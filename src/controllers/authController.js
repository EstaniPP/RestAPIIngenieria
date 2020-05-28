const { Router } = require('express');
const router = Router();
const verifyTokenMedical = require('./verifyTokenMedical');
const verifyTokenUser = require('./verifyTokenUser');
const mysqlConnection  = require('../database.js');
const jwt = require('jsonwebtoken');
const secret = "mysecretpassword";
const bcrypt = require('bcryptjs');

router.post('/signin', async (req, res) => {
    const email = req.body.email;
    console.log(email);
    let user; 
    mysqlConnection.query('SELECT * FROM users WHERE email = ?', email, async (err, rows, fields) => {
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
            return res.json({ auth: true, token });
        }
        else {
            console.log(err);
        }
    });
});


router.post('/signupmedical', async (req, res) => {
    try {
        const { name, last_name, birth_date, gender, document_number, email, password, address, city_id, document_type, medical_speciality} = req.body;
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);
        mysqlConnection.query('INSERT INTO users (name, last_name, birth_date, gender, document_number, email, password, address, city_id, document_type_id) VALUES (?)', [[name, last_name, birth_date, gender, document_number, email, newPassword, address, city_id, document_type]], (err, rows, fields) => {
            if (!err) {
                mysqlConnection.query('select id from users where email = ?', [email], (err, rows, fields) => {
                    if(!err){
                        mysqlConnection.query('Insert into medical_personnel (id, user_id, medical_speciality_id) values (?,?,?);', [null, rows[0].id, medical_speciality], (err, rows, fields) => {
                            if(!err){
                                console.log({ status:"El medico ha sido agregado correctamente" });
                                const token = jwt.sign({ id: email }, secret);
                                return res.json({ auth: true, token });
                            } else {
                                console.log(err);
                                return res.status(500).send('Hubo problemas para registrar al usuario en la aplicacion');
                            }
                        });
                    } else { 
                        console.log(err);
                        return res.status(500).send('Hubo problemas para registrar al usuario en la aplicacion');
                    }
                });
                } else {
                console.log(err);
                return res.status(500).send('Hubo problemas para registrar al usuario en la aplicacion');
                }
            });
    } catch (e) {
        console.log(e)
        return res.status(500).send('Hubo problemas para registrar al usuario en la aplicacion');
    }
});

/*
    retocado por mi.......
*/

router.post('/signupuser', async (req, res) => {
    try {
        const { name, last_name, birth_date, gender, document_number, email, password, address, city_id, document_type, weight, height, insurance_number, insurance_id} = req.body;
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);
        mysqlConnection.query('INSERT INTO users (name, last_name, birth_date, gender, document_type_id, document_number, email, password, city_id, address) VALUES (?)', [[name, last_name, birth_date, gender, document_type, document_number, email, newPassword, city_id, address]], (err, rows, fields) => {
            if (!err) {
                mysqlConnection.query('select id from users where email = ?', [email], (err, rows, fields) => {
                    if(!err){
                        mysqlConnection.query('Insert into Device_Users (weight, height, insurance_number, insurance_id, user_id) values (?)', [[weight, height, insurance_number, insurance_id, rows[0].id]], (err, rows, fields) => {
                            if(!err){
                                console.log({ status:"El usuario ha sido agregado correctamente" });
                            } else {
                                console.log(err);
                                return res.status(500).send('Hubo problemas para registrar al usuario en la aplicacion');
                            }
                        });
                    } else { 
                        console.log(err);
                        return res.status(500).send('Hubo problemas para registrar al usuario en la aplicacion');
                    }
                });
                } else {
                console.log(err);
                return res.status(500).send('Hubo problemas para registrar al usuario en la aplicacion');
                }
            });
        // Create a Token
        const token = jwt.sign({ id: email }, secret);
        res.json({ auth: true, token });

    } catch (e) {
        console.log(e)
        return res.status(500).send('Hubo problemas para registrar al usuario en la aplicacion');
    }
});


router.get('/getmedicalinfo',verifyTokenMedical, (req,res) =>{
    //aca uso un id que me inserto el middleWare y lo uso como req.id
    mysqlConnection.query('SELECT * FROM users WHERE id = ?', [req.id], async (err, rows, fields) => {
        if (!err) {
            user = rows[0];
            if(!user) {
                return res.status(404).send("El usuario no existe")
            }else{
                let user = rows[0];
                mysqlConnection.query('SELECT * FROM medical_personnel WHERE user_id = ?', [req.id], async (err, rows, fields) => {
                    if (!err) {
                        if(!user) {
                            return res.status(404).send("El usuario no es medico")
                        }else{
                            const medicalinfo = await rows[0];
                            user.medical_speciality_id = medicalinfo.medical_speciality_id;
                            return res.json(user)
                        }
                    }
                    else {
                        console.log(err);
                    }
                });
            }
        }
    })
});


router.get('/getuserinfo',verifyTokenUser, (req,res) =>{
    //aca uso un id que me inserto el middleWare y lo uso como req.id
    mysqlConnection.query('SELECT * FROM users WHERE id = ?', [req.id], async (err, rows, fields) => {
        if (!err) {
            user = rows[0];
            if(!user) {
                return res.status(404).send("El usuario no existe")
            }else{
                let user = rows[0];
                mysqlConnection.query('SELECT * FROM device_users WHERE user_id = ?', [req.id], async (err, rows, fields) => {
                    if (!err) {
                        if(!user) {
                            return res.status(404).send("El usuario no es medico")
                        }else{
                            const userinfo = await rows[0];
                            user.weight = userinfo.weight;
                            user.height = userinfo.height;
                            user.insurance_id = userinfo.insurance_id;
                            user.insurance_number = userinfo.insurance_number;
                            return res.json(user)
                        }
                    }
                    else {
                        console.log(err);
                    }
                });
            }
        }
    })
});

module.exports = router;