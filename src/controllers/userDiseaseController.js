const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');
const verifyTokenUser = require('./verifyTokenUser');
const verifyTokenGeneral = require('./verifyTokenGeneral');

router.get('/userDisease/:fk&:id', verifyTokenGeneral, (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'device_user_id'){
        var device_user_id;
        if(id == 0){
            device_user_id = req.child_id;
        } else {
            device_user_id = id;
        }
        mysqlConnection.query('SELECT * FROM User_Diseases WHERE device_user_id = ?', [device_user_id], (err, rows, fields) => {
            if(!err){
                return res.status(200).json(rows);
            } else {
                return res.status(500).send(err);
            }
        });
    } else if(fk == 'disease_id'){
        mysqlConnection.query('SELECT * FROM User_Diseases WHERE disease_id = ?', [id], (err, rows, fields) => {
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

router.get('/userDisease/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM User_Diseases WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/userDisease/', (req, res) => {
    mysqlConnection.query('SELECT * FROM User_Diseases', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/userDisease/', verifyTokenUser, (req, res) => {
    const { disease_id } = req.body;
    if(!disease_id){
        return res.status(411).send();
    }
    const query = 'INSERT INTO User_Diseases(device_user_id, disease_id) VALUES (?,?)';
    mysqlConnection.query(query, [req.id, disease_id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/userDisease/:id', verifyTokenUser, (req, res) => {
    const { id } = req.params;
    const { disease_id } = req.body;
    if(!disease_id){
        return res.status(411).send();
    }
    const query = 'UPDATE User_Diseases SET device_user_id = ?, disease_id = ? WHERE id = ?';
    mysqlConnection.query(query, [req.id, disease_id, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/userDisease/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM User_Diseases WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;