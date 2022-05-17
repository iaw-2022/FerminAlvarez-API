const axios = require('axios');
const scrapping_settings = require('../scrapping-settings');

async function callScrappingAPI(ISBN, indexBookshop){
    bookshop = scrapping_settings.bookshopmapping[indexBookshop]
    let uri = 'https://scrappinglibreriaapi.herokuapp.com/'+bookshop.name+'/'+ISBN;
    let promise = axios.get(uri);

    let dataPromise = promise
    .then((response) => {
        return ({
            "indexBookshop": indexBookshop,
            data : response.data
        })
    }).catch(() => {});
    return dataPromise;
}

module.exports = {
    callScrappingAPI
}