const database = require('../database');
const utils = require('../utils/utils');


const getCategories = async(req, res) => {
    const responseCategories= 
    await database.query('SELECT id, name as name FROM categories');

    if(responseCategories.rows.length > 0){
        res.status(200).json(responseCategories.rows);
    }else{
        res.status(404).json({error: 'Not Found'});
    }  
}

const getBookByCategoryId= async(req, res) => {
    if(!isNaN(req.params.Id)){
        const responseBooks = 
        await database.query('SELECT books."ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name as category FROM (books JOIN categories ON books.category = categories.id JOIN written_by ON written_by."ISBN"=books."ISBN" JOIN authors ON authors.id = written_by."Author") WHERE categories.id = ($1)', [req.params.Id]);

        const responseAuthors = 
        await database.query('SELECT written_by."ISBN", authors.name, authors.id FROM  (authors JOIN written_by ON written_by."Author" = authors."id" JOIN books On written_by."ISBN" = books."ISBN") WHERE books.category = ($1)', [req.params.Id]);

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
    getCategories,
    getBookByCategoryId
}