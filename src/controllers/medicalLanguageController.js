const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

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

router.post('/medicalLanguage/', verifyTokenUser, (req, res) => {
    const { medical_personnel_id, language_id } = req.body;
    if(!medical_personnel_id || !language_id){
        return res.status(411).send();
    }
    const query = 'INSERT INTO Medical_Languages(medical_personnel_id, language_id) VALUES (?,?)';
    mysqlConnection.query(query, [medical_personnel_id, language_id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/medicalLanguage/:id', (req, res) => {
    const { id } = req.params;
    const { medical_personnel_id, language_id } = req.body;
    if(!medical_personnel_id || !language_id){
        return res.status(411).send();
    }
    const query = 'UPDATE Medical_Languages SET medical_personnel_id = ?, language_id = ? WHERE id = ?';
    mysqlConnection.query(query, [medical_personnel_id, language_id, id], (err, rows, fields) => {
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