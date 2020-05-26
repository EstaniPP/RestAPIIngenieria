const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/city/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Cities', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/city/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Cities WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.post('/city/', (req, res) => {
    const { name, stateId } = req.body;
    const query = 'INSERT INTO Cities(name, state_id) VALUES (?,?)';
    mysqlConnection.query(query, [name, stateId], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'City saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/city/:id', (req, res) => {
    const { id } = req.params;
    const { name, stateId } = req.body;
    const query = 'UPDATE Cities SET name = ?, state_id = ? WHERE id = ?';
    mysqlConnection.query(query, [name, stateId, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'City updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/city/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Cities WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'City deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;