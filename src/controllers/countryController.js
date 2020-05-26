const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/country/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Countries', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/country/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Countries WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.post('/country/', (req, res) => {
    const { name } = req.body;
    const query = 'INSERT INTO Countries(name) VALUES (?)';
    mysqlConnection.query(query, [name], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Country saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/country/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const query = 'UPDATE Countries SET name = ? WHERE id = ?';
    mysqlConnection.query(query, [name, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Country updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/country/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Countries WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Country deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;