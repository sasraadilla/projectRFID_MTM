const db = require('./config/db');

const newCustomers = [
    "PT. ADM", "PT. AHM", "PT. AFI", "PT. AISIN", "PT. ATI", "PT. DNIA",
    "PT. FIM", "PT. HMMI", "PT. HPM", "PT. IAMI", "PT. IGP", "PT. JBI",
    "PT. KOYAMA", "PT. KTB", "PT. KUBOTA", "PT. KAYABA", "PT. MKM", "PT. MMKI",
    "PT. OTICS", "PT. PAMA PERSADA", "PT. SAPURA", "PT. SUZUKI", "PT. TACI",
    "PT. TAM", "PT. TMMIN", "PT. TTI", "PT. TVS", "PT. UD AMI", "PT. VELASTO",
    "PT. YASUNAGA"
];

async function updateCustomers() {
    try {
        // 1. Get current customers to see how many we need to update vs insert
        const [current] = await db.promise().query("SELECT id FROM customers ORDER BY id");

        // 2. Update existing ones first to preserve FK integrity
        for (let i = 0; i < current.length; i++) {
            if (i < newCustomers.length) {
                await db.promise().query("UPDATE customers SET customer_name = ? WHERE id = ?", [newCustomers[i], current[i].id]);
                console.log(`Updated ID ${current[i].id} to ${newCustomers[i]}`);
            }
        }

        // 3. Insert remaining ones
        if (newCustomers.length > current.length) {
            const remaining = newCustomers.slice(current.length);
            for (const name of remaining) {
                const code = (1120 + newCustomers.indexOf(name)).toString(); // Generic codes starting from 1120
                await db.promise().query("INSERT INTO customers (customer_code, customer_name) VALUES (?, ?)", [code, name]);
                console.log(`Inserted ${name}`);
            }
        }

        // 4. If there are more current than new (unlikely here but for safety), we could delete but let's just leave them or rename to '-'
        if (current.length > newCustomers.length) {
            for (let i = newCustomers.length; i < current.length; i++) {
                await db.promise().query("DELETE FROM customers WHERE id = ?", [current[i].id]);
                console.log(`Deleted surplus ID ${current[i].id}`);
            }
        }

        console.log("Customer list updated successfully!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateCustomers();
