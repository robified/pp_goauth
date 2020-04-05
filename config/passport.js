// this is not middleware, this is to configure passport
// this is the same passport module like the one in server.js
const passport = require('passport');
// require oauth strategy module. this is capitalized because it's a class
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
