const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* ======================
   GET ALL PART
====================== */
router.get("/", auth, (req, res) => {
  const sql = `
    SELECT 
      p.id,
      p.part_number,
      p.part_name,
      p.qty_per_pack,
      p.keterangan,
      c.customer_name,
      pt.type_name as packing_type,
      COALESCE(lt.lt_production + lt.lt_store + lt.lt_customer, 0) as lead_time,
      COALESCE(ap.qty_actual, 0) as actual,
      COALESCE((SELECT forecast_month FROM forecast_month WHERE part_id = p.id AND bulan = 'Oktober' AND tahun = '2025' LIMIT 1), 0) as oct_25,
      COALESCE((SELECT forecast_month FROM forecast_month WHERE part_id = p.id AND bulan = 'November' AND tahun = '2025' LIMIT 1), 0) as nov_25,
      COALESCE((SELECT forecast_month FROM forecast_month WHERE part_id = p.id AND bulan = 'Desember' AND tahun = '2025' LIMIT 1), 0) as dec_25,
      COALESCE((SELECT forecast_month FROM forecast_month WHERE part_id = p.id AND bulan = 'Januari' AND tahun = '2026' LIMIT 1), 0) as jan_26,
      COALESCE((SELECT forecast_month FROM forecast_month WHERE part_id = p.id AND bulan = 'Februari' AND tahun = '2026' LIMIT 1), 0) as feb_26
    FROM part p
    JOIN customers c ON p.customer_id = c.id
    LEFT JOIN lead_time lt ON lt.part_id = p.id
    LEFT JOIN actual_packaging ap ON ap.part_id = p.id
    LEFT JOIN assets a ON a.part_id = p.id
    LEFT JOIN packagings pkg ON (pkg.id = a.packaging_id OR pkg.packaging_name LIKE CONCAT('PKG-', p.part_number, '%'))
    LEFT JOIN packaging_types pt ON pt.id = pkg.packaging_type_id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal mengambil data part" });
    }
    res.json(results);
  });
});

/* ======================
   GET PART BY ID
====================== */
router.get("/:id", auth, (req, res) => {
  db.query(
    "SELECT * FROM part WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (results.length === 0)
        return res.status(404).json({ message: "Part tidak ditemukan" });

      res.json(results[0]);
    }
  );
});

/* ======================
   ADD PART
====================== */
router.post("/", auth, (req, res) => {
  const {
    part_number,
    part_name,
    customer_id,
    qty_per_pack,
    keterangan,
  } = req.body;

  if (!part_number || !part_name || !customer_id || !qty_per_pack) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  db.query(
    "SELECT id FROM part WHERE part_number = ?",
    [part_number],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });

      if (results.length > 0) {
        return res
          .status(400)
          .json({ message: "Part number sudah digunakan" });
      }

      db.query(
        `INSERT INTO part 
        (part_number, part_name, customer_id, qty_per_pack, keterangan, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())`,
        [part_number, part_name, customer_id, qty_per_pack, keterangan],
        (err) => {
          if (err)
            return res.status(500).json({ message: "Gagal menambah part" });

          res.json({ message: "Part berhasil ditambahkan" });
        }
      );
    }
  );
});

/* ======================
   UPDATE PART
====================== */
router.put("/:id", auth, (req, res) => {
  const {
    part_number,
    part_name,
    customer_id,
    qty_per_pack,
    keterangan,
  } = req.body;

  if (!part_number || !part_name || !customer_id || !qty_per_pack) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  db.query(
    "SELECT id FROM part WHERE part_number = ? AND id != ?",
    [part_number, req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });

      if (results.length > 0) {
        return res
          .status(400)
          .json({ message: "Part number sudah digunakan" });
      }

      db.query(
        `UPDATE part SET
          part_number = ?,
          part_name = ?,
          customer_id = ?,
          qty_per_pack = ?,
          keterangan = ?
        WHERE id = ?`,
        [
          part_number,
          part_name,
          customer_id,
          qty_per_pack,
          keterangan,
          req.params.id,
        ],
        (err) => {
          if (err)
            return res.status(500).json({ message: "Gagal update part" });

          res.json({ message: "Part berhasil diupdate" });
        }
      );
    }
  );
});

/* ======================
   DELETE PART
====================== */
router.delete("/:id", auth, (req, res) => {
  db.query(
    "DELETE FROM part WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err)
        return res.status(500).json({ message: "Gagal hapus part" });

      res.json({ message: "Part berhasil dihapus" });
    }
  );
});

/* =====================================================
   GET PART BY CUSTOMER
   GET /api/parts/by-customer/:customer_id
===================================================== */
// GET parts by customer, include packaging_id
router.get("/by-customer/:customerId", (req, res) => {
  const customerId = req.params.customerId;

  if (!customerId) {
    return res.status(400).json({ message: "Customer ID tidak boleh kosong" });
  }

  const query = `
    SELECT 
      p.id AS id, 
      p.part_name, 
      -- ambil satu packaging_id dari assets
      MIN(a.packaging_id) AS packaging_id
    FROM part p
    LEFT JOIN assets a ON a.part_id = p.id
    WHERE p.customer_id = ?
    GROUP BY p.id, p.part_name
    ORDER BY p.id
  `;

  db.query(query, [customerId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal mengambil data part" });
    }

    res.json(results);
  });
});

module.exports = router;
