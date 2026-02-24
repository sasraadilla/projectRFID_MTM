const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* ========================
   GET ALL CUSTOMERS
======================== */
router.get("/", auth, (req, res) => {
  db.query(
    "SELECT id, customer_code, customer_name FROM customers",
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json(results);
    }
  );
});

/* ========================
   CREATE CUSTOMER
======================== */
router.post("/", auth, (req, res) => {
  const { customer_code, customer_name } = req.body;

  if (!customer_code || !customer_name) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  // 🔍 CEK KODE CUSTOMER SUDAH ADA ATAU BELUM
  db.query(
    "SELECT id FROM customers WHERE customer_code = ?",
    [customer_code],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ message: "Kode customer sudah digunakan" });
      }

      // ✅ BARU INSERT JIKA BELUM ADA
      db.query(
        "INSERT INTO customers (customer_code, customer_name, created_at) VALUES (?, ?, NOW())",
        [customer_code, customer_name],
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Gagal menambah customer" });
          }

          res.json({ message: "Customer berhasil ditambahkan" });
        }
      );
    }
  );
});


/* ========================
   GET CUSTOMER BY ID
======================== */
router.get("/:id", auth, (req, res) => {
  db.query(
    "SELECT id, customer_code, customer_name FROM customers WHERE id=?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (results.length === 0) {
        return res.status(404).json({ message: "Customer tidak ditemukan" });
      }
      res.json(results[0]);
    }
  );
});

/* ========================
   UPDATE CUSTOMER
======================== */
router.put("/:id", auth, (req, res) => {
  const { id } = req.params;
  const { customer_code, customer_name } = req.body;

  if (!customer_code || !customer_name) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  // 🔍 CEK APAKAH KODE DIPAKAI CUSTOMER LAIN
  db.query(
    "SELECT id FROM customers WHERE customer_code = ? AND id != ?",
    [customer_code, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ message: "Kode customer sudah digunakan" });
      }

      // ✅ AMAN → UPDATE
      db.query(
        "UPDATE customers SET customer_code=?, customer_name=? WHERE id=?",
        [customer_code, customer_name, id],
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Gagal update customer" });
          }

          res.json({ message: "Customer berhasil diperbarui" });
        }
      );
    }
  );
});


/* ========================
   DELETE CUSTOMER
======================== */
router.delete("/:id", auth, (req, res) => {
  db.query(
    "DELETE FROM customers WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: "Gagal hapus customer" });
      res.json({ message: "Customer berhasil dihapus" });
    }
  );
});

module.exports = router;
