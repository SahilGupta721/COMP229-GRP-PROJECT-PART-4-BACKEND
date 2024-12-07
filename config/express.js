var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
var adsRouter = require('../routes/ads');
var questionsRouter = require('../routes/questions');

var app = express();

// Enables cors.
app.use(cors());
app.options('*', cors());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ads', adsRouter);
app.use('/questions', questionsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  res.status(err.status || 500);
  // res.render('error'); /* In case to render the error message.*/
  res.json({
    status: false,
    message: err.message
  })
});

module.exports = app;
