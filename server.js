var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// require the express-session module
const session = require('express-session');
// require the passport module
const passport = require('passport');

// load the env vars before connecting to the database
require('dotenv').config();

// create the Express app
var app = express();

// connect to the database with Mongoose
require('./config/database');

// configure the passport module
require('./config/passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// mounting the express-session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        // to remove deprecation warnings
        resave: false,
        saveUninitialized: true,
    })
);
// mounting the passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
