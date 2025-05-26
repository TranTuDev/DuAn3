var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');



// var indexRouter = require('./routes/index');
// // var usersRouter = require('./routes/authMiddleware');
// var tradingjournalRouter = require('./routes/tradingjournal');






const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');


var app = express();


//kết nối data
app.use(session({
  secret: 'dulich-secret-key',
  resave: false,
  saveUninitialized: true,
}));





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// Middleware




// Middleware cần trước routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/image', express.static(path.join(__dirname, 'image')));
//để sử dụng image ngoài public

//router
app.use('/', indexRoutes);
app.use('/auth', authRoutes);

//router bổ sung
// app.get('/', (req, res) => {
//   res.render('main'); // nhấn vào home trở lại 'user.ejs' nếu bạn muốn rõ ràng
// });


// app.get('/users', (req, res) => {
//   res.render('users'); // nhấn vào home trở lại 'user.ejs' nếu bạn muốn rõ ràng
// });

// app.get('/trade', (req, res) => {
//   res.render('trade');
// });

// app.get('/tradingjournal', async (req, res) => {
//   // const journals = await TradingJournal.find({}); // hoặc { user: req.user._id } nếu có login
//   res.render('tradingjournal');
// });




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
