// routes/forecastMonth.routes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

// 🔹 GET LIST FORECAST BULAN
router.get("/", auth, (req, res) => {
  const sql = `
    SELECT fm.id, fm.part_id, fm.bulan, fm.tahun, fm.forecast_month,
           p.part_number, p.part_name
    FROM forecast_month fm
    JOIN part p ON p.id = fm.part_id
    ORDER BY fm.tahun DESC, fm.bulan DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal mengambil data forecast bulan" });
    }

    res.json(results);
  });
});

module.exports = router;
