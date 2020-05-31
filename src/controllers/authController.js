const { Router } = require('express');
const router = Router();
const mysqlConnection  = require('../database.js');
const jwt = require('jsonwebtoken');
const secret = "mysecretpassword";
const bcrypt = require('bcryptjs');
const emailValidation = require('../functionalMethods/emailValidation');
const dateValidation = require('../functionalMethods/dateValidation');

router.post('/signin/', async (req, res) => {
    if(!req.body.email || !req.body.password){
        return res.status(411).send();
    }
    const email = req.body.email;
    let user; 
    mysqlConnection.query('SELECT * FROM users WHERE email = ?', email, async (err, rows, fields) => {
        if (!err) {
            user = rows[0];
            if(!user) {
                return res.status(406).send("El usuario no existe")
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(407).send();
            }
            const token = jwt.sign({ id: email }, secret);
            return res.status(200).json({ auth: true, token });
        }
        else {
            return res.status(500).send();
        }
    });
});


router.post('/signupmedical/', async (req, res) => {
    const { name, last_name, birth_date, gender, document_number, email, password, address, city_id, document_type, medical_speciality} = req.body;
    if(!name || !last_name || !birth_date || !gender || !document_number || !email || !password || !address || !city_id || !document_type || !medical_speciality){
        return res.status(411).send();
    }
    if(!dateValidation(birth_date)){
        return res.status(413).send();
    }
    if(!emailValidation(email)){
        return res.status(415).send();
    }
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    mysqlConnection.query('select id from users where email = ?', [email], (err, rows, fields) => {
        if (!err) {
            if(rows[0]){
                return res.status(417).send('Ese email ya esta asociado a otro usuario');
            }else{
            mysqlConnection.query('INSERT INTO users (name, last_name, birth_date, gender, document_number, email, password, address, city_id, document_type_id) VALUES (?)', [[name, last_name, birth_date, gender, document_number, email, newPassword, address, city_id, document_type]], (err, rows, fields) => {
                if (!err) {
                    mysqlConnection.query('select id from users where email = ?', [email], (err, rows, fields) => {
                        if(!err){
                            mysqlConnection.query('Insert into medical_personnel (user_id, medical_speciality_id) values (?,?);', [rows[0].id, medical_speciality], (err, rows, fields) => {
                                if(!err){
                                    console.log({ status:"El medico ha sido agregado correctamente" });
                                    const token = jwt.sign({ id: email }, secret);
                                    return res.status(200).json({ auth: true, token });
                                } else {
                                    console.log(err);
                                    return res.status(500).send(err);
                                }
                            });
                        } else { 
                            console.log(err);
                            return res.status(500).send(err);
                        }
                    });
                    } else {
                    console.log(err);
                    return res.status(500).send(err);
                    }
                });
            }
        } else {
            console.log(err);
            return res.status(500).send(err);
        }
    });
});

router.post('/signupuser/', async (req, res) => {
    const { name, last_name, birth_date, gender, document_number, email, password, address, city_id, document_type, weight, height, insurance_number, insurance_id} = req.body;
    if(!name || !last_name || !birth_date || !gender || !document_number || !email || !password || !address || !city_id || !document_type || !weight || !height || !insurance_number || !insurance_id){
        return res.status(411).send();
    }
    if(!dateValidation(birth_date)){
        return res.status(413).send();
    }
    if(!emailValidation(email)){
        return res.status(415).send();
    }
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    mysqlConnection.query('select id from users where email = ?', [email], (err, rows, fields) => {
        if (!err) {
            if(rows[0]){
                return res.status(417).send();
            }else{
                mysqlConnection.query('INSERT INTO users (name, last_name, birth_date, gender, document_type_id, document_number, email, password, city_id, address) VALUES (?)', [[name, last_name, birth_date, gender, document_type, document_number, email, newPassword, city_id, address]], (err, rows, fields) => {
                if (!err) {
                    mysqlConnection.query('select id from users where email = ?', [email], (err, rows, fields) => {
                        if(!err){
                                mysqlConnection.query('Insert into Device_Users (weight, height, insurance_number, insurance_id, user_id) values (?)', [[weight, height, insurance_number, insurance_id, rows[0].id]], (err, rows, fields) => {
                                if(!err){
                                    console.log({ status:"El usuario ha sido agregado correctamente" });
                                    const token = jwt.sign({ id: email }, secret);
                                    return res.status(200).json({ auth: true, token });
                                } else {
                                    console.log(err);
                                    return res.status(500).send(err);
                                }
                            });
                        } else {
                            return res.status(500).send(err);
                        }
                    });
                    } else {
                    console.log(err);
                    return res.status(500).send(err);
                    }
                });
            }
        } else {
            console.log(err);
            return res.status(500).send(err);
        }
    });
});

module.exports = router;