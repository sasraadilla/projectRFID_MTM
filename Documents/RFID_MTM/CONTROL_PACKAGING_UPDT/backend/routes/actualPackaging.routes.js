const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* ========================
   GET ALL ACTUAL PACKAGING
   Schema: id, part_id, qty_actual, tanggal, created_at, updated_at
======================== */
router.get("/", auth, (req, res) => {
  const sql = `
    SELECT
      ap.id,
      ap.part_id,
      COALESCE(p.part_number, '-') AS part_number,
      COALESCE(p.part_name,   '-') AS part_name,
      COALESCE(c.customer_name, '-') AS customer_name,
      ap.qty_actual,
      ap.tanggal,
      ap.created_at
    FROM actual_packaging ap
    LEFT JOIN part        p ON ap.part_id    = p.id
    LEFT JOIN customers   c ON p.customer_id = c.id
    ORDER BY ap.tanggal DESC, ap.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("GET /actual-packaging error:", err.message);
      return res.status(500).json({ message: "Gagal ambil data actual", detail: err.message });
    }
    res.json(results);
  });
});

/* ========================
   CREATE ACTUAL PACKAGING
======================== */
router.post("/", auth, (req, res) => {
  const { part_id, qty_actual, tanggal } = req.body;

  if (!part_id || !qty_actual || !tanggal) {
    return res.status(400).json({ message: "Data tidak lengkap (part_id, qty_actual, tanggal wajib)" });
  }

  db.query(
    `INSERT INTO actual_packaging (part_id, qty_actual, tanggal, created_at, updated_at)
     VALUES (?, ?, ?, NOW(), NOW())`,
    [part_id, qty_actual, tanggal],
    (err, result) => {
      if (err) {
        console.error("POST /actual-packaging error:", err.message);
        return res.status(500).json({ message: "Gagal simpan actual", detail: err.message });
      }
      res.json({ message: "Actual packaging berhasil ditambahkan", id: result.insertId });
    }
  );
});

/* ========================
   GET BY ID
======================== */
router.get("/:id", auth, (req, res) => {
  const sql = `
    SELECT
      ap.id,
      ap.part_id,
      COALESCE(p.part_number, '-') AS part_number,
      COALESCE(p.part_name,   '-') AS part_name,
      ap.qty_actual,
      ap.tanggal
    FROM actual_packaging ap
    LEFT JOIN part p ON ap.part_id = p.id
    WHERE ap.id = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error("GET /actual-packaging/:id error:", err.message);
      return res.status(500).json({ message: "Server error", detail: err.message });
    }
    if (results.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(results[0]);
  });
});

/* ========================
   UPDATE ACTUAL PACKAGING
======================== */
router.put("/:id", auth, (req, res) => {
  const { part_id, qty_actual, tanggal } = req.body;

  if (!part_id || !qty_actual || !tanggal) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  db.query(
    `UPDATE actual_packaging
     SET part_id=?, qty_actual=?, tanggal=?, updated_at=NOW()
     WHERE id=?`,
    [part_id, qty_actual, tanggal, req.params.id],
    (err) => {
      if (err) {
        console.error("PUT /actual-packaging error:", err.message);
        return res.status(500).json({ message: "Gagal update actual", detail: err.message });
      }
      res.json({ message: "Actual berhasil diperbarui" });
    }
  );
});

/* ========================
   DELETE ACTUAL PACKAGING
======================== */
router.delete("/:id", auth, (req, res) => {
  db.query(
    "DELETE FROM actual_packaging WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error("DELETE /actual-packaging error:", err.message);
        return res.status(500).json({ message: "Gagal hapus actual", detail: err.message });
      }
      res.json({ message: "Actual berhasil dihapus" });
    }
  );
});

module.exports = router;
