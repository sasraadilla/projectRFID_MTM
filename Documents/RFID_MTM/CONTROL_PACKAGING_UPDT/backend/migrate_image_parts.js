const db = require('./config/db');

const partsToImport = [
    { num: "MFMSTR-FHFD14N000", name: "HUB FRONT, AXLE D14N" },
    { num: "MFMSTR-FHFD34T000", name: "HUB SUB-ASSY, FRONT AXLE D34T" },
    { num: "MFMSTR-FHFD80N000", name: "HUB FRONT, AXLE D80N" },
    { num: "MFMSTR-FSPD40L000", name: "SPINDLE SUB-ASSY, STRG KNUCKLE D40L" },
    { num: "MFMSTR-FSPD40L00A", name: "SPINDLE, STRG KNUCKLE D40L (PAINTED)" },
    { num: "MJPAJA-F00D03BEX1", name: "PANTOGRAPH JACK, D03B (EXPORT)" },
    { num: "MJPAJA-F00D14N000", name: "PANTOGRAPH JACK, D14N" },
    { num: "MJPAJA-F00D14NEX0", name: "PANTOGRAPH JACK, D14N (EXPORT)" },
    { num: "MJPAJA-F00D30D000", name: "PANTOGRAPH JACK, D30D" },
    { num: "MJPAJA-F00D40GL00", name: "PANTOGRAPH JACK, D40GL" },
    { num: "MJPAJA-F00D40L000", name: "PANTOGRAPH JACK, D40L" },
    { num: "MJPAJA-F00D55L000", name: "PANTOGRAPH JACK, D55L" },
    { num: "MTHAND-CRDD80N000", name: "ROD HANDLE, D80N (PLATTED)" },
    { num: "MTTOOL-F00D14N000", name: "TOOL SET, D14N" },
    { num: "MTTOOL-F00D40L000", name: "TOOL SET, D40L" },
    { num: "MTTOOL-F00D80N000", name: "TOOL SET, D80N" },
    { num: "MTTOOL-F00ST1100B", name: "TOOL SET, (STD) 110 D40G" },
    { num: "MTTOOL-FCVD40G00A", name: "COVER JACK, D40G" },
    { num: "MTTOOL-FCVD40L00A", name: "COVER JACK, D40L" },
    { num: "MTTOOL-FSPD40G00A", name: "SUPPORT JACK, D40G" },
    { num: "MTTOOL-SCO2RHBD8A", name: "TIRE WRENCH, 21 REH D80N (COATED)" },
    { num: "MFMRAE-F00X10000A", name: "RACK END, STEERING X1000" },
    { num: "MFMSTR-FHFD40L000", name: "HUB FRONT, AXLE D40L" },
    { num: "MJPAJA-F00D16DNW0", name: "PANTOGRAPH JACK, NEW D16D" },
    { num: "MJPAJA-F00D17D000", name: "PANTOGRAPH JACK, D17D" },
    { num: "MJPAJA-F00D22D000", name: "PANTOGRAPH JACK, D22D" },
    { num: "MJPAJA-F00D80N000", name: "PANTOGRAPH JACK, D80N" },
    { num: "MTBAGG-CTBD14N000", name: "BAG, TOOL D14N" },
    { num: "MTPAJA-SASD14NHD0", name: "HANDLE, PJ D14N (ASSY)" },
    { num: "MTPAJA-SASD28GHDA", name: "HANDLE, PJ D28G" },
    { num: "MTPAJA-SASD40GHDA", name: "HANDLE, PJ D40G" },
    { num: "MTPAJA-SASX620HDA", name: "HANDLE, PJ X620 (ASSY)" }
];

async function migrateParts() {
    try {
        const dbP = db.promise();
        console.log("Starting Migration of Parts from Image...");

        // 1. Get Customer ID for PT. AHM
        const [custRows] = await dbP.query("SELECT id FROM customers WHERE customer_name LIKE '%AHM%' LIMIT 1");
        let customerId;
        if (custRows.length > 0) {
            customerId = custRows[0].id;
            console.log(`Using customer ID ${customerId} (PT. AHM)`);
        } else {
            const [allCusts] = await dbP.query("SELECT id FROM customers LIMIT 1");
            if (allCusts.length === 0) {
                console.error("No customers found in database. Please add a customer first.");
                process.exit(1);
            }
            customerId = allCusts[0].id;
            console.log(`PT. AHM not found. Using first available customer ID: ${customerId}`);
        }

        let insertedCount = 0;
        let skippedCount = 0;

        for (const p of partsToImport) {
            // Check if part already exists
            const [existing] = await dbP.query("SELECT id FROM part WHERE part_number = ?", [p.num]);

            if (existing.length === 0) {
                // Insert new part
                await dbP.query(
                    "INSERT INTO part (part_number, part_name, customer_id, qty_per_pack, created_at) VALUES (?, ?, ?, ?, NOW())",
                    [p.num, p.name, customerId, 1]
                );
                insertedCount++;
            } else {
                skippedCount++;
            }
        }

        console.log(`Migration completed.`);
        console.log(`Total Parts Processed: ${partsToImport.length}`);
        console.log(`Inserted: ${insertedCount}`);
        console.log(`Skipped (already exist): ${skippedCount}`);

        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrateParts();
