const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, (req, res) => {
  db.query("SELECT * FROM assets", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Gagal ambil assets" });
    }
    res.json(results);
  });
});

module.exports = router;
