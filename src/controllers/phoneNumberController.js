const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/phoneNumber/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Phone_Numbers', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/phoneNumber/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Phone_Numbers WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.get('/phoneNumber/:fk&:id', (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'user_id'){
        mysqlConnection.query('SELECT * FROM Phone_Numbers where ? = ?', [fk, id], (err, rows, fields) => {
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

router.post('/phoneNumber/', (req, res) => {
    const { user_id, number } = req.body;
    const query = 'INSERT INTO Phone_Numbers(user_id, number) VALUES (?,?)';
    mysqlConnection.query(query, [user_id, number], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Phone number saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/phoneNumber/:id', (req, res) => {
    const { id } = req.params;
    const { user_id, number } = req.body;
    const query = 'UPDATE Phone_Numbers SET user_id = ?, number = ? WHERE id = ?';
    mysqlConnection.query(query, [user_id, number, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Phone number updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/phoneNumber/:id', (req, res) => {
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