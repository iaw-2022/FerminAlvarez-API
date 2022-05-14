const database = require('../database');
const axios = require('axios');
const { json } = require('express/lib/response');
const utils = require('../utils');

const getBooks = async(req, res ) => {
    const responseBooks = 
    await database.query('SELECT books."ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name as category FROM (books JOIN categories ON books.category = categories.id JOIN written_by ON written_by."ISBN" = books."ISBN" JOIN authors On written_by."Author" = authors.id) GROUP BY books."ISBN", categories.name');

    const responseAuthors = 
    await database.query('SELECT written_by."ISBN", authors.name, authors.id  FROM  (authors JOIN written_by ON written_by."Author" = authors."id" JOIN books On written_by."ISBN" = books."ISBN")');

    utils.compactAuthors(responseBooks, responseAuthors)

    if(responseBooks.rows.length>0)
        res.status(200).json(responseBooks.rows);
    else
        res.status(404).json({error: 'Not Found'});
}

async function getBookWithISBN(ISBN){
    let responseBooks = 
        await database.query('SELECT "ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name as category FROM (books JOIN categories ON books.category = categories.id) WHERE books."ISBN" = $1', [ISBN]);
    
        const responseAuthors = 
        await database.query('SELECT written_by."ISBN", authors.name, authors.id  FROM  (authors JOIN written_by ON written_by."Author" = authors."id" JOIN books On written_by."ISBN" = books."ISBN") WHERE written_by."ISBN" = $1', [ISBN]);
    
        utils.compactAuthors(responseBooks, responseAuthors)

        return responseBooks;
}

const getBookByAuthorName = async(req, res) => {
    if(typeof req.params.AuthorName === 'string'){
        req.params.AuthorName = req.params.AuthorName.replace(/[^0-9a-zA-Z.]+/g, " ");
        const responseBooks = 
        await database.query('SELECT books."ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name as category FROM (books JOIN categories ON books.category = categories.id JOIN written_by ON written_by."ISBN"=books."ISBN" JOIN authors ON authors.id = written_by."Author") WHERE upper(authors.name) LIKE upper($1)', [`%${req.params.AuthorName}%`]);

        const responseAuthors = 
        await database.query('SELECT written_by."ISBN", authors.name, authors.id  FROM  (authors JOIN written_by ON written_by."Author" = authors."id" JOIN books On written_by."ISBN" = books."ISBN") WHERE upper(authors.name) LIKE upper($1)', [`%${req.params.AuthorName}%`]);

        utils.compactAuthors(responseBooks, responseAuthors)

        if(responseBooks.rows.length > 0){
            res.status(200).json(responseBooks.rows);
        }else{
            res.status(404).json({error: 'Not Found'});
        }
    }else{
        res.status(400).json({error: 'Invalid parameter'});
    }    
}

const getBookByCategory= async(req, res) => {
    if(typeof req.params.Category === 'string'){
        req.params.Category = req.params.Category.replace(/[^0-9a-zA-Z.]+/g, " ");
        const responseBooks = 
        await database.query('SELECT books."ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name as category FROM (books JOIN categories ON books.category = categories.id JOIN written_by ON written_by."ISBN"=books."ISBN" JOIN authors ON authors.id = written_by."Author") WHERE to_ascii(upper(categories.name)) LIKE to_ascii(upper($1))', [`%${req.params.Category}%`]);

        console.log(req.params.Category);

        const responseAuthors = 
        await database.query('SELECT written_by."ISBN", authors.name, authors.id  FROM  (authors JOIN written_by ON written_by."Author" = authors."id" JOIN books On written_by."ISBN" = books."ISBN" JOIN categories ON categories.id = books.category) WHERE to_ascii(upper(categories.name)) LIKE to_ascii(upper($1)) ', [`%${req.params.Category}%`]);

        utils.compactAuthors(responseBooks, responseAuthors)

        if(responseBooks.rows.length > 0){
            res.status(200).json(responseBooks.rows);
        }else{
            res.status(404).json({error: 'Not Found'});
        }
    }else{
        res.status(400).json({error: 'Invalid parameter'});
    }    
}

const getBookByISBN = async(req, res) => {
    if(!isNaN(req.params.ISBN)){
        const responseBook =  await database.query('SELECT books."ISBN" FROM books WHERE books."ISBN" = $1 LIMIT 1', [req.params.ISBN]);

        if(responseBook.rows.length > 0){
            getBookWithISBN(req.params.ISBN).then((responseBook) => { 
                res.status(200).json(responseBook.rows);
            })
        }else{
            callGoogleAPI(req.params.ISBN).then(
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
            throw (err +"error: Something went wrong saving book on database");
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

function callGoogleAPI(ISBN){
    let uri = 'https://www.googleapis.com/books/v1/volumes?q=isbn:'+ISBN;
    let promise = axios.get(uri);

    let dataPromise = promise
    .then((response) => {
        if(response.data.totalItems != 0)
            return response.data.items[0];
        else
            throw ("Book not founded");
    });
    return dataPromise;
}


function callScrappingAPI(ISBN){
    let bookshops = ['libreriadonquijote','cuspide','buscalibre','tematika']
    let prices = []
    for(i in bookshops){
        let uri = 'https://scrappinglibreriaapi.herokuapp.com/'+bookshops[i]+'/'+ISBN;

        axios.get(uri)
        .then((response) => {
           console.log(response.data);
           prices.push(response.data)
        }).catch();
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
    getBookByAuthorName,
    getBookByCategory
}