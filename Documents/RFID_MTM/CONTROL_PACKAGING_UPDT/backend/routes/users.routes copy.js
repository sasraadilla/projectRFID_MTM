const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/authMiddleware");

/* ========================
   GET ALL USERS
======================== */
router.get("/", auth, (req, res) => {
  db.query(
    "SELECT id, username, name, role FROM users",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

/* ========================
   CREATE USER
======================== */
router.post("/", auth, async (req, res) => {
  const { username, password, name, role, email } = req.body;

  if (!username || !name || !email || !password || !role) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  try {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (username, name, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [username, name, email, hashedPassword, role],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Gagal menambah user" });
        }

        res.json({
          message: "User berhasil ditambahkan",
        });
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
// GET USER BY ID
// ======================
router.get("/:id", auth, (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT id, username, name, email, role
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(results[0]);
  });
});

// ======================
// UPDATE USER
// ======================
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { username, name, email, password, role } = req.body;

  try {
    let sql = "";
    let params = [];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql = `
        UPDATE users
        SET username=?, name=?, email=?, password=?, role=?
        WHERE id=?
      `;
      params = [username, name, email, hashedPassword, role, id];
    } else {
      sql = `
        UPDATE users
        SET username=?, name=?, email=?, role=?
        WHERE id=?
      `;
      params = [username, name, email, role, id];
    }

    db.query(sql, params, (err) => {
      if (err) {
        return res.status(500).json({ message: "Gagal update user" });
      }

      res.json({ message: "User berhasil diperbarui" });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


/* ========================
   DELETE USER
======================== */
router.delete("/:id", auth, (req, res) => {
  db.query(
    "DELETE FROM users WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User berhasil dihapus" });
    }
  );
});

module.exports = router;
