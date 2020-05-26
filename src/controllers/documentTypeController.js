const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/documentType/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Document_Types', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/documentType/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Document_Types WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.post('/documentType/', (req, res) => {
    const { name } = req.body;
    const query = 'INSERT INTO Document_Types(name) VALUES (?)';
    mysqlConnection.query(query, [name], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Document type saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/documentType/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const query = 'UPDATE Document_Types SET name = ? WHERE id = ?';
    mysqlConnection.query(query, [name, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Document type updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/documentType/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Document_Types WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Document type deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;