const db = require('./config/db');

const fullPartsList = [
    { num: "10101-K0N-D00", name: "GASKET KIT A" },
    { num: "10101-K2F-N00", name: "GASKET KIT A" },
    { num: "10101-K1N-V00", name: "GASKET KIT A" },
    { num: "12100-K0N-D00", name: "CYLINDER COMP" },
    { num: "12200-K0N-D00", name: "HEAD COMP CYLINDER" },
    { num: "12310-K0N-D00", name: "COVER COMP CYLINDER HEAD" },
    { num: "11100-K0N-D00", name: "CRANKCASE COMP R" },
    { num: "11200-K0N-D00", name: "CRANKCASE COMP L" },
    { num: "11330-K0N-D00", name: "COVER COMP R CRANKCASE" },
    { num: "11341-K0N-D00", name: "COVER L CRANKCASE" },
    { num: "12100-K2F-N00", name: "CYLINDER COMP" },
    { num: "12200-K2F-N00", name: "HEAD COMP CYLINDER" },
    { num: "12310-K2F-N00", name: "COVER COMP HEAD" },
    { num: "11100-K2F-N00", name: "CRANKCASE COMP R" },
    { num: "11200-K2F-N00", name: "CRANKCASE COMP L" },
    { num: "11330-K2F-N00", name: "COVER COMP R CRANK" },
    { num: "11341-K2F-N00", name: "COVER L CRANKCASE" },
    { num: "13011-K0N-D00", name: "RING SET PISTON" },
    { num: "13101-K0N-D00", name: "PISTON" },
    { num: "14100-K0N-D01", name: "CAMSHAFT COMP" },
    { num: "14401-K0N-D01", name: "CHAIN CAM" },
    { num: "15100-K0N-D00", name: "PUMP ASSY OIL" },
    { num: "16400-K0N-D01", name: "THROTTLE BODY" },
    { num: "22100-K0N-V01", name: "OUTER COMP CLUTCH" },
    { num: "23211-K0N-V00", name: "SHAFT RR AXLE" },
    { num: "23411-K0N-V00", name: "GEAR COUNTER SHAFT" },
    { num: "13011-K2F-N00", name: "RING SET PISTON" },
    { num: "13101-K2F-N00", name: "PISTON" },
    { num: "16400-K2F-N01", name: "THROTTLE BODY" },
    { num: "23211-K1N-V00", name: "SHAFT RR AXLE" },
    { num: "23411-K1N-V00", name: "GEAR COUNTER SHAFT" },
    { num: "23421-K1N-V00", name: "GEAR COUNTER" },
    { num: "23430-K1N-V00", name: "GEAR COMP FINAL" },
    { num: "12100-K1N-V00", name: "CYLINDER COMP" },
    { num: "12200-K1N-V00", name: "HEAD COMP CYLINDER" },
    { num: "22100-K1N-V00", name: "OUTER COMP CLUTCH" },
    { num: "23211-KZR-600", name: "SHAFT RR AXLE" },
    { num: "23411-KZR-600", name: "GEAR COUNTER SHAFT" },
    { num: "12100-KZR-600", name: "CYLINDER COMP" },
    { num: "13011-KZR-600", name: "RING SET PISTON" },
    { num: "13101-KZR-601", name: "PISTON" },
    { num: "23211-K59-A10", name: "SHAFT RR AXLE" },
    { num: "23411-K59-A10", name: "GEAR COUNTER SHAFT" },
    { num: "23421-K59-A10", name: "GEAR COUNTER" },
    { num: "12100-K59-A10", name: "CYLINDER COMP" },
    { num: "12200-K59-A10", name: "HEAD COMP CYLINDER" },
    { num: "13101-K59-A10", name: "PISTON" },
    { num: "12100-K44-V00", name: "CYLINDER COMP" },
    { num: "13101-K44-V00", name: "PISTON" },
    { num: "22100-K44-V00", name: "OUTER COMP CLUTCH" },
    { num: "23211-K44-V00", name: "SHAFT RR AXLE" },
    { num: "23411-K44-V00", name: "GEAR COUNTER SHAFT" },
    { num: "23421-K44-V00", name: "GEAR COUNTER" },
    { num: "23430-K44-V00", name: "GEAR COMP FINAL" }
];

async function cleanAndImport() {
    try {
        const dbP = db.promise();
        console.log("Starting Clean Import of Master Data Parts...");

        // 1. Get PT. AHM ID
        const [custRows] = await dbP.query("SELECT id FROM customers WHERE customer_name LIKE '%AHM%'");
        if (custRows.length === 0) {
            console.error("PT. AHM not found in customers table!");
            process.exit(1);
        }
        const custId = custRows[0].id;

        // 2. Clear relevant tables to ensure "jangan dibedakan isinya" (make it clean)
        await dbP.query("DELETE FROM asset_events");
        await dbP.query("DELETE FROM assets");
        await dbP.query("DELETE FROM forecast_input");
        await dbP.query("DELETE FROM forecast_month");
        await dbP.query("DELETE FROM lead_time");
        await dbP.query("DELETE FROM actual_packaging");
        await dbP.query("DELETE FROM packagings");
        await dbP.query("DELETE FROM part"); // Clear ALL old parts

        // 3. Get a default packaging type
        const [typeRows] = await dbP.query("SELECT id FROM packaging_types LIMIT 1");
        const typeId = typeRows.length > 0 ? typeRows[0].id : 1;

        console.log(`Importing ${fullPartsList.length} parts from the image...`);

        for (const p of fullPartsList) {
            // Insert Part
            const [partRes] = await dbP.query(
                "INSERT INTO part (part_number, part_name, customer_id, qty_per_pack, created_at) VALUES (?, ?, ?, ?, NOW())",
                [p.num, p.name, custId, 1]
            );
            const partId = partRes.insertId;

            // Create associated Packaging
            const pkgName = `PKG-${p.num}`;
            const [pkgRes] = await dbP.query(
                "INSERT INTO packagings (packaging_name, kapasitas_packaging, packaging_type_id, created_at) VALUES (?, ?, ?, NOW())",
                [pkgName, 10, typeId]
            );
            const pkgId = pkgRes.insertId;

            // Setup default data for calculations
            await dbP.query("INSERT INTO lead_time (part_id, lt_production, lt_store, lt_customer, created_at) VALUES (?, 1, 1, 1, NOW())", [partId]);
            await dbP.query("INSERT INTO actual_packaging (part_id, qty_actual, created_at) VALUES (?, 15, NOW())", [partId]);

            // Link one dummy asset so it shows up in "by-customer" logic
            await dbP.query(
                "INSERT INTO assets (rfid_tag, asset_code, packaging_id, part_id, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
                [`TAG-${p.num}`, `AST-${p.num}`, pkgId, partId, 'in']
            );
        }

        console.log("Clean import completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

cleanAndImport();
