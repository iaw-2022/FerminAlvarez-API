const database = require('../database');


const getCategories = async(req, res) => {
    const responseAuthors = 
    await database.query('SELECT name as category FROM categories');

    if(responseAuthors.rows.length > 0){
        res.status(200).json(responseAuthors.rows);
    }else{
        res.status(404).json({error: 'Not Found'});
    }  
}

module.exports = {
    getCategories
}