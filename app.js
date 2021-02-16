const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(express.json({ limit: '50mb' }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./middlewares/response'));
app.use(require('cors')());

// MongoDB
require('./config/db');

// Routes
const routes = require('./config/routes');
routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.reply({ statusCode: 404 });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log('ERROR:', err);
  if (err.isJoi || err.hasOwnProperty('errors') || err.name === 'MongoError')
    err.status = 422;
  res.reply({ data: err.message, statusCode: err.status || 500 });
});

module.exports = app;
