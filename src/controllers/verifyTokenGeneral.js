const jwt = require('jsonwebtoken');
const mysqlConnection  = require('../database.js');
const secret = "mysecretpassword";

async function verifyTokenGeneral(req, res, next) {
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
                return res.status(401).send("El usuario no existe")
            }else{
                next();
            }
        }
        else {
            console.log(err);
        }
    });
}

module.exports = verifyTokenGeneral;