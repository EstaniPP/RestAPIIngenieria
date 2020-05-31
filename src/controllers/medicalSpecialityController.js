const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/medicalSpeciality/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Medical_Specialities WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/medicalSpeciality/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Medical_Specialities', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/medicalSpeciality/', (req, res) => {
    const { name } = req.body;
    if(!name){
        return res.status(411).send();
    }
    const query = 'INSERT INTO Medical_Specialities(name) VALUES (?)';
    mysqlConnection.query(query, [name], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/medicalSpeciality/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if(!name){
        return res.status(411).send();
    }
    const query = 'UPDATE Medical_Specialities SET name = ? WHERE id = ?';
    mysqlConnection.query(query, [name, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/medicalSpeciality/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Medical_Specialities WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;