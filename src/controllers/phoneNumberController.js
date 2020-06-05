const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');
const verifyTokenGeneral = require('./verifyTokenGeneral');

router.get('/phoneNumber/:fk&:id', verifyTokenGeneral, (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'user_id'){
        var user_id;
        if(id == 0){
            user_id = req.id;
        } else {
            user_id = id;
        }
        mysqlConnection.query('SELECT * FROM Phone_Numbers WHERE user_id = ?', [user_id], (err, rows, fields) => {
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

router.get('/phoneNumber/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Phone_Numbers WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/phoneNumber/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Phone_Numbers', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/phoneNumber/', verifyTokenGeneral, (req, res) => {
    const { number } = req.body;
    if(!number){
        return res.status(411).send();
    }
    const query = 'INSERT INTO Phone_Numbers(user_id, number) VALUES (?,?)';
    mysqlConnection.query(query, [req.id, number], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/phoneNumber/:id', verifyTokenGeneral, (req, res) => {
    const { id } = req.params;
    const { number } = req.body;
    if(!number){
        return res.status(411).send();
    }
    const query = 'UPDATE Phone_Numbers SET user_id = ?, number = ? WHERE id = ?';
    mysqlConnection.query(query, [req.id, number, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/phoneNumber/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Phone_Numbers WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;