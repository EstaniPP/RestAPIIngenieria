const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/exercise/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Exercises WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/exercise/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Exercises', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/exercise/', (req, res) => {
    const { description, path } = req.body;
    if(!description){
        return res.status(411).send();
    }
    const query = 'INSERT INTO Exercises(description, path) VALUES (?,?)';
    mysqlConnection.query(query, [description, path], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/exercise/:id', (req, res) => {
    const { id } = req.params;
    const { description, path } = req.body;
    if(!description){
        return res.status(411).send();
    }
    const query = 'UPDATE Exercises SET description = ?, path = ? WHERE id = ?';
    mysqlConnection.query(query, [description, path, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/exercise/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Exercises WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;