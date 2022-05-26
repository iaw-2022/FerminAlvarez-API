function compactAuthors(responseBooks, responseAuthors){
    let books = responseBooks.rows;
    let authors = responseAuthors.rows;
    let authorsExists = false
    for(e in books){
        let aux = [];
        books[e]["authors"] = aux;
        for(i in authors){
            if(authors[i].ISBN == books[e].ISBN){
                authorsExists = true
                aux.push({
                    "id": authors[i].id,
                    "name": authors[i].name
                });
            }
        }
    }
    if(!authorsExists)
        responseBooks.rows = []
}

module.exports = {
    compactAuthors
}