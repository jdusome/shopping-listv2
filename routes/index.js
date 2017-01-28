/*       Name: Joshua Dusome
         Date: 01/12/2016
         Website: https://shopping-list-app-josh.herokuapp.com/
         File: index.js
         Purpose: Index js handles our shoppinglist and home routes, aswell as login and registration.
         It loads our EJS pages, and passes in neccessary information
 */

//load our required node modules
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//link the controller to the product/shopping list model
var Product = require('../models/product');
var ListEntry = require('../models/shoppingList');

//reference account model for loggedIn users
var Account = require('../models/account');

//reference flash
var flash = require('connect-flash');

//reference passport
var passport = require('passport');

//authentication check
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    next();
  }
  else {
    res.redirect('/login');
  }
};

/* GET home page. */
router.get('/', function(req, res, next) {
    //use the product model to query the database for product data
    //it will either return an error or product
    Product.find(function(err, products)
    {
        if (err){
            console.log(err);
            res.render('error');
        }

        else {
            //use the ShoppingList model to query the database for ShoppingList data
            //it will either return an error or product
            ListEntry.find(function(err, listEntries){
                if (err){
                    console.log(err);
                    res.render('error');
                }

                else {
                    //load the item-list page
                    res.render('home', {
                        title: 'Home',
                        products: products,
                        listEntries: listEntries,
                        user: req.user
                    });
                }
            });
        }
    });
});

/* GET login page. */
router.get('/login', function(req, res, next){
  //set messages as any session messages, if not empty
  var messages = req.session.messages || []; //flash.message;

  //clear session messages
  req.session.messages = [];

  res.render('login', {
    title: 'Login',
    messages: messages,
    user: req.user
  });
});

/* POST Login page */
//for local strategy
router.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login',
//displays a failure message if the login fails
  failureMessage: 'Invalid Login',
  failureFlash: true
}));

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register',
    user: req.user});
});

/* POST register page */
router.post('/register', function(req, res, next){
  //use the Account model and passport to create a new user
  Account.register(new Account({username: req.body.username}),
      req.body.password,
      function (err, account){
        if(err){
          console.log(err);
          res.redirect('/register');
        }
        else {
          res.redirect('/login');
        }
      });
});


/* GET shopping-list page. */
router.get('/shopping-list', isLoggedIn, function(req, res, next) {
  //use the product model to query the database for product data
  //it will either return an error or product
  Product.find(function(err, products)
  {
    if (err){
      console.log(err);
      res.render('error');
    }

    else {
        //use the ShoppingList model to query the database for ShoppingList data
        //it will either return an error or product
        ListEntry.find(function(err, listEntries){
            if (err){
                console.log(err);
                res.render('error');
            }

            else {
                //load the item-list page
                res.render('shopping-list', {
                    title: 'Shopping List',
                    products: products,
                    listEntries: listEntries,
                    user: req.user
                });
            }
        });
    } //else
  });
});

/* GET /shopping-list/add/:_id - Add an item to the shopping list */
router.get('/shopping-list/add/:_id', function (req, res, next){
    //get the id from the URL
    var _id = req.params._id;

    //search for the selected ListEntries
    ListEntry.findById({ _id: _id}, function(err, listEntries){
        if (err) {
            console.log(err);
            res.render('error', {
                message: 'Could not Load ListEntry',
                error: err
            });
        }

        // We have successfully returned our listEntries
        else {

            // If the listEntry already exists, increase the quantity by 1
            if (listEntries != null){

                // instantiate and populate a new listEntry object
                var listEntry = new ListEntry({
                    _id: _id,
                    quantity: listEntries.quantity + 1
                });

                //update the listEntry
                ListEntry.update({ _id: _id}, listEntry, function(err){
                    if (err){
                        console.log(err);
                        res.render('error', {
                            message: 'Could not Update the ListEntry',
                            error: err
                        });
                    }
                    else {
                        res.redirect('/shopping-list');
                    }
                });
            }

            // If the listEntry does not exist, create a new entry with a quantity of 1
            else {
                ListEntry.create( {
                    _id : _id,
                    quantity: 1
                }, function(err, ListEntry) {
                    if (err){
                        console.log(err);
                        res.render('error', {message: 'Could not Create ListEntry'});
                    }

                    else {
                        res.redirect('/shopping-list');
                    }
                });
            }
        }
    });
});

/* GET /shopping-list/remove/:_id - Remove an item from the shopping list */
router.get('/shopping-list/remove/:_id', function (req, res, next){
    //get the id from the URL
    var _id = req.params._id;

    //search for the selected ListEntries
    ListEntry.findById({ _id: _id}, function(err, listEntries){
        if (err) {
            console.log(err);
            res.render('error', {
                message: 'Could not Load ListEntry',
                error: err
            });
        }

        // We have successfully returned our listEntries
        else {

            //If the item is in our table
            if (listEntries != null) {

                //if there is only 1 of our item in the list, remove the entry
                if (listEntries.quantity == 1){

                    // delete the document with this _id
                    ListEntry.remove( { _id: _id}, function(err){
                        if(err) {
                            console.log(err);
                            res.render('error', {
                                message: 'Could not Delete ListEntry',
                                error: err
                            });
                        }

                        else{
                            res.redirect('/shopping-list');
                        }
                    });
                }

                // there is more than 1 of our item in the list, decrease quantity by 1
                else {

                    // instantiate and populate a new listEntry object
                    var listEntry = new ListEntry({
                        _id: _id,
                        quantity: listEntries.quantity - 1
                    });

                    //update the listEntry
                    ListEntry.update({ _id: _id}, listEntry, function(err){
                        if (err){
                            console.log(err);
                            res.render('error', {
                                message: 'Could not Update the ListEntry',
                                error: err
                            });
                        }
                        else {
                            res.redirect('/shopping-list');
                        }
                    });
                }

                }

                //there is no list entry to remove
                else {
                res.redirect('/shopping-list');
            }
            }
});
});

/* GET /shopping-list/new -- Delete the current shopping list */
router.get('/shopping-list/new', function (req, res, next) {

    //drop our list entry collection
    mongoose.connection.db.dropCollection('listentries', function(err, empty) {

        if(err){
            console.log(err);
            res.render('error', {
                message: 'Could not Delete ListEntry',
                error: err
            });
        }

        else {
            res.redirect('/shopping-list')
        }
    });
});

/* GET /github */
router.get('/github', passport.authenticate('github'), function (req, res, next){});

/* GET /github/callback */
router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/login',
    failureMessage: 'Invalid Login'
}), function(req, res, next){
    res.redirect('/shopping-list');
});

/* GET /twitter */
router.get('/twitter', passport.authenticate('twitter'), function (req, res, next){});

/* GET /twitter/callback */
router.get('/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/login',
    failureMessage: 'Invalid Login'
}), function(req, res, next){
    res.redirect('/shopping-list');
});




/* GET logout page */
router.get('/logout', function(req, res, next){
  //log the user out and redirect to homepage
  req.logout();
  res.redirect('/login');
});


module.exports = router;
