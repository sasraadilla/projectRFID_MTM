const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* =====================================================
   KPI BOX ATAS
   Total Fasilitas, Di Customer, Di Internal, Repair
===================================================== */
router.get("/kpi", auth, (req, res) => {
  const qTotal = `SELECT COUNT(*) AS total FROM assets`;

  const qCustomer = `
    SELECT COUNT(*) AS total
    FROM asset_events
    WHERE event_type = 'out'
  `;

  const qInternal = `
    SELECT COUNT(*) AS total
    FROM asset_events
    WHERE event_type = 'in'
  `;

  const qRepair = `
    SELECT COUNT(*) AS total
    FROM repairs
    WHERE status = 'ongoing'
  `;

  db.query(qTotal, (err, total) => {
    if (err) return res.status(500).json(err);

    db.query(qCustomer, (err, customer) => {
      if (err) return res.status(500).json(err);

      db.query(qInternal, (err, internal) => {
        if (err) return res.status(500).json(err);

        db.query(qRepair, (err, repair) => {
          if (err) return res.status(500).json(err);

          res.json({
            total_asset: total[0].total,
            di_customer: customer[0].total,
            di_internal: internal[0].total,
            di_total: Number(customer[0].total) + Number(internal[0].total),
            repair: repair[0].total,
          });
        });
      });
    });
  });
});

/* =====================================================
   MAIN TABLE DASHBOARD
   Customer | Asset | IN | OUT | Daily | Weekly | MTD
===================================================== */
router.get("/table", auth, (req, res) => {
  const sql = `
    SELECT
      c.customer_name AS customer,
      pt.type_name AS asset,

      SUM(CASE WHEN ae.event_type = 'in' THEN 1 ELSE 0 END) AS in_count,
      SUM(CASE WHEN ae.event_type = 'out' THEN 1 ELSE 0 END) AS out_count,

      SUM(CASE 
        WHEN DATE(ae.scan_time) = CURDATE() 
        THEN IF(ae.event_type='in',1,-1) 
        ELSE 0 
      END) AS daily,

      SUM(CASE 
        WHEN ae.scan_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
        THEN IF(ae.event_type='in',1,-1) 
        ELSE 0 
      END) AS weekly,

      SUM(IF(ae.event_type='in',1,-1)) AS mtd

    FROM asset_events ae
    JOIN assets a ON a.id = ae.asset_id
    JOIN packagings p ON p.id = a.packaging_id
    JOIN packaging_types pt ON pt.id = p.packaging_type_id
    JOIN part prt ON prt.id = a.part_id
    JOIN customers c ON c.id = prt.customer_id

    GROUP BY c.customer_name, pt.type_name
    ORDER BY c.customer_name, pt.type_name
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);

    const result = rows.map((r) => ({
      customer: r.customer,
      asset: r.asset,
      in: r.in_count,
      out: r.out_count,
      daily: r.daily,
      weekly: r.weekly,
      mtd: r.mtd,
    }));

    res.json(result);
  });
});

router.get("/detail/:asset", auth, (req, res) => {
  const { asset } = req.params;

  const sql = `
    SELECT
      c.customer_name,
      a.asset_code,
      ae.event_type,
      ae.location AS physical_location,
      CASE
        WHEN ae.location IN ('Warehouse IN', 'Quality Control')
          THEN 'PRODUKSI'
        WHEN ae.location IN ('Area Loading')
          THEN 'STORE_FG'
        WHEN ae.location IN ('Area Unloading')
          THEN 'CUSTOMER'
        ELSE 'UNKNOWN'
      END AS logical_location,
      ae.scan_time
    FROM asset_events ae
    JOIN assets a ON a.id = ae.asset_id
    JOIN packagings p ON p.id = a.packaging_id
    JOIN packaging_types pt ON pt.id = p.packaging_type_id
    JOIN part prt ON prt.id = a.part_id
    JOIN customers c ON c.id = prt.customer_id
    WHERE pt.type_name = ?
    ORDER BY ae.scan_time DESC
  `;

  db.query(sql, [asset], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});


/* =====================================================
   DETAIL PER ASSET (untuk klik kartu bawah)
===================================================== */
router.get("/tabelgrafik/:customer/:asset", auth, (req, res) => {
  const { customer, asset } = req.params;

  const sql = `
    SELECT
      c.customer_name,
      a.asset_code,
      ae.event_type,
      ae.location,
      ae.scan_time
    FROM asset_events ae
    JOIN assets a ON a.id = ae.asset_id
    JOIN packagings p ON p.id = a.packaging_id
    JOIN packaging_types pt ON pt.id = p.packaging_type_id
    JOIN part prt ON prt.id = a.part_id
    JOIN customers c ON c.id = prt.customer_id
    WHERE pt.type_name = ?
    AND c.customer_name = ?
    AND ae.scan_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    ORDER BY ae.scan_time DESC
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
      AND ae.scan_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY DAY(ae.scan_time)
    ORDER BY day
  `;

  db.query(sql, [asset, customer], (err, rows) => {
    if (err) {
      console.error("Error mengambil grafik:", err);
      return res.status(500).json({ message: "Gagal mengambil data grafik", error: err });
    }

    const formatted = rows.map(r => ({
      day: Number(r.day),
      in: Number(r.in),
      out: Number(r.out),
    }));

    res.json(formatted);
  });
});




module.exports = router;
