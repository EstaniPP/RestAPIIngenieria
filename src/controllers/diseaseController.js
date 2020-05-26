const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/disease/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Diseases', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/disease/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Diseases WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.post('/disease/', (req, res) => {
    const { name } = req.body;
    const query = 'INSERT INTO Diseases(name) VALUES (?)';
    mysqlConnection.query(query, [name], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Disease saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/disease/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const query = 'UPDATE Diseases SET name = ? WHERE id = ?';
    mysqlConnection.query(query, [name, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Disease updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/disease/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Diseases WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Disease deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;