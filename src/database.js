const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
  host: 'db-mysql-sfo2-13237-do-user-10211536-0.b.db.ondigitalocean.com',
  user: 'superuser',
  password: 'lvnO1ZcmHFHlmslP',
  database: 'grandcares',
  port: 25060,
  multipleStatements: true,
  timezone: 'utc' 
});

mysqlConnection.connect(function (err) {
  if (err) {
    console.error(err);
    return;
  } else {
    console.log('db is connected');
  }
});

module.exports = mysqlConnection;

