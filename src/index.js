const express = require('express');
const app = express();

// Settings
app.set('port',process.env.PORT || 3000);

// Middlewares
app.use(express.json());


// Routes
//LogIn y registrarse
app.use(require('./controllers/authController'));

//Starting server
app.listen(app.get('port'), () => {
    console.log('Server andando en port');
});

