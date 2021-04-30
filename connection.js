const mysql = require('mysql');
const util = require('util');

require('dotenv').config();

const connection = mysql.createConnection({
  host : process.env.DB_HOST,
  user : process.env.DB_USER,
  password : process.env.DB_PW,
  database : 'employee_manager_db'
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`Connected to mysql server at ID ${connection.threadId}`);
});

connection.query = util.promisify(connection.query);

module.exports = connection;