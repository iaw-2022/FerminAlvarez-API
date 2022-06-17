const database = require('../database');
const getUserInfoFromToken = require('../auth').getUserInfoFromToken;
const createUser = require('../utils/utils').createUser;
const utils = require('../utils/utils');


const getSuscriber = async(req, res) => {
    const userInfo = await getUserInfoFromToken(req);
    createUser(userInfo)

    const responseBooks = 
    await database.query('SELECT books."ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name as category, MIN(price) as min_price FROM (books JOIN categories ON books.category = categories.id LEFT JOIN has ON books."ISBN" = has."ISBN" JOIN subscribed ON books."ISBN"=subscribed."ISBN") WHERE user_email = $1 GROUP BY books."ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name', [userInfo.email]);

    const responseAuthors = 
    await database.query('SELECT written_by."ISBN", authors.name, authors.id  FROM  (authors JOIN written_by ON written_by."Author" = authors."id" JOIN books On written_by."ISBN" = books."ISBN" JOIN subscribed ON books."ISBN"=subscribed."ISBN") WHERE user_email = $1',[userInfo.email]);

    utils.compactAuthors(responseBooks, responseAuthors)

    if(responseBooks.rows.length > 0){
        res.status(200).json(responseBooks.rows);
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