const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/documentType/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Document_Types WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/documentType/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Document_Types', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/documentType/', (req, res) => {
    const { name } = req.body;
    if(!name){
        return res.status(411).send();
    }
    const query = 'INSERT INTO Document_Types(name) VALUES (?)';
    mysqlConnection.query(query, [name], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/documentType/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if(!name){
        return res.status(411).send();
    }
    const query = 'UPDATE Document_Types SET name = ? WHERE id = ?';
    mysqlConnection.query(query, [name, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/documentType/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Document_Types WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;