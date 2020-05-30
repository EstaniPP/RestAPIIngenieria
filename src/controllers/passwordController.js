/*
    Controller for password actions
    @author valentin
     - backendingenieria@gmail.com
     - BackendIngenieria@gmail.com
*/
const { Router } = require('express');
const router = Router();
// database connection
const mysqlConnection = require('../database');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
var generator = require('generate-password');

router.post('/forgot', (req, res) => {
    // get account email
    const accountEmail = req.body.email;
    if(!accountEmail){
        // bad request
        return res.status(400).json({
            error: 400,
            msg: "Falta direccion de email"
        });
    }else{
        // check if the email exists
        mysqlConnection.query('SELECT email FROM Users WHERE email = ?', [accountEmail], async (err, rows) => {
            console.log("Personas con ese mail ", rows.length);
            // check if email exists
            if(rows.length !== 0){
                // generate a password
                let newPass = generator.generate({
                    length: 10,
                    numbers: true
                });;
                const salt = await bcrypt.genSalt(10);
                const encNewPass = await bcrypt.hash(newPass, salt);
                // set the user password
                mysqlConnection.query('UPDATE Users SET password = ? WHERE email = ?', [encNewPass, accountEmail], async (err, result) => {
                    // send email
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: 'backendingenieria@gmail.com',
                          pass: 'EstaNoEsLaPassword'
                        }
                    });
                    var mailOptions = {
                        from: 'backendingenieria@gmail.com',
                        to: accountEmail,
                        subject: 'Cambio de Contrasena',
                        text: 'Su nueva contrasena es: ' + newPass
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                          return res.status(200).json({
                            msg: "OK"
                          });
                        }
                    });
                });
            }else{
                // if email does not exist i'll send a 200 status code anyway
                return res.status(500).json({
                    msg: "OK"
                });
            }
        });

    }
});

module.exports = router;