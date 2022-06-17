const database = require('../database');
const getUserInfoFromToken = require('../auth').getUserInfoFromToken;
const createUser = require('../utils/utils').createUser;


const getSuscriber = async(req, res) => {
    const userInfo = await getUserInfoFromToken(req);
    createUser(userInfo)

    const responseSuscriber = 
    await database.query('SELECT "ISBN" FROM subscribed WHERE user_email = ($1)', [userInfo.email]);

    if(responseSuscriber.rows.length > 0){
        res.status(200).json(responseSuscriber.rows);
    }else{
        res.status(404).json({error: 'Not Found'});
    }  
}

const applySuscription = async(req, res) => {
    let actualDate = new Date(Date.now()).toLocaleString('en-US');
    const {ISBN} = req.body
    const userInfo = await getUserInfoFromToken(req);
    user_email = userInfo.email



    createUser(userInfo).then( () => {
        if(ISBN != null){
            database.query('INSERT INTO subscribed VALUES ($1,$2,$3,$4) returning user_email', [user_email, ISBN, actualDate, actualDate], function(err, result, fields) {
                if (err) {
                    res.status(400).json({error: 'Invalid body'});
                  }else{
                    res.status(200).json({
                        message: "Subscription Added Succesfully",
                        user_email, 
                        ISBN
                    })
                  }
            }); 
        }else{
            res.status(400).json({error: 'Invalid body'});
        }
    })
}

const removeSuscription = async(req, res) => {
    const {ISBN} = req.body
    const userInfo = await getUserInfoFromToken(req);
    user_email = userInfo.email
    if(ISBN != null){
        createUser(userInfo).then( () => {
            database.query('DELETE FROM  subscribed WHERE user_email = ($1) and subscribed."ISBN" = ($2)', [user_email, ISBN], function(err, result, fields) {
                if (err || result.rowCount == 0) {
                    res.status(400).json({error: 'Invalid body'});
                }else{
                    res.status(200).json({
                        message: "Subscription Removed Succesfully"
                    })
                }
            });
        })
    }else{
        res.status(400).json({error: 'Invalid body'});
    }
}

module.exports = {
    getSuscriber,
    applySuscription,
    removeSuscription
}