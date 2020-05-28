const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/user/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Users', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/user/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Users WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.post('/user/', (req, res) => {
    const { name, last_name, birth_date, gender, document_type_id, document_number, email, password, city_id, address } = req.body;
    const query = 'INSERT INTO Users(name, last_name, birth_date, gender, document_type_id, document_number, email, password, city_id, address) VALUES (?,?,?,?,?,?,?,?,?,?)';
    mysqlConnection.query(query, [name, last_name, birth_date, gender, document_type_id, document_number, email, password, city_id, address], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'User saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/user/:id', (req, res) => {
    const { id } = req.params;
    const { name, last_name, birth_date, gender, document_type_id, document_number, email, password, city_id, address } = req.body;
    const query = 'UPDATE Users SET name = ?, last_name = ?, birth_date = ?, gender = ?, document_type_id = ?, document_number = ?, email = ?, password = ?, city_id = ?, address = ? WHERE id = ?';
    mysqlConnection.query(query, [name, last_name, birth_date, gender, document_type_id, document_number, email, password, city_id, address, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'User updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/user/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Users WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'User deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;