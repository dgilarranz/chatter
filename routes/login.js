const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* Answer POST -> login user or show error */
router.post('/', function(req, res, next) {
  // Recuperamos los parámetros enviados
  let username = req.body.username;
  let password = req.body.password;

  // Comprobamos si las credenciales proporcionadas son correctas
  if (users[username] && bcrypt.compare(password, users[username].hash)) {
    // Si todo está correcto, creamos una sesión para el usuario y le redirigimos a chat
    req.session.user = users[username];
    res.redirect('/chat');
  } else {
    // Si las credenciales no son válidas, se redirige a login con un mensaje de error
    req.session.error = "Incorrect Username or Password";
    res.redirect('/login');
  }
});

let users = {
  david: {username: "david"}
};

// hasheamos la contraseña de los usuarios
bcrypt.hash("1234", 10, function(err, hash) {
  users.david.hash = hash;
});

module.exports = router;
