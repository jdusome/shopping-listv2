/*       Name: Joshua Dusome
         Date: 01/12/2016
         Website: https://shopping-list-app-josh.herokuapp.com/
         File: globalVars.js
         Purpose: stores our global variables.
 */

module.exports = {
    //db connection string
    db: 'mongodb://jdusome:shadowferal4@ds153667.mlab.com:53667/shopping-list-manager',
    //random string used to salt our passwords
    secret: 'This is a super secret salty secret full of salt',

    ids: {
        //set up OAUTH variables
        github: {
            clientID: '3274eadd94e23d0c2a76',
            clientSecret: 'd32fc3380bc9b5bf160b4a2ec4e896150707a01f',
            //this is where facebook will redirect user on successful login
            callbackURL: 'https://shopping-list-app-josh.herokuapp.com/github/callback'
        },
        twitter: {
            consumerKey: 'TieJsqIVOYlz5UvDa4zyeGjg9',
            consumerSecret: 'yEZgPfdkt2sQ5QoMXVq0eOIhPmcBX2MYZMvrEYRajYvlEbI5Zr',
            callbackURL: 'https://shopping-list-app-josh.herokuapp.com/twitter/callback'
        }
    }
};