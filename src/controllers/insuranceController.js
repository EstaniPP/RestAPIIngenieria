const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/insurance/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Insurances WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/insurance/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Insurances', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/insurance/', (req, res) => {
    const { name } = req.body;
    if(!name){
        return res.status(411).send();
    }
    const query = 'INSERT INTO Insurances(name) VALUES (?)';
    mysqlConnection.query(query, [name], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/insurance/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if(!name){
        return res.status(411).send();
    }
    const query = 'UPDATE Insurances SET name = ? WHERE id = ?';
    mysqlConnection.query(query, [name, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/insurance/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Insurances WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;