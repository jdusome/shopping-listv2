/*       Name: Joshua Dusome
         Date: 01/12/2016
         Website: https://shopping-list-app-josh.herokuapp.com/
         File: account.js
         Purpose: Stores our account model
 */

var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');

//oauthID and created ID's are used alongside username and password(auto defined) in local strategy
var accountSchema = new mongoose.Schema({
    //empty schema is okay
    oauthID: String,
    created: Date
});

//passport local model will use the accountSchema when storing user accounts
//will inherit all functions of passport local mongoose
accountSchema.plugin(plm);

//make this public
module.exports = mongoose.model('Account', accountSchema);