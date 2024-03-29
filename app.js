var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

var logger = require('morgan');
require('./Connection/Db')
let usersRouter = require('./routes/User')
const PostRouter = require('./routes/Posts')
const FollowRouter = require('./routes/Follows')
const AdminRouter = require('./routes/Admin')
const StoryRouter = require('./routes/Stories')
const PlanRouter = require('./routes/Plans')
const StoriesModel = require('./Model/Stories')
const cors = require('cors')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());



// app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/posts/', PostRouter);
app.use('/', FollowRouter);
app.use('/admin/', AdminRouter);
app.use('/', StoryRouter);
app.use('/subscriptions/', PlanRouter);

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
