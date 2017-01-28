/*      Name: Joshua Dusome
        Date: 01/12/2016
        Website: https://shopping-list-app-josh.herokuapp.com/
        File: app.js
        Purpose: This launches our NodeJS application, dispatches routes and loads the required node modules.
        It also handles our logins and authentication aswell as error dispatching.
 */

//load our required node modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//require mongoose to connect to database
var mongoose = require('mongoose');

//require our passport packages + account model
var passport = require('passport');
var session = require ('express-session');
var flash = require('connect-flash');
var Account = require('./models/account');

//instantiated to a class within the package (local Strategy)
var localStrategy = require('passport-local').Strategy;

//configure Github Strategy
var githubStrategy = require('passport-github').Strategy;

//configure Twitter strategy
var twitterStrategy = require('passport-twitter').Strategy;

//load our global variables
var config = require('./config/globalVars');

//connect to our database
mongoose.connect(config.db);

//load our routes into variables to be dispatched
var routes = require('./routes/index');
var itemlist  = require('./routes/itemlist');

var app = express();

//initialize the passport packages for authentication///////////////

//creates and stores messages that can be displayed on different pages
app.use(flash());

app.use(session({
  secret: config.secret,
  //refresh session every time user reloads the page (don't time user out if active)
  resave: true,
  //dont initialize the session until someone signs up or logs in
  saveUninitialized: false
}));

//initialize passport and session class
app.use(passport.initialize());
app.use(passport.session());

//create login strategy based on our account model
passport.use(Account.createStrategy());

//configure Github login strategy
passport.use(new githubStrategy({
      clientID: config.ids.github.clientID,
      clientSecret: config.ids.github.clientSecret,
      callbackURL: config.ids.github.callbackURL
    }, function(accessToken, refreshToken, profile, cb) {
      //what to do when github returns the profile
      //returns profile, and callback function
      //check if this github profile is already in our accounts collection
      Account.findOne({oauthID: profile.id}, function (err, user) {
        if (err) {
          console.log(err);
        }
        else {
          //if the user already exists, continue
          if (user !== null) {
            //run callback and whatever else happens after, send back the user account
            //we send user to the next page
            cb(null, user);
          }
          else {
            //valid user but not yet in mongoDB. add the user
            user = new Account({
              oauthID: profile.id,
              username: profile.username,
              created: Date.now()
            });
            //try to save the new user
            user.save(function(err){
              if (err){
                console.log(err);
              }
              else {
                cb(null, user);
              }
            });
          }
        }
      });
    }
));

//configure twitter login Strategy
passport.use(new twitterStrategy({
      consumerKey: config.ids.twitter.consumerKey,
      consumerSecret: config.ids.twitter.consumerSecret,
      callbackURL: config.ids.twitter.callbackURL
    }, function(accessToken, refreshToken, profile, cb) {
      //what to do when twitter returns the profile
      //returns profile, and callback function
      //check if this twitter profile is already in our accounts collection
      Account.findOne({oauthID: profile.id}, function (err, user) {
        if (err) {
          console.log(err);
        }
        else {
          //if the user already exists, continue
          if (user !== null) {
            //run callback and whatever else happens after, send back the user account
            //we send user to the next page
            cb(null, user);
          }
          else {
            //valid user but not yet in mongoDB. add the user
            user = new Account({
              oauthID: profile.id,
              username: profile.username,
              created: Date.now()
            });
            //try to save the new user
            user.save(function(err){
              if (err){
                console.log(err);
              }
              else {
                cb(null, user);
              }
            });
          }
        }
      });
    }
));


// read/write users between passport and mongodb
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//////////////////////////////////////////////////////////////////////

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// dispatch our URL requests
app.use('/', routes);
app.use ('/item-list', itemlist);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
