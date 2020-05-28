/*
    Controller for MercadoPago's payments
    @author valentin
*/
const { Router } = require('express');
const router = Router();
// database connection
const mysqlConnection = require('../database');
// MercadoPago libraries
const mercadopago = require('../../lib/mercadopago.js');
var oldAccessToken = mercadopago.configurations.getAccessToken();
// user authentication
const verifyTokenUser = require('./verifyTokenUser');
/*
    Credentials
        - For production we need the client_id and client_secret
        - This example is entirely a sandbox test
*/
 /*
        Body format:
            - workoutList: []
*/
router.post('/mercadop/', verifyTokenUser, (req, res) => {
    mercadopago.configure({
        sandbox: true,
        access_token: "TEST-7376157659045255-052717-375fef09302638cd785342590cc90682-53060878"
    });
    // workout list
    const workoutList = req.body.workoutList;
    // set preferences for MercadoPago API
    let preference = {}
    // stored items based on the workout list
    let items = [];
    // doctor's id
    let doctorId = null;
    // payer's info
    let payerInfo;
    // get user information
    mysqlConnection.query('SELECT * FROM Users WHERE id = ?', [req.id], async (err, rows) => {
        payerInfo = rows[0];
    }).on('error', function(error){
        console.log("[mysql error]", error);
        throw error;
    });
    // get al workouts and description
    workoutList.forEach(element => {
        await mysqlConnection.query('SELECT * FROM Workouts WHERE  id = ?', [element], async (err, rows) => {
            if(rows.length !== 0){
                if(!doctorId){
                    doctorId = rows[0].medical_personnel_id;
                    console.log("DOCTOR ID: ", doctorId);
                }
                items.push({
                    title: rows[0].id, // replace for workout_title
                    quantity: 1,
                    currency_id: 'ARS',
                    unit_price: rows[0].workout_price
                }); 
                console.log("Pusheando");
            }else{
                console.log("No se ha encontrado un medico")
            }            
        }).on('error', function(error){
            console.log("[mysql error]", error);
            throw error;
        });          
    });
    console.log(items.length);
    // check if there is at least a row to work with.
    // let's assume front end retards are gonna send us workouts from only one medical personnel
    if(items.length === 0){
        // bad request
        return res.status(400).json({
            error: 400,
            msg: "No existen workouts con el ID seleccionado"
        });
    }
    // get medical user token and access key out of a workout
    let credentials = null;
    if(doctorId){
        mysqlConnection.query('SELECT * FROM Medical_Personnel WHERE id = ?', [doctorId], async (err, rows) => {
            credentials = {
                mp_access_token: rows[0].mp_access_token,
                mp_public_key: rows[0].mp_public_key
            };
        }).on('error', function(error){
            console.log("[mysql error]", error);
            throw error;
        }); 
    }else{
        // bad request
        return res.status(400).json({
            error: 400,
            msg: "No existe medico"
        });
    }
    // set payer's info
    payerInfo = {
        name: payerInfo.name, 
        surname: payerInfo.last_name,
        email: payerInfo.email
    }
    // give attributes to API
    preference.items = items;
    preference.payer = payerInfo;
    // Create the preference
    mercadopago.preferences.create(preference).then(function (data) {
        return res.status(200).json({precerence: data});
    }).catch(function (error) {
        return res.status(500).json({error: error});
    });        
});



module.exports = router;