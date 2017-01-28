/*       Name: Joshua Dusome
         Date: 01/12/2016
         Website: https://shopping-list-app-josh.herokuapp.com/
         File: product.js
         Purpose: stores our product model
 */

var mongoose = require('mongoose');

//define a schema for the product model
//this model inherits from the mongoose.Schema
var productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Please enter a name'
    },
    department: {
        type: String,
        required: "Please choose a department"
    }
});

// make the productSchema class public, under the name Product
module.exports = mongoose.model('Product', productSchema);