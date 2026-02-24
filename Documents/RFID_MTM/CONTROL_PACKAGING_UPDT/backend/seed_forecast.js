const db = require('./config/db');

async function seedForecastData() {
    try {
        const dbP = db.promise();
        console.log("Seeding Forecast Data...");

        // 1. Clear existing forecast results to show only seeded ones
        await dbP.query("DELETE FROM forecast_input");
        await dbP.query("DELETE FROM forecast_month");
        await dbP.query("DELETE FROM lead_time");
        await dbP.query("DELETE FROM kalender_kerja");
        await dbP.query("DELETE FROM actual_packaging");

        // 2. Setup Kalender Kerja for required months
        const year = 2026;
        const prevYear = 2025;
        const months = [
            { name: "Oktober", year: prevYear, days: 22 },
            { name: "November", year: prevYear, days: 21 },
            { name: "Desember", year: prevYear, days: 20 },
            { name: "Januari", year: year, days: 22 },
            { name: "Februari", year: year, days: 20 }
        ];

        for (const m of months) {
            await dbP.query("INSERT INTO kalender_kerja (bulan, tahun, hari_kerja) VALUES (?, ?, ?)", [m.name, m.year.toString(), m.days]);
        }

        // 3. Get Parts to seed
        const [parts] = await dbP.query(`
      SELECT p.id, p.part_name, pkg.id as packaging_id 
      FROM part p 
      JOIN packagings pkg ON (pkg.packaging_name LIKE CONCAT('PKG-', p.part_name, '%') OR pkg.packaging_name LIKE CONCAT('PKG-', p.part_number, '%'))
    `);

        console.log(`Found ${parts.length} parts to seed.`);

        for (const p of parts) {
            // Setup Lead Time (Dummy values 1-3 days)
            await dbP.query("INSERT INTO lead_time (part_id, lt_production, lt_store, lt_customer, created_at) VALUES (?, ?, ?, ?, NOW())", [p.id, 1, 1, 1]);

            // Setup Actual Packaging (Dummy values 10-50 units)
            await dbP.query("INSERT INTO actual_packaging (part_id, qty_actual, created_at) VALUES (?, ?, NOW())", [p.id, 15]);

            // Seed Forecast Months
            let firstMonthId = null;
            for (const m of months) {
                const forecastQty = 1000 + Math.floor(Math.random() * 2000); // Random forecast 1000-3000
                const [res] = await dbP.query("INSERT INTO forecast_month (part_id, bulan, tahun, forecast_month) VALUES (?, ?, ?, ?)", [p.id, m.name, m.year.toString(), forecastQty]);

                if (m.name === "Oktober") firstMonthId = res.insertId;
            }

            // Important: setup forecast_input so the logic finds the packaging_id
            if (firstMonthId) {
                await dbP.query(`
          INSERT INTO forecast_input (forecast_month_id, kalender_kerja, packaging_id, lead_time, actual_packaging) 
          VALUES (?, ?, ?, ?, ?)`,
                    [firstMonthId, 22, p.packaging_id, 3, 15]
                );
            }
        }

        console.log("Forecast seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedForecastData();
