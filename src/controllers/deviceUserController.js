const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');
const verifyTokenGeneral = require('./verifyTokenGeneral');

router.get('/deviceUser/:fk&:id', verifyTokenGeneral, (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'user_id'){
        var user_id;
        if(id == 0){
            user_id = req.id;
        } else {
            user_id = id;
        }
        mysqlConnection.query('SELECT * FROM Device_Users WHERE user_id = ?', [user_id], (err, rows, fields) => {
            if(!err){
                return res.status(200).json(rows);
            } else {
                return res.status(500).send(err);
            }
        });
    } else if(fk == 'insurance_id'){
        mysqlConnection.query('SELECT * FROM Device_Users WHERE insurance_id = ?', [id], (err, rows, fields) => {
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

router.get('/deviceUser/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Device_Users WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/deviceUser/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Device_Users', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/deviceUser/', (req, res) => {
    const { user_id, weight, height, insurance_id, insurance_number, heart_rate_signal_threshold } = req.body;
    if(!user_id || !weight || !height || !insurance_id || !insurance_number){
        return res.status(411).send();
    }
    const query = 'INSERT INTO Device_Users(user_id, weight, height, insurance_id, insurance_number, heart_rate_signal_threshold) VALUES (?,?,?,?,?,?)';
    mysqlConnection.query(query, [user_id, weight, height, insurance_id, insurance_number, heart_rate_signal_threshold], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/deviceUser/:id', (req, res) => {
    const { id } = req.params;
    const { user_id, weight, height, insurance_id, insurance_number, heart_rate_signal_threshold } = req.body;
    if(!user_id || !weight || !height || !insurance_id || !insurance_number){
        return res.status(411).send();
    }
    const query = 'UPDATE Device_Users SET user_id = ?, weight = ?, height = ?, insurance_id = ?, insurance_number = ?, heart_rate_signal_threshold = ? WHERE id = ?';
    mysqlConnection.query(query, [user_id, weight, height, insurance_id, insurance_number, heart_rate_signal_threshold, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/deviceUser/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Device_Users WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;