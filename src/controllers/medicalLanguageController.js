const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');
const verifyTokenGeneral = require('./verifyTokenGeneral');

router.get('/userLanguage/:fk&:id', verifyTokenGeneral, (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'user_id'){
        var user_id;
        if(id == 0){
            user_id = req.id;
        } else {
            user_id = id;
        }
        mysqlConnection.query('SELECT * FROM User_Languages WHERE user_id = ?', [user_id], (err, rows, fields) => {
            if(!err){
                return res.status(200).json(rows);
            } else {
                return res.status(500).send(err);
            }
        });
    } else if(fk == 'language_id'){
        mysqlConnection.query('SELECT * FROM User_Languages WHERE language_id = ?', [id], (err, rows, fields) => {
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

router.get('/userLanguage/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM User_Languages WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/userLanguage/', (req, res) => {
    mysqlConnection.query('SELECT * FROM User_Languages', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/userLanguage/', verifyTokenGeneral, (req, res) => {
    const { language_id } = req.body;
    if(!language_id){
        return res.status(411).send();
    }
    const query = 'INSERT INTO User_Languages(user_id, language_id) VALUES (?,?)';
    mysqlConnection.query(query, [req.id, language_id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/userLanguage/:id', verifyTokenGeneral, (req, res) => {
    const { id } = req.params;
    const { language_id } = req.body;
    if(!language_id){
        return res.status(411).send();
    }
    const query = 'UPDATE User_Languages SET user_id = ?, language_id = ? WHERE id = ?';
    mysqlConnection.query(query, [req.id, language_id, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/userLanguage/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM User_Languages WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;