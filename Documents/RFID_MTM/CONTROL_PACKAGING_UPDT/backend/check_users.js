const db = require('./config/db');
db.query("SELECT * FROM users", (err, results) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("Current Users:", results);
    process.exit(0);
});
