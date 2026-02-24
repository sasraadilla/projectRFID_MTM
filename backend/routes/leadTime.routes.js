const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* ========================
   GET ALL LEAD TIME
======================== */
router.get("/", auth, (req, res) => {
  const sql = `
    SELECT 
      lt.id,
      p.part_number,
      p.part_name,
      lt.lt_production,
      lt.lt_store,
      lt.lt_customer,
      (lt.lt_production + lt.lt_store + lt.lt_customer) AS total_lt
    FROM lead_time lt
    JOIN part p ON p.id = lt.part_id
    ORDER BY p.part_name ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal mengambil data lead time" });
    }

    res.json(results);
  });
});

/* ========================
   CREATE LEAD TIME
======================== */
router.post("/", auth, (req, res) => {
  const { part_id, lt_production, lt_store, lt_customer } = req.body;

  if (!part_id || lt_production == null || lt_store == null || lt_customer == null) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  // Cek 1 part cuma boleh 1 lead time
  db.query(
    "SELECT id FROM lead_time WHERE part_id = ?",
    [part_id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "Lead time untuk part ini sudah ada"
        });
      }

      db.query(
        `INSERT INTO lead_time 
         (part_id, lt_production, lt_store, lt_customer, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [part_id, lt_production, lt_store, lt_customer],
        (err) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ message: "Gagal menambah lead time" });
          }

          res.json({ message: "Lead time berhasil ditambahkan" });
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
      part_id,
      lt_production,
      lt_store,
      lt_customer
    FROM lead_time
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
        .json({ message: "Lead time tidak ditemukan" });
    }

    res.json(results[0]);
  });
});

/* ========================
   UPDATE LEAD TIME
======================== */
router.put("/:id", auth, (req, res) => {
  const { part_id, lt_production, lt_store, lt_customer } = req.body;
  const { id } = req.params;

  if (!part_id || lt_production == null || lt_store == null || lt_customer == null) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  // Cek duplicate part
  db.query(
    "SELECT id FROM lead_time WHERE part_id = ? AND id != ?",
    [part_id, id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "Part ini sudah punya lead time lain"
        });
      }

      db.query(
        `UPDATE lead_time 
         SET part_id = ?, lt_production = ?, lt_store = ?, lt_customer = ?
         WHERE id = ?`,
        [part_id, lt_production, lt_store, lt_customer, id],
        (err) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ message: "Gagal update lead time" });
          }

          res.json({ message: "Lead time berhasil diperbarui" });
        }
      );
    }
  );
});

/* ========================
   DELETE LEAD TIME
======================== */
router.delete("/:id", auth, (req, res) => {
  db.query(
    "DELETE FROM lead_time WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Gagal hapus lead time" });
      }

      res.json({ message: "Lead time berhasil dihapus" });
    }
  );
});

module.exports = router;
