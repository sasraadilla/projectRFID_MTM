const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* =========================
   GET ALL ASSETS
========================= */
router.get("/", auth, (req, res) => {
  const sql = `
    SELECT 
      a.id,
      a.rfid_tag,
      a.asset_code,
      a.status,
      a.created_at,
      p.part_number,
      p.part_name,
      pk.packaging_name
    FROM assets a
    JOIN part p ON a.part_id = p.id
    JOIN packagings pk ON a.packaging_id = pk.id
    ORDER BY a.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal mengambil data asset" });
    }
    res.json(results);
  });
});

/* =========================
   GET ASSET BY ID
========================= */
router.get("/:id", auth, (req, res) => {
  const sql = `
    SELECT *
    FROM assets
    WHERE id = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length === 0) {
      return res.status(404).json({ message: "Asset tidak ditemukan" });
    }
    res.json(results[0]);
  });
});

/* =========================
   CREATE ASSET
========================= */
router.post("/", auth, (req, res) => {
  const {
    rfid_tag,
    asset_code,
    packaging_id,
    part_id,
    status
  } = req.body;

  if (!rfid_tag || !asset_code || !packaging_id || !part_id || !status) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  // cek RFID unik
  db.query(
    "SELECT id FROM assets WHERE rfid_tag = ?",
    [rfid_tag],
    (err, exists) => {
      if (exists.length > 0) {
        return res.status(400).json({ message: "RFID sudah digunakan" });
      }

      const sql = `
        INSERT INTO assets 
        (rfid_tag, asset_code, packaging_id, part_id, status, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;

      db.query(
        sql,
        [rfid_tag, asset_code, packaging_id, part_id, status],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Gagal menambah asset" });
          }
          res.json({ message: "Asset berhasil ditambahkan" });
        }
      );
    }
  );
});

/* =========================
   UPDATE ASSET
========================= */
router.put("/:id", auth, (req, res) => {
  const {
    rfid_tag,
    asset_code,
    packaging_id,
    part_id,
    status
  } = req.body;

  const { id } = req.params;

  // cek RFID tidak boleh sama milik asset lain
  db.query(
    "SELECT id FROM assets WHERE rfid_tag = ? AND id != ?",
    [rfid_tag, id],
    (err, exists) => {
      if (exists.length > 0) {
        return res.status(400).json({ message: "RFID sudah digunakan asset lain" });
      }

      const sql = `
        UPDATE assets SET
          rfid_tag = ?,
          asset_code = ?,
          packaging_id = ?,
          part_id = ?,
          status = ?
        WHERE id = ?
      `;

      db.query(
        sql,
        [rfid_tag, asset_code, packaging_id, part_id, status, id],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Gagal update asset" });
          }
          res.json({ message: "Asset berhasil diperbarui" });
        }
      );
    }
  );
});

/* =========================
   DELETE ASSET
========================= */
router.delete("/:id", auth, (req, res) => {
  db.query(
    "DELETE FROM assets WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Gagal menghapus asset" });
      }
      res.json({ message: "Asset berhasil dihapus" });
    }
  );
});

module.exports = router;
