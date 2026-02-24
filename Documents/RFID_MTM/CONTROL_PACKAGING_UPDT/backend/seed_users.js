const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function seedUsers() {
    // Hash password "Admin123!"
    const password = 'Admin123!';
    const hash = await bcrypt.hash(password, 10);

    const users = [
        { id: 1, username: 'admin', email: 'admin@mtm.co.id', password: hash, name: 'Administrator', role: 'admin' },
        { id: 2, username: 'operator1', email: 'operator1@mtm.co.id', password: hash, name: 'Budi Santoso', role: 'operator' },
        { id: 3, username: 'viewer1', email: 'viewer1@mtm.co.id', password: hash, name: 'Andi Wijaya', role: 'viewer' },
    ];

    for (const u of users) {
        await new Promise((resolve, reject) => {
            const sql = `INSERT INTO users (id, username, email, password, name, role, is_active, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, 1, NOW())
                   ON DUPLICATE KEY UPDATE password=VALUES(password), is_active=1`;
            db.query(sql, [u.id, u.username, u.email, u.password, u.name, u.role], (err) => {
                if (err) {
                    console.error('Error inserting', u.username, ':', err.message);
                    reject(err);
                } else {
                    console.log('✅ User inserted/updated:', u.username, '| password:', password);
                    resolve();
                }
            });
        });
    }

    console.log('\n✅ SELESAI! Login dengan:');
    console.log('   Username: admin');
    console.log('   Password: Admin123!');
    process.exit(0);
}

seedUsers().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
