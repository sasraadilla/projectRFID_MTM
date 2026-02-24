const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* =====================================================
   KPI BOX ATAS
   Total Fasilitas, Di Customer, Di Internal, Repair
===================================================== */
/* =====================================================
   KPI BOX ATAS
   Total Fasilitas, Di Customer, Di Internal, Repair
===================================================== */
router.get("/kpi", (req, res) => {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM assets) as total_asset,
      (SELECT COUNT(*) FROM assets WHERE status = 'out') as di_customer,
      (SELECT COUNT(*) FROM assets WHERE status = 'in') as di_internal,
      (SELECT COUNT(*) FROM assets WHERE status = 'repair') as repair,
      (SELECT 80) as di_customer_target
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

/* =====================================================
   MAIN TABLE DASHBOARD
   Customer | Asset | IN | OUT | Daily | Weekly | MTD
 ===================================================== */
router.get("/table", (req, res) => {
  // Set timezone agar CURDATE() & NOW() sesuai WIB (+07:00)
  db.query("SET time_zone = '+07:00'", (tzErr) => {
    if (tzErr) console.error("Error setting timezone:", tzErr);

    const sql = `
      SELECT 
        c.customer_name as customer,
        pt.type_name as asset,
        -- IN & OUT (Snapshot Status Saat Ini)
        SUM(CASE WHEN a.status = 'in' THEN 1 ELSE 0 END) as \`in\`,
        SUM(CASE WHEN a.status = 'out' THEN 1 ELSE 0 END) as \`out\`,
        
        -- Aktivitas Pergerakan (Deltas via Subquery Aggregation)
        COALESCE(SUM(moves.daily), 0) as daily,
        COALESCE(SUM(moves.weekly), 0) as weekly,
        COALESCE(SUM(moves.mtd), 0) as mtd
      FROM customers c
      JOIN part p ON p.customer_id = c.id
      JOIN assets a ON a.part_id = p.id
      JOIN packagings pkg ON pkg.id = a.packaging_id
      JOIN packaging_types pt ON pt.id = pkg.packaging_type_id
      LEFT JOIN (
        SELECT 
          asset_id,
          SUM(CASE WHEN event_type = 'in' AND DATE(scan_time) = CURDATE() THEN 1 
                   WHEN event_type = 'out' AND DATE(scan_time) = CURDATE() THEN -1 ELSE 0 END) as daily,
          SUM(CASE WHEN event_type = 'in' AND YEARWEEK(scan_time, 1) = YEARWEEK(NOW(), 1) THEN 1 
                   WHEN event_type = 'out' AND YEARWEEK(scan_time, 1) = YEARWEEK(NOW(), 1) THEN -1 ELSE 0 END) as weekly,
          SUM(CASE WHEN event_type = 'in' AND MONTH(scan_time) = MONTH(NOW()) AND YEAR(scan_time) = YEAR(NOW()) THEN 1 
                   WHEN event_type = 'out' AND MONTH(scan_time) = MONTH(NOW()) AND YEAR(scan_time) = YEAR(NOW()) THEN -1 ELSE 0 END) as mtd
        FROM asset_events
        GROUP BY asset_id
      ) moves ON moves.asset_id = a.id
      GROUP BY c.id, pt.id
    `;

    db.query(sql, (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json(rows);
    });
  });
});

/* =====================================================
   DETAIL PER ASSET (untuk klik kartu bawah)
===================================================== */
router.get("/detail/:customer/:asset", auth, (req, res) => {
  const { customer, asset } = req.params;

  const sql = `
    SELECT
      c.customer_name,
      a.asset_code,
      ae.event_type,
      ae.location,
      ae.scan_time,
      d.driver_name as driver,
      v.vehicle_number as vehicle
    FROM asset_events ae
    JOIN assets a ON a.id = ae.asset_id
    JOIN packagings p ON p.id = a.packaging_id
    JOIN packaging_types pt ON pt.id = p.packaging_type_id
    JOIN part prt ON prt.id = a.part_id
    JOIN customers c ON c.id = prt.customer_id
    LEFT JOIN drivers d ON d.id = ae.driver_id
    LEFT JOIN vehicles v ON v.id = ae.vehicle_id
    WHERE pt.type_name = ?
      AND c.customer_name = ?
    ORDER BY ae.scan_time DESC
    LIMIT 100
  `;

  db.query(sql, [asset, customer], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

/* =====================================================
   GRAFIK MTD PER CUSTOMER & ASSET
===================================================== */
router.get("/grafik/:customer/:asset", auth, (req, res) => {
  const { customer, asset } = req.params;

  const sql = `
    SELECT
      DAY(ae.scan_time) AS day,
      SUM(CASE WHEN ae.event_type = 'in' THEN 1 ELSE 0 END) AS \`in\`,
      SUM(CASE WHEN ae.event_type = 'out' THEN 1 ELSE 0 END) AS \`out\`
    FROM asset_events ae
    JOIN assets a ON a.id = ae.asset_id
    JOIN packagings p ON p.id = a.packaging_id
    JOIN packaging_types pt ON pt.id = p.packaging_type_id
    JOIN part prt ON prt.id = a.part_id
    JOIN customers c ON c.id = prt.customer_id
    WHERE
      pt.type_name = ?
      AND c.customer_name = ?
      AND MONTH(ae.scan_time) = MONTH(NOW())
      AND YEAR(ae.scan_time) = YEAR(NOW())
    GROUP BY DAY(ae.scan_time)
    ORDER BY day
  `;

  db.query(sql, [asset, customer], (err, rows) => {
    if (err) {
      console.error("Error mengambil grafik:", err);
      return res.status(500).json({ message: "Gagal mengambil data grafik", error: err });
    }

    // Pastikan semua value angka
    const formatted = rows.map(r => ({
      day: Number(r.day),
      in: Number(r.in),
      out: Number(r.out),
    }));

    res.json(formatted);
  });
});



module.exports = router;
