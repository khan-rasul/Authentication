const mysql= require('mysql2');
const connection= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'auth_demo'
});

module.exports=connection;