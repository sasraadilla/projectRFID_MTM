const db = require('./config/db');

async function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

async function seed() {
    try {
        console.log("Seeding Dummy Forecast Data for PT. ADM (Part ID: 7)...");

        // Clean up specifically for this part to avoid conflicts
        await runQuery("DELETE fi FROM forecast_input fi JOIN forecast_month fm ON fm.id = fi.forecast_month_id WHERE fm.part_id = 7");
        await runQuery("DELETE FROM forecast_month WHERE part_id = 7");

        // 1. Lead Time for Part 7 (HUB FRONT AXLE D14N)
        console.log("Setting Lead Time...");
        await runQuery(`
            INSERT IGNORE INTO lead_time (part_id, lt_production, lt_store, lt_customer) 
            VALUES (7, 1, 2, 1) 
            ON DUPLICATE KEY UPDATE lt_production=1, lt_store=2, lt_customer=1
        `);

        // 2. Kalender Kerja
        console.log("Setting Kalender Kerja...");
        await runQuery("INSERT IGNORE INTO kalender_kerja (bulan, tahun, hari_kerja) VALUES ('Februari', 2026, 20)");
        await runQuery("INSERT IGNORE INTO kalender_kerja (bulan, tahun, hari_kerja) VALUES ('Maret', 2026, 20)");
        await runQuery("INSERT IGNORE INTO kalender_kerja (bulan, tahun, hari_kerja) VALUES ('April', 2026, 20)");

        // 3. Forecast Data
        console.log("Setting Forecast Months & Actual Stock...");

        // --- Februari 2026 (KURANG scenerio) ---
        // Forecast: 4800 / 20 days = 240/day. Capacity 24 = 10 packs/day. LT total = 4. Needs = 40.
        // Actual: 35. Diff = 35 - 40 = -5. Display = (Kurang 5)
        const febRes = await runQuery("INSERT INTO forecast_month (part_id, bulan, tahun, forecast_month) VALUES (7, 'Februari', 2026, 4800)");
        await runQuery("INSERT INTO forecast_input (forecast_month_id, kalender_kerja, packaging_id, lead_time, actual_packaging) VALUES (?, ?, ?, ?, ?)", [febRes.insertId, 20, 44, 40, 35]);

        // --- Maret 2026 (LEBIH scenario) ---
        // Needs = 40. Actual = 50. Diff = 50 - 40 = +10. Display = (Lebih 10)
        const marRes = await runQuery("INSERT INTO forecast_month (part_id, bulan, tahun, forecast_month) VALUES (7, 'Maret', 2026, 4800)");
        await runQuery("INSERT INTO forecast_input (forecast_month_id, kalender_kerja, packaging_id, lead_time, actual_packaging) VALUES (?, ?, ?, ?, ?)", [marRes.insertId, 20, 44, 40, 50]);

        // --- April 2026 (PASS scenario) ---
        // Needs = 40. Actual = 40. Diff = 0. Display = (Pass)
        const aprRes = await runQuery("INSERT INTO forecast_month (part_id, bulan, tahun, forecast_month) VALUES (7, 'April', 2026, 4800)");
        await runQuery("INSERT INTO forecast_input (forecast_month_id, kalender_kerja, packaging_id, lead_time, actual_packaging) VALUES (?, ?, ?, ?, ?)", [aprRes.insertId, 20, 44, 40, 40]);

        console.log("Dummy seeder finished successfully!");
        process.exit(0);

    } catch (error) {
        console.error("Error during seeding:", error);
        process.exit(1);
    }
}

seed();
