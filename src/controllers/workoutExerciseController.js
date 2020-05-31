const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');
const timeValidation = require('../functionalMethods/timeValidation');

router.get('/workoutExercise/:fk&:id', (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'workout_id'){
        mysqlConnection.query('SELECT * FROM Workout_Exercises WHERE workout_id = ?', [id], (err, rows, fields) => {
            if(!err){
                return res.status(200).json(rows);
            } else {
                return res.status(500).send(err);
            }
        });
    } else if(fk == 'exercise_id'){
        mysqlConnection.query('SELECT * FROM Workout_Exercises WHERE exercise_id = ?', [id], (err, rows, fields) => {
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

router.get('/workoutExercise/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Workout_Exercises WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/workoutExercise/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Workout_Exercises', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/workoutExercise/', (req, res) => {
    const {workout_id, exercise_id, time } = req.body;
    if(!workout_id || !exercise_id){
        return res.status(411).send();
    }
    if(time !== null && !timeValidation(time)){
        return res.status(414).send();
    }
    const query = 'INSERT INTO Workout_Exercises(workout_id, exercise_id, time) VALUES (?,?,?)';
    mysqlConnection.query(query, [workout_id, exercise_id, time], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/workoutExercise/:id', (req, res) => {
    const { id } = req.params;
    const { workout_id, exercise_id, time } = req.body;
    if(!workout_id || !exercise_id){
        return res.status(411).send();
    }
    if(time !== null && !timeValidation(time)){
        return res.status(414).send();
    }
    const query = 'UPDATE Workout_Exercises SET workout_id = ?, exercise_id = ?, time = ? WHERE id = ?';
    mysqlConnection.query(query, [workout_id, exercise_id, time, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/workoutExercise/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Workout_Exercises WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;