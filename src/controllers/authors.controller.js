const database = require('../database');


const getAuthors = async(req, res) => {
    const responseAuthors = 
    await database.query('SELECT id, authors.name as Author FROM authors');

    if(responseAuthors.rows.length > 0){
        res.status(200).json(responseAuthors.rows);
    }else{
        res.status(404).json({error: 'Not Found'});
    }  
}

const getAuthorsById = async(req, res) => {
    if(!isNaN(req.params.Id)){
        const responseAuthors = 
        await database.query('SELECT id, name FROM authors WHERE authors.id = $1', [req.params.Id]);

        if(responseAuthors.rows.length > 0){
            res.status(200).json(responseAuthors.rows[0]);
        }else{
            res.status(404).json({error: 'Not Found'});
        }
    }else{
        res.status(400)
    }
}

module.exports = {
    getAuthors,
    getAuthorsById
}