const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/medicalSpeciality/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Medical_Specialities', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/medicalSpeciality/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Medical_Specialities WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.post('/medicalSpeciality/', (req, res) => {
    const { name } = req.body;
    const query = 'INSERT INTO Medical_Specialities(name) VALUES (?)';
    mysqlConnection.query(query, [name], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Medical speciality saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/medicalSpeciality/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const query = 'UPDATE Medical_Specialities SET name = ? WHERE id = ?';
    mysqlConnection.query(query, [name, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Medical speciality updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/medicalSpeciality/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Medical_Specialities WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Medical speciality deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;