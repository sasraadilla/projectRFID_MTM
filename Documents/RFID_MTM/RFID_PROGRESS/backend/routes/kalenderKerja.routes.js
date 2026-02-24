const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* ========================
   GET ALL KALENDER KERJA
======================== */
router.get("/", auth, (req, res) => {
  const sql = `
    SELECT 
      id,
      bulan,
      tahun,
      hari_kerja
    FROM kalender_kerja
    ORDER BY tahun DESC, bulan ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Gagal mengambil data kalender kerja" });
    }

    res.json(results);
  });
});

/* ========================
   CREATE KALENDER KERJA
======================== */
router.post("/", auth, (req, res) => {
  const { bulan, tahun, hari_kerja } = req.body;

  if (!bulan || !tahun || !hari_kerja) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  // Cek duplicate bulan + tahun
  db.query(
    `SELECT id FROM kalender_kerja 
     WHERE bulan = ? AND tahun = ?`,
    [bulan, tahun],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "Kalender kerja untuk bulan & tahun ini sudah ada"
        });
      }

      // Insert
      db.query(
        `INSERT INTO kalender_kerja 
         (bulan, tahun, hari_kerja, created_at)
         VALUES (?, ?, ?, NOW())`,
        [bulan, tahun, hari_kerja],
        (err) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ message: "Gagal menambah kalender kerja" });
          }

          res.json({ message: "Kalender kerja berhasil ditambahkan" });
        }
      );
    }
  );
});

/* ========================
   GET BY ID
======================== */
router.get("/:id", auth, (req, res) => {
  const sql = `
    SELECT 
      id,
      bulan,
      tahun,
      hari_kerja
    FROM kalender_kerja
    WHERE id = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Kalender kerja tidak ditemukan" });
    }

    res.json(results[0]);
  });
});

/* ========================
   UPDATE KALENDER KERJA
======================== */
router.put("/:id", auth, (req, res) => {
  const { bulan, tahun, hari_kerja } = req.body;
  const { id } = req.params;

  if (!bulan || !tahun || !hari_kerja) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  // Cek duplicate
  db.query(
    `SELECT id FROM kalender_kerja 
     WHERE bulan = ? AND tahun = ? AND id != ?`,
    [bulan, tahun, id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "Kalender kerja untuk bulan & tahun ini sudah ada"
        });
      }

      db.query(
        `UPDATE kalender_kerja 
         SET bulan = ?, tahun = ?, hari_kerja = ?
         WHERE id = ?`,
        [bulan, tahun, hari_kerja, id],
        (err) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ message: "Gagal update kalender kerja" });
          }

          res.json({ message: "Kalender kerja berhasil diperbarui" });
        }
      );
    }
  );
});

/* ========================
   DELETE KALENDER KERJA
======================== */
router.delete("/:id", auth, (req, res) => {
  db.query(
    "DELETE FROM kalender_kerja WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Gagal hapus kalender kerja" });
      }

      res.json({ message: "Kalender kerja berhasil dihapus" });
    }
  );
});

module.exports = router;
