const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/emailReport/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Email_Reports', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/emailReport/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Email_Reports WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.post('/emailReport/', (req, res) => {
    const { device_user_id, report_date, emergency_contact_id } = req.body;
    const query = 'INSERT INTO Email_Reports(device_user_id, report_date, emergency_contact_id) VALUES (?,?,?)';
    mysqlConnection.query(query, [device_user_id, report_date, emergency_contact_id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Email report saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/emailReport/:id', (req, res) => {
    const { id } = req.params;
    const { device_user_id, report_date, emergency_contact_id } = req.body;
    const query = 'UPDATE Email_Reports SET device_user_id = ?, report_date = ?, emergency_contact_id = ? WHERE id = ?';
    mysqlConnection.query(query, [device_user_id, report_date, emergency_contact_id, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Email report updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/emailReport/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Email_Reports WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Email report deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;