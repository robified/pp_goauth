var express = require('express');
var router = express.Router();
// require passport module
const passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

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
        successRedirect: '/index',
        // if user does not consent, then they can't use the app
        failureRedirect: '/index',
    })
);

// this is the log out route
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/index');
});

module.exports = router;
