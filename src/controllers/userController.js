const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');
const dateValidation = require('../functionalMethods/dateValidation');
const emailValidation = require('../functionalMethods/emailValidation');

router.get('/user/:fk&:id', (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'document_type_id'){
        mysqlConnection.query('SELECT * FROM Users WHERE document_type_id = ?', [id], (err, rows, fields) => {
            if(!err){
                return res.status(200).json(rows);
            } else {
                return res.status(500).send(err);
            }
        });
    } else if(fk == 'city_id'){
        mysqlConnection.query('SELECT * FROM Users WHERE city_id = ?', [id], (err, rows, fields) => {
            if(!err){
                return res.status(200).json(rows);
            } else {
                return res.status(500).send(err);
            }
        });
    } else {
        return res.status(416).send();
    }
});

router.get('/user/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Users WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/user/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Users', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/user/', (req, res) => {
    const { name, last_name, birth_date, gender, document_type_id, document_number, email, password, city_id, address } = req.body;
    if(!name || !last_name || !birth_date || !gender || !document_type_id || !document_number || !email || !password || !city_id || !address){
        return res.status(411).send();
    }
    if(!dateValidation(birth_date)){
        return res.status(413).send();
    }
    if(!emailValidation(email)){
        return res.status(415).send();
    }
    const query = 'INSERT INTO Users(name, last_name, birth_date, gender, document_type_id, document_number, email, password, city_id, address) VALUES (?,?,?,?,?,?,?,?,?,?)';
    mysqlConnection.query(query, [name, last_name, birth_date, gender, document_type_id, document_number, email, password, city_id, address], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/user/:id', (req, res) => {
    const { id } = req.params;
    const { name, last_name, birth_date, gender, document_type_id, document_number, email, password, city_id, address } = req.body;
    if(!name || !last_name || !birth_date || !gender || !document_type_id || !document_number || !email || !password || !city_id || !address){
        return res.status(411).send();
    }
    if(!dateValidation(birth_date)){
        return res.status(413).send();
    }
    if(!emailValidation(email)){
        return res.status(415).send();
    }
    const query = 'UPDATE Users SET name = ?, last_name = ?, birth_date = ?, gender = ?, document_type_id = ?, document_number = ?, email = ?, password = ?, city_id = ?, address = ? WHERE id = ?';
    mysqlConnection.query(query, [name, last_name, birth_date, gender, document_type_id, document_number, email, password, city_id, address, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;