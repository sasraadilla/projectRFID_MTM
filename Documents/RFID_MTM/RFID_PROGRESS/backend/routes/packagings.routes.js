const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* ======================
   GET ALL PACKAGINGS
====================== */
router.get("/", auth, (req, res) => {
  const sql = `
    SELECT 
      p.id,
      p.packaging_name,
      p.kapasitas_packaging,
      pt.type_name AS packaging_type,
      p.warna
    FROM packagings p
    JOIN packaging_types pt ON pt.id = p.packaging_type_id
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.json(results);
  });
});

/* ======================
   GET BY ID
====================== */
router.get("/:id", auth, (req, res) => {
  db.query(
    "SELECT * FROM packagings WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (results.length === 0)
        return res.status(404).json({ message: "Data tidak ditemukan" });

      res.json(results[0]);
    }
  );
});

/* ======================
   CREATE
====================== */
router.post("/", auth, (req, res) => {
  const { packaging_name, kapasitas_packaging, packaging_type_id, warna } = req.body;

  if (!packaging_name || !kapasitas_packaging || !packaging_type_id || !warna) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  db.query(
    `INSERT INTO packagings
      (packaging_name, kapasitas_packaging, packaging_type_id, warna, created_at)
     VALUES (?, ?, ?, ?, NOW())`,
    [packaging_name, kapasitas_packaging, packaging_type_id, warna],
    (err) => {
      if (err)
        return res.status(500).json({ message: "Gagal menambah packaging" });

      res.json({ message: "Packaging berhasil ditambahkan" });
    }
  );
});

/* ======================
   UPDATE
====================== */
router.put("/:id", auth, (req, res) => {
  const { packaging_name, kapasitas_packaging, packaging_type_id, warna } = req.body;

  if (!packaging_name || !kapasitas_packaging || !packaging_type_id || !warna) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  db.query(
    `UPDATE packagings SET
      packaging_name = ?,
      kapasitas_packaging = ?,
      packaging_type_id = ?,
      warna = ?
     WHERE id = ?`,
    [packaging_name, kapasitas_packaging, packaging_type_id, warna, req.params.id],
    (err) => {
      if (err)
        return res.status(500).json({ message: "Gagal update packaging" });

      res.json({ message: "Packaging berhasil diperbarui" });
    }
  );
});

/* ======================
   DELETE
====================== */
router.delete("/:id", auth, (req, res) => {
  db.query(
    "DELETE FROM packagings WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err)
        return res.status(500).json({ message: "Gagal menghapus packaging" });

      res.json({ message: "Packaging berhasil dihapus" });
    }
  );
});

module.exports = router;
