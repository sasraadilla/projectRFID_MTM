const db = require('./config/db');
const tables = ['customers', 'assets', 'actual_packaging', 'asset_events', 'packagings', 'part', 'packaging_types'];
let done = 0;
tables.forEach(name => {
    db.query(`SHOW COLUMNS FROM \`${name}\``, (err, cols) => {
        if (err) { process.stdout.write(`${name}: ERR ${err.message}\n`); }
        else { process.stdout.write(`${name}: ${cols.map(c => c.Field).join('|')}\n`); }
        if (++done === tables.length) process.exit(0);
    });
});
