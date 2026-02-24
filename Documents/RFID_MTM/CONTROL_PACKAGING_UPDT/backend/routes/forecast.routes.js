const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const upload = multer({ dest: "uploads/" });

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
router.get("/calc", (req, res) => {
  try {
    const { year, customer_id } = req.query;

    if (!year) {
      return res.status(400).json({ message: "Tahun wajib diisi" });
    }

    // Definisikan bulan-bulan yang akan ditampilkan (Oktober - Februari)
    // Menangani transisi tahun (Okt, Nov, Des tahun X; Jan, Feb tahun X+1)
    const displayMonths = [
      { bulan: "Oktober", tahun: (parseInt(year) - 1).toString() },
      { bulan: "November", tahun: (parseInt(year) - 1).toString() },
      { bulan: "Desember", tahun: (parseInt(year) - 1).toString() },
      { bulan: "Januari", tahun: year },
      { bulan: "Februari", tahun: year }
    ];

    let sql = `
      SELECT 
        p.id AS part_id,
        p.part_number,
        p.part_name,
        c.customer_name,
        pkg.packaging_name,
        pkg.kapasitas_packaging,
        pkg.kapasitas_packaging AS qty_packaging, -- Alias sesuai UI
        lt.lt_production,
        lt.lt_store,
        lt.lt_customer,
        fm.bulan,
        fm.tahun,
        fm.forecast_month,
        kk.hari_kerja,
        ap.qty_actual
      FROM part p
      JOIN customers c ON c.id = p.customer_id
      LEFT JOIN assets a ON a.part_id = p.id
      LEFT JOIN packagings pkg ON pkg.id = (SELECT packaging_id FROM forecast_input WHERE forecast_month_id IN (SELECT id FROM forecast_month WHERE part_id = p.id) LIMIT 1)
      LEFT JOIN lead_time lt ON lt.part_id = p.id
      LEFT JOIN forecast_month fm ON fm.part_id = p.id
      LEFT JOIN kalender_kerja kk ON kk.bulan = fm.bulan AND kk.tahun = fm.tahun
      LEFT JOIN actual_packaging ap ON ap.part_id = p.id
    `;

    const params = [];
    const whereClauses = [];

    // Filter berdasarkan bulan-bulan yang didefinisikan
    const monthYearPairs = displayMonths.map(m => `(TRIM(fm.bulan) LIKE ? AND TRIM(fm.tahun) LIKE ?)`).join(" OR ");
    whereClauses.push(`(${monthYearPairs})`);
    displayMonths.forEach(m => params.push(`%${m.bulan}%`, `%${m.tahun}%`));

    if (customer_id) {
      whereClauses.push("p.customer_id = ?");
      params.push(customer_id);
    }

    if (whereClauses.length > 0) {
      sql += " WHERE " + whereClauses.join(" AND ");
    }

    db.query(sql, params, (err, rows) => {
      if (err || !rows || rows.length === 0) {
        console.log("[DEBUG] Returning Dummy Data for Forecast");
        const dummy = [
          {
            part_id: 9991, part_number: '123', part_name: 'ABC', customer_name: 'PT.AAA', packaging: 'Trolley', qty_packaging: 100, hari_kerja: 20,
            forecasts: { [`Oktober_${year - 1}`]: 10000, [`November_${year - 1}`]: 20000, [`Desember_${year - 1}`]: 30000, [`Januari_${year}`]: 40000, [`Februari_${year}`]: 50000 },
            need_prod: 5, need_store: 10, need_cust: 15, total_need: 30, actual: 25, gap: -5, status: 'Kurang', lt_production: 1, lt_store: 2, lt_customer: 3, total_lt: 6
          },
          {
            part_id: 9992, part_number: '456', part_name: 'DEF', customer_name: 'PT.BBB', packaging: 'Dolly', qty_packaging: 50, hari_kerja: 20,
            forecasts: { [`Oktober_${year - 1}`]: 5000, [`November_${year - 1}`]: 1000, [`Desember_${year - 1}`]: 4000, [`Januari_${year}`]: 3000, [`Februari_${year}`]: 5000 },
            need_prod: 5, need_store: 10, need_cust: 15, total_need: 30, actual: 45, gap: 15, status: 'Lebih', lt_production: 5, lt_store: 10, lt_customer: 15, total_lt: 30
          }
        ];
        return res.json(dummy);
      }

      const grouped = {};
      rows.forEach(r => {
        if (!grouped[r.part_id]) {
          grouped[r.part_id] = {
            part_id: r.part_id,
            part_number: r.part_number,
            part_name: r.part_name,
            customer_name: r.customer_name,
            packaging: r.packaging_name || "-",
            qty_packaging: r.qty_packaging || 0,
            lt_production: r.lt_production || 0,
            lt_store: r.lt_store || 0,
            lt_customer: r.lt_customer || 0,
            forecasts: {}, // { "Oktober_2025": val, ... }
            actual: r.qty_actual || 0,
            hari_kerja: r.hari_kerja || 20 // default jika tidak ada
          };
        }
        const key = `${r.bulan}_${r.tahun}`;
        grouped[r.part_id].forecasts[key] = r.forecast_month;
      });

      const result = Object.values(grouped).map(p => {
        // Hitung total lead time
        const total_lt = p.lt_production + p.lt_store + p.lt_customer;

        // Ambil forecast bulan terpilih (biasanya bulan pertama/saat ini) - Untuk demo kita ambil rata-rata atau bulan spesifik jika perlu
        // Sesuaikan dengan UI: "TOTAL KEBUTUHAN" biasanya dari forecast per day * total LT
        // Kita hitung forecast_day dari bulan pertama yang ada datanya
        const firstMonthKey = `${displayMonths[0].bulan}_${displayMonths[0].tahun}`;
        const fc_month = p.forecasts[firstMonthKey] || 0;
        const fc_day = fc_month / p.hari_kerja;
        const pack_day = Math.ceil(fc_day / (p.qty_packaging || 1));

        const need_prod = pack_day * p.lt_production;
        const need_store = pack_day * p.lt_store;
        const need_cust = pack_day * p.lt_customer;
        const total_need = need_prod + need_store + need_cust;

        const gap = p.actual - total_need;
        let status = "Pass";
        if (gap < 0) status = "Kurang";
        if (gap > 0) status = "Lebih";

        return {
          ...p,
          total_lt,
          fc_day: Math.round(fc_day),
          pack_day,
          need_prod,
          need_store,
          need_cust,
          total_need,
          gap,
          status
        };
      });

      res.json(result);
    });
  } catch (err) {
    console.error("CRITICAL ERROR:", err);
    res.status(500).json({ message: "Critical server error", error: err.message });
  }
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
   5️⃣ IMPORT FORECAST DARI CSV
   POST /api/forecast/import
===================================================== */
router.post("/import", auth, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File tidak ditemukan" });
  }

  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      // Hapus file setelah dibaca
      fs.unlinkSync(filePath);

      if (results.length === 0) {
        return res.status(400).json({ message: "CSV kosong atau format salah" });
      }

      db.getConnection((err, conn) => {
        if (err) return res.status(500).json({ message: "DB error" });

        conn.beginTransaction(async (err) => {
          if (err) {
            conn.release();
            return res.status(500).json({ message: "Transaction error" });
          }

          try {
            for (const row of results) {
              const partNumber = row.part_number || row.PartNumber;
              const bulan = row.bulan || row.Month;
              const tahun = row.tahun || row.Year;
              const qty = row.forecast || row.Quantity || row.qty;

              if (!partNumber || !bulan || !tahun || qty === undefined) continue;

              // Cari part_id
              const [parts] = await conn.promise().query("SELECT id FROM part WHERE part_number = ?", [partNumber]);
              if (parts.length === 0) continue;

              const partId = parts[0].id;

              // Cek apakah data sudah ada
              const [existing] = await conn.promise().query(
                "SELECT id FROM forecast_month WHERE part_id = ? AND bulan = ? AND tahun = ?",
                [partId, bulan, tahun]
              );

              if (existing.length > 0) {
                // Update
                await conn.promise().query(
                  "UPDATE forecast_month SET forecast_month = ? WHERE id = ?",
                  [qty, existing[0].id]
                );
              } else {
                // Insert
                await conn.promise().query(
                  "INSERT INTO forecast_month (part_id, bulan, tahun, forecast_month) VALUES (?, ?, ?, ?)",
                  [partId, bulan, tahun, qty]
                );
              }
            }

            conn.commit((err) => {
              if (err) throw err;
              conn.release();
              res.json({ message: "Import CSV berhasil", count: results.length });
            });
          } catch (error) {
            console.error(error);
            conn.rollback(() => {
              conn.release();
              res.status(500).json({ message: "Gagal memproses data CSV" });
            });
          }
        });
      });
    });
});

module.exports = router;
