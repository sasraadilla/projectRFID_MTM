const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* ========================
   GET ALL CUSTOMERS
   Schema: id, customer_code, customer_name, address, contact_person, phone,
           created_at, updated_at, deleted_at
======================== */
router.get("/", auth, (req, res) => {
  db.query(
    `SELECT id, customer_code, customer_name, address, contact_person, phone, created_at
     FROM customers
     WHERE deleted_at IS NULL
     ORDER BY customer_name ASC`,
    (err, results) => {
      if (err) {
        console.error("GET /customers error:", err.message);
        return res.status(500).json({ message: "Server error", detail: err.message });
      }
      res.json(results);
    }
  );
});

/* ========================
   CREATE CUSTOMER
======================== */
router.post("/", auth, (req, res) => {
  const { customer_code, customer_name, address, contact_person, phone } = req.body;

  if (!customer_code || !customer_name) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  db.query(
    "SELECT id FROM customers WHERE customer_code = ? AND deleted_at IS NULL",
    [customer_code],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (results.length > 0) {
        return res.status(400).json({ message: "Kode customer sudah digunakan" });
      }

      db.query(
        `INSERT INTO customers (customer_code, customer_name, address, contact_person, phone, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [customer_code, customer_name, address || null, contact_person || null, phone || null],
        (err, result) => {
          if (err) {
            console.error("POST /customers error:", err.message);
            return res.status(500).json({ message: "Gagal menambah customer", detail: err.message });
          }
          res.json({ message: "Customer berhasil ditambahkan", id: result.insertId });
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
    `SELECT id, customer_code, customer_name, address, contact_person, phone
     FROM customers WHERE id = ? AND deleted_at IS NULL`,
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (results.length === 0) return res.status(404).json({ message: "Customer tidak ditemukan" });
      res.json(results[0]);
    }
  );
});

/* ========================
   UPDATE CUSTOMER
======================== */
router.put("/:id", auth, (req, res) => {
  const { id } = req.params;
  const { customer_code, customer_name, address, contact_person, phone } = req.body;

  if (!customer_code || !customer_name) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  db.query(
    "SELECT id FROM customers WHERE customer_code = ? AND id != ? AND deleted_at IS NULL",
    [customer_code, id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (results.length > 0) {
        return res.status(400).json({ message: "Kode customer sudah digunakan" });
      }

      db.query(
        `UPDATE customers
         SET customer_code=?, customer_name=?, address=?, contact_person=?, phone=?, updated_at=NOW()
         WHERE id=? AND deleted_at IS NULL`,
        [customer_code, customer_name, address || null, contact_person || null, phone || null, id],
        (err) => {
          if (err) {
            console.error("PUT /customers error:", err.message);
            return res.status(500).json({ message: "Gagal update customer", detail: err.message });
          }
          res.json({ message: "Customer berhasil diperbarui" });
        }
      );
    }
  );
});

/* ========================
   DELETE CUSTOMER (soft delete)
======================== */
router.delete("/:id", auth, (req, res) => {
  db.query(
    "UPDATE customers SET deleted_at = NOW(), updated_at = NOW() WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error("DELETE /customers error:", err.message);
        return res.status(500).json({ message: "Gagal hapus customer", detail: err.message });
      }
      res.json({ message: "Customer berhasil dihapus" });
    }
  );
});

module.exports = router;
