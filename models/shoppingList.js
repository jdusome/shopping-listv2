/*       Name: Joshua Dusome
         Date: 01/12/2016
         Website: https://shopping-list-app-josh.herokuapp.com/
         File: shoppingList.js
         Purpose: stores our listEntry model.
 */

var mongoose = require('mongoose');

//define a schema for listEntry model
var listEntrySchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: 'Must enter a quantity'
    }
});

// make the shoppingListSchema class public, under the name ShoppingList
module.exports = mongoose.model('listEntry', listEntrySchema);
