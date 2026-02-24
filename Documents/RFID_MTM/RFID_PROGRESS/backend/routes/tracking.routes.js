const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* =========================
   TRACKING LIST (SUMMARY)
========================= */
router.get("/", auth, (req, res) => {
  const sql = `
    SELECT
      a.id,
      a.asset_code,
      a.rfid_tag,
      a.status,

      p.part_number,
      p.part_name,

      c.customer_code,
      c.customer_name,

      pk.packaging_name,

      ae.event_type,
      ae.location,
      ae.scan_time

    FROM assets a
    JOIN part p ON a.part_id = p.id
    JOIN customers c ON p.customer_id = c.id
    JOIN packagings pk ON a.packaging_id = pk.id

    LEFT JOIN asset_events ae ON ae.id = (
      SELECT id FROM asset_events
      WHERE asset_id = a.id
      ORDER BY scan_time DESC
      LIMIT 1
    )

    ORDER BY ae.scan_time DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal mengambil data tracking" });
    }
    res.json(results);
  });
});


/* =========================
   TRACKING DETAIL (HISTORY)
========================= */
router.get("/:asset_code", auth, (req, res) => {
  const { asset_code } = req.params;

  const sql = `
    SELECT
      ae.event_type,
      ae.location,
      ae.scan_time,

      r.reader_name,
      u.name AS scanned_by
    FROM asset_events ae
    JOIN assets a ON ae.asset_id = a.id
    JOIN readers r ON ae.reader_id = r.id
    JOIN users u ON ae.scanned_by = u.id
    WHERE a.asset_code = ?
    ORDER BY ae.scan_time DESC
  `;

  db.query(sql, [asset_code], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal mengambil detail tracking" });
    }
    res.json(results);
  });
});


module.exports = router;
