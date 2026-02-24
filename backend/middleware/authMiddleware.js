const jwt = require("jsonwebtoken");
const JWT_SECRET = "rfid_troli_rahasia";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ada" });
  }

  const token = authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Format token salah" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // simpan user hasil decode
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
}

module.exports = authMiddleware;
