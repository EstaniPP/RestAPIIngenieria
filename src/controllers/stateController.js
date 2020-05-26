const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/state/', (req, res) => {
    mysqlConnection.query('SELECT * FROM States', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/state/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM States WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.post('/state/', (req, res) => {
    const { name, countryId } = req.body;
    const query = 'INSERT INTO States(name, country_id) VALUES (?,?)';
    mysqlConnection.query(query, [name, countryId], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'State saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/state/:id', (req, res) => {
    const { id } = req.params;
    const { name, countryId } = req.body;
    const query = 'UPDATE States SET name = ?, country_id = ? WHERE id = ?';
    mysqlConnection.query(query, [name, countryId, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'State updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/state/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM States WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'State deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;