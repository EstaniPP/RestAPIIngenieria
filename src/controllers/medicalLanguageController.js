const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');
const verifyTokenGeneral = require('./verifyTokenGeneral');
const verifyTokenMedical = require('./verifyTokenMedical');

router.get('/medicalLanguage/:fk&:id', verifyTokenGeneral, (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'medical_personnel_id'){
        var medical_personnel_id;
        if(id == 0){
            medical_personnel_id = req.child_id;
        } else {
            medical_personnel_id = id;
        }
        mysqlConnection.query('SELECT * FROM Medical_Languages WHERE medical_personnel_id = ?', [medical_personnel_id], (err, rows, fields) => {
            if(!err){
                return res.status(200).json(rows);
            } else {
                return res.status(500).send(err);
            }
        });
    } else if(fk == 'language_id'){
        mysqlConnection.query('SELECT * FROM Medical_Languages WHERE language_id = ?', [id], (err, rows, fields) => {
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

router.get('/medicalLanguage/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Medical_Languages WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/medicalLanguage/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Medical_Languages', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/medicalLanguage/', verifyTokenMedical, (req, res) => {
    const { language_id } = req.body;
    if(!language_id){
        return res.status(411).send();
    }
    const query = 'INSERT INTO Medical_Languages(medical_personnel_id, language_id) VALUES (?,?)';
    mysqlConnection.query(query, [req.id, language_id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/medicalLanguage/:id', verifyTokenMedical, (req, res) => {
    const { id } = req.params;
    const { language_id } = req.body;
    if(!language_id){
        return res.status(411).send();
    }
    const query = 'UPDATE Medical_Languages SET medical_personnel_id = ?, language_id = ? WHERE id = ?';
    mysqlConnection.query(query, [req.id, language_id, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/medicalLanguage/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Medical_Languages WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;