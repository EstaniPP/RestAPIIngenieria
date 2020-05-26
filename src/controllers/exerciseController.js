const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/exercises/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Exercises', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/exercises/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Exercises WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.post('/exercises/', (req, res) => {
    const { description, path } = req.body;
    const query = 'INSERT INTO Exercises(description, path) VALUES (?,?)';
    mysqlConnection.query(query, [description, path], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Exercise saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/exercises/:id', (req, res) => {
    const { id } = req.params;
    const { description, path } = req.body;
    const query = 'UPDATE Exercises SET description = ?, path = ? WHERE id = ?';
    mysqlConnection.query(query, [description, path, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Exercise updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/exercises/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Exercises WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Exercise deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;