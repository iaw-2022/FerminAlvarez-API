function compactAuthors(responseBooks, responseAuthors){
    let books = responseBooks.rows;
    let authors = responseAuthors.rows;
    let result = []
    for(e in books){
        let aux = [];
        books[e]["authors"] = aux;
        authorFounded = false
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

module.exports = {
    compactAuthors
}