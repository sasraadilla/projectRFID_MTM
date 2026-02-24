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
            if (err) {
              return conn.rollback(() =>
                res.status(500).json({ message: "Gagal menyimpan forecast" })
              );
            }
            res.json({ message: "Forecast berhasil disimpan" });
          });
        }

        const item = items[index];

        conn.query(insertMonth, [item.part_id, bulan, tahun, item.forecast_month], (err, result) => {
          if (err) return conn.rollback(() =>
            res.status(500).json({ message: "Gagal menyimpan forecast" })
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
              res.status(500).json({ message: "Gagal menyimpan forecast" })
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
   GET /api/forecast/calc?bulan=&tahun=
===================================================== */
router.get("/calc", auth, (req, res) => {
  const { bulan, tahun } = req.query;
  if (!bulan || !tahun) return res.status(400).json({ message: "Bulan dan tahun wajib" });

  const sql = `
    SELECT
      fm.forecast_month,
      fi.kalender_kerja,
      fi.lead_time,
      fi.actual_packaging,
      p.part_name,
      pkg.packaging_name,
      pkg.kapasitas_packaging
    FROM forecast_month fm
    JOIN forecast_input fi ON fi.forecast_month_id = fm.id
    JOIN part p ON p.id = fm.part_id
    JOIN packagings pkg ON pkg.id = fi.packaging_id
    WHERE fm.bulan = ? AND fm.tahun = ?
  `;

  db.query(sql, [bulan, tahun], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    const result = rows.map(r => {
      const kalender = r.kalender_kerja || 1;
      const lead = r.lead_time || 1;

      const forecast_day = r.forecast_month / kalender;
      const packaging_per_day = Math.ceil(forecast_day / r.kapasitas_packaging);
      const total_need = packaging_per_day * lead;
      const diff = r.actual_packaging - total_need;

      return {
        part_name: r.part_name,
        packaging: r.packaging_name,
        forecast_day: Math.round(forecast_day),
        total_need,
        actual: r.actual_packaging,
        status: diff < 0 ? "Kurang" : diff > 0 ? "Lebih" : "Pass"
      };
    });

    res.json(result);
  });
});

module.exports = router;
