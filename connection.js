const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'rootpass',
  database : 'employee_manager_db'
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`Connected to mysql server at ID ${connection.threadId}`);
});

connection.query = util.promisify(connection.query);

module.exports = connection;