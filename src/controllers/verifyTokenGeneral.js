const jwt = require('jsonwebtoken');
const mysqlConnection  = require('../database.js');
const secret = "mysecretpassword";

async function verifyTokenGeneral(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'No ingreso ningun token' });
    }
    const decoded = await jwt.verify(token, secret,function(err, decoded) {
        if(err){
            return res.status(405).send();
        }else{
            mysqlConnection.query('SELECT * FROM Users WHERE email = ?', [decoded.id], async (err, rows, fields) => {
                if (!err) {
                    user = rows[0];
                    req.id = rows[0].id;
                    if(!user) {
                        return res.status(402).send("Token invalido")
                    }else{
                        mysqlConnection.query('SELECT * FROM Medical_Personnel WHERE user_id = ?', [req.id], async (err, rows, fields) => {
                            if (!err) {
                                user = rows[0];
                                if(!user) {
                                    mysqlConnection.query('SELECT * FROM Device_Users WHERE User_id = ?', [req.id], async (err, rows, fields) => {
                                        if (!err) {
                                            User = rows[0];
                                            if(!User) {
                                                return res.status(403).send();
                                            }else{
                                                req.child_id = rows[0].id;
                                                next();
                                            }
                                        }else {
                                            return res.status(500).send(err);
                                        }
                                    });
                                }else{
                                    req.child_id = rows[0].id;
                                    next();
                                }
                            }else {
                                return res.status(500).send(err);
                            }
                        });
                    }
                }
                else {
                    return res.status(500).send(err);
                }
            });
        }
    });
}

module.exports = verifyTokenGeneral;