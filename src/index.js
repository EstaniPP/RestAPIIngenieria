const express = require('express');
const app = express();

// Settings
app.set('port',process.env.PORT || 3000);

// Middlewares
app.use(express.json());


// Routes
//LogIn y registrarse
app.use(require('./controllers/authController'));

// MercadoPago services
app.use(require('./controllers/mpController'));
// MercadoPago services
app.use(require('./controllers/passwordController'));

app.use(require('./controllers/cityController'));
app.use(require('./controllers/countryController'));
/*
//Controllers generales
app.use(require('./controllers/usersJoinsController'));

//app.use(require('./controllers/deviceUserController'));
app.use(require('./controllers/diseaseController'));
app.use(require('./controllers/documentTypeController'));
app.use(require('./controllers/emailReportController'));
app.use(require('./controllers/emergencyContactController'));
app.use(require('./controllers/exerciseController'));
app.use(require('./controllers/heartRateSignalController'));
app.use(require('./controllers/insuranceController'));
//app.use(require('./controllers/medicalPersonnelController'));
app.use(require('./controllers/medicalSpecialityController'));
app.use(require('./controllers/phoneNumberController'));
app.use(require('./controllers/stateController'));
//app.use(require('./controllers/userController'));
app.use(require('./controllers/userDiseaseController'));
app.use(require('./controllers/workoutController'));
app.use(require('./controllers/workoutExerciseController'));
app.use(require('./controllers/workoutReportController'));
//Starting server
*/
app.listen(app.get('port'), () => {
    console.log('Server andando en port');
});

