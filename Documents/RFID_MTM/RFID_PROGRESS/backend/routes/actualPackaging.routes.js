const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* ========================
   GET ALL ACTUAL
======================== */
router.get("/", auth, (req, res) => {
  const sql = `
    SELECT 
      ap.id,
      ap.part_id,
      p.part_name,
      ap.qty_actual,
      ap.tanggal
    FROM actual_packaging ap
    JOIN part p ON ap.part_id = p.id
    ORDER BY ap.tanggal DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal ambil data actual" });
    }
    res.json(results);
  });
});

/* ========================
   CREATE ACTUAL
======================== */
router.post("/", auth, (req, res) => {
  const { part_id, qty_actual, tanggal } = req.body;

  if (!part_id || !qty_actual || !tanggal) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  const sql = `
    INSERT INTO actual_packaging
    (part_id, qty_actual, tanggal)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [part_id, qty_actual, tanggal], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal simpan actual" });
    }

    res.json({ message: "Actual packaging berhasil ditambahkan" });
  });
});

/* ========================
   GET BY ID
======================== */
router.get("/:id", auth, (req, res) => {
  db.query(
    "SELECT * FROM actual_packaging WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }

      res.json(results[0]);
    }
  );
});

/* ========================
   UPDATE ACTUAL
======================== */
router.put("/:id", auth, (req, res) => {
  const { part_id, qty_actual, tanggal } = req.body;

  if (!part_id || !qty_actual || !tanggal) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  const sql = `
    UPDATE actual_packaging
    SET part_id = ?, qty_actual = ?, tanggal = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [part_id, qty_actual, tanggal, req.params.id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Gagal update actual" });
      }

      res.json({ message: "Actual berhasil diperbarui" });
    }
  );
});

/* ========================
   DELETE ACTUAL
======================== */
router.delete("/:id", auth, (req, res) => {
  db.query(
    "DELETE FROM actual_packaging WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Gagal hapus actual" });
      }

      res.json({ message: "Actual berhasil dihapus" });
    }
  );
});

module.exports = router;
