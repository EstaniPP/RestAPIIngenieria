const jwt = require('jsonwebtoken');
const mysqlConnection  = require('../database.js');
const secret = "mysecretpassword";

async function verifyTokenUser(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'No ingreso ningun token' });
    }
    const decoded = await jwt.verify(token, secret);
    mysqlConnection.query('SELECT * FROM users WHERE email = ?', [decoded.id], async (err, rows, fields) => {
        if (!err) {
            user = rows[0];
            req.id = rows[0].id;
            if(!user) {
                return res.status(404).send("El usuario no existe")
            }else{
                const user_id = rows[0].id;
                mysqlConnection.query('SELECT * FROM device_users WHERE user_id = ?', [user_id], async (err, rows, fields) => {
                    if (!err) {
                        user = rows[0];
                        if(!user) {
                            return res.status(404).send("El usuario no es medico")
                        }else{
                            next();
                        }
                    }
                    else {
                        console.log(err);
                    }
                });
            }
        }
        else {
            console.log(err);
        }
    });
}

module.exports = verifyTokenUser;