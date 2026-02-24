const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* ========================
   GET ALL READERS
======================== */
router.get("/", auth, (req, res) => {
  const sql = `
    SELECT 
      id,
      reader_code,
      reader_name,
      location
    FROM readers
    ORDER BY reader_name ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal mengambil data reader" });
    }
    res.json(results);
  });
});

/* ========================
   CREATE READER
======================== */
router.post("/", auth, (req, res) => {
  const { reader_code, reader_name, location } = req.body;

  if (!reader_code || !reader_name || !location) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  // 🔍 Cek reader_code unik
  db.query(
    "SELECT id FROM readers WHERE reader_code = ?",
    [reader_code],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ message: "Reader code sudah digunakan" });
      }

      // ✅ Insert
      db.query(
        `INSERT INTO readers 
         (reader_code, reader_name, location, created_at)
         VALUES (?, ?, ?, NOW())`,
        [reader_code, reader_name, location],
        (err) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ message: "Gagal menambah reader" });
          }

          res.json({ message: "Reader berhasil ditambahkan" });
        }
      );
    }
  );
});

/* ========================
   GET READER BY ID
======================== */
router.get("/:id", auth, (req, res) => {
  const sql = `
    SELECT 
      id,
      reader_code,
      reader_name,
      location
    FROM readers
    WHERE id = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Reader tidak ditemukan" });
    }

    res.json(results[0]);
  });
});

/* ========================
   UPDATE READER
======================== */
router.put("/:id", auth, (req, res) => {
  const { reader_code, reader_name, location } = req.body;
  const { id } = req.params;

  if (!reader_code || !reader_name || !location) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  // 🔍 Cek reader_code dipakai reader lain
  db.query(
    "SELECT id FROM readers WHERE reader_code = ? AND id != ?",
    [reader_code, id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ message: "Reader code sudah digunakan" });
      }

      // ✅ Update
      db.query(
        `UPDATE readers 
         SET reader_code = ?, reader_name = ?, location = ?
         WHERE id = ?`,
        [reader_code, reader_name, location, id],
        (err) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ message: "Gagal update reader" });
          }

          res.json({ message: "Reader berhasil diperbarui" });
        }
      );
    }
  );
});

/* ========================
   DELETE READER
======================== */
router.delete("/:id", auth, (req, res) => {
  db.query(
    "DELETE FROM readers WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Gagal hapus reader" });
      }

      res.json({ message: "Reader berhasil dihapus" });
    }
  );
});

module.exports = router;
