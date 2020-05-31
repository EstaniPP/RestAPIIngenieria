const { Router } = require('express');
const router = Router();
const verifyTokenMedical = require('./verifyTokenMedical');
const verifyTokenUser = require('./verifyTokenUser');
const verifyTokenGeneral = require('./verifyTokenGeneral');
const mysqlConnection  = require('../database.js');
const bcrypt = require('bcryptjs');
const emailValidation = require('../functionalMethods/emailValidation');
const dateValidation = require('../functionalMethods/dateValidation');

router.get('/medicalinfo/',verifyTokenMedical, (req,res) =>{
    //aca uso un id que me inserto el middleWare y lo uso como req.id
    mysqlConnection.query('SELECT * FROM users WHERE id = ?', [req.id], async (err, rows, fields) => {
        if (!err) {
            let user = rows[0];
            mysqlConnection.query('SELECT * FROM medical_personnel WHERE user_id = ?', [req.id], async (err, rows, fields) => {
                if (!err) {
                    const medicalinfo = await rows[0];
                    user.medical_speciality_id = medicalinfo.medical_speciality_id;
                    user.password = '';
                    return res.status(200).json(user);
                }
                else {
                    return res.status(500).send(err);
                }
            });
        }else{
            return res.status(500).send(err);
        }
    })
});


router.get('/userinfo/',verifyTokenUser, async (req,res) =>{
    //aca uso un id que me inserto el middleWare y lo uso como req.id
    mysqlConnection.query('SELECT * FROM users WHERE id = ?', [req.id], async (err, rows, fields) => {
        if (!err) {
            let user = rows[0];
            mysqlConnection.query('SELECT * FROM device_users WHERE user_id = ?', [req.id], async (err, rows, fields) => {
                if (!err) {
                    const userinfo = await rows[0];
                    user.weight = userinfo.weight;
                    user.height = userinfo.height;
                    user.insurance_id = userinfo.insurance_id;
                    user.insurance_number = userinfo.insurance_number;
                    user.password = '';
                    return res.status(200).json(user)
                }
                else {
                    return res.status(500).send();
                }
            });
        } else {
            return res.status(500).send();
        }
    }) 
});

router.delete('/user/',verifyTokenGeneral, (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM users WHERE id = ?', [req.id], (err, rows, fields) => {
        if(!err){
            res.status(200).send();
        } else {
            res.status(500).send();
        }
    });
});

router.put('/userinfo/', verifyTokenUser, async (req,res) => {
    const { name, last_name, birth_date, gender, document_number, email, password, address, city_id, document_type, weight, height, insurance_number, insurance_id} = req.body;
    if(!name || !last_name || !birth_date || !gender || !document_number || !email || !password || !address || !city_id || !document_type || !weight || !height || !insurance_number || !insurance_id){
        return res.status(410).send();
    }
    if(dateValidation(birth_date)){
        return res.status(411).send();
    }
    if(emailValidation(email)){
        return res.status(412).send();
    }
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    mysqlConnection.query('select id from users where email = ?', [email], (err, rows, fields) => {
        if (!err) {
            if(rows[0].id = req.id){
                return res.status(413).send();
            }else{
                mysqlConnection.query('UPDATE users SET name = ?, last_name = ?, birth_date = ?, gender = ?, document_type_id = ?, document_number = ?, email = ?, password = ?, city_id = ?, address = ?  where id = ? ', [name, last_name, birth_date, gender, document_type, document_number, email, newPassword, city_id, address,req.id], (err, rows, fields) => {
                    if(!err){
                            mysqlConnection.query('UPDATE Device_Users SET weight = ?, height = ?, insurance_number = ?, insurance_id = ?, user_id = ? WHERE id = ?', [weight, height, insurance_number, insurance_id, req.id, req.id], (err, rows, fields) => {
                            if(!err){
                                return res.status(200).send();
                            } else {
                                return res.status(500).send(err);
                            }
                        });
                    } else { 
                        return res.status(500).send(err);
                    }
                });
            }
        } else {
            return res.status(500).send(err);
        }
    });
});
router.put('/medicalinfo/',verifyTokenMedical, async (req,res) =>{
    const { name, last_name, birth_date, gender, document_number, email, password, address, city_id, document_type, medical_speciality} = req.body;
    if(!name || !last_name || !birth_date || !gender || !document_number || !email || !password || !address || !city_id || !document_type || !medical_speciality){
        return res.status(410).send();
    }
    if(dateValidation(birth_date)){
        return res.status(411).send();
    }
    if(emailValidation(email)){
        return res.status(412).send();
    }
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    mysqlConnection.query('select id from users where email = ?', [email], (err, rows, fields) => {
        if (!err) {
            if(rows[0].id != req.id){
                return res.status(412).send();
            }else{
                mysqlConnection.query('UPDATE users SET name = ?, last_name = ?, birth_date = ?, gender = ?, document_number = ?, email = ?, password = ?, address = ?, city_id = ?, document_type_id = ? WHERE id = ?', [name, last_name, birth_date, gender, document_number, email, newPassword, address, city_id, document_type, req.id], (err, rows, fields) => {
                    if(!err){
                        mysqlConnection.query('UPDATE medical_personnel  SET user_id = ?, medical_speciality_id = ? WHERE user_id = ?;', [req.id, medical_speciality, req.id], (err, rows, fields) => {
                            if(!err){
                                return res.status(200).send();
                            } else {
                                return res.status(500).send('Hubo problemas para registrar al usuario en la aplicacion');
                            }
                        });
                    } else { 
                        return res.status(500).send('Hubo problemas para registrar al usuario en la aplicacion');
                    }
                });
            }
        } else {
            return res.status(500).send(err);
        }
    });
});


module.exports = router;