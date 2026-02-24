const db = require('./config/db.js');

db.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Database connection successful:', results);
    process.exit(0);
});
