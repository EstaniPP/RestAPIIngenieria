const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');
const emailValidation = require('../functionalMethods/emailValidation');

router.get('/emergencyContact/:fk&:id', (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'device_user_id'){
        mysqlConnection.query('SELECT * FROM Emergency_Contacts WHERE device_user_id = ?', [id], (err, rows, fields) => {
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

router.get('/emergencyContact/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Emergency_Contacts WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/emergencyContact/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Emergency_Contacts', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/emergencyContact/', (req, res) => {
    const { device_user_id, name, email, relation } = req.body;
    if(!device_user_id || !name || !email){
        return res.status(411).send();
    }
    if(!emailValidation(email)){
        return res.status(415).send();
    }
    const query = 'INSERT INTO Emergency_Contacts(device_user_id, name, email, relation) VALUES (?,?,?,?)';
    mysqlConnection.query(query, [device_user_id, name, email, relation], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/emergencyContact/:id', (req, res) => {
    const { id } = req.params;
    const { device_user_id, name, email, relation } = req.body;
    if(!device_user_id || !name || !email){
        return res.status(411).send();
    }
    if(!emailValidation(email)){
        return res.status(415).send();
    }
    const query = 'UPDATE Emergency_Contacts SET device_user_id = ?, name = ?, email = ?, relation = ? WHERE id = ?';
    mysqlConnection.query(query, [device_user_id, name, email, relation, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/emergencyContact/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Emergency_Contacts WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;