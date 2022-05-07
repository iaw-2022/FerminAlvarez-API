const database = require('../database');


const getCategories = async(req, res) => {
    const responseCategories= 
    await database.query('SELECT name as name FROM categories');

    if(responseCategories.rows.length > 0){
        res.status(200).json(responseCategories.rows);
    }else{
        res.status(404).json({error: 'Not Found'});
    }  
}

const createCategory = async(req, res) => {
    const {name} = req.body;
    await database.query('INSERT INTO categories (name) VALUES ($1) returning id', [name], function(err, result, fields) {
        if (err) {
            res.status(400).json({error: 'ERROR: Something went wrong'});
          }else{
            let id = result.rows[0].id;
            res.json({
                message: "Category Added Succesfully",
                body : {
                    category: {id, name}
                }
            })
          }
    });
}

module.exports = {
    getCategories,
    createCategory
}