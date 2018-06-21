const controllers = require('../controllers')
const multer = require('multer')
const auth = require('./auth')

let upload = multer({
    dest: './content/images'
})

module.exports = (app) => {
    app.get('/', controllers.home.index)
    app.get('/home/index', controllers.home.index)

    //User register
    app.get('/users/register', controllers.users.registerGet)
    app.post('/users/register', controllers.users.registerPost)

    //User login
    app.get('/users/login', controllers.users.loginGet)
    app.post('/users/login', controllers.users.loginPost)

    //User logout
    app.post('/users/logout', auth.isAuthenticated, controllers.users.logout)

    //Add product
    app.get('/products/add', auth.isAuthenticated, controllers.product.addGet)
    app.post('/products/add', auth.isAuthenticated, upload.single('image'), controllers.product.addPost)

    //Edit product
    app.get('/products/edit/:id', auth.isAuthenticated, controllers.product.editGet)
    app.post('/products/edit/:id', auth.isAuthenticated, upload.single('image'), controllers.product.editPost)

    //Delete product
    app.get('/products/delete/:id', auth.isAuthenticated, controllers.product.deleteGet)
    app.post('/products/delete/:id', auth.isAuthenticated, controllers.product.deletePost)

    //Buy product
    app.get('/products/buy/:id', auth.isAuthenticated, controllers.product.buyGet)
    app.post('/products/buy/:id', auth.isAuthenticated, controllers.product.buyPost)

    //Add category
    app.get('/category/add', auth.isInRole('Admin'), controllers.category.addGet)
    app.post('/category/add', auth.isInRole('Admin'), controllers.category.addPost)

    //List products by category
    app.get('/category/:category/products', controllers.category.productByCategory)
}