const named = require('yesql').pg

function getSQLQuerWithFiltersBooks(req) {
    const {name, bookshops, min_price, max_price} = req.body;

    let queryString = 'SELECT books."ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name as category, MIN(price) as min_price FROM (books JOIN categories ON books.category = categories.id JOIN written_by ON written_by."ISBN" = books."ISBN" JOIN authors On written_by."Author" = authors.id LEFT JOIN has ON books."ISBN" = has."ISBN") ';
    
    let parameters = {}
    let more_parameters = false;
    if(bookshops!==undefined){
        if( bookshops.length > 0){
            queryString = queryString.concat('WHERE (has."Bookshop" = :bookshop_0 ');
            parameters["bookshop_".concat(0)] = bookshops[0];
            more_parameters = true;
            for(let i = 1; i < bookshops.length; i++){
                queryString = queryString.concat('OR has."Bookshop" = :bookshop_', i, " ");
                parameters["bookshop_".concat(i)] = bookshops[i];
            }
            queryString = queryString.concat(') ');
        }
    }

    if(name!==undefined){
        let nameString;
        nameNormalized = "%" + name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + "%"
        if(more_parameters){
            nameString = "AND books.name ILIKE :name ";
        }else{
            nameString = "WHERE books.name ILIKE :name ";
            more_parameters = true;
        }
        parameters["name"] = nameNormalized;
        queryString = queryString.concat(nameString);
    }

    if(min_price!==undefined){
        let min_priceString;
        if(more_parameters){
            min_priceString = 'AND price >= :min_price ';
        }else{
            min_priceString = 'WHERE price >= :min_price ';
            more_parameters = true;
        }
        parameters["min_price"] = min_price;
        queryString = queryString.concat(min_priceString);
    }

    if(max_price!==undefined){
        let max_priceString;
        if(more_parameters){
            max_priceString = 'AND price <= :max_price ';
        }else{
            max_priceString = 'WHERE price <= :max_price ';
            more_parameters = true;
        }
        parameters["max_price"] = max_price;
        queryString = queryString.concat(max_priceString);
    }

    queryString += 'GROUP BY books."ISBN", categories.name'
    return named(queryString)(parameters);
}


function getSQLQuerWithFiltersAuthors(req) {
    const {authors} = req.body;

    let queryString = 'SELECT written_by."ISBN", authors.name, authors.id  FROM  (authors JOIN written_by ON written_by."Author" = authors."id" JOIN books On written_by."ISBN" = books."ISBN")';
    
    let parameters = {}
    if(authors!==undefined){
        if( authors.length > 0){
            queryString = queryString.concat('WHERE (written_by."Author" = :author_0 ');
            parameters["author_".concat(0)] = authors[0];
            more_parameters = true;
            for(let i = 1; i < authors.length; i++){
                queryString = queryString.concat('OR written_by."Author" = :author_', i, " ");
                parameters["author_".concat(i)] = authors[i];
            }
            queryString = queryString.concat(') ');
        }
       
    }

    return named(queryString)(parameters);
}

module.exports = {
    getSQLQuerWithFiltersBooks,
    getSQLQuerWithFiltersAuthors
}