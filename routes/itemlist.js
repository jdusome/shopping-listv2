/*       Name: Joshua Dusome
         Date: 01/12/2016
         Website: https://shopping-list-app-josh.herokuapp.com/
         File: itemlist.js
         Purpose: Itemlist.js handles all of our item list routing. Includes full CRUD operations.
 */

//loads our required node modules
var express = require('express');
var router = express.Router();

//link the controller to the product model
var Product = require('../models/product');

//authentication check
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        next();
    }
    else {
        res.redirect('/login');
    }
};

/* GET item-list page. */
router.get('/', isLoggedIn, function(req, res, next) {
    //use the product model to query the database for product data
    //it will either return an error or product
    Product.find(function(err, products)
    {
        if (err){
            console.log(err);
            res.render('error');
        }

        else {
            //load the item-list page
            res.render('item-list', {
                title: 'Item List',
                products: products,
                user: req.user
            });
            }
    });
});


/* GET add-item page. */
router.get('/add-item', isLoggedIn, function(req, res, next) {
    res.render('add-item', { title: 'Add Item',
        user: req.user});
});

/* POST /item-list/add-item - process the form submission */
router.post('/add-item', isLoggedIn, function(req,res,next){
    //get input and use mongoose to insert to the db
    //we pass in object, then callback function
    Product.create( {
        name: req.body.name,
        department: req.body.department
    }, function(err, Product) {
        if (err){
            console.log(err);
            res.render('error', {message: 'Could not Add Product'});
        }

        else {
            res.redirect('/item-list');
        }
    });
});

/* GET /edit-item/_id - display edit page & fill with values */
router.get('/edit-item/:_id', isLoggedIn, function (req, res, next){
    //get the id from the URL
    var _id = req.params._id;

    //use Mongoose to get the selected product document
    Product.findById({ _id: _id}, function(err, product){
        if (err) {
            console.log(err);
            res.render('error', {
                message: 'Could not Load Product',
                error: err
            });
        }

        else {
            res.render('edit-item', {
                title: 'Edit Item',
                product: product,
                user: req.user
            });
        }
    });
});

/* POST /edit-item/id - process form submission & update selected doc */
router.post('/edit-item/:_id', isLoggedIn, function(req, res, next){
    //get ID from the URL
    var _id = req.params._id;

    // instantiate and populate a new product object
    var product = new Product({
        _id: _id,
        name: req.body.name,
        department: req.body.department
    });

    //update the product
    Product.update({ _id: _id}, product, function(err){
        if (err){
            console.log(err);
            res.render('error', {
                message: 'Could not Update Product',
                error: err
            });
        }
        else {
            res.redirect('/item-list');
        }
    });
});

/* GET delete-item/_id - process delete */
/* the : means that it is a variable */
router.get('/delete-item/:_id', isLoggedIn, function (req, res, next){
    //get the id from the URL
    //creates a local variable with the same name
    var _id = req.params._id;

    // delete the document with this _id
    Product.remove( { _id: _id}, function(err){
        if(err) {
            console.log(err);
            res.render('error', {
                message: 'Could not Delete Product',
                error: err
            });
        }

        else{
            res.redirect('/item-list');
        }
    });
});

module.exports = router;

