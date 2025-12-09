const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "vendorA.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Gagal konek SQLite:", err);
  } else {
    console.log("SQLite connected at", dbPath);
  }
});

// bikin tabel kalau belum ada
db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS vendor_a_products (
      kd_produk TEXT PRIMARY KEY,
      nm_brg TEXT NOT NULL,
      hrg TEXT NOT NULL,
      ket_stok TEXT NOT NULL
    )
  `,
    (err) => {
      if (err) {
        console.error("Gagal bikin tabel vendor_a_products:", err);
      } else {
        console.log("Tabel vendor_a_products siap");
      }
    }
  );
});

module.exports = db;
