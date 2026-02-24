const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = "rfid_troli_rahasia";

/* ========================
   LOGIN
   Schema users: id, username, email, password, name, role,
                 is_active(tinyint), last_login, created_at, updated_at, deleted_at
======================== */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Filter: user aktif dan belum dihapus
  const sql = "SELECT * FROM users WHERE username = ? AND is_active = 1 AND deleted_at IS NULL";
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("Login DB error:", err.message);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    const user = results[0];

    // Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    // Update last_login
    db.query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id]);

    // Buat JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  });
});

module.exports = router;
