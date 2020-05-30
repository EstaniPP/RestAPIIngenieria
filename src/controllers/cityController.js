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

router.get('/city/:fk&:id', (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'state_id'){
        mysqlConnection.query('SELECT * FROM Cities where ? = ?', [fk, id], (err, rows, fields) => {
            if(!err){
                res.json(rows);
            } else {
                console.log(err);
            }
        });
    } else {
        console.log('Not valid FK.')
    }
});

router.post('/city/', (req, res) => {
    const { name, state_id } = req.body;
    const query = 'INSERT INTO Cities(name, state_id) VALUES (?,?)';
    mysqlConnection.query(query, [name, state_id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'City saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/city/:id', (req, res) => {
    const { id } = req.params;
    const { name, state_id } = req.body;
    const query = 'UPDATE Cities SET name = ?, state_id = ? WHERE id = ?';
    mysqlConnection.query(query, [name, state_id, id], (err, rows, fields) => {
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