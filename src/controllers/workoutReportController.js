const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');
const dateValidation = require('../functionalMethods/dateValidation');

router.get('/workoutReport/:fk&:id', (req, res) => {
    const { fk, id } = req.params;
    if(fk == 'workout_id'){
        mysqlConnection.query('SELECT * FROM Workout_Reports WHERE workout_id = ?', [id], (err, rows, fields) => {
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

router.get('/workoutReport/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM Workout_Reports WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows[0]);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/workoutReport/', (req, res) => {
    mysqlConnection.query('SELECT * FROM Workout_Reports', (err, rows, fields) => {
        if(!err){
            return res.status(200).json(rows);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.post('/workoutReport/', (req, res) => {
    const { workout_id, execution_date } = req.body;
    if(!workout_id || !execution_date){
        return res.status(411).send();
    }
    if(!dateValidation(execution_date)){
        return res.status(413).send();
    }
    const query = 'INSERT INTO Workout_Reports(workout_id, execution_date) VALUES (?,?)';
    mysqlConnection.query(query, [workout_id, execution_date], (err, rows, fields) => {
        if(!err){
            return res.status(200).json({"insertId": rows.insertId}).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.put('/workoutReport/:id', (req, res) => {
    const { id } = req.params;
    const { workout_id, execution_date } = req.body;
    if(!workout_id || !execution_date){
        return res.status(411).send();
    }
    if(!dateValidation(execution_date)){
        return res.status(413).send();
    }
    const query = 'UPDATE Workout_Reports SET workout_id = ?, execution_date = ? WHERE id = ?';
    mysqlConnection.query(query, [workout_id, execution_date, id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

router.delete('/workoutReport/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM Workout_Reports WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            return res.status(200).send();
        } else {
            return res.status(500).send(err);
        }
    });
});

module.exports = router;