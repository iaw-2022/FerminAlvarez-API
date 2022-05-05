const database = require('../database');


const getBookshops = async(req, res) => {
    const responseBookshops = 
    await database.query('SELECT name, city, street, number FROM bookshops');

    if(responseBookshops.rows.length > 0){
        res.status(200).json(responseBookshops.rows);
    }else{
        res.status(404).json({error: 'Not Found'});
    }  
}

const getBookshopsById = async(req, res) => {
    if(!isNaN(req.params.Id)){
        const responseBookshops = 
        await database.query('SELECT name, city, street, number FROM bookshops WHERE bookshops.id = $1', [req.params.Id]);

        if(responseBookshops.rows.length > 0){
            res.status(200).json(responseBookshops.rows[0]);
        }else{
            res.status(404).json({error: 'Not Found'});
        }
    }else{
        res.status(400)
    }
}

const getBookshopsByName = async(req, res) => {
    if(typeof req.params.BookshopName === 'string'){
        req.params.BookshopName = req.params.BookshopName.replace(/[^0-9a-zA-Z.]+/g, " ");

        const responseBookshops = 
        await database.query('SELECT name, city, street, number FROM bookshops WHERE to_ascii(upper(bookshops.name)) LIKE to_ascii(upper($1))', [`%${req.params.BookshopName}%`]);

        if(responseBookshops.rows.length > 0){
            res.status(200).json(responseBookshops.rows[0]);
        }else{
            res.status(404).json({error: 'Not Found'});
        }
    }else{
        res.status(400)
    }
}

const getBooksByBookshopId = async(req, res) => {
    if(!isNaN(req.params.Id)){
        const responseBooks = 
        await database.query('SELECT books."ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name as category, has.price as price FROM (books JOIN categories ON books.category = categories.id JOIN has ON books."ISBN" = has."ISBN") WHERE has."Bookshop" = $1', [req.params.Id]);

        const responseAuthors = 
        await database.query('SELECT written_by."ISBN", authors.name FROM  (authors JOIN written_by ON written_by."Author" = authors."id" JOIN books On written_by."ISBN" = books."ISBN" JOIN has ON books."ISBN" = has."ISBN" ) WHERE has."Bookshop" = $1', [req.params.Id]);

        compactAuthors(responseBooks, responseAuthors)

        if(responseBooks.rows.length > 0){
            res.status(200).json(responseBooks.rows);
        }else{
            res.status(404).json({error: 'Not Found'});
        }
    }else{
        res.status(400).json({error: 'Invalid parameter'});
    }    
}

const getBookFromBookshop = async(req, res) => {
    if(!isNaN(req.params.Id) && !isNaN(req.params.ISBN)){
        const responseBooks = 
        await database.query('SELECT books."ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name as category, has.price as price FROM (books JOIN categories ON books.category = categories.id JOIN has ON books."ISBN" = has."ISBN") WHERE has."Bookshop" = $1 and has."ISBN" = $2', [req.params.Id, req.params.ISBN]);

        const responseAuthors = 
        await database.query('SELECT written_by."ISBN", authors.name FROM  (authors JOIN written_by ON written_by."Author" = authors."id" JOIN books On written_by."ISBN" = books."ISBN" JOIN has ON books."ISBN" = has."ISBN" ) WHERE has."Bookshop" = $1 and has."ISBN" = $2', [req.params.Id, req.params.ISBN]);

        compactAuthors(responseBooks, responseAuthors)

        if(responseBooks.rows.length > 0){
            res.status(200).json(responseBooks.rows);
        }else{
            res.status(404).json({error: 'Not Found'});
        }
    }else{
        res.status(400).json({error: 'Invalid parameter'});
    }    
}

function compactAuthors(responseBooks, responseAuthors){
    let books = responseBooks.rows;
    let authors = responseAuthors.rows;
    for(e in books){
        let aux = [];
        books[e]["authors"] = aux;
        for(i in authors){
            if(authors[i].ISBN == books[e].ISBN){
                aux.push(authors[i].name);
            }
        }
    }
}


module.exports = {
    getBookshops,
    getBookshopsById,
    getBookshopsByName,
    getBooksByBookshopId,
    getBookFromBookshop
}