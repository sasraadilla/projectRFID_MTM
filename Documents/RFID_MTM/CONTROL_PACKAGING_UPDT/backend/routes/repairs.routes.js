const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

/* =========================
   GET ALL REPAIRS
========================= */
router.get("/", auth, (req, res) => {
  const sql = `
    SELECT 
      r.id,
      r.asset_id,
      a.asset_code,
      r.repair_type,
      r.location,
      r.notes,
      r.status,
      r.repair_date,
      r.finished_at
    FROM repairs r
    JOIN assets a ON r.asset_id = a.id
    ORDER BY r.repair_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal mengambil data repair" });
    }
    res.json(results);
  });
});

/* =========================
   CREATE REPAIR
========================= */
router.post("/", auth, (req, res) => {
  const { asset_id, repair_type, location, notes } = req.body;

  if (!asset_id || !repair_type || !location) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  // cek asset masih repair
  db.query(
    "SELECT id FROM repairs WHERE asset_id=? AND status='ongoing'",
    [asset_id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (rows.length > 0) {
        return res.status(400).json({ message: "Asset masih dalam proses repair" });
      }

      db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ message: "Gagal ambil connection" });

        connection.beginTransaction(err => {
          if (err) {
            connection.release();
            return res.status(500).json({ message: "Transaction error" });
          }

          connection.query(
            `INSERT INTO repairs
            (asset_id, repair_type, location, notes, repair_date, status, created_at)
            VALUES (?, ?, ?, ?, NOW(), 'ongoing', NOW())`,
            [asset_id, repair_type, location, notes],
            (err) => {
              if (err) return connection.rollback(() => {
                connection.release();
                return res.status(500).json({ message: "Gagal tambah repair", error: err });
              });

              connection.query(
                "UPDATE assets SET status='repair' WHERE id=?",
                [asset_id],
                (err) => {
                  if (err) return connection.rollback(() => {
                    connection.release();
                    return res.status(500).json({ message: "Gagal update asset", error: err });
                  });

                  connection.commit(err => {
                    if (err) return connection.rollback(() => {
                      connection.release();
                      return res.status(500).json({ message: "Commit gagal", error: err });
                    });

                    connection.release();
                    res.json({ message: "Repair dimulai" });
                  });
                }
              );
            }
          );
        });
      });
    }
  );
});

/* =========================
   FINISH REPAIR
========================= */
router.put("/:id/finish", auth, (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT asset_id FROM repairs WHERE id=? AND status='ongoing'",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (rows.length === 0) return res.status(404).json({ message: "Repair tidak ditemukan" });

      const asset_id = rows[0].asset_id;

      db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ message: "Gagal ambil connection" });

        connection.beginTransaction(err => {
          if (err) {
            connection.release();
            return res.status(500).json({ message: "Transaction error" });
          }

          connection.query(
            "UPDATE repairs SET status='finished', finished_at=NOW() WHERE id=?",
            [id],
            (err) => {
              if (err) return connection.rollback(() => {
                connection.release();
                return res.status(500).json({ message: "Gagal update repair", error: err });
              });

              connection.query(
                "UPDATE assets SET status='in' WHERE id=?",
                [asset_id],
                (err) => {
                  if (err) return connection.rollback(() => {
                    connection.release();
                    return res.status(500).json({ message: "Gagal update asset", error: err });
                  });

                  connection.commit(err => {
                    if (err) return connection.rollback(() => {
                      connection.release();
                      return res.status(500).json({ message: "Commit gagal", error: err });
                    });

                    connection.release();
                    res.json({ message: "Repair selesai" });
                  });
                }
              );
            }
          );
        });
      });
    }
  );
});

module.exports = router;
