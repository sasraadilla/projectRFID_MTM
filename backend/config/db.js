const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",       // sesuaikan
  database: "controlingpackaging_rfid" // sesuaikan
});

module.exports = db;
