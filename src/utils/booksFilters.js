const named = require('yesql').pg

function getSQLQueryWithCombinedFilters(req) {
    const {bookshops, min_price, max_price} = req.body;

    let queryString = 'SELECT books."ISBN", books.name, publisher, total_pages, published_at, image_link, categories.name as category, MIN(price) as min_price FROM (books JOIN categories ON books.category = categories.id JOIN written_by ON written_by."ISBN" = books."ISBN" JOIN authors On written_by."Author" = authors.id JOIN has ON books."ISBN" = has."ISBN") ';
    
    let parameters = {}
    let more_parameters = false;
    
    if(bookshops!=="*"){
        queryString = queryString.concat('WHERE has."Bookshop" IN :bookshops ');
        more_parameters = true;
        parameters["bookshops"] = bookshops;
    }

    if(min_price!=="*"){
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

    if(max_price!=="*"){
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

module.exports = getSQLQueryWithCombinedFilters;