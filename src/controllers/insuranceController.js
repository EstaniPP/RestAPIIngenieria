const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/insurance/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Insurances', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/insurance/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Insurances WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.post('/insurance/', (req, res) => {
    const { name } = req.body;
    const query = 'INSERT INTO Insurances(name) VALUES (?)';
    mysqlConnection.query(query, [name], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Insurance saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/insurance/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const query = 'UPDATE Insurances SET name = ? WHERE id = ?';
    mysqlConnection.query(query, [name, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Insurance updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/insurance/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Insurances WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Insurance deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;