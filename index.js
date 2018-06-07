const http = require('http');
const handlers = require('./handlers');
const url = require('url')
const port = process.env.PORT || 3000;

let environment = process.env.NODE_ENV || 'development';
const config = require('./config/config');
const database = require('./config/database.config');

database(config[environment]);
/**
 *
 * @param {http.ClientRequest} req
 * @param {http.ClientResponse} res
 */
http.createServer((req, res) => {
    req.pathname = req.pathname || url.parse(req.url).pathname;

    for (let handler of handlers) {
        if (handler(req, res) !== true) {
            break;
        }
    }

}).listen(port);

console.log(`Listening on port ${port}`);

