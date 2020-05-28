const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/workout/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Workouts', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/workout/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Workouts WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.post('/workout/', (req, res) => {
    const { device_user_id, medical_personnel_id, done, creation_date, difficulty, rating } = req.body;
    const query = 'INSERT INTO Workouts(device_user_id, medical_personnel_id, done, creation_date, difficulty, rating) VALUES (?,?,?,?,?,?)';
    mysqlConnection.query(query, [device_user_id, medical_personnel_id, done, creation_date, difficulty, rating], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Workout saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/workout/:id', (req, res) => {
    const { id } = req.params;
    const { device_user_id, medical_personnel_id, done, creation_date, difficulty, rating } = req.body;
    const query = 'UPDATE Workouts SET device_user_id = ?, medical_personnel_id = ?, done = ?, creation_date = ?, difficulty = ?, rating = ? WHERE id = ?';
    mysqlConnection.query(query, [device_user_id, medical_personnel_id, done, creation_date, difficulty, rating, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Workout updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/workout/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Workouts WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Workout deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;