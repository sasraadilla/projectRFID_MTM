const db = require('./config/db');

const partsData = [
    { num: "12100-K0N-D00", name: "CYLINDER COMP" },
    { num: "12200-K0N-D00", name: "HEAD COMP CYLINDER" },
    { num: "13011-K0N-D00", name: "RING SET PISTON" },
    { num: "13101-K0N-D00", name: "PISTON" },
    { num: "14100-K0N-D01", name: "CAMSHAFT COMP" },
    { num: "23211-K0N-V00", name: "SHAFT RR AXLE" },
    { num: "23411-K0N-V00", name: "GEAR COUNTER SHAFT" },
    { num: "22100-K0N-V01", name: "OUTER COMP CLUTCH" },
    { num: "50100-K2F-N00", name: "BODY COMP FRAME" },
    { num: "12100-K2F-N00", name: "CYLINDER COMP" },
    { num: "12200-K2F-N00", name: "HEAD COMP CYLINDER" },
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
    { num: "23421-KZR-600", name: "GEAR COUNTER" },
    { num: "23430-KZR-600", name: "GEAR COMP FINAL" },
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

async function importParts() {
    try {
        const dbP = db.promise();
        console.log("Starting Part Import for PT. AHM...");

        const customerId = 2; // PT. AHM

        // Get packaging type ID for PT. AHM
        const [typeRows] = await dbP.query("SELECT id FROM packaging_types WHERE type_name = 'TROLLEY STEM AHM'");
        const typeId = typeRows.length > 0 ? typeRows[0].id : 1;

        for (const p of partsData) {
            // Check if part number already exists
            const [existing] = await dbP.query("SELECT id FROM part WHERE part_number = ?", [p.num]);

            let partId;
            if (existing.length > 0) {
                partId = existing[0].id;
                await dbP.query("UPDATE part SET part_name = ?, customer_id = ? WHERE id = ?", [p.name, customerId, partId]);
                console.log(`Updated: ${p.num}`);
            } else {
                const [res] = await dbP.query(
                    "INSERT INTO part (part_number, part_name, customer_id, created_at) VALUES (?, ?, ?, NOW())",
                    [p.num, p.name, customerId]
                );
                partId = res.insertId;
                console.log(`Inserted: ${p.num}`);
            }

            // Also create/update associated packaging for forecast logic
            const pkgName = `PKG-${p.num}`;
            const [pkgExisting] = await dbP.query("SELECT id FROM packagings WHERE packaging_name = ?", [pkgName]);

            let pkgId;
            if (pkgExisting.length > 0) {
                pkgId = pkgExisting[0].id;
                await dbP.query("UPDATE packagings SET packaging_type_id = ? WHERE id = ?", [typeId, pkgId]);
            } else {
                const [pkgRes] = await dbP.query(
                    "INSERT INTO packagings (packaging_name, kapasitas_packaging, packaging_type_id, created_at) VALUES (?, ?, ?, NOW())",
                    [pkgName, 10, typeId]
                );
                pkgId = pkgRes.insertId;
            }

            // Ensure Lead Time and Actual data exists for calculations
            const [ltExist] = await dbP.query("SELECT id FROM lead_time WHERE part_id = ?", [partId]);
            if (ltExist.length === 0) {
                await dbP.query("INSERT INTO lead_time (part_id, lt_production, lt_store, lt_customer, created_at) VALUES (?, 1, 1, 1, NOW())", [partId]);
            }

            const [actExist] = await dbP.query("SELECT id FROM actual_packaging WHERE part_id = ?", [partId]);
            if (actExist.length === 0) {
                await dbP.query("INSERT INTO actual_packaging (part_id, qty_actual, created_at) VALUES (?, 10, NOW())", [partId]);
            }
        }

        console.log("Import completed!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

importParts();
