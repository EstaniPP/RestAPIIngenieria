const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/medicalPersonnel/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Medical_Personnel', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/medicalPersonnel/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Medical_Personnel WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.get('/medicalPersonnel/:fk&:id', (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'user_id' || fk == 'medical_speciality_id'){
        mysqlConnection.query('SELECT * FROM Medical_Personnel where ? = ?', [fk, id], (err, rows, fields) => {
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

router.post('/medicalPersonnel/', (req, res) => {
    const { user_id, medical_speciality_id } = req.body;
    const query = 'INSERT INTO Medical_Personnel(user_id, medical_speciality_id) VALUES (?,?)';
    mysqlConnection.query(query, [user_id, medical_speciality_id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Medical personnel saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/medicalPersonnel/:id', (req, res) => {
    const { id } = req.params;
    const { user_id, medical_speciality_id } = req.body;
    const query = 'UPDATE Medical_Personnel SET user_id = ?, medical_speciality_id = ? WHERE id = ?';
    mysqlConnection.query(query, [user_id, medical_speciality_id, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Medical personnel updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/medicalPersonnel/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Medical_Personnel WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Medical personnel deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;