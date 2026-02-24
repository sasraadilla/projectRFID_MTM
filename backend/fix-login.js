const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function fixLogin() {
    const username = 'admin';
    const plainPassword = 'admin123';
    const role = 'admin';
    const name = 'Administrator';

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        console.log('Hashed password generated');

        // Check if user exists
        db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
            if (err) {
                console.error('DB error (check):', err.message);
                process.exit(1);
            }

            if (results.length === 0) {
                // Insert new user
                db.query(
                    'INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)',
                    [username, hashedPassword, name, role],
                    (err2, result) => {
                        if (err2) {
                            console.error('DB error (insert):', err2.message);
                            process.exit(1);
                        }
                        console.log(`✅ User '${username}' berhasil dibuat! ID: ${result.insertId}`);
                        console.log(`   Username: ${username}`);
                        console.log(`   Password: ${plainPassword}`);
                        process.exit(0);
                    }
                );
            } else {
                // Update existing user password
                db.query(
                    'UPDATE users SET password = ?, role = ?, name = ? WHERE username = ?',
                    [hashedPassword, role, name, username],
                    (err2) => {
                        if (err2) {
                            console.error('DB error (update):', err2.message);
                            process.exit(1);
                        }
                        console.log(`✅ Password user '${username}' berhasil diupdate!`);
                        console.log(`   Username: ${username}`);
                        console.log(`   Password: ${plainPassword}`);
                        process.exit(0);
                    }
                );
            }
        });
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

fixLogin();
