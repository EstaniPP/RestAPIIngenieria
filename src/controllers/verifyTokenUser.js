const jwt = require('jsonwebtoken');
const mysqlConnection  = require('../database.js');
const secret = "mysecretpassword";

async function verifyTokenUser(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).send();
    }
    try{
        const decoded = jwt.verify(token, secret, function(err, decoded) {
        mysqlConnection.query('SELECT * FROM Users WHERE email = ?', [decoded.id], async (err, rows, fields) => {
            if (!err) {
                User = rows[0];
                if(!User) {
                    return res.status(402).send();
                }else{
                    req.user_id = rows[0].id;
                    const User_id = rows[0].id;
                    mysqlConnection.query('SELECT * FROM Device_Users WHERE user_id = ?', [User_id], async (err, rows, fields) => {
                        if (!err) {
                            User = rows[0];
                            if(!User) {
                                return res.status(403).send();
                            }else{
                                req.id = rows[0].id;
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
        });});
    }catch(err){
        console.log(err)
    }
}

module.exports = verifyTokenUser;