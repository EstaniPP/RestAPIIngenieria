const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');
const datetimeValidation = require('../functionalMethods/dateTimeValidation');
const verifyTokenUser = require('./verifyTokenUser');

router.get('/emailReport/:fk&:id', verifyTokenUser, (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'device_user_id'){
        const device_user_id;
        if(id == 0){
            device_user_id = req.id;
        } else {
            device_user_id = id;
        }
        mysqlConnection.query('SELECT * FROM Email_Reports WHERE device_user_id = ?', [device_user_id], (err, rows, fields) => {
            if(!err){
                return res.status(200).json(rows);
            } else {
                return res.status(500).send(err);
            }
        });
    } else if(fk == 'emergency_contact_id'){
        mysqlConnection.query('SELECT * FROM Email_Reports WHERE emergency_contact_id = ?', [id], (err, rows, fields) => {
            if(!err){
                return res.status(200).json(rows);
            } else {
                return res.status(500).send(err);
            }
        });
    } else{
        return res.status(416).send();
    }
});

router.get('/emailReport/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Email_Reports WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/emailReport/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Email_Reports', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/emailReport/', (req, res) => {
    const { device_user_id, report_date, emergency_contact_id } = req.body;
    if(!device_user_id || !report_date || !emergency_contact_id){
        return res.status(411).send();
    }
    if(!datetimeValidation(report_date)){
        return res.status(412).send();
    }
    const query = 'INSERT INTO Email_Reports(device_user_id, report_date, emergency_contact_id) VALUES (?,?,?)';
    mysqlConnection.query(query, [device_user_id, report_date, emergency_contact_id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/emailReport/:id', (req, res) => {
    const { id } = req.params;
    const { device_user_id, report_date, emergency_contact_id } = req.body;
    if(!device_user_id || !report_date || !emergency_contact_id){
        return res.status(411).send();
    }
    if(!datetimeValidation(report_date)){
        return res.status(412).send();
    }
    const query = 'UPDATE Email_Reports SET device_user_id = ?, report_date = ?, emergency_contact_id = ? WHERE id = ?';
    mysqlConnection.query(query, [device_user_id, report_date, emergency_contact_id, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/emailReport/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Email_Reports WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;