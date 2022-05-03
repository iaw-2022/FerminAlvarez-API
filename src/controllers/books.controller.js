const database = require('../database');

const getBooks = async(req, res ) => {
    const response = 
    await database.query('SELECT books."ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name as category, string_agg(authors.name::character varying, \', \') as Authors FROM (books JOIN categories ON books.category = categories.id JOIN written_by ON written_by."ISBN" = books."ISBN" JOIN authors On written_by."Author" = authors.id) GROUP BY books."ISBN", categories.name');

    if(response.rows.length>0)
        res.status(200).json(response.rows);
    else
        res.status(404).json({error: 'Not Found'});
}

const getBookByISBN = async(req, res) => {
    if(!isNaN(req.params.ISBN)){
        const response = 
        await database.query('SELECT "ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name as category FROM (books JOIN categories ON books.category = categories.id) WHERE "ISBN" = $1', [req.params.ISBN]);

        if(response.rows.length > 0){
            res.status(200).json(response.rows[0]);
        }else{
            res.status(404).json({error: 'Not Found'});
        }
    }else{
        res.status(400).json({error: 'Invalid parameter'});
    }    
}

module.exports = {
    getBooks,
    getBookByISBN, 
}