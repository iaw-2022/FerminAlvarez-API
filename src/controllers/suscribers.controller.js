const database = require('../database');


const getSuscriberById = async(req, res) => {
    const responseSuscriber = 
    await database.query('SELECT "ISBN" FROM subscribed WHERE id_suscriber = ($1)', [req.params.Id]);

    if(responseSuscriber.rows.length > 0){
        res.status(200).json(responseSuscriber.rows);
    }else{
        res.status(404).json({error: 'Not Found'});
    }  
}

const applySuscription = async(req, res) => {
    const {id, ISBN} = req.body
    await database.query('INSERT INTO subscribed VALUES ($1,$2) returning id_suscriber', [id, ISBN], function(err, result, fields) {
        if (err) {
            res.status(400).json({error: 'ERROR: Something went wrong'});
          }else{
            res.json({
                message: "Subscription Added Succesfully",
                id, 
                ISBN
            })
          }
    }); 
}

module.exports = {
    getSuscriberById,
    applySuscription
}