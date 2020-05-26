const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/workoutReport/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Workout_Reports', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/workoutReport/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Workout_Reports WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.post('/workoutReport/', (req, res) => {
    const { workoutId, executionDate } = req.body;
    const query = 'INSERT INTO Workout_Reports(workout_id, execution_date) VALUES (?,?)';
    mysqlConnection.query(query, [workoutId, executionDate], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Workout report saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/workoutReport/:id', (req, res) => {
    const { id } = req.params;
    const { workoutId, executionDate } = req.body;
    const query = 'UPDATE Workout_Reports SET workout_id = ?, exectuion_date = ? WHERE id = ?';
    mysqlConnection.query(query, [workoutId, executionDate, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Workout report updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/workoutReport/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Workout_Reports WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Workout report deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;