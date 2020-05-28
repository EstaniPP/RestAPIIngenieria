const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/deviceUser/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Device_Users', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/deviceUser/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Device_Users WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.post('/deviceUser/', (req, res) => {
    const { user_id, weight, height, insurance_id, insurance_number } = req.body;
    const query = 'INSERT INTO Device_Users(user_id, weight, height, insurance_id, insurance_number) VALUES (?,?,?,?,?)';
    mysqlConnection.query(query, [user_id, weight, height, insurance_id, insurance_number], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Device user saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/deviceUser/:id', (req, res) => {
    const { id } = req.params;
    const { user_id, weight, height, insurance_id, insurance_number } = req.body;
    const query = 'UPDATE Device_Users SET user_id = ?, weight = ?, height = ?, insurance_id = ?, insurance_number = ? WHERE id = ?';
    mysqlConnection.query(query, [user_id, weight, height, insurance_id, insurance_number, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Device user updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/deviceUser/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Device_Users WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Device user deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;