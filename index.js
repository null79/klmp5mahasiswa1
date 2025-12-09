const express = require("express");
const vendorARouter = require("./routes/vendorA.routes");
require("./db"); // ini supaya db.js dieksekusi & tabel dibuat

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// PREFIX UTAMA: /api/vendor-a
app.use("/api/vendor-a", vendorARouter);

app.listen(PORT, () => {
  console.log(`Vendor A API running at http://localhost:${PORT}`);
});
