const db = require('./config/db');
db.query("SELECT COUNT(*) as count FROM part", (err, results) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("Current Part Count:", results[0].count);
    db.query("SELECT * FROM lead_time LIMIT 5", (err, lt) => {
        console.log("Sample Lead Time:", lt);
        db.query("SELECT * FROM actual_packaging LIMIT 5", (err, act) => {
            console.log("Sample Actual:", act);
            process.exit(0);
        });
    });
});
