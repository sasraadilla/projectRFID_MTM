const db = require('./config/db');
const tables = [
    'customers', 'assets', 'asset_events', 'actual_packaging',
    'packagings', 'packaging_types', 'part', 'readers', 'users',
    'repairs', 'rfid_tags', 'drivers', 'vehicles',
    'kalender_kerja', 'lead_time', 'kebutuhan_packaging'
];
let done = 0;
const results = {};
tables.forEach(name => {
    db.query(`SHOW COLUMNS FROM \`${name}\``, (err, cols) => {
        if (err) results[name] = 'ERR: ' + err.message;
        else results[name] = cols.map(c => `${c.Field}(${c.Type})`).join(', ');
        if (++done === tables.length) {
            Object.entries(results).forEach(([t, c]) => console.log(`\n== ${t} ==\n${c}`));
            process.exit(0);
        }
    });
});
