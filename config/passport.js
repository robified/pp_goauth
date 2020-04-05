// this is not middleware, this is to configure passport
// this is the same passport module like the one in server.js
const passport = require('passport');
// require oauth strategy module. this is capitalized because it's a class
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// require User model
const User = require('../models/user');

// mount GoogleStrategy
passport.use(
    new GoogleStrategy(
        {
            // the first argument is a configuration object that uses these key names specifically
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK,
        },
        // the profile parameter is a google profile object
        function (accessToken, refreshToken, profile, callback) {
            // a user has logged in with OAuth...
            User.findOne({ googleId: profile.id }, function (err, user) {
                if (err) return callback(err);
                if (user) {
                    // return user
                    return callback(null, user);
                } else {
                    // we have a new user via OAuth!
                    const newUser = new User({
                        // if we want to include these, we'll need to modify our User model
                        // name: profile.displayName,
                        // email: profile.emails[0].value,
                        googleId: profile.id,
                        avatar: profile.photos[0].value
                    });
                    newUser.save(function (err) {
                        if (err) return callback(err);
                        return callback(null, newUser);
                    });
                }
            });
        }
    )
);

passport.serializeUser(function (user, done) {
    // mongoose id property is user._id, this is the same as just typing user.id. You can only use this on the server side
    done(null, user.id);
});

// id is the same thing as the user.id, it's the mongo id of the user model
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        // passport will then attach this user object to req.user
        done(err, user);
    });
});
