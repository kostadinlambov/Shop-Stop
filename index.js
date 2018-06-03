const http = require('http');
const handlers = require('./handlers');
const url = require('url')
const port = 3000;

/**
 * 
 * @param {http.ClientRequest} req 
 * @param {http.ClientResponse} res 
 */
http.createServer((req, res) => {
    req.pathname = req.pathname || url.parse(req.url).pathname;

    for(let handler of handlers){
        if(handler(req, res) !== true){
            break;
        }
    }

}).listen(port);

console.log(`Listening on port ${port}`);