const database = require('../database');


const getSuscriberById = async(req, res) => {
    const responseSuscriber = 
    await database.query('SELECT "ISBN" FROM subscribed WHERE id_user = ($1)', [req.params.Id]);

    if(responseSuscriber.rows.length > 0){
        res.status(200).json(responseSuscriber.rows);
    }else{
        res.status(404).json({error: 'Not Found'});
    }  
}

const applySuscription = async(req, res) => {
    const {id, ISBN} = req.body
    await database.query('INSERT INTO subscribed VALUES ($1,$2) returning id_user', [id, ISBN], function(err, result, fields) {
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

const removeSuscription = async(req, res) => {
    const {id, ISBN} = req.body
    await database.query('DELETE FROM  subscribed WHERE id_user = ($1) and subscribed."ISBN" = ($2)', [id, ISBN], function(err, result, fields) {
        if (err) {
            res.status(400).json({error: 'ERROR: Something went wrong' +err});
          }else{
            res.json({
                message: "Subscription Removed Succesfully"
            })
          }
    }); 
}

module.exports = {
    getSuscriberById,
    applySuscription,
    removeSuscription
}