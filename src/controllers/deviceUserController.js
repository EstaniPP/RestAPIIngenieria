const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/deviceUser/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Device_Users', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/deviceUser/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Device_Users WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.get('/deviceUser/:fk&:id', (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'user_id' || fk == 'insurance_id'){
        mysqlConnection.query('SELECT * FROM Device_Users where ? = ?', [fk, id], (err, rows, fields) => {
            if(!err){
                res.json(rows);
            } else {
                console.log(err);
            }
        });
    } else {
        console.log('Not valid FK.')
    }
});

router.post('/deviceUser/', (req, res) => {
    const { user_id, weight, height, insurance_id, insurance_number, heart_rate_signal_threshold } = req.body;
    const query = 'INSERT INTO Device_Users(user_id, weight, height, insurance_id, insurance_number, heart_rate_signal_threshold) VALUES (?,?,?,?,?,?)';
    mysqlConnection.query(query, [user_id, weight, height, insurance_id, insurance_number, heart_rate_signal_threshold], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Device user saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/deviceUser/:id', (req, res) => {
    const { id } = req.params;
    const { user_id, weight, height, insurance_id, insurance_number, heart_rate_signal_threshold } = req.body;
    const query = 'UPDATE Device_Users SET user_id = ?, weight = ?, height = ?, insurance_id = ?, insurance_number = ?, heart_rate_signal_threshold = ? WHERE id = ?';
    mysqlConnection.query(query, [user_id, weight, height, insurance_id, insurance_number, heart_rate_signal_threshold, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Device user updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/deviceUser/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Device_Users WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Device user deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;