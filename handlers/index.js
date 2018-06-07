const homeHandler = require('./home');
const staticHandler = require('./static-files');
const productHandler = require('./product');
const categoryHandler = require('./category');

module.exports = [
    homeHandler,
    staticHandler,
    productHandler,
    categoryHandler
]