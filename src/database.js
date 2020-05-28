const mysql = require ('mysql');
const _testMode = true;

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

function handleDisconnect(){
    const connection = mysql.createConnection(dbConnection);
    connection.connect(function (err){
        if(err){
            console.log("Error when connecting to the database", err);
            setTimeout(handleDisconnect, 2000); 
        }else{
            console.log('db connection accomplished');
        }
    });
    connection.on('error', function(erro) {
        console.log('db error', erro);
        if(erro.code === 'PROTOCOL_CONNECTION_LOST') { 
          handleDisconnect();                         
        } else {                                     
          throw erro;                                  
        }
    });
    return connection;
};

module.exports = handleDisconnect();
