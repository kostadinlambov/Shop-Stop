const Product = require('../models/Product');
const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

module.exports.addGet = (req, res) => {
    Category.find().then((categories) => {

        res.render('products/add', {
            categories
        })
    })
}

module.exports.addPost = (req, res) => {
    let productObj = req.body
    productObj.image = '\\' + req.file.path
    productObj.creator = req.user._id

    Product.create(productObj).then((product) => {
        console.log(product);
        Category.findById(product.category).then(category => {
            console.log(category)
            category.products.push(product._id);
            console.log(category)
            category.save();
        })
        res.redirect('/');
    })
}

module.exports.editGet = (req, res) => {
    let id = req.params.id

    Product.findById(id).then((product) => {
        if (!product) {
            res.sendStatus(404)
            return
        }
        if (product.creator.equals(req.user._id) ||
            req.user.roles.indexOf('Admin') >= 0) {
            Category.find().then(categories => {
                res.render('products/edit', {
                    product,
                    categories
                });
            }).catch(err => {
                console.log(err)
            })
        }else {
            res.redirect(`/?error=${encodeURIComponent("You don't have the permission to edit this Product!")}`)
        }
    })
}

module.exports.editPost = (req, res) => {
    let id = req.params.id
    let editedProduct = req.body

    Product.findById(id).then((product) => {
        if (!product) {
            res.redirect(`/?error=${encodeURIComponent('Product was not found!')}`)
            return
        }

        product.name = editedProduct.name
        product.description = editedProduct.description
        product.price = editedProduct.price

        if (req.file) {
            product.image = '\\' + req.file.path
        }

        if (product.category.toString() !== editedProduct.category) {
            Category.findById(product.category).then(currentCategory => {
                Category.findById(editedProduct.category).then(nextCategory => {
                    let index = currentCategory.products.indexOf(product._id)
                    if (index >= 0) {
                        currentCategory.products.splice(index, 1)
                    }
                    currentCategory.save()

                    nextCategory.products.push(product._id)
                    nextCategory.save()


                    product.category = editedProduct.category

                    product.save().then(() => {
                        res.redirect(
                            '/?success=' + encodeURIComponent('Product was edited successfuly!')
                        )
                    })

                })
            })
        } else {
            product.save().then(() => {
                res.redirect(
                    '/?success=' + encodeURIComponent('Product was edited successfuly!')
                )
            })
        }
    })
}

module.exports.deleteGet = (req, res) => {
    let id = req.params.id

    Product.findById(id).populate('category').then((product) => {
        if (!product) {
            res.sendStatus(404)
            return
        }


        if ((product.creator.equals(req.user._id)) ||
            req.user.roles.indexOf('Admin') >= 0) {

            Category.find().then(categories => {
                res.render('products/delete', {
                    product,
                    categories
                });
            }).catch(err => {
                console.log(err)
            })

        } else {
            res.redirect(`/?error=${encodeURIComponent("You don't have the permission to delete this Product!")}`)
        }

    })
    // }

}

module.exports.deletePost = (req, res) => {
    let id = req.params.id

    Product.findById(id).then((productToDelete) => {
        if (!productToDelete) {
            res.redirect(`/?error=${encodeURIComponent('Product was not found!')}`)
            return
        }

        if ((productToDelete.creator.equals(req.user._id)) ||
            req.user.roles.indexOf('Admin') >= 0) {

            Product.findOneAndRemove(id).then(() => {
                res.redirect(
                    '/?success=' + encodeURIComponent('Product was deleted successfuly!')
                )
            })

        } else {
            res.redirect(`/?error=${encodeURIComponent("You don't have the permission to delete this Product!")}`)
        }
    })
}

module.exports.buyGet = (req, res) => {
    let id = req.params.id

    Product.findById(id).then((product) => {
        if (!product) {
            res.sendStatus(404)
            return
        }

        Category.find().then(categories => {
            res.render('products/buy', {
                product,
                categories
            });
        }).catch(err => {
            console.log(err)
        })
    })
}

module.exports.buyPost = (req, res) => {
    let productId = req.params.id

    Product.findById(productId).then((product) => {
        if (product.buyer) {
            let error = `error=${encodeURIComponent('Product was already bought!')}`
            res.redirect(`/?${error}`)
            return
        }

        product.buyer = req.user._id
        product.isBought = true
        product.save().then(() => {
            req.user.boughtProducts.push(productId)
            req.user.save().then(() => {
                res.redirect('/')
            })
        })
    })
}