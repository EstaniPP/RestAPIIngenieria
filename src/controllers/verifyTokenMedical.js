const jwt = require('jsonwebtoken');
const mysqlConnection  = require('../database.js');
const secret = "mysecretpassword";

async function verifyTokenMedical(req, res, next) {
    const token = req.headers['x-access-token'];
    console.log(token)
    if (!token) {
        return res.status(401).send();
    }
    const decoded = await jwt.verify(token, secret,function(err, decoded) {
        if(err){
            return res.status(405).send();
        }else{
            mysqlConnection.query('SELECT * FROM Users WHERE email = ?', [decoded.id], async (err, rows, fields) => {
                if (!err) {
                    user = rows[0];
                    if(!user) {
                        return res.status(402).send();
                    }else{
                        const user_id = rows[0].id;
                        mysqlConnection.query('SELECT * FROM Medical_Personnel WHERE user_id = ?', [user_id], async (err, rows, fields) => {
                            if (!err) {
                                user = rows[0];
                                req.id = rows[0].id;
                                if(!user) {
                                    return res.status(403).send();
                                }else{
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

module.exports = verifyTokenMedical;