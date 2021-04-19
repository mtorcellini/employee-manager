const mysql = require('mysql');
const connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'rootpass',
  database : 'employee_manager_db'
});

module.exports = connection;