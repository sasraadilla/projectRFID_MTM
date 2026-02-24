const db = require('./config/db');

const expandedPartsList = [
    // Series K0N (Scoopy/Genio)
    { num: "10101-K0N-D00", name: "GASKET KIT A" },
    { num: "12100-K0N-D00", name: "CYLINDER COMP" },
    { num: "12200-K0N-D00", name: "HEAD COMP CYLINDER" },
    { num: "12310-K0N-D00", name: "COVER COMP CYLINDER HEAD" },
    { num: "11100-K0N-D00", name: "CRANKCASE COMP R" },
    { num: "11200-K0N-D00", name: "CRANKCASE COMP L" },
    { num: "11330-K0N-D00", name: "COVER COMP R CRANKCASE" },
    { num: "11341-K0N-D00", name: "COVER L CRANKCASE" },
    { num: "13011-K0N-D00", name: "RING SET PISTON" },
    { num: "13101-K0N-D00", name: "PISTON" },
    { num: "14100-K0N-D01", name: "CAMSHAFT COMP" },
    { num: "14401-K0N-D01", name: "CHAIN CAM" },
    { num: "14510-K0N-D00", name: "TENSIONER COMP CAM CHAIN" },
    { num: "14520-K0N-D01", name: "LIFTER ASSY TENSIONER" },
    { num: "14611-K0N-D00", name: "GUIDE CAM CHAIN" },
    { num: "14711-K0N-D00", name: "VALVE IN" },
    { num: "14721-K0N-D00", name: "VALVE EX" },
    { num: "15100-K0N-D00", name: "PUMP ASSY OIL" },
    { num: "16400-K0N-D01", name: "THROTTLE BODY" },
    { num: "19210-K0N-V01", name: "IMPELLER COMP WATER PUMP" },
    { num: "22100-K0N-V01", name: "OUTER COMP CLUTCH" },
    { num: "22102-K0N-V00", name: "FACE COMP DRIVE" },
    { num: "23100-K0N-V01", name: "BELT DRIVE" },
    { num: "23211-K0N-V00", name: "SHAFT RR AXLE" },
    { num: "23411-K0N-V00", name: "GEAR COUNTER SHAFT" },
    { num: "23421-K0N-V00", name: "GEAR COUNTER" },
    { num: "23430-K0N-V00", name: "GEAR COMP FINAL" },

    // Series K2F (New Scoopy)
    { num: "10101-K2F-N00", name: "GASKET KIT A" },
    { num: "12100-K2F-N00", name: "CYLINDER COMP" },
    { num: "12200-K2F-N00", name: "HEAD COMP CYLINDER" },
    { num: "12310-K2F-N00", name: "COVER COMP HEAD" },
    { num: "11100-K2F-N00", name: "CRANKCASE COMP R" },
    { num: "11200-K2F-N00", name: "CRANKCASE COMP L" },
    { num: "11330-K2F-N00", name: "COVER COMP R CRANK" },
    { num: "11341-K2F-N00", name: "COVER L CRANKCASE" },
    { num: "13011-K2F-N00", name: "RING SET PISTON" },
    { num: "13101-K2F-N00", name: "PISTON" },
    { num: "14100-K2F-N00", name: "CAMSHAFT COMP" },
    { num: "14401-K2F-N00", name: "CHAIN CAM" },
    { num: "15100-K2F-N00", name: "PUMP ASSY OIL" },
    { num: "16400-K2F-N01", name: "THROTTLE BODY" },

    // Series K1N (Vario 160)
    { num: "10101-K1N-V00", name: "GASKET KIT A" },
    { num: "12100-K1N-V00", name: "CYLINDER COMP" },
    { num: "12200-K1N-V00", name: "HEAD COMP CYLINDER" },
    { num: "22100-K1N-V00", name: "OUTER COMP CLUTCH" },
    { num: "23211-K1N-V00", name: "SHAFT RR AXLE" },
    { num: "23411-K1N-V00", name: "GEAR COUNTER SHAFT" },
    { num: "23421-K1N-V00", name: "GEAR COUNTER" },
    { num: "23430-K1N-V00", name: "GEAR COMP FINAL" },

    // Series KZR (Vario 125 Old)
    { num: "12100-KZR-600", name: "CYLINDER COMP" },
    { num: "12200-KZR-600", name: "HEAD COMP CYLINDER" },
    { num: "13011-KZR-600", name: "RING SET PISTON" },
    { num: "13101-KZR-601", name: "PISTON" },
    { num: "23211-KZR-600", name: "SHAFT RR AXLE" },
    { num: "23411-KZR-600", name: "GEAR COUNTER SHAFT" },
    { num: "23421-KZR-600", name: "GEAR COUNTER" },
    { num: "23430-KZR-600", name: "GEAR COMP FINAL" },

    // Series K59 (Vario 150)
    { num: "12100-K59-A10", name: "CYLINDER COMP" },
    { num: "12200-K59-A10", name: "HEAD COMP CYLINDER" },
    { num: "13101-K59-A10", name: "PISTON" },
    { num: "23211-K59-A10", name: "SHAFT RR AXLE" },
    { num: "23411-K59-A10", name: "GEAR COUNTER SHAFT" },
    { num: "23421-K59-A10", name: "GEAR COUNTER" },

    // Series K44 (BeAT ESP)
    { num: "12100-K44-V00", name: "CYLINDER COMP" },
    { num: "13101-K44-V00", name: "PISTON" },
    { num: "22100-K44-V00", name: "OUTER COMP CLUTCH" },
    { num: "23211-K44-V00", name: "SHAFT RR AXLE" },
    { num: "23411-K44-V00", name: "GEAR COUNTER SHAFT" },
    { num: "23421-K44-V00", name: "GEAR COUNTER" },
    { num: "23430-K44-V00", name: "GEAR COMP FINAL" },

    // Additional items from the long list
    { num: "14401-K0N-D01", name: "CHAIN CAM" },
    { num: "14751-K0N-D00", name: "SPRING VALVE IN" },
    { num: "14752-K0N-D00", name: "SPRING VALVE EX" },
    { num: "15421-K0N-D00", name: "SCREEN OIL FILTER" },
    { num: "15651-K0N-D00", name: "GAUGE OIL LEVEL" },
    { num: "16211-K0N-D00", name: "INSULATOR CARB" },
    { num: "17210-K0N-D00", name: "ELEMENT COMP AIR CLEANER" },
    { num: "18310-K02-N00", name: "MUFFLER COMP" },
    { num: "19100-K0N-D00", name: "RESERVE TANK ASSY" },
    { num: "19215-K0N-D00", name: "SHAFT WATER PUMP" },
    { num: "22101-K0N-V01", name: "CLUTCH CENTER" },
    { num: "22535-K0N-V01", name: "WEIGHT SET CLUTCH" },
    { num: "22350-K0N-V01", name: "PLATE COMP DRIVE" },
    { num: "22401-K0N-V01", name: "SPRING CLUTCH" },
    { num: "23210-K0N-V01", name: "SHAFT COMP DRIVE" },
    { num: "23220-K0N-V01", name: "FACE COMP DRIVEN" },
    { num: "23224-K0N-V01", name: "PIN ROLLER GUIDE" },
    { num: "23233-K0N-V01", name: "SPRING DRIVEN FACE" },
    { num: "23237-K0N-V01", name: "COLLAR SEAL" },
    { num: "23238-K0N-V01", name: "COLLAR SPRING" },
    { num: "23422-K0N-V01", name: "BUSH COUNTER GEAR" },
    { num: "23431-K0N-V01", name: "SHAFT FINAL" },
    { num: "31110-K0N-D01", name: "FLYWHEEL COMP" },
    { num: "31120-K0N-D01", name: "STATOR COMP" },
    { num: "31210-K0N-D02", name: "MOTOR UNIT START" },
    { num: "31916-K0N-D01", name: "PLUG SPARK (MR8K-9)" },
    { num: "32100-K0N-D00", name: "HARNESS WIRE" },
    { num: "38501-K0N-D01", name: "RELAY COMP POWER" },
    { num: "50100-K0N-D00", name: "BODY COMP FRAME" }
];

async function finalCleanImport() {
    try {
        const dbP = db.promise();
        console.log("Starting FINAL Clean Import from Image Data...");

        // 1. Get PT. AHM ID
        const [custRows] = await dbP.query("SELECT id FROM customers WHERE customer_name LIKE '%AHM%'");
        if (custRows.length === 0) {
            console.error("PT. AHM missing!");
            process.exit(1);
        }
        const custId = custRows[0].id;

        // 2. Clear Tables
        await dbP.query("DELETE FROM asset_events");
        await dbP.query("DELETE FROM assets");
        await dbP.query("DELETE FROM forecast_input");
        await dbP.query("DELETE FROM forecast_month");
        await dbP.query("DELETE FROM lead_time");
        await dbP.query("DELETE FROM actual_packaging");
        await dbP.query("DELETE FROM packagings");
        await dbP.query("DELETE FROM part");

        // 3. Get Packaging Type
        const [typeRows] = await dbP.query("SELECT id FROM packaging_types WHERE type_name LIKE '%TROLLEY STEM AHM%' LIMIT 1");
        const typeId = typeRows.length > 0 ? typeRows[0].id : 1;

        console.log(`Importing exact data: ${expandedPartsList.length} items.`);

        for (const p of expandedPartsList) {
            // "Data Product jadi Part Number, Data Product Desc jadi Part Name"
            const [partRes] = await dbP.query(
                "INSERT INTO part (part_number, part_name, customer_id, qty_per_pack, created_at) VALUES (?, ?, ?, ?, NOW())",
                [p.num, p.name, custId, 1]
            );
            const partId = partRes.insertId;

            // Associate Packaging (PKG-PartNumber)
            const pkgName = `PKG-${p.num}`;
            const [pkgRes] = await dbP.query(
                "INSERT INTO packagings (packaging_name, kapasitas_packaging, packaging_type_id, created_at) VALUES (?, ?, ?, NOW())",
                [pkgName, 10, typeId]
            );
            const pkgId = pkgRes.insertId;

            // Mandatory setup for system logic
            await dbP.query("INSERT INTO lead_time (part_id, lt_production, lt_store, lt_customer, created_at) VALUES (?, 1, 1, 1, NOW())", [partId]);
            await dbP.query("INSERT INTO actual_packaging (part_id, qty_actual, created_at) VALUES (?, 15, NOW())", [partId]);
            await dbP.query(
                "INSERT INTO assets (rfid_tag, asset_code, packaging_id, part_id, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
                [`TAG-${p.num}`, `AST-${p.num}`, pkgId, partId, 'in']
            );
        }

        console.log("SUCCESS: All product data from image successfully mapped to system.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

finalCleanImport();
