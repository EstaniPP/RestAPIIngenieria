const mysql = require ('mysql');

const mysqlConnection = mysql.createConnection({
    host:'remotemysql.com',
    user:'jvWEfvA56X',
    password:'95HRIGJaq3',
    database:'jvWEfvA56X'
});

mysqlConnection.connect(function (err){
    if(err){
        console.log(err);
    }else{
        console.log('Db is connected');
    }
});

module.exports = mysqlConnection;
