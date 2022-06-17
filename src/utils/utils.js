const database = require('../database');

function compactAuthors(responseBooks, responseAuthors){
    let books = responseBooks.rows;
    let authors = responseAuthors.rows;
    let result = []
    for(e in books){
        let aux = [];
        books[e]["authors"] = aux;
        authorFounded = false
        
        if(authors.length == 0)
            authorFounded = true

        for(i in authors){
            if(authors[i].ISBN == books[e].ISBN){
                authorFounded = true
                aux.push({
                    "id": authors[i].id,
                    "name": authors[i].name
                });
            }
        }
        if(authorFounded)
            result.push(books[e])
    }
    responseBooks.rows = result;
}

const createUser = async (userInfo) => {
    try{
        await database.query('INSERT INTO users (email,name,role) VALUES ($1,$2,$3) returning email', [userInfo.email, userInfo.name, 3]);
    } catch(err){
        console.log(err)
    }
}

module.exports = {
    compactAuthors,
    createUser
}