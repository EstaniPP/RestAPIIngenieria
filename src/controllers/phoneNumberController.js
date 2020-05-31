const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/phoneNumber/:fk&:id', (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'user_id'){
        mysqlConnection.query('SELECT * FROM Phone_Numbers WHERE user_id = ?', [id], (err, rows, fields) => {
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

router.post('/phoneNumber/', (req, res) => {
    const { user_id, number } = req.body;
    if(!user_id || !number){
        return res.status(411).send();
    }
    const query = 'INSERT INTO Phone_Numbers(user_id, number) VALUES (?,?)';
    mysqlConnection.query(query, [user_id, number], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/phoneNumber/:id', (req, res) => {
    const { id } = req.params;
    const { user_id, number } = req.body;
    if(!user_id || !number){
        return res.status(411).send();
    }
    const query = 'UPDATE Phone_Numbers SET user_id = ?, number = ? WHERE id = ?';
    mysqlConnection.query(query, [user_id, number, id], (err, rows, fields) => {
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