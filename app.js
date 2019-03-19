var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser= require('body-parser');
var cookieParser = require('cookie-parser');
var mongodb=require('mongodb');
var mongoose=require('mongoose');
var session=require('express-session');
var flash=require('connect-flash');
var passport=require('passport');
var logger = require('morgan');
var mongoDb = require('connect-mongo')(session);
var index = require('./routes/index');
var admin= require('./routes/admin/addSection');

var app = express();

console.log("begin");

var mongoConnection = 'mongodb://localhost:27017/minorproject';

mongoose.connect(mongoConnection, {useNewUrlParser: true});


mongoose.connection.on('connected', function () {
  console.log("connection started");
});

//on error
mongoose.connection.on('error', function (err) {
    console.log('Error occur in mongoose ' + err);
});

//On disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.use(session({
        secret: 'qwertyuiopasdfghjkl',
        resave: false,
        saveUninitialized: false,

    }
    )
);

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
    res.locals.session = session;
    next();
})


app.use('/', index);
app.use('/admin',admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
