const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');
const verifyTokenGeneral = require('./verifyTokenGeneral');

router.get('/medicalPersonnel/:fk&:id', verifyTokenGeneral, (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'user_id'){
        const user_id;
        if(id == 0){
            user_id = req.id;
        } else {
            user_id = id;
        }
        mysqlConnection.query('SELECT * FROM Medical_Personnel WHERE user_id = ?', [user_id], (err, rows, fields) => {
            if(!err){
                return res.status(200).json(rows);
            } else {
                return res.status(500).send(err);
            }
        });
    } else if(fk == 'medical_speciality_id'){
        mysqlConnection.query('SELECT * FROM Medical_Personnel WHERE medical_speciality_id = ?', [id], (err, rows, fields) => {
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

router.get('/medicalPersonnel/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Medical_Personnel WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/medicalPersonnel/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Medical_Personnel', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/medicalPersonnel/', (req, res) => {
    const { user_id, medical_speciality_id } = req.body;
    if(!user_id || !medical_speciality_id){
        return res.status(411).send();
    }
    const query = 'INSERT INTO Medical_Personnel(user_id, medical_speciality_id) VALUES (?,?)';
    mysqlConnection.query(query, [user_id, medical_speciality_id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/medicalPersonnel/:id', (req, res) => {
    const { id } = req.params;
    const { user_id, medical_speciality_id } = req.body;
    if(!user_id || !medical_speciality_id){
        return res.status(411).send();
    }
    const query = 'UPDATE Medical_Personnel SET user_id = ?, medical_speciality_id = ? WHERE id = ?';
    mysqlConnection.query(query, [user_id, medical_speciality_id, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/medicalPersonnel/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Medical_Personnel WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;