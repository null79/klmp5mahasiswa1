const express = require("express");
const app = express();
const PORT = 3000;

// ambil data dari file JSON
const vendorAProducts = require("./vendorA.json");

// endpoint untuk Vendor A
app.get("/vendor-a/products", (req, res) => {
  res.json(vendorAProducts);
});

// nyalakan server
app.listen(PORT, () => {
  console.log(`Vendor A API running at http://localhost:${PORT}`);
});
