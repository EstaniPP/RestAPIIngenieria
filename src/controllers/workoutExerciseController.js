const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/workoutExercise/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Workout_Exercises', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/workoutExercise/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Workout_Exercises WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

router.post('/workoutExercise/', (req, res) => {
    const { workoutId, exerciseId, time } = req.body;
    const query = 'INSERT INTO Workout_Exercises(workout_id, exercise_id, time) VALUES (?,?,?)';
    mysqlConnection.query(query, [workoutId, exerciseId, time], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Workout exercise saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/workoutExercise/:id', (req, res) => {
    const { id } = req.params;
    const { workoutId, exerciseId, time } = req.body;
    const query = 'UPDATE Workout_Exercises SET workout_id = ?, exercise_id = ?, time = ? WHERE id = ?';
    mysqlConnection.query(query, [workoutId, exerciseId, time, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Workout exercise updated'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/workoutExercise/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Workout_Exercises WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Workout exercise deleted'});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;