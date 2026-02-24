const db = require('./config/db');

console.log('Testing database connection...');

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('Access denied. Please check your username and password.');
    }
    process.exit(1);
  } else {
    console.log('Successfully connected to database!');
    connection.release();
    process.exit(0);
  }
});
