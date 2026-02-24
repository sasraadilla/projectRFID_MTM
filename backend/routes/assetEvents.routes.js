const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* =========================
   GET ALL ASSET EVENTS
========================= */
router.get("/", auth, (req, res) => {
  const sql = `
    SELECT
      ae.id,
      ae.event_type,
      ae.location,
      ae.scan_time,

      a.rfid_tag,
      a.asset_code,

      p.part_number,
      p.part_name,

      pk.packaging_name,

      r.reader_code,
      r.reader_name,

      u.name AS scanned_by_name

    FROM asset_events ae
    JOIN assets a ON ae.asset_id = a.id
    JOIN part p ON a.part_id = p.id
    JOIN packagings pk ON a.packaging_id = pk.id
    JOIN readers r ON ae.reader_id = r.id
    JOIN users u ON ae.scanned_by = u.id

    ORDER BY ae.scan_time DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Gagal mengambil data asset event" });
    }
    res.json(results);
  });
});

/* =========================
   SCAN ASSET (IN / OUT)
========================= */
router.post("/scan", auth, (req, res) => {
  const { rfid_tag, reader_id } = req.body;
  const scanned_by = req.user.id;

  if (!rfid_tag || !reader_id) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  /* =========================
     1. CARI ASSET
  ========================= */
  db.query(
    "SELECT * FROM assets WHERE rfid_tag = ?",
    [rfid_tag],
    (err, assetRows) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (assetRows.length === 0) {
        return res.status(404).json({ message: "Asset tidak ditemukan" });
      }

      const asset = assetRows[0];

      /* =========================
         2. CARI READER
      ========================= */
      db.query(
        "SELECT * FROM readers WHERE id = ?",
        [reader_id],
        (err, readerRows) => {
          if (err) return res.status(500).json({ message: "Server error" });
          if (readerRows.length === 0) {
            return res.status(404).json({ message: "Reader tidak ditemukan" });
          }

          const reader = readerRows[0];

          /* =========================
             3. TENTUKAN EVENT TYPE
          ========================= */
          const event_type = asset.status === "in" ? "out" : "in";

          /* =========================
             4. INSERT ASSET EVENT
          ========================= */
          const insertSql = `
            INSERT INTO asset_events
            (asset_id, reader_id, event_type, location, driver_id, vehicle_id, scanned_by, scan_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
          `;

          db.query(
            insertSql,
            [
              asset.id,
              reader.id,
              event_type,
              reader.location,
              0, // driver_id (belum dipakai)
              0, // vehicle_id (belum dipakai)
              scanned_by,
            ],
            (err) => {
              if (err) {
                console.error(err);
                return res
                  .status(500)
                  .json({ message: "Gagal menyimpan asset event" });
              }

              /* =========================
                 5. UPDATE STATUS ASSET
              ========================= */
              db.query(
                "UPDATE assets SET status = ? WHERE id = ?",
                [event_type, asset.id],
                (err) => {
                  if (err) {
                    console.error(err);
                    return res
                      .status(500)
                      .json({ message: "Gagal update status asset" });
                  }

                  res.json({
                    message: `Asset berhasil ${event_type.toUpperCase()}`,
                    asset_code: asset.asset_code,
                    event_type,
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

module.exports = router;
