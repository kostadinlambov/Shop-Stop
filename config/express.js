const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars')
const helpers = require('handlebars-helpers').comparison()
// const helpers = require('helper-lib');
const shortid = require('shortid')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')

module.exports = (app, config) => {

    // View engine setup.
    //  app.set('views', path.join(__dirname, './views'));
    app.engine('.hbs', handlebars({
        extname: '.hbs',
        layoutsDir: 'views/layouts',
        defaultLayout: 'main',
        partialsDir: 'views/partials',
    }))

    app.set('view engine', '.hbs');

    // app.set('view engine', 'pug')
    // app.set('views', path.join(config.rootPath, 'views'))

    //Configure middleware for parsing form data
    app.use(bodyParser.urlencoded({
        extended: true
    }))

    //Configure "public" folder
    app.use((req, res, next) => {
        if (req.url.startsWith('/content')) {
            req.url = req.url.replace('/content', '')
        }
        next()
    }, express.static(
        path.normalize(path.join(config.rootPath, 'content'))
    ))

    // Session is storage for cookies, which will be de/encrypted with that 'secret' key.
    app.use(session({
        secret: 'S3cr3t',
        resave: false,
        saveUninitialized: false
    }))

    // We will use cookies.
    app.use(cookieParser())

    // For user validation we will use passport module.
    app.use(passport.initialize())
    app.use(passport.session())

    app.use((req, res, next) => {
        if (req.user) {
            res.locals.currentUser = req.user
        }

        next()
    })
}