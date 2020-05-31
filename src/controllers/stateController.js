const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/state/:fk&:id', (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'country_id'){
        mysqlConnection.query('SELECT * FROM States WHERE country_id = ?', [id], (err, rows, fields) => {
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

router.get('/state/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM States WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/state/', (req, res) => {
    mysqlConnection.query('SELECT * FROM States', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/state/', (req, res) => {
    const { name, country_id } = req.body;
    if(!name || !country_id){
        return res.status(411).send();
    }
    const query = 'INSERT INTO States(name, country_id) VALUES (?,?)';
    mysqlConnection.query(query, [name, country_id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/state/:id', (req, res) => {
    const { id } = req.params;
    const { name, country_id } = req.body;
    if(!name || !country_id){
        return res.status(411).send();
    }
    const query = 'UPDATE States SET name = ?, country_id = ? WHERE id = ?';
    mysqlConnection.query(query, [name, country_id, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/state/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM States WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;