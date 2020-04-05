var express = require('express');
var router = express.Router();
// require passport module
const passport = require('passport');
const usersCtrl = require('../controllers/users');

/* GET home page. */
router.get('/', usersCtrl.index);

// this is the log in route
router.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

// this is the callback route that the OAuth provider will callback with
// this is to callback only from where it was registered in console.developers.google.com. This is a little security mechanism, it will only callback registered callbacks.
router.get(
    '/oauth2callback',
    passport.authenticate('google', {
        successRedirect: '/',
        // if user does not consent, then they can't use the app
        failureRedirect: '/',
    })
);

// this is the log out route
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

/* an example if we want to add a map
router.post('/maps', isLoggedIn, mapsCtrl.addMap); 
*/
// this is how we can protect a specific route
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/google');
}

module.exports = router;