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
        console.log("Seeding Dummy Forecast Data...");

        // 1. Customers
        await runQuery("INSERT IGNORE INTO customers (id, customer_name) VALUES (1, 'PT. TRD Indonesia')");
        await runQuery("
            INSERT IGNORE INTO customers (id, customer_name) VALUES (2, 'PT. HMM Motor')");
        console.log("Customers seeding done.");

        // 2. Packagings (Need dummy packaging_type_id=1 and warna='Biru')
        await runQuery("INSERT IGNORE INTO packagings (id, packaging_name, kapasitas_packaging, packaging_type_id, warna) VALUES (1, 'Box Plastik 50L', 20, 1, 'Biru')");
        await runQuery("INSERT IGNORE INTO packagings (id, packaging_name, kapasitas_packaging, packaging_type_id, warna) VALUES (2, 'Rack Besi', 10, 1, 'Kuning')");
        console.log("Packagings seeding done.");

        // 3. Parts
        await runQuery("INSERT IGNORE INTO part (id, part_number, part_name, customer_id, qty_per_pack, keterangan) VALUES (1, 'TRD-BMP-01', 'Bumper Depan Yaris', 1, 10, 'Dummy Part 1')");
        await runQuery("INSERT IGNORE INTO part (id, part_number, part_name, customer_id, qty_per_pack, keterangan) VALUES (2, 'HMM-HDL-02', 'Headlight LED', 2, 5, 'Dummy Part 2')");
        console.log("Parts seeding done.");

        // 4. Lead Time
        await runQuery("INSERT IGNORE INTO lead_time (part_id, lt_production, lt_store, lt_customer) VALUES (1, 1, 2, 3)");
        await runQuery("INSERT IGNORE INTO lead_time (part_id, lt_production, lt_store, lt_customer) VALUES (2, 2, 1, 2)");
        console.log("Lead time seeding done.");

        // 5. Kalender Kerja
        await runQuery("INSERT IGNORE INTO kalender_kerja (bulan, tahun, hari_kerja) VALUES ('Februari', 2026, 20)");
        await runQuery("INSERT IGNORE INTO kalender_kerja (bulan, tahun, hari_kerja) VALUES ('Maret', 2026, 22)");
        console.log("Kalender kerja seeding done.");

        // Clear old forecast data to ensure fresh testing data
        // Delete depending tables first
        await runQuery("DELETE FROM forecast_input");
        await runQuery("DELETE FROM forecast_month");

        // 6. Forecast Month (Get the newly inserted IDs)
        const resMonth1 = await runQuery("INSERT INTO forecast_month (part_id, bulan, tahun, forecast_month) VALUES (1, 'Februari', 2026, 4000)");
        const resMonth2 = await runQuery("INSERT INTO forecast_month (part_id, bulan, tahun, forecast_month) VALUES (2, 'Februari', 2026, 5000)");
        const resMonth3 = await runQuery("INSERT INTO forecast_month (part_id, bulan, tahun, forecast_month) VALUES (1, 'Maret', 2026, 6000)");
        console.log("Forecast month seeding done.");

        // 7. Forecast Input
        await runQuery("INSERT INTO forecast_input (forecast_month_id, kalender_kerja, packaging_id, lead_time, actual_packaging) VALUES (?, ?, ?, ?, ?)", [resMonth1.insertId, 20, 1, 6, 1100]);
        await runQuery("INSERT INTO forecast_input (forecast_month_id, kalender_kerja, packaging_id, lead_time, actual_packaging) VALUES (?, ?, ?, ?, ?)", [resMonth2.insertId, 20, 2, 5, 200]);
        await runQuery("INSERT INTO forecast_input (forecast_month_id, kalender_kerja, packaging_id, lead_time, actual_packaging) VALUES (?, ?, ?, ?, ?)", [resMonth3.insertId, 22, 1, 6, 1200]);
        console.log("Forecast input seeding done.");

        console.log("Dummy seeder finished successfully!");
        process.exit(0);

    } catch (error) {
        console.error("Error during seeding:", error);
        process.exit(1);
    }
}

seed();
