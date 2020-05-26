const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/phoneNumbers/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Phone_Numbers', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/phoneNumbers/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Phone_Numbers WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.post('/phoneNumbers/', (req, res) => {
    const { userId, number } = req.body;
    const query = 'INSERT INTO Phone_Numbers(user_id, number) VALUES (?,?)';
    mysqlConnection.query(query, [userId, number], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Phone number saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/phoneNumbers/:id', (req, res) => {
    const { id } = req.params;
    const { userId, number } = req.body;
    const query = 'UPDATE Phone_Numbers SET user_id = ?, number = ? WHERE id = ?';
    mysqlConnection.query(query, [userId, number, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Phone number updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/phoneNumbers/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Phone_Numbers WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Phone number deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;