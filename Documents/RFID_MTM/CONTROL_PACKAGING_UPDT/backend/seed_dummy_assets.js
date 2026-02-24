const db = require('./config/db');

async function seedAssets() {
    try {
        const dbP = db.promise();

        // Get a part and packaging
        const [parts] = await dbP.query("SELECT id FROM part LIMIT 1");
        const [packagings] = await dbP.query("SELECT id FROM packagings LIMIT 1");
        if (parts.length === 0 || packagings.length === 0) {
            console.log("Please ensure there is at least one part and one packaging in the DB.");
            process.exit(1);
        }
        const partId = parts[0].id;
        const pkgId = packagings[0].id;

        console.log(`Using part_id: ${partId}, packaging_id: ${pkgId}`);

        // Create 10 dummy assets
        for (let i = 1; i <= 10; i++) {
            const assetCode = `DUMMY-AST-${i.toString().padStart(3, '0')}`;
            const rfId = `DUMMY-TAG-${i.toString().padStart(3, '0')}`;

            // try to insert, ignore if duplicates for some reason
            await dbP.query(
                "INSERT IGNORE INTO assets (rfid_tag, asset_code, packaging_id, part_id, status, created_at) VALUES (?, ?, ?, ?, 'in', NOW())",
                [rfId, assetCode, pkgId, partId]
            );
            console.log(`Inserted asset ${assetCode}`);
        }

        console.log("Dummy assets seeded successfully.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedAssets();
