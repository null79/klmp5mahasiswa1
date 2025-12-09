const express = require("express");
const router = express.Router();
const db = require("../db");

// READ ALL: GET /api/vendor-a
router.get("/", (req, res) => {
  db.all(
    "SELECT kd_produk, nm_brg, hrg, ket_stok FROM vendor_a_products",
    [],
    (err, rows) => {
      if (err) {
        console.error("Error DB (GET all):", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(rows);
    }
  );
});

// READ ONE: GET /api/vendor-a/:kd_produk
router.get("/:kd_produk", (req, res) => {
  const { kd_produk } = req.params;
  db.get(
    "SELECT kd_produk, nm_brg, hrg, ket_stok FROM vendor_a_products WHERE kd_produk = ?",
    [kd_produk],
    (err, row) => {
      if (err) {
        console.error("Error DB (GET one):", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (!row) return res.status(404).json({ error: "Product not found" });
      res.json(row);
    }
  );
});

// CREATE: POST /api/vendor-a
router.post("/", (req, res) => {
  const { kd_produk, nm_brg, hrg, ket_stok } = req.body;

  if (!kd_produk || !nm_brg || !hrg || !ket_stok) {
    return res.status(400).json({
      error: "kd_produk, nm_brg, hrg, ket_stok wajib diisi",
    });
  }

  const stok = String(ket_stok).toLowerCase();
  if (!["ada", "habis"].includes(stok)) {
    return res
      .status(400)
      .json({ error: 'ket_stok harus "ada" atau "habis"' });
  }

  const hargaStr = String(hrg);
  if (!/^\d+$/.test(hargaStr)) {
    return res
      .status(400)
      .json({ error: "hrg harus berupa string angka, contoh: '15000'" });
  }

  db.run(
    "INSERT INTO vendor_a_products (kd_produk, nm_brg, hrg, ket_stok) VALUES (?, ?, ?, ?)",
    [kd_produk, nm_brg, hargaStr, stok],
    function (err) {
      if (err) {
        console.error("Error DB (INSERT):", err);
        if (err.message && err.message.includes("UNIQUE")) {
          return res
            .status(409)
            .json({ error: "kd_produk sudah digunakan" });
        }
        return res.status(500).json({ error: "Internal server error" });
      }

      res.status(201).json({
        message: "Product created",
        kd_produk,
      });
    }
  );
});

// UPDATE: PUT /api/vendor-a/:kd_produk
router.put("/:kd_produk", (req, res) => {
  const { kd_produk } = req.params;
  const { nm_brg, hrg, ket_stok } = req.body;

  if (!nm_brg || !hrg || !ket_stok) {
    return res.status(400).json({
      error: "nm_brg, hrg, ket_stok wajib diisi untuk update",
    });
  }

  const stok = String(ket_stok).toLowerCase();
  if (!["ada", "habis"].includes(stok)) {
    return res
      .status(400)
      .json({ error: 'ket_stok harus "ada" atau "habis"' });
  }

  const hargaStr = String(hrg);
  if (!/^\d+$/.test(hargaStr)) {
    return res
      .status(400)
      .json({ error: "hrg harus berupa string angka, contoh: '15000'" });
  }

  db.run(
    `
    UPDATE vendor_a_products
    SET nm_brg = ?, hrg = ?, ket_stok = ?
    WHERE kd_produk = ?
  `,
    [nm_brg, hargaStr, stok, kd_produk],
    function (err) {
      if (err) {
        console.error("Error DB (UPDATE):", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      console.log("UPDATED rows:", this.changes);

      if (this.changes === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({ message: "Product updated" });
    }
  );
});

// DELETE: DELETE /api/vendor-a/:kd_produk
router.delete("/:kd_produk", (req, res) => {
  const { kd_produk } = req.params;

  db.run(
    "DELETE FROM vendor_a_products WHERE kd_produk = ?",
    [kd_produk],
    function (err) {
      if (err) {
        console.error("Error DB (DELETE):", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({ message: "Product deleted" });
    }
  );
});

module.exports = router;
