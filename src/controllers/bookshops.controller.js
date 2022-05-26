const database = require('../database');
const utils = require('../utils/utils');


const getBookshops = async(req, res) => {
    const responseBookshops = 
    await database.query('SELECT id, name, city, street, number FROM bookshops');

    if(responseBookshops.rows.length > 0){
        res.status(200).json(responseBookshops.rows);
    }else{
        res.status(404).json({error: 'Not Found'});
    }  
}

const getBookshopsById = async(req, res) => {
    if(!isNaN(req.params.Id)){
        const responseBookshops = 
        await database.query('SELECT id, name, city, street, number FROM bookshops WHERE bookshops.id = $1', [req.params.Id]);

        if(responseBookshops.rows.length > 0){
            res.status(200).json(responseBookshops.rows[0]);
        }else{
            res.status(404).json({error: 'Not Found'});
        }
    }else{
        res.status(400).json({error: 'Invalid parameter'});
    }
}

const getBooksByBookshopId = async(req, res) => {
    if(!isNaN(req.params.Id)){
        const responseBooks = 
        await database.query('SELECT books."ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name as category, has.price as price FROM (books JOIN categories ON books.category = categories.id JOIN has ON books."ISBN" = has."ISBN") WHERE has."Bookshop" = $1', [req.params.Id]);

        const responseAuthors = 
        await database.query('SELECT written_by."ISBN", authors.name, authors.id  FROM  (authors JOIN written_by ON written_by."Author" = authors."id" JOIN books On written_by."ISBN" = books."ISBN" JOIN has ON books."ISBN" = has."ISBN" ) WHERE has."Bookshop" = $1', [req.params.Id]);

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

const getBookFromBookshop = async(req, res) => {
    if(!isNaN(req.params.Id) && !isNaN(req.params.ISBN)){
        const responseBooks = 
        await database.query('SELECT books."ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name as category, has.price as price FROM (books JOIN categories ON books.category = categories.id JOIN has ON books."ISBN" = has."ISBN") WHERE has."Bookshop" = $1 and has."ISBN" = $2', [req.params.Id, req.params.ISBN]);

        const responseAuthors = 
        await database.query('SELECT written_by."ISBN", authors.name, authors.id  FROM  (authors JOIN written_by ON written_by."Author" = authors."id" JOIN books On written_by."ISBN" = books."ISBN" JOIN has ON books."ISBN" = has."ISBN" ) WHERE has."Bookshop" = $1 and has."ISBN" = $2', [req.params.Id, req.params.ISBN]);

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

module.exports = {
    getBookshops,
    getBookshopsById,
    getBooksByBookshopId,
    getBookFromBookshop
}