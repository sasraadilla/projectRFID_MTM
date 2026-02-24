const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* =========================
   TRACKING LIST
   Schema assets: id, rfid_tag, asset_code, packaging_id, part_id, customer_id,
                  status, location, created_at, updated_at, deleted_at
   Schema asset_events: id, asset_id, reader_id, event_type, location,
                        customer_id, driver_id, vehicle_id, scanned_by, scan_time, notes
========================= */
router.get("/", auth, (req, res) => {
  const sql = `
    SELECT
      a.id,
      a.asset_code,
      a.rfid_tag,
      a.status,
      a.location                                   AS last_location,

      COALESCE(p.part_number, '-')                  AS part_number,
      COALESCE(p.part_name,   '-')                  AS part_name,

      COALESCE(c.customer_code, '-')                AS customer_code,
      COALESCE(c.customer_name, 'INTERNAL')         AS customer_name,

      pk.packaging_name,
      COALESCE(pt.type_name, '-')                   AS packaging_type,

      ae.event_type,
      ae.location                                   AS last_scan_location,
      ae.scan_time                                  AS last_scan

    FROM assets a
    LEFT JOIN part            p  ON a.part_id           = p.id
    LEFT JOIN customers       c  ON a.customer_id        = c.id
    JOIN  packagings          pk ON a.packaging_id       = pk.id
    LEFT JOIN packaging_types pt ON pk.packaging_type_id = pt.id
    LEFT JOIN asset_events    ae ON ae.id = (
      SELECT id FROM asset_events
      WHERE asset_id = a.id
      ORDER BY scan_time DESC
      LIMIT 1
    )

    WHERE a.deleted_at IS NULL

    ORDER BY a.asset_code ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("GET /tracking error:", err.message);
      return res.status(500).json({ message: "Gagal mengambil data tracking", detail: err.message });
    }
    res.json(results);
  });
});

/* =========================
   TRACKING DETAIL – riwayat scan satu asset
   asset_events.customer_id → nama customer saat scan
========================= */
router.get("/:asset_code", auth, (req, res) => {
  const { asset_code } = req.params;

  const sql = `
    SELECT
      ae.id,
      ae.event_type,
      ae.location,
      ae.scan_time,
      ae.notes,

      r.reader_name,
      r.reader_code,

      COALESCE(u.name, '-')           AS scanned_by,
      COALESCE(c.customer_name, '-')  AS customer_name,
      COALESCE(d.driver_name,   '-')  AS driver_name,
      COALESCE(v.plate_number,  '-')  AS plate_number

    FROM asset_events     ae
    JOIN  assets          a  ON ae.asset_id   = a.id
    JOIN  readers         r  ON ae.reader_id  = r.id
    LEFT JOIN users       u  ON ae.scanned_by = u.id
    LEFT JOIN customers   c  ON ae.customer_id = c.id
    LEFT JOIN drivers     d  ON ae.driver_id  = d.id
    LEFT JOIN vehicles    v  ON ae.vehicle_id  = v.id

    WHERE a.asset_code = ? AND a.deleted_at IS NULL
    ORDER BY ae.scan_time DESC
  `;

  db.query(sql, [asset_code], (err, results) => {
    if (err) {
      console.error("GET /tracking/:code error:", err.message);
      return res.status(500).json({ message: "Gagal mengambil detail tracking", detail: err.message });
    }
    res.json(results);
  });
});

module.exports = router;
