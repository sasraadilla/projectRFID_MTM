const db = require('./config/db');

const types = [
    "TROLLEY STEM AHM",
    "TROLLEY STEM UBC",
    "TROLLEY BIRU",
    "DOLLY CRANK SHAFT",
    "DOLLY HPM",
    "PALLET BIRU KYB",
    "PALLET BESI",
    "MESH PALLET",
    "PETI KAYU",
    "POLYBOX"
];

const matrix = [
    { name: "PT. ADM", types: ["MESH PALLET", "POLYBOX"] },
    { name: "PT. AHM", types: ["TROLLEY STEM AHM"] },
    { name: "PT. AFI", types: ["PALLET BESI"] },
    { name: "PT. AISIN", types: ["POLYBOX"] },
    { name: "PT. ATI", types: ["MESH PALLET"] },
    { name: "PT. DNIA", types: [] },
    { name: "PT. FIM", types: ["POLYBOX"] },
    { name: "PT. HMMI", types: [] },
    { name: "PT. HPM", types: ["DOLLY HPM", "POLYBOX"] },
    { name: "PT. IAMI", types: ["POLYBOX"] },
    { name: "PT. IGP", types: ["PALLET BESI", "POLYBOX"] },
    { name: "PT. JBI", types: ["MESH PALLET"] },
    { name: "PT. KOYAMA", types: ["POLYBOX"] },
    { name: "PT. KTB", types: [] },
    { name: "PT. KUBOTA", types: ["POLYBOX"] },
    { name: "PT. KAYABA", types: ["TROLLEY STEM UBC", "PALLET BIRU KYB"] },
    { name: "PT. MKM", types: ["MESH PALLET"] },
    { name: "PT. MMKI", types: ["POLYBOX"] },
    { name: "PT. OTICS", types: ["POLYBOX"] },
    { name: "PT. PAMA PERSADA", types: [] },
    { name: "PT. SAPURA", types: ["PETI KAYU"] },
    { name: "PT. SUZUKI", types: ["POLYBOX"] },
    { name: "PT. TACI", types: ["POLYBOX"] },
    { name: "PT. TAM", types: ["POLYBOX"] },
    { name: "PT. TMMIN", types: ["MESH PALLET", "POLYBOX"] },
    { name: "PT. TTI", types: ["POLYBOX"] },
    { name: "PT. TVS", types: ["POLYBOX"] },
    { name: "PT. UD AMI", types: ["POLYBOX"] },
    { name: "PT. VELASTO", types: ["PETI KAYU"] },
    { name: "PT. YASUNAGA", types: ["POLYBOX"] }
];

async function setupMatrix() {
    try {
        const dbP = db.promise();
        console.log("Cleaning up and starting master data setup...");

        // 1. Clear existing data to avoid confusion
        await dbP.query("DELETE FROM asset_events");
        await dbP.query("DELETE FROM assets");
        await dbP.query("DELETE FROM packagings");
        await dbP.query("DELETE FROM part");
        await dbP.query("DELETE FROM packaging_types");

        // 2. Insert Packaging Types
        const typeIds = {};
        for (const t of types) {
            const [res] = await dbP.query("INSERT INTO packaging_types (type_name, created_at) VALUES (?, NOW())", [t]);
            typeIds[t] = res.insertId;
            console.log(`Created type: ${t}`);
        }

        let assetCounter = 1;

        for (const item of matrix) {
            const [custRows] = await dbP.query("SELECT id FROM customers WHERE customer_name = ?", [item.name]);
            if (custRows.length === 0) {
                console.warn(`Customer not found: ${item.name}`);
                continue;
            }
            const custId = custRows[0].id;

            for (const tName of item.types) {
                const typeId = typeIds[tName];

                // Create a Part for this customer + asset type
                const partName = `${tName} - ${item.name}`;
                const partNum = `P-${custId}-${typeId}`;
                const [partRes] = await dbP.query(
                    "INSERT INTO part (part_number, part_name, customer_id, qty_per_pack, keterangan, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
                    [partNum, partName, custId, 1, 'Matrix Data']
                );
                const partId = partRes.insertId;

                // Create a Packaging record
                const pkgName = `PKG-${partName}`;
                const [pkgRes] = await dbP.query(
                    "INSERT INTO packagings (packaging_name, kapasitas_packaging, packaging_type_id, warna, created_at) VALUES (?, ?, ?, ?, NOW())",
                    [pkgName, 1, typeId, 'Grey']
                );
                const pkgId = pkgRes.insertId;

                // Create an Initial Asset (10 units each for better visual)
                for (let j = 0; j < 10; j++) {
                    const assetCode = `AST-${String(assetCounter++).padStart(5, '0')}`;
                    const rfId = `TAG-${assetCode}`;
                    await dbP.query(
                        "INSERT INTO assets (rfid_tag, asset_code, packaging_id, part_id, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
                        [rfId, assetCode, pkgId, partId, 'in']
                    );
                }
            }
        }

        console.log("Matrix data setup completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

setupMatrix();
