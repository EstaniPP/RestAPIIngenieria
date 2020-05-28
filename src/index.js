const express = require('express');
const app = express();
const validateEmail = require('./functionalMethods/emailValidation');

// Settings
app.set('port',process.env.PORT || 3000);

// Middlewares
app.use(express.json());

/*

// Routes
//LogIn y registrarse
app.use(require('./controllers/authController'));
// MercadoPago services
app.use(require('./controllers/mpController'));
//Starting server
app.listen(app.get('port'), () => {
    console.log('Server andando en port');
});*/

