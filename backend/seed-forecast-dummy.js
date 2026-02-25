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
        console.log("Seeding Extracted Dummy Forecast Data from Screenshot...");

        // Delete depending tables first
        console.log("Cleaning up old forecast data...");
        await runQuery("DELETE FROM forecast_input");
        await runQuery("DELETE FROM forecast_month");

        // Setup base data mapping from the screenshot

        // 1. Customers
        await runQuery("INSERT IGNORE INTO customers (id, customer_name) VALUES (801, 'PT.AAA')");
        await runQuery("INSERT IGNORE INTO customers (id, customer_name) VALUES (802, 'PT.BBB')");
        await runQuery("INSERT IGNORE INTO customers (id, customer_name) VALUES (803, 'PT.CCC')");

        // 2. Packagings
        // Trolley: id 901, 100 capacity
        await runQuery("INSERT IGNORE INTO packagings (id, packaging_name, kapasitas_packaging, packaging_type_id, warna) VALUES (901, 'Trolley', 100, 1, '-')");
        // Dolly: id 902, 50 capacity  
        await runQuery("INSERT IGNORE INTO packagings (id, packaging_name, kapasitas_packaging, packaging_type_id, warna) VALUES (902, 'Dolly', 50, 1, '-')");
        // Pallet: id 903, 50 capacity
        await runQuery("INSERT IGNORE INTO packagings (id, packaging_name, kapasitas_packaging, packaging_type_id, warna) VALUES (903, 'Pallet', 50, 1, '-')");

        // 3. Parts
        // Part ABC
        await runQuery("INSERT IGNORE INTO part (id, part_number, part_name, customer_id, qty_per_pack, keterangan) VALUES (701, 'PART-ABC', 'ABC', 801, 100, '')");
        // Part DEF
        await runQuery("INSERT IGNORE INTO part (id, part_number, part_name, customer_id, qty_per_pack, keterangan) VALUES (702, 'PART-DEF', 'DEF', 802, 50, '')");
        // Part GHI 
        await runQuery("INSERT IGNORE INTO part (id, part_number, part_name, customer_id, qty_per_pack, keterangan) VALUES (703, 'PART-GHI', 'GHI', 803, 50, '')");



        // 4. Lead Time
        // For ABC: 1 Prod=5, 2 Store=10, 3 Cust=15 
        await runQuery("INSERT IGNORE INTO lead_time (part_id, lt_production, lt_store, lt_customer) VALUES (701, 5, 10, 15) ON DUPLICATE KEY UPDATE lt_production=5, lt_store=10, lt_customer=15");
        // For DEF: 1 Prod=5, 2 Store=10, 3 Cust=15
        await runQuery("INSERT IGNORE INTO lead_time (part_id, lt_production, lt_store, lt_customer) VALUES (702, 5, 10, 15) ON DUPLICATE KEY UPDATE lt_production=5, lt_store=10, lt_customer=15");
        // For GHI: 1 Prod=7, 2 Store=14, 3 Cust=21 
        await runQuery("INSERT IGNORE INTO lead_time (part_id, lt_production, lt_store, lt_customer) VALUES (703, 7, 14, 21) ON DUPLICATE KEY UPDATE lt_production=7, lt_store=14, lt_customer=21");

        // 5. Kalender Kerja
        // Oct: 20, Nov: 21, Dec: 15 (2025)
        await runQuery("INSERT IGNORE INTO kalender_kerja (bulan, tahun, hari_kerja) VALUES ('Oktober', 2025, 20)");
        await runQuery("INSERT IGNORE INTO kalender_kerja (bulan, tahun, hari_kerja) VALUES ('November', 2025, 21)");
        await runQuery("INSERT IGNORE INTO kalender_kerja (bulan, tahun, hari_kerja) VALUES ('Desember', 2025, 15)");

        // 6. Forecast Month & Input Data Loop
        // Creating the baseline data for "Oktober 2025" for the three parts, 
        // using the "Actual" counts to trigger the Judgment math.

        // --- Part ABC (Oktober 2025) ---
        // Forecast / Month: 10.000
        const abc_Oct = await runQuery("INSERT INTO forecast_month (part_id, bulan, tahun, forecast_month) VALUES (701, 'Oktober', 2025, 10000)");
        // Actual Stock = 25 (to get diff of +5 for 'Kurang' against Needs = 30)
        await runQuery("INSERT INTO forecast_input (forecast_month_id, kalender_kerja, packaging_id, lead_time, actual_packaging) VALUES (?, ?, ?, ?, ?)", [abc_Oct.insertId, 20, 901, 30, 25]);

        // --- Part DEF (Oktober 2025) ---
        // Forecast / Month: 5.000 
        const def_Oct = await runQuery("INSERT INTO forecast_month (part_id, bulan, tahun, forecast_month) VALUES (702, 'Oktober', 2025, 5000)");
        // Actual Stock = 45 (to get diff of -15 for 'Lebih' against Needs = 30)
        await runQuery("INSERT INTO forecast_input (forecast_month_id, kalender_kerja, packaging_id, lead_time, actual_packaging) VALUES (?, ?, ?, ?, ?)", [def_Oct.insertId, 20, 902, 30, 45]);

        // --- Part GHI (Oktober 2025) ---
        // Forecast / Month: 7.000
        const ghi_Oct = await runQuery("INSERT INTO forecast_month (part_id, bulan, tahun, forecast_month) VALUES (703, 'Oktober', 2025, 7000)");
        // Actual Stock = 42 (to get diff of 0 for 'Pass' against Needs = 42)
        await runQuery("INSERT INTO forecast_input (forecast_month_id, kalender_kerja, packaging_id, lead_time, actual_packaging) VALUES (?, ?, ?, ?, ?)", [ghi_Oct.insertId, 20, 903, 42, 42]);


        console.log("Mock Excel Screenshot seeder finished successfully!");
        process.exit(0);

    } catch (error) {
        console.error("Error during seeding:", error);
        process.exit(1);
    }
}

seed();
