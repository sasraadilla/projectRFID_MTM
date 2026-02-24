const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const JWT_SECRET = "rfid_troli_rahasia";
const cors = require("cors");
const usersRoutes = require("./routes/users.routes");

app.use(express.json()); // WAJIB nanti untuk POST

app.get("/", (req, res) => {
  res.send("Backend RFID hidup 🚀");
});

app.get("/test", (req, res) => {
  res.json({
    status: "ok",
    message: "Endpoint test jalan"
  });
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/customers", require("./routes/customers.routes"));
app.use("/api/parts", require("./routes/parts.routes"));
app.use("/api/packaging-types", require("./routes/packaging_types.routes"));
app.use("/api/packagings", require("./routes/packagings.routes"));
app.use("/api/assets", require("./routes/assets.routes"));
app.use("/api/asset-events", require("./routes/assetEvents.routes"));
app.use("/api/tracking", require("./routes/tracking.routes"));
app.use("/api/readers", require("./routes/readers.routes"));
app.use("/api/repairs", require("./routes/repairs.routes"));
app.use("/api/forecast", require("./routes/forecast.routes"));
app.use("/api/forecast/month", require("./routes/forecastMonth.routes"));
app.use("/api/kalender-kerja", require("./routes/kalenderKerja.routes"));
app.use("/api/lead-time", require("./routes/leadTime.routes"));
app.use("/api/actual-packaging", require("./routes/actualPackaging.routes"));

app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});
