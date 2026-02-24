const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "", // sesuaikan jika ada password
    multipleStatements: true
};

const schemaPath = path.join(__dirname, '../db_packaging.sql');

console.log('--- Database Setup Script ---');
console.log('1. Connecting to MySQL...');

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        process.exit(1);
    }
    console.log('Connected to MySQL.');

    // 1. Create Database
    console.log('2. Creating database "db_troli" if not exists...');
    connection.query('CREATE DATABASE IF NOT EXISTS db_troli', (err) => {
        if (err) {
            console.error('Error creating database:', err.message);
            connection.end();
            process.exit(1);
        }
        console.log('Database "db_troli" check/creation successful.');

        // 2. Use Database
        connection.query('USE db_troli', (err) => {
            if (err) {
                console.error('Error selecting database:', err.message);
                connection.end();
                process.exit(1);
            }
            console.log('Selected database "db_troli".');

            // 3. Read and Import Schema
            console.log(`3. Reading schema from ${schemaPath}...`);
            fs.readFile(schemaPath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading schema file:', err.message);
                    connection.end();
                    process.exit(1);
                }

                console.log('Schema file read. Importing data (this might take a moment)...');

                connection.query(data, (err) => {
                    if (err) {
                        console.error('Error importing schema:', err.message);
                        connection.end();
                        process.exit(1);
                    }
                    console.log('Schema imported successfully!');
                    console.log('--- Setup Complete ---');
                    connection.end();
                });
            });
        });
    });
});
