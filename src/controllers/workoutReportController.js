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

router.get('/workoutReport/:fk&:id', (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'workout_id'){
        mysqlConnection.query('SELECT * FROM Workout_Reports where ? = ?', [fk, id], (err, rows, fields) => {
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

router.post('/workoutReport/', (req, res) => {
    const { workout_id, execution_date } = req.body;
    const query = 'INSERT INTO Workout_Reports(workout_id, execution_date) VALUES (?,?)';
    mysqlConnection.query(query, [workout_id, execution_date], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Workout report saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/workoutReport/:id', (req, res) => {
    const { id } = req.params;
    const { workout_id, execution_date } = req.body;
    const query = 'UPDATE Workout_Reports SET workout_id = ?, execution_date = ? WHERE id = ?';
    mysqlConnection.query(query, [workout_id, execution_date, id], (err, rows, fields) => {
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