const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

const verifyTokenMedical = require('./verifyTokenMedical');
const verifyTokenUser = require('./verifyTokenUser');

// user's routes
    // subscribe -> (id_medico) | post   | crea una suscripcion sin precio
    // end -> (id_medico)       | delete | elimina una suscripcion
    // renew -> (id_medico)     | put    | actualiza la suscripcion con + 1 mes
    // get                      | get    | le da sus suscripciones

// USER
router.post('/subscriptions/subscribe', verifyTokenUser, (req, res) => {
    const { medical_personnel_id } = req.body;
    let today = new Date();
    mysqlConnection.query("INSERT INTO Subscriptions (`expires`, `Medical_Personnel_id`, `Device_Users_id`, `amount`) VALUES (NULL, '?', '?', '0');", [medical_personnel_id, req.id], (err, rows, fields) => {
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send("OK");
        }
    })
});
router.delete('/subscriptions/end/:id_medico', verifyTokenUser, (req, res) => {
    const { id_medico } = req.params;
    mysqlConnection.query("DELETE FROM Subscriptions WHERE Medical_Personnel_id = ? AND Device_Users_id = '?'", [id_medico, req.id], (err, rows, fields) => {
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send("OK");
        }
    })
});
router.put('/subscriptions/renew/:id_medico', verifyTokenUser, (req, res) => {
    const { id_medico } = req.params;
    mysqlConnection.query("SELECT * FROM Subscriptions WHERE Medical_Personnel_id = ? AND Device_Users_id = '?'", [id_medico, req.id], (err, rows, fields) => {
        if(err){
            return res.status(500).send(err);
        }else{
            if(rows.length == 0){
                return res.status(404).send("not found"); 
            }else{
                let today = null;
                if(rows[0].expires == null){
                    // es una suscripcion nueva
                    today = new Date();
                }else{
                    today = new Date(rows[0].expires);
                }
                today.setMonth(today.getMonth() + 2); // sumo de a dos porque js te da de 0-11 wtf
                let formattedDate = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
                mysqlConnection.query("UPDATE Subscriptions SET expires = ? WHERE Medical_Personnel_id = ? AND Device_Users_id = '?' ", [formattedDate, id_medico, req.id], (err, rows, fields) => {
                    if(err){
                        return res.status(500).send(err);
                    }else{
                        return res.status(200).send("OK");
                    }
                });
            }
        }
    })
});
router.get('/subscriptions/get', verifyTokenUser, (req, res) => {
    mysqlConnection.query("SELECT Medical_Personnel_id, amount, expires FROM Subscriptions WHERE Device_Users_id = '?'", [req.id], (err, rows, fields) => {
        if(err){
            return res.status(500).send(err);
        }else{
            if(rows.length == 0){
                return res.status(404).send("no subscriptions found");
            }else{
                return res.status(200).json(rows);
            }
        }
    })
});
// doctor's routes
    // approve -> id_user, price| put    | aprueba la suscripcion con un precio
    // delete -> id_user        | delete | elimina susripcion
    // manage -> id_user        | put    | cambia el precio
    // getSubscribed            | get    | le devuelve los suscriptos

// medico numero 17 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InZhbGVudGluOUBnbWFpbC5jb20iLCJpYXQiOjE1OTIwNjk4MTZ9.pdfSKDM3fnUFRI0q4-Prz4tC0520RX7ZjaQ4pEbMNrE
// user 13 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InZhbGVudGluMTIzQGdtYWlsLmNvbSIsImlhdCI6MTU5MjA2NzgyMX0.q2qn2k8y2JRKw9gm-iybqzXiSOWeLhe3yzALoPLBPYE
router.put('/subscriptions/approve/:id_user', verifyTokenMedical, (req, res) => {
    const { amount } = req.body;
    mysqlConnection.query("UPDATE Subscriptions SET amount = ? WHERE Device_Users_id = ? AND Medical_Personnel_id = '?'", [amount, req.params.id_user, req.id], (err, rows, fields) => {
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send("OK");
        }
    })
});

router.delete('/subscriptions/delete/:id_user', verifyTokenMedical, (req, res) => {
    const { id_user } = req.params;
    mysqlConnection.query("DELETE FROM Subscriptions WHERE Medical_Personnel_id = ? AND Device_Users_id = ?", [req.id, id_user], (err, rows, fields) => {
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send("OK");
        }
    })
});

router.put('/subscriptions/manage/:id_user', verifyTokenMedical, (req, res) => {
    const { amount } = req.body;
    mysqlConnection.query("UPDATE Subscriptions SET amount = ? WHERE Device_Users_id = ? AND Medical_Personnel_id = '?'", [amount, req.params.id_user, req.id], (err, rows, fields) => {
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send("OK");
        }
    })
});
router.get('/subscriptions/getSubscribed', verifyTokenMedical, (req, res) => {
    mysqlConnection.query("SELECT Device_Users_id, amount, expires FROM Subscriptions WHERE Medical_Personnel_id = '?'", [req.id], (err, rows, fields) => {
        if(err){
            return res.status(500).send(err);
        }else{
            if(rows.length == 0){
                return res.status(404).send("no subscriptions found");
            }else{
                return res.status(200).json(rows);
            }
        }
    })
});
module.exports = router;