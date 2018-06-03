const homeHandler = require('./home');
const staticHandler = require('./static-files');
const productHandler = require('./product');

module.exports = [
    homeHandler,
    staticHandler,
    productHandler
]