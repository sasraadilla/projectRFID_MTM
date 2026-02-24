const db = require('./config/db');
const fs = require('fs');

async function check() {
    const tables = ['customers', 'packagings', 'part', 'lead_time', 'kalender_kerja'];
    let output = '';
    let pending = tables.length;
    for (let t of tables) {
        db.query(`DESCRIBE ${t}`, (err, res) => {
            output += `\n--- ${t} ---\n`;
            if (err) output += err.toString() + '\n';
            else output += res.map(r => r.Field).join(', ') + '\n';
            pending--;
            if (pending === 0) {
                fs.writeFileSync('schema_dump.txt', output);
                process.exit(0);
            }
        });
    }
}
check();
