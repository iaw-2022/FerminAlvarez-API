const database = require('../database');

const getBooks = async(req, res ) => {
    const responseBooks = 
    await database.query('SELECT books."ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name as category FROM (books JOIN categories ON books.category = categories.id JOIN written_by ON written_by."ISBN" = books."ISBN" JOIN authors On written_by."Author" = authors.id) GROUP BY books."ISBN", categories.name');

    const responseAuthors = 
    await database.query('SELECT written_by."ISBN", authors.name FROM  (authors JOIN written_by ON written_by."Author" = authors."id" JOIN books On written_by."ISBN" = books."ISBN")');

    compactAuthors(responseBooks, responseAuthors)

    if(responseBooks.rows.length>0)
        res.status(200).json(responseBooks.rows);
    else
        res.status(404).json({error: 'Not Found'});
}

const getBookByISBN = async(req, res) => {
    if(!isNaN(req.params.ISBN)){
        const responseBooks = 
        await database.query('SELECT "ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name as category FROM (books JOIN categories ON books.category = categories.id) WHERE "ISBN" = $1', [req.params.ISBN]);

        if(responseBooks.rows.length > 0){
            res.status(200).json(responseBooks.rows[0]);
        }else{
            res.status(404).json({error: 'Not Found'});
        }
    }else{
        res.status(400).json({error: 'Invalid parameter'});
    }    
}

function compactAuthors(responseBooks, responseAuthors){
    let books = responseBooks.rows;
    let authors = responseAuthors.rows;
    for(e in books){
        let aux = [];
        books[e]["authors"] = aux;
        for(i in authors){
            if(authors[i].ISBN == books[e].ISBN){
                aux.push(authors[i].name);
            }
        }
    }

}

module.exports = {
    getBooks,
    getBookByISBN, 
}