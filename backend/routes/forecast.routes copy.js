const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* =====================================================
   SIMPAN FORECAST MONTH (INPUT USER)
   POST /api/forecast/month
===================================================== */
router.post("/month", auth, (req, res) => {
  const { part_id, bulan, tahun, forecast_month } = req.body;

  if (!part_id || !bulan || !tahun || !forecast_month) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  const sql = `
    INSERT INTO forecast_month (part_id, bulan, tahun, forecast_month)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [part_id, bulan, tahun, forecast_month], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal menyimpan forecast bulanan" });
    }
    res.json({ message: "Forecast bulanan tersimpan", id: result.insertId });
  });
});

/* =====================================================
   SIMPAN FORECAST INPUT (USER INPUT)
   POST /api/forecast/input
===================================================== */
router.post("/input", auth, (req, res) => {
  const { forecast_month_id, kalender_kerja, packaging_id, lead_time, actual_packaging } = req.body;

  if (!forecast_month_id || !kalender_kerja || !packaging_id || !lead_time || !actual_packaging) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  const sql = `
    INSERT INTO forecast_input 
      (forecast_month_id, kalender_kerja, packaging_id, lead_time, actual_packaging)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [forecast_month_id, kalender_kerja, packaging_id, lead_time, actual_packaging], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal menyimpan input forecast" });
    }
    res.json({ message: "Input forecast tersimpan", id: result.insertId });
  });
});

// GET list tahun unik untuk filter dropdown
router.get("/months", auth, (req, res) => {
  const sql = `
    SELECT DISTINCT tahun
    FROM forecast_month
    ORDER BY tahun ASC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
    // Hasil: [{tahun: '2025'}, {tahun: '2026'}, ...]
    const years = results.map(r => r.tahun);
    res.json(years);
  });
});

/* =====================================================
   GET FORECAST FINAL (HITUNG OTOMATIS)
   GET /api/forecast/calc?month=11&year=2025
===================================================== */
router.get("/calc", auth, (req, res) => {
  const { month, year, part_id } = req.query;
  if (!month || !year) return res.status(400).json({ message: "month dan year wajib diisi" });

  // mapping bulan angka → huruf (sesuaikan DB)
  const monthMap = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
    7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
  };

  let sql = `
    SELECT 
      fm.id AS forecast_month_id,
      fm.part_id,
      fm.bulan,
      fm.tahun,
      fm.forecast_month,
      fi.kalender_kerja,
      fi.lead_time,
      fi.actual_packaging,
      p.part_name,
      pkg.packaging_name,
      pkg.kapasitas_packaging
    FROM forecast_month fm
    JOIN forecast_input fi ON fi.forecast_month_id = fm.id
    JOIN parts p ON p.id = fm.part_id
    JOIN packagings pkg ON pkg.id = fi.packaging_id
    WHERE fm.bulan = ? AND fm.tahun = ?
  `;

  const params = [monthMap[month], year];
  if (part_id) {
    sql += " AND fm.part_id = ?";
    params.push(part_id);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });

    const data = results.map(row => {
      const forecast_day = row.forecast_month / row.kalender_kerja;
      const packaging_per_day = Math.ceil(forecast_day / row.kapasitas_packaging);
      const total_need = packaging_per_day * row.lead_time;
      const diff = row.actual_packaging - total_need;

      let status = "Pass";
      if (diff < 0) status = "Kurang";
      if (diff > 0) status = "Lebih";

      return {
        forecast_month_id: row.forecast_month_id,
        part_name: row.part_name,
        packaging: row.packaging_name,
        forecast_month: row.forecast_month,
        kalender_kerja: row.kalender_kerja,
        forecast_day: Math.round(forecast_day),
        packaging_per_day,
        total_need,
        actual: row.actual_packaging,
        diff,
        status
      };
    });

    res.json(data);
  });
});

module.exports = router;
