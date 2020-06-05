const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');
const dateValidation = require('../functionalMethods/dateValidation');
const verifyTokenGeneral = require('./verifyTokenGeneral');
const verifyTokenMedical = require('./verifyTokenMedical');
const verifyTokenUser = require('./verifyTokenUser');

router.get('/workout/:fk&:id', verifyTokenGeneral, (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'device_user_id'){
        var device_user_id;
        if(id == 0){
            device_user_id = req.child_id;
        } else {
            device_user_id = id;
        }
        mysqlConnection.query('SELECT * FROM Workouts WHERE device_user_id = ?', [device_user_id], (err, rows, fields) => {
            if(!err){
                return res.status(200).json(rows);
            } else {
                return res.status(500).send(err);
            }
        });
    } else if(fk == 'medical_personnel_id'){
        const medical_personnel_id;
        if(id == 0){
            medical_personnel_id = req.child_id;
        } else {
            medical_personnel_id = id;
        }
        mysqlConnection.query('SELECT * FROM Workouts WHERE medical_personnel_id = ?', [medical_personnel_id], (err, rows, fields) => {
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

router.get('/workout/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Workouts WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/workout/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Workouts', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/workout/', verifyTokenMedical, (req, res) => {
    const { device_user_id, name, creation_date, difficulty, price} = req.body;
    if(!device_user_id || !name || !creation_date || !difficulty){
        return res.status(411).send();
    }
    if(!dateValidation(creation_date)){
        return res.status(413).send();
    }
    const query = 'INSERT INTO Workouts(device_user_id, medical_personnel_id, name, creation_date, difficulty, price, done, rating) VALUES (?,?,?,?,?,?,?,?)';
    mysqlConnection.query(query, [device_user_id, req.id, name, creation_date, difficulty, price, false, null], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/workout/:id', verifyTokenMedical, (req, res) => {
    const { id } = req.params;
    const { device_user_id, name, creation_date, difficulty, price} = req.body;
    if(!device_user_id || !name || !creation_date || !difficulty){
        return res.status(411).send();
    }
    if(!dateValidation(creation_date)){
        return res.status(413).send();
    }
    const query = 'UPDATE Workouts SET device_user_id = ?, medical_personnel_id = ?, name = ?, creation_date = ?, difficulty = ?, price = ?, done = ?, rating = ? WHERE id = ?';
    mysqlConnection.query(query, [device_user_id, req.id, name, creation_date, difficulty, price, false, null, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/workout/setDone/:id', verifyTokenUser, (req,res) => {
    const { id } = req.params;
    const { rating } = req.body;
    const query = 'UPDATE Workouts SET done = ?, rating = ? WHERE id = ?';
    mysqlConnection.query(query, [ true, rating, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/workout/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Workouts WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;