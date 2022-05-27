function compactAuthors(responseBooks, responseAuthors){
    let books = responseBooks.rows;
    let authors = responseAuthors.rows;
    for(e in books){
        let aux = [];
        books[e]["authors"] = aux;
        for(i in authors){
            if(authors[i].ISBN == books[e].ISBN){
                aux.push({
                    "id": authors[i].id,
                    "name": authors[i].name
                });
            }
        }
    }
}

module.exports = {
    compactAuthors
}