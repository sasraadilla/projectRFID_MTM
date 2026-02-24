const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* =====================================================
   1️⃣ SIMPAN FORECAST BULANAN
   POST /api/forecast/month
===================================================== */
/* BULK INSERT FORECAST */
router.post("/bulk", auth, (req, res) => {
  const { bulan, tahun, items } = req.body;

  if (!bulan || !tahun || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  db.getConnection((err, conn) => {
    if (err) return res.status(500).json({ message: "DB error" });

    conn.beginTransaction(err => {
      if (err) return res.status(500).json({ message: "DB error" });

      const insertMonth =
        "INSERT INTO forecast_month (part_id, bulan, tahun, forecast_month) VALUES (?, ?, ?, ?)";
      const insertInput =
        "INSERT INTO forecast_input (forecast_month_id, kalender_kerja, packaging_id, lead_time, actual_packaging) VALUES (?, ?, ?, ?, ?)";

      let index = 0;

      const loop = () => {
        if (index >= items.length) {
          return conn.commit(err => {
            if (err) return conn.rollback(() =>
              res.status(500).json({ message: "Gagal menyimpan forecast" })
            );
            res.json({ message: "Forecast berhasil disimpan" });
          });
        }

        const item = items[index];

        if (!item.part_id || !item.forecast_month || !item.packaging_id) {
          return conn.rollback(() =>
            res.status(400).json({ message: `Item tidak valid: part_id, forecast_month, atau packaging_id kosong` })
          );
        }

        // debug log
        console.log("Insert item:", item.part_id, item.packaging_id, item.forecast_month, item.actual_packaging);

        conn.query(insertMonth, [item.part_id, bulan, tahun, item.forecast_month], (err, result) => {
          if (err) return conn.rollback(() =>
            res.status(500).json({ message: "Gagal menyimpan forecast_month" })
          );

          const forecastMonthId = result.insertId;

          conn.query(insertInput, [
            forecastMonthId,
            item.kalender_kerja || 0,
            item.packaging_id,
            item.lead_time || 0,
            item.actual_packaging || 0
          ], (err) => {
            if (err) return conn.rollback(() =>
              res.status(500).json({ message: "Gagal menyimpan forecast_input" })
            );

            index++;
            loop();
          });
        });
      };

      loop();
    });
  });
});
/* =====================================================
   3️⃣ LIST FORECAST BULANAN
   GET /api/forecast
===================================================== */
router.get("/", auth, (req, res) => {
  const sql = `
    SELECT fm.id, fm.bulan, fm.tahun, fm.forecast_month, p.part_name
    FROM forecast_month fm
    JOIN part p ON p.id = fm.part_id
    ORDER BY fm.tahun DESC, fm.bulan DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(rows);
  });
});

/* =====================================================
   4️⃣ HITUNG FORECAST
   GET /api/forecast/calc?month=&year=&customer_id=
===================================================== */
// routes/forecast.js
router.get("/calc", auth, (req, res) => {
  const { month, year, customer_id } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: "Bulan dan tahun wajib diisi" });
  }

  // Ambil data forecast_month + part + packaging + customer
  // join ke lead_time, kalender_kerja, actual_packaging
  let sql = `
    SELECT 
      fm.id AS forecast_month_id,
      fm.forecast_month,
      p.part_name,
      p.id AS part_id,
      pkg.packaging_name,
      pkg.kapasitas_packaging,
      c.customer_name,
      lt.lt_production,
      lt.lt_store,
      lt.lt_customer,
      kk.hari_kerja,
      ap.qty_actual
    FROM forecast_month fm
    JOIN part p ON p.id = fm.part_id
    JOIN customers c ON c.id = p.customer_id
    JOIN forecast_input fi ON fi.forecast_month_id = fm.id
    JOIN packagings pkg ON pkg.id = fi.packaging_id
    LEFT JOIN lead_time lt ON lt.part_id = p.id
    LEFT JOIN kalender_kerja kk ON kk.bulan = fm.bulan AND kk.tahun = fm.tahun
    LEFT JOIN actual_packaging ap ON ap.part_id = p.id
  `;

  const params = [];

  // filter bulan/tahun
  sql += " WHERE fm.bulan = ? AND fm.tahun = ?";
  params.push(month, year);

  // filter customer jika ada
  if (customer_id) {
    sql += " AND c.id = ?";
    params.push(customer_id);
  }

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    const result = rows.map(r => {
      // total lead time = sum dari lt_production + lt_store + lt_customer
      const total_lead_time = (r.lt_production || 0) + (r.lt_store || 0) + (r.lt_customer || 0);
      const kalender = r.hari_kerja || 1;
      const forecast_day = r.forecast_month / kalender;
      const packaging_per_day = Math.ceil(forecast_day / r.kapasitas_packaging);
      const total_need = packaging_per_day * total_lead_time;

      const diff = (r.qty_actual || 0) - total_need;
      let status = "Pass";
      if (diff < 0) status = "Kurang";
      if (diff > 0) status = "Lebih";

      return {
        forecast_month_id: r.forecast_month_id,
        customer_name: r.customer_name,
        part_name: r.part_name,
        packaging: r.packaging_name,
        forecast_day: Math.round(forecast_day),
        packaging_per_day,
        total_need,
        actual: r.qty_actual || 0,
        status
      };
    });

    res.json(result);
  });
});



router.get("/months", (req, res) => {
  const sql = `SELECT DISTINCT tahun FROM forecast_month ORDER BY tahun`;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "Server error" });
    const years = rows.map(r => r.tahun);
    res.json(years);
  });
});

/* =====================================================
   5️⃣ DELETE FORECAST BY ID
   DELETE /api/forecast/:id
===================================================== */
router.delete("/:id", auth, (req, res) => {
  const { id } = req.params;

  db.getConnection((err, conn) => {
    if (err) return res.status(500).json({ message: "DB error" });

    conn.beginTransaction(err => {
      if (err) return res.status(500).json({ message: "DB error" });

      // 1. hapus child dulu
      conn.query(
        "DELETE FROM forecast_input WHERE forecast_month_id = ?",
        [id],
        (err) => {
          if (err) return conn.rollback(() =>
            res.status(500).json({ message: "Gagal hapus forecast_input" })
          );

          // 2. hapus parent
          conn.query(
            "DELETE FROM forecast_month WHERE id = ?",
            [id],
            (err) => {
              if (err) return conn.rollback(() =>
                res.status(500).json({ message: "Gagal hapus forecast_month" })
              );

              conn.commit(err => {
                if (err) return conn.rollback(() =>
                  res.status(500).json({ message: "Gagal commit" })
                );

                res.json({ message: "Forecast berhasil dihapus" });
              });
            }
          );
        }
      );
    });
  });
});


module.exports = router;
