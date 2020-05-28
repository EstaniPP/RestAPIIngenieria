const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/heartRateSignal/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Heart_Rate_Signals', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/heartRateSignal/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Heart_Rate_Signals WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.post('/heartRateSignal/', (req, res) => {
    const { workout_report_id, time, value } = req.body;
    const query = 'INSERT INTO Heart_Rate_Signals(workout_report_id, time, value) VALUES (?,?,?)';
    mysqlConnection.query(query, [workout_report_id, time, value], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Heart rate signal saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/heartRateSignal/:id', (req, res) => {
    const { id } = req.params;
    const { workout_report_id, time, value } = req.body;
    const query = 'UPDATE Heart_Rate_Signals SET workout_report_id = ?, time = ?, value = ? WHERE id = ?';
    mysqlConnection.query(query, [workout_report_id, time, value, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Heart rate signal updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/heartRateSignal/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Heart_Rate_Signals WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Heart rate signal deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;