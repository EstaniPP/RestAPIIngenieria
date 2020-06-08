const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

const verifyTokenGeneral = require('./verifyTokenGeneral');
const verifyTokenUser = require('./verifyTokenUser');

router.get('/patient/:fk&:id', verifyTokenGeneral, (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'device_user_id'){
        var device_user_id;
        if(id == 0){
            device_user_id = req.child_id;
        } else {
            device_user_id = id;
        }
        mysqlConnection.query('SELECT * FROM Patients WHERE device_user_id = ?', [device_user_id], (err, rows, fields) => {
            if(!err){
                return res.status(200).json(rows);
            } else {
                return res.status(500).send(err);
            }
        });
    } else if(fk == 'medical_personnel_id'){
        var medical_personnel_id;
        if(id == 0){
            medical_personnel_id = req.child_id;
        } else {
            medical_personnel_id = id;
        }
        mysqlConnection.query('SELECT * FROM Patients WHERE medical_personnel_id = ?', [medical_personnel_id], (err, rows, fields) => {
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
    const { medical_personnel_id } = req.body;
    if(!medical_personnel_id){
        return res.status(411).send();
    }
    const query = 'INSERT INTO Patients(device_user_id, medical_personnel_id) VALUES (?,?)';
    mysqlConnection.query(query, [req.id, medical_personnel_id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/patient/:id', verifyTokenUser, (req, res) => {
    const { id } = req.params;
    const { medical_personnel_id } = req.body;
    if(!medical_personnel_id){
        return res.status(411).send();
    }
    const query = 'UPDATE Patients SET device_user_id = ?, medical_personnel_id = ? WHERE id = ?';
    mysqlConnection.query(query, [req.id, medical_personnel_id, id], (err, rows, fields) => {
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