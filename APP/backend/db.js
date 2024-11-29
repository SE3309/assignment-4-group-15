const mysql = require('mysql2'); // npm install mysql2

const mysqlDB = 'marketplace'           // your database name
const mysqlPass = '6x7VuxRQCAlF9DZ4'    // change this to your password

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: mysqlPass,
  database: mysqlDB
});

connection.connect((err) => {
  if (err) {
    console.error(err.stack);
    return;
  }
  console.log('Connected to MySQL');
});

module.exports = connection;