const { Router } = require('express');
const router = Router();
const mysqlConnection  = require('../database.js');
const jwt = require('jsonwebtoken');
const secret = "mysecretpassword";
const bcrypt = require('bcryptjs');

router.post('/signin', async (req, res) => {
    const email = req.body.email;
    console.log(email);
    let user; 
    mysqlConnection.query('SELECT * FROM users WHERE email = ?', [email], async (err, rows, fields) => {
        if (!err) {
            user = rows[0];
            if(!user) {
                return res.status(404).send("El usuario no existe")
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(401).send({auth: false, token: null});
            }
            const token = jwt.sign({ id: email }, secret);
            res.json({ auth: true, token });
        }
        else {
            console.log(err);
        }
    });
});


router.post('/signupmedical', async (req, res) => {
    try {
        const { name, last_name, birth_date, gender, document_number, email, password, address, medical_speciality} = req.body;
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);
        mysqlConnection.query('INSERT INTO users (name, last_name, birth_date, gender, document_number, email, password, address) VALUES (?)', [[name, last_name, birth_date, gender, document_number, email, newPassword, address]], (err, rows, fields) => {
            if (!err) {
                mysqlConnection.query('select id from users where email = ?', [email], (err, rows, fields) => {
                    if(!err){
                        mysqlConnection.query('Insert into medical_personnel (user_id) values (?);', [[ rows[0].id]], (err, rows, fields) => {
                            if(!err){
                                console.log({ status:"El medico ha sido agregado correctamente" });
                                // Create a Token
                                const token = jwt.sign({ id: email }, secret);
                                res.json({ auth: true, token });
                            } else {
                                console.log(err);
                                res.status(500).send('Hubo problemas para registrar al usuario de la aplicacion');
                            }
                        });
                    } else { 
                        console.log(err);
                        res.status(500).send('Hubo problemas para registrar al usuario de la aplicacion');
                    }
                });
                } else {
                console.log(err);
                res.status(500).send('Hubo problemas para registrar al usuario');
                }
            });
    } catch (e) {
        console.log(e)
        res.status(500).send('Hubo problemas para registrarse');
    }
});


router.post('/signupuser', async (req, res) => {
    try {
        const { name, last_name, birth_date, gender, document_number, email, password, address, city_id, document_type, weight, height, insurance_number, insurance_id} = req.body;
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);
        mysqlConnection.query('INSERT INTO users (name, last_name, birth_date, gender, document_number, email, password, address) VALUES (?)', [[name, last_name, birth_date, gender, document_number, email, newPassword, address]], (err, rows, fields) => {
            if (!err) {
                mysqlConnection.query('select id from users where email = ?', [email], (err, rows, fields) => {
                    if(!err){
                        mysqlConnection.query('Insert into Device_Users (weight, height, insurance_number, user_id) values (?)', [[weight, height, insurance_number, rows[0].id]], (err, rows, fields) => {
                            if(!err){
                                console.log({ status:"El usuario ha sido agregado correctamente" });
                            } else {
                                console.log(err);
                                res.status(500).send('Hubo problemas para registrar al usuario de la aplicacion');
                            }
                        });
                    } else { 
                        console.log(err);
                        res.status(500).send('Hubo problemas para registrar al usuario de la aplicacion');
                    }
                });
                } else {
                console.log(err);
                res.status(500).send('Hubo problemas para registrar al usuario');
                }
            });
        // Create a Token
        const token = jwt.sign({ id: email }, secret);
        res.json({ auth: true, token });

    } catch (e) {
        console.log(e)
        res.status(500).send('Hubo problemas para registrarse');
    }
});

module.exports = router;