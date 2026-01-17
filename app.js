import express from "express";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Simpan data sementara di memory (array)
const bmiHistory = [];

/**
 * POST /api/v1/bmi
 * input: id, heightCm, weightKg, bmi, gender, createdAtMillis
 */
app.post("/api/v1/bmi", (req, res) => {
    const { id, heightCm, weightKg, bmi, gender, createdAtMillis } = req.body ?? {};
    console.log('tesss');
    

    // Validasi minimal
    if (!id) {
        return res.status(400).json({ ok: false, message: "id wajib" });
    }
    const h = Number(heightCm);
    const w = Number(weightKg);
    const b = Number(bmi);
    const ts = Number(createdAtMillis);

    if (!Number.isFinite(h) || h <= 0) {
        return res.status(400).json({ ok: false, message: "heightCm harus angka > 0" });
    }
    if (!Number.isFinite(w) || w <= 0) {
        return res.status(400).json({ ok: false, message: "weightKg harus angka > 0" });
    }
    if (!Number.isFinite(b) || b <= 0) {
        return res.status(400).json({ ok: false, message: "bmi harus angka > 0" });
    }
    if (!Number.isFinite(ts) || ts <= 0) {
        return res.status(400).json({ ok: false, message: "createdAtMillis harus angka > 0" });
    }
    if (typeof gender !== "string" || gender.trim() === "") {
        return res.status(400).json({ ok: false, message: "gender wajib string" });
    }

    // Anti double: id harus unik
    const exists = bmiHistory.some((x) => x.id === id);
    if (exists) {
        return res.status(200).json({
            ok: true,
            duplicated: true,
            message: "Data dengan id yang sama sudah ada (tidak di-insert ulang).",
        });
    }

    const record = {
        id,
        heightCm: h,
        weightKg: w,
        bmi: b,
        gender: gender.trim(),
        createdAtMillis: ts,
    };

    bmiHistory.push(record);

    return res.status(201).json({
        ok: true,
        duplicated: false,
        data: record,
        total: bmiHistory.length,
    });
});

// (opsional) cek isi array cepat
app.get("/api/v1/bmi", (_req, res) => {
    res.json({ ok: true, data: bmiHistory, total: bmiHistory.length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BMI API running on http://localhost:${PORT}`));
