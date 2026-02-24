const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* ========================
   GET ALL PACKAGING TYPES
======================== */
router.get("/", auth, (req, res) => {
  db.query(
    "SELECT id, type_name FROM packaging_types ORDER BY id DESC",
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json(results);
    }
  );
});

/* ========================
   CREATE
======================== */
router.post("/", auth, (req, res) => {
  const { type_name } = req.body;

  if (!type_name) {
    return res.status(400).json({ message: "Type packaging wajib diisi" });
  }

  // cek duplicate
  db.query(
    "SELECT id FROM packaging_types WHERE type_name=?",
    [type_name],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (results.length > 0) {
        return res
          .status(400)
          .json({ message: "Type packaging sudah ada" });
      }

      db.query(
        "INSERT INTO packaging_types (type_name, created_at) VALUES (?, NOW())",
        [type_name],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Gagal menambah packaging type" });

          res.json({ message: "Packaging type berhasil ditambahkan" });
        }
      );
    }
  );
});

/* ========================
   GET BY ID
======================== */
router.get("/:id", auth, (req, res) => {
  db.query(
    "SELECT id, type_name FROM packaging_types WHERE id=?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (results.length === 0)
        return res.status(404).json({ message: "Data tidak ditemukan" });

      res.json(results[0]);
    }
  );
});

/* ========================
   UPDATE
======================== */
router.put("/:id", auth, (req, res) => {
  const { type_name } = req.body;

  db.query(
    "SELECT id FROM packaging_types WHERE type_name=? AND id!=?",
    [type_name, req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (results.length > 0) {
        return res
          .status(400)
          .json({ message: "Type packaging sudah digunakan" });
      }

      db.query(
        "UPDATE packaging_types SET type_name=? WHERE id=?",
        [type_name, req.params.id],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Gagal update packaging type" });

          res.json({ message: "Packaging type berhasil diperbarui" });
        }
      );
    }
  );
});

/* ========================
   DELETE
======================== */
router.delete("/:id", auth, (req, res) => {
  db.query(
    "DELETE FROM packaging_types WHERE id=?",
    [req.params.id],
    (err) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Gagal hapus packaging type" });

      res.json({ message: "Packaging type berhasil dihapus" });
    }
  );
});

module.exports = router;
