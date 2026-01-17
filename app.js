import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const tips = [
    { id: 1, title: "Minum air putih yang cukup setiap hari" },
    { id: 2, title: "Olahraga ringan minimal 30 menit" },
    { id: 3, title: "Tidur cukup 7–8 jam per malam" },
    { id: 4, title: "Kurangi konsumsi gula berlebih" },
    { id: 5, title: "Perbanyak konsumsi buah dan sayur" },
    { id: 6, title: "Kelola stres dengan baik" },
    { id: 7, title: "Jaga pola makan teratur" },
    { id: 8, title: "Hindari begadang terlalu sering" }
];

const bmiHistory = [];
const seenIds = new Set(); // buat deteksi duplikasi opsional

/**
 * POST /api/v1/bmi/sync
 * body: { records: [{id, heightCm, weightKg, bmi, gender, createdAtMillis}, ...] }
 */
app.post("/api/v1/bmi/sync", (req, res) => {
    const records = req.body?.records;

    if (!Array.isArray(records)) {
        return res.status(400).json({
            ok: false,
            message: "Invalid body. Expected { records: [...] }",
        });
    }

    let saved = 0;
    let duplicated = 0;

    for (const r of records) {
        // validasi minimal
        if (r?.id == null) continue;

        // dedup by id (opsional)
        if (seenIds.has(r.id)) {
            duplicated++;
            continue;
        }

        seenIds.add(r.id);
        bmiHistory.push(r);
        saved++;
    }

    return res.status(200).json({
        ok: true,
        saved,
        duplicated,
        total: bmiHistory.length,
    });
});

// cek isi memory
app.get("/api/v1/bmi", (_req, res) => {
    res.json({ ok: true, data: bmiHistory, total: bmiHistory.length });
});

app.get("/api/v1/tips", (_req, res) => {
    res.json(tips);
});

// =========================
// GET 1 tips random
// =========================
app.get("/api/v1/tips/random", (_req, res) => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    const tip = tips[randomIndex];

    res.json(tip);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BMI API running on http://localhost:${PORT}`));
