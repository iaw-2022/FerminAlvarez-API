const database = require('../database');
const axios = require('axios');
const { json } = require('express/lib/response');
const utils = require('../utils/utils');
const scrapping_settings = require('../scrapping-settings');
const google_repository = require('../respositories/google_repository');
const scrapping_repository = require('../respositories/scrapping_repository');
const {getSQLQuerWithFiltersBooks, getSQLQuerWithFiltersAuthors} = require('../utils/booksFilters');

const getBooks = async(req, res ) => {
    const responseBooks = await database.query(getSQLQuerWithFiltersBooks(req));

    const responseAuthors = await database.query(getSQLQuerWithFiltersAuthors(req));

    utils.compactAuthors(responseBooks, responseAuthors)

    if(responseBooks.rows.length>0)
        res.status(200).json(responseBooks.rows);
    else
        res.status(404).json({error: 'Not Found'});
}

async function getBookWithISBN(ISBN){
    let responseBooks = 
        await database.query('SELECT books."ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name as category, MIN(price) as min_price FROM (books JOIN categories ON books.category = categories.id JOIN has ON books."ISBN" = has."ISBN") WHERE books."ISBN" = $1 GROUP BY books."ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name', [ISBN]);
    
        const responseAuthors = 
        await database.query('SELECT written_by."ISBN", authors.name, authors.id  FROM  (authors JOIN written_by ON written_by."Author" = authors."id" JOIN books On written_by."ISBN" = books."ISBN") WHERE written_by."ISBN" = $1', [ISBN]);
    
        utils.compactAuthors(responseBooks, responseAuthors)

        return responseBooks;
}

const getBookByISBN = async(req, res) => {
    if(!isNaN(req.params.ISBN)){
        const responseBook =  await database.query('SELECT books."ISBN" FROM books WHERE books."ISBN" = $1 LIMIT 1', [req.params.ISBN]);

        if(responseBook.rows.length > 0){
            getBookWithISBN(req.params.ISBN).then((responseBook) => { 
                res.status(200).json(responseBook.rows);
            })
        }else{
            google_repository.callGoogleAPI(req.params.ISBN).then(
                data => {
                    let book = parseGoogleJSON(req.params.ISBN,data);
                    createBook(book)
                    .then(
                        getBookWithISBN(req.params.ISBN).then((responseBook) => { 
                            res.status(200).json(responseBook.rows);
                        })
                    )
                    .catch(
                        err =>{
                            res.status(404).json({error: 'Not Found'});
                        }
            )}).catch(
                () => {
                    res.status(404).json({error: 'Not Found'});
                }
            )
        } 
    }else{
        res.status(400).json({error: 'Invalid parameter'});
    } 
}


async function createBook(jsonBook) {
    jsonBook.publishedDate = createDate(jsonBook.publishedDate);
    let actualDate = new Date(Date.now()).toLocaleString('es-AR');
    getCategory(jsonBook.category)
    .then( (categoryID) => {
        insertBook(jsonBook,categoryID,actualDate)
        .then( () => {
            assignAuthors(jsonBook.authors,jsonBook.ISBN)
        })
        .catch(
            err => {
                console.log(err);
            }
    )}).catch(
        err => {
            console.log(err + "ERROR: Something went wrong adding the category");
        }
    );
}

const createDate = (date) => {
    if(date != null)
        return (new Date(date))
}

async function getCategory(categoryName){
    const responseCategories = await database.query('SELECT id, name FROM categories WHERE to_ascii(upper(name)) LIKE to_ascii(upper($1)) LIMIT 1',[categoryName]);
    
    if(responseCategories.rows.length == 0){
        let result = await database.query('INSERT INTO categories (name) VALUES ($1) returning id', [categoryName]);
        return result.rows[0].id;
    }else{
        return responseCategories.rows[0].id;
    }
}

async function insertBook(jsonBook, categoryID,actualDate){
    await database.query('INSERT INTO books ("ISBN",name,publisher,total_pages,published_at,image_link,category, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning books."ISBN"', [jsonBook.ISBN,jsonBook.title,jsonBook.publisher, jsonBook.page_count, jsonBook.publishedDate, jsonBook.image_link, categoryID, actualDate, actualDate]).then(
        result => {
            return result.rows[0].ISBN;
        }
    ).catch(
        (err) => {
            throw ("error: Something went wrong saving book on database");
        }
    );
}

async function assignAuthors(authorsNames,ISBN){
    let authorsIDS = []
    for (author in authorsNames){
        const responseAuthors = await database.query('SELECT id FROM authors WHERE to_ascii(upper(name)) LIKE to_ascii(upper($1)) LIMIT 1',[authorsNames[author]]);

        if(responseAuthors.rows.length == 0){
            let result = await database.query('INSERT INTO authors (name) VALUES ($1) returning id', [authorsNames[author]]) ;
            authorsIDS.push(result.rows[0].id);
        }else{
            authorsIDS.push(responseAuthors.rows[0].id);
        }
    }

    try{
        for(i in authorsIDS){
            await database.query('INSERT INTO written_by ("Author", "ISBN") VALUES ($1,$2)', [authorsIDS[i],ISBN]);
        }
    } catch(err){
        console.log(err + "ERROR: Something went wrong adding authors");
    } 
}



const getBookPrice= async(req, res) => {
    if(!isNaN(req.params.ISBN)){
        const responseBook =  await database.query('SELECT books."ISBN" FROM books WHERE books."ISBN" = $1 LIMIT 1', [req.params.ISBN]);
        if(responseBook.rows.length > 0){
            await callScrapper(req.params.ISBN).then(() => {
                getPrices(req.params.ISBN)
                .then((response) => { 
                    res.status(200).json(response);
                }).catch(() => {
                    res.status(400).json({error: 'Not Found'})
                });
            })
        }else{
            res.status(400).json({error: 'Not Found'})
        }
    }else{
        res.status(400).json({error: 'Invalid parameter'});
    }
}

async function callScrapper(ISBN){
    let promises = [];
    for(i in scrapping_settings.bookshopmapping){
        promises.push(scrapping_repository.callScrappingAPI(ISBN, i).then( res => {
            if (typeof res !== 'undefined')
                for(i of scrapping_settings.bookshopmapping[res.indexBookshop].id){
                    promises.push(insertHas(ISBN, i, res.data.Precio, res.data.Link))
                }
        }))
    }
    await Promise.all(promises);
}

async function getPrices(ISBN){
    return await database.query('SELECT "ISBN", "Bookshop", name, price, link FROM has JOIN bookshops ON bookshops.id = "Bookshop" WHERE "ISBN" = ($1)', [ISBN]).then( (response) => {
        if(response.rows.length > 0){
            return (response.rows)
        }else{
            throw ('error')
        }
    });
}

async function insertHas(ISBN, bookshopId, price, link){
    let actualDate = new Date(Date.now()).toLocaleString('es-AR');
    const responseHas = await database.query('SELECT "ISBN", "Bookshop",updated_at FROM has WHERE "ISBN" = ($1) and "Bookshop" = ($2) LIMIT 1',[ISBN, bookshopId]);

    if(responseHas.rows.length == 0){
        await database.query('INSERT INTO has ("ISBN","Bookshop",price, link, created_at, updated_at) VALUES ($1, $2, $3, $4,$5, $6)', [ISBN, bookshopId, price, link, actualDate, actualDate]).catch();
    } else{    
        let hasDateTime = createDate(responseHas.rows[0].updated_at).getTime()

        let actualTime = new Date().getTime()

        var hours = Math.abs(hasDateTime - actualTime) / 36e5;
        if(hours > 8){
            await database.query('UPDATE has SET price = ($3), link = ($4), updated_at = ($5) WHERE "ISBN" = ($1) and "Bookshop" = ($2)', [ISBN, bookshopId, price, link, actualDate]).catch();
        }
        
    }        
}

function parseGoogleJSON(ISBN,data){
    let dataInfo = data.volumeInfo;    
    let json =  JSON.parse(JSON.stringify({
        ISBN:ISBN,
        title:dataInfo.title,
        authors:dataInfo.authors
    }));

    if(dataInfo.categories != null)
        json.category= dataInfo.categories[0];
    else
        json.category = "NOT_DEFINED_CATEGORY"

    if(dataInfo.imageLinks != null)
        json.image_link= dataInfo.imageLinks.thumbnail;
    
    if(dataInfo.publisher != null)
        json.publisher= dataInfo.publisher;
    
    if(dataInfo.pageCount != null)
        json.page_count= dataInfo.pageCount;
    
    if(dataInfo.publishedDate != null)
        json.publishedDate = dataInfo.publishedDate;

    return json;

}

module.exports = {
    getBooks,
    getBookByISBN,
    getBookPrice
}