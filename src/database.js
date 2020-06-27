const mysql = require ('mysql');
const _testMode = false;

/*
    Use testmode for test porpuses
*/
let dbConnection;
if(!_testMode){
    dbConnection= {
        host:'remotemysql.com',
        user:'jvWEfvA56X',
        password:'95HRIGJaq3',
        database:'jvWEfvA56X'
    };
}else{
    dbConnection= {
        host:'127.0.0.1',
        user:'root',
        password:'password',
        database:'mydb'
    };
}
var pool  = mysql.createPool({
    connectionLimit : 1,
    host            : 'remotemysql.com',
    user            : 'jvWEfvA56X',
    password        : '95HRIGJaq3',
    database        : 'jvWEfvA56X'
});
/*
var connection;
function handleDisconnect() {
    connection = mysql.createConnection(dbConnection); 
    connection.connect(function(err) {             
        if(err) {                                     
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); 
        }else{
            console.log("db connection accomplished");
        }                                     
    });                                     
    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log("reconnectiong to database due to an error or timeout"); 
            handleDisconnect();                        
        }else{                                   
            throw err;
        }                               
    });
}
handleDisconnect();
*/
//module.exports = connection;
module.exports = pool;
