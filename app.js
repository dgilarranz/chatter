const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session')

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const chatRouter = require('./routes/chat');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Usamos session
app.use(session({
  resave: false,
  secret: "clave secreta para chats",
  saveUninitialized: false
}));

// Función que guarda la sesión actual para que no se borre entre peticiones
app.use(function (req, res, next) {
  let error = req.session.error;
  
  // Si error no está vacío, lo borramos de la sesión
  delete req.session.error;

  // Guardamos el error en res.locals (para que esté disponible esta petición)
  res.locals.error = "";
  if (error) res.locals.error = error;

  // Continuamos con la cadena
  next();
});

app.use('/', indexRouter);
app.use('/chat', restrict, chatRouter);   // Se fuerza a estar logueado para acceder a los chats
app.use('/login', loginRouter);

// Función que comprueba si un usuario está logueado. Si no, le reenvía a login
function restrict(req, res, next) {
  if (req.session.user) {
    // Si el usuario está logueado, se continúa
    next();
  } else {
    // Si los usuarios no están logeados, se reenvían a login
    res.session.error = "Unauthorized Access";
    res.redirect('/login');
  }
}

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
