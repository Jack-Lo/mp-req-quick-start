var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var sysApiRouter = require('./routes/api/sys');
var userApiRouter = require('./routes/api/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (/^\/api\//.test(req.path)) {
    const { sessionid } = req.headers;
    const now = new Date().getTime();
    if (now - sessionid > 1000 * 10) {
      res.json({
        code: 3000,
        data: null,
        msg: 'invalid sessionid.',
      });
      return;
    }
  }
  next();
});

app.use('/', indexRouter);
app.use('/api/sys', sysApiRouter);
app.use('/api/user', userApiRouter);

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
