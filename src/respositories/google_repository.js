const axios = require('axios');
function callGoogleAPI(ISBN){
    let uri = 'https://www.googleapis.com/books/v1/volumes?q=isbn:'+ISBN;
    let promise = axios.get(uri);

    let dataPromise = promise
    .then((response) => {
        if(response.data.totalItems != 0){
            return response.data.items[0];
        }
        else
            throw ("Book not founded");
    });
    return dataPromise;
}

module.exports = {
    callGoogleAPI
}