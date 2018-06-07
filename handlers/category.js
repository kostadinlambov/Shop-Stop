const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const multiparty = require('multiparty');
const shortid = require('shortid');
const Category = require('../models/Category');

module.exports = (req, res) => {
    //req.pathname = req.pathname || url.parse(req.url).pathname

    if (req.pathname === '/category/add' && req.method === 'GET') {
        let filePath = path.normalize(path.join(__dirname, '../views/category/add.html'));

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.write(data);
            res.end();
        })


    }else if(req.pathname === '/category/add' && req.method === 'POST'){
        let querydata = '';

        req.on('data' , (data) => {
            querydata += data;
        })

        req.on('error' , (err) => {
            console.log(err);

            return;
        })


        req.on('end', () => {
            let category = qs.parse(querydata);
            console.log(category);
            if(category.name === ''){
                res.writeHead(302, {
                    Location: '/category/add'
                });

                res.end()
            }else{
                Category.create(category).then(() => {
                    res.writeHead(302, {
                        Location: '/'
                    });

                    res.end()
                })
            }
        })

    }else{
        return true;
    }
}