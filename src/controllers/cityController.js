const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/city/:fk&:id', (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'state_id'){
        mysqlConnection.query('SELECT * FROM Cities WHERE state_id = ?', [id], (err, rows, fields) => {
            if(!err){
                return res.status(200).json(rows);
            } else {
                return res.status(500).send(err);
            }
        });
    } else {
        return res.status(416).send();
    }
});

router.get('/city/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Cities WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/city/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Cities', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/city/', (req, res) => {
    const { name, state_id } = req.body;
    if(!name || !state_id){
        return res.status(411).send();
    }
    const query = 'INSERT INTO Cities(name, state_id) VALUES (?,?)';
    mysqlConnection.query(query, [name, state_id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/city/:id', (req, res) => {
    const { id } = req.params;
    const { name, state_id } = req.body;
    if(!name || !state_id){
        return res.status(411).send();
    }
    const query = 'UPDATE Cities SET name = ?, state_id = ? WHERE id = ?';
    mysqlConnection.query(query, [name, state_id, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/city/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Cities WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;