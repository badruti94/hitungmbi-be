import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BMI API running on http://localhost:${PORT}`));
