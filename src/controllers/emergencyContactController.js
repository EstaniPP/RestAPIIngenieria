const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/emergencyContact/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Emergency_Contacts', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/emergencyContact/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Emergency_Contacts WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.get('/emergencyContact/:fk&:id', (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'device_user_id'){
        mysqlConnection.query('SELECT * FROM Emergency_Contacts where ? = ?', [fk, id], (err, rows, fields) => {
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

router.post('/emergencyContact/', (req, res) => {
    const { device_user_id, name, email, relation } = req.body;
    const query = 'INSERT INTO Emergency_Contacts(device_user_id, name, email, relation) VALUES (?,?,?,?)';
    mysqlConnection.query(query, [device_user_id, name, email, relation], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Emergency contact saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/emergencyContact/:id', (req, res) => {
    const { id } = req.params;
    const { device_user_id, name, email, relation } = req.body;
    const query = 'UPDATE Emergency_Contacts SET device_user_id = ?, name = ?, email = ?, relation = ? WHERE id = ?';
    mysqlConnection.query(query, [device_user_id, name, email, relation, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Emergency contact updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/emergencyContact/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Emergency_Contacts WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Emergency contact deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;