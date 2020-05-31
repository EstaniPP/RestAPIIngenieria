const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');
const timeValidation = require('../functionalMethods/timeValidation');

router.get('/heartRateSignal/:fk&:id', (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'workout_report_id'){
        mysqlConnection.query('SELECT * FROM Heart_Rate_Signals WHERE workout_report_id = ?', [id], (err, rows, fields) => {
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

router.get('/heartRateSignal/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Heart_Rate_Signals WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/heartRateSignal/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Heart_Rate_Signals', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/heartRateSignal/', (req, res) => {
    const { workout_report_id, time, value } = req.body;
    if(!workout_report_id || !time || !value){
        return res.status(411).send();
    }
    if(!timeValidation(time)){
        return res.status(414).send();
    }
    const query = 'INSERT INTO Heart_Rate_Signals(workout_report_id, time, value) VALUES (?,?,?)';
    mysqlConnection.query(query, [workout_report_id, time, value], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/heartRateSignal/:id', (req, res) => {
    const { id } = req.params;
    const { workout_report_id, time, value } = req.body;
    if(!workout_report_id || !time || !value){
        return res.status(411).send();
    }
    if(!timeValidation(time)){
        return res.status(414).send();
    }
    const query = 'UPDATE Heart_Rate_Signals SET workout_report_id = ?, time = ?, value = ? WHERE id = ?';
    mysqlConnection.query(query, [workout_report_id, time, value, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/heartRateSignal/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Heart_Rate_Signals WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;