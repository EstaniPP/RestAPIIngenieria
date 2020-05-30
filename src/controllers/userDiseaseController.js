const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/userDisease/', (req, res) => {
    mysqlConnection.query('SELECT * FROM User_Diseases', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/userDisease/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM User_Diseases WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.get('/userDisease/:fk&:id', (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'device_user_id' || fk == 'disease_id'){
        mysqlConnection.query('SELECT * FROM User_Diseases where ? = ?', [fk, id], (err, rows, fields) => {
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

router.post('/userDisease/', (req, res) => {
    const { device_user_id, disease_id } = req.body;
    const query = 'INSERT INTO User_Diseases(device_user_id, disease_id) VALUES (?,?)';
    mysqlConnection.query(query, [device_user_id, disease_id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'User disease saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/userDisease/:id', (req, res) => {
    const { id } = req.params;
    const { device_user_id, disease_id } = req.body;
    const query = 'UPDATE User_Diseases SET device_user_id = ?, disease_id = ? WHERE id = ?';
    mysqlConnection.query(query, [device_user_id, disease_id, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'User disease updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/userDisease/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM User_Diseases WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'User disease deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;