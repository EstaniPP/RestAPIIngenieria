const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/patient/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Patients WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/patient/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Patients', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/patient/', verifyTokenUser, (req, res) => {
    const { device_user_id, medical_personnel_id } = req.body;
    if(!device_user_id || !medical_personnel_id){
        return res.status(411).send();
    }
    const query = 'INSERT INTO Patients(device_user_id, medical_personnel_id) VALUES (?,?)';
    mysqlConnection.query(query, [device_user_id, medical_personnel_id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/patient/:id', (req, res) => {
    const { id } = req.params;
    const { device_user_id, medical_personnel_id } = req.body;
    if(!device_user_id || !medical_personnel_id){
        return res.status(411).send();
    }
    const query = 'UPDATE Patients SET device_user_id = ?, medical_personnel_id = ? WHERE id = ?';
    mysqlConnection.query(query, [device_user_id, medical_personnel_id, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/patient/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Patients WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;