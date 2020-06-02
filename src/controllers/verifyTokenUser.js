const jwt = require('jsonwebtoken');
const mysqlConnection  = require('../database.js');
const secret = "mysecretpassword";

async function verifyTokenUser(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).send();
    }
    const decoded = await jwt.verify(token, secret,function(err, decoded) {
        if(err){
            return res.status(405).send();
        }else{
            mysqlConnection.query('SELECT * FROM Users WHERE email = ?', [decoded.id], async (err, rows, fields) => {
                if (!err) {
                    User = rows[0];
                    req.id = rows[0].id;
                    console.log("hola");
                    if(!User) {
                        return res.status(402).send();
                    }else{
                        const User_id = rows[0].id;
                        mysqlConnection.query('SELECT * FROM Device_Users WHERE User_id = ?', [User_id], async (err, rows, fields) => {
                            if (!err) {
                                User = rows[0];
                                if(!User) {

                                    return res.status(403).send();
                                }else{
                                    next();
                                }
                            }else {
                                return res.status(500).send(err);
                            }
                        });
                    }
                }else {
                    return res.status(500).send(err);
                }
            });
        }
    });
}

module.exports = verifyTokenUser;