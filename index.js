// index.js
import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import textMatch from "./text-match.js";
import chunkPerPage from "./chunk.js";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { bm25 } = textMatch;
const app = express();
const PORT = process.env.PORT || 3000;
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(express.static(path.join(__dirname, "public")));

let data = [];
let textSentences = [];
let chunks = [];
try {
  const raw = fs.readFileSync(
    path.join(__dirname, "ihk_sept2025_text_per_page.json"),
    "utf-8"
  );
  data = JSON.parse(raw);
  chunks = chunkPerPage(data);
  textSentences = chunks.map((c) => c.text);
} catch (err) {
  console.error("⚠️  Failed to load JSON:", err.message);
}

app.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  const matches = bm25(textSentences, q, 10);
  const text = [...new Set(matches.map((m) => m.index))]
    .map((i) => chunks[i]?.text || "")
    .join(" ");
  const prompt = `
  Anda adalah mesin penjawab. Jawab berbasis konteks dan ramah. Tidak perlu menyebutkan berdasarkan konteks yang anda berikan pada jawaban

  Pertanyaan: ${q}

  Konteks:
  ${text}
  `;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      temperature: 0.2,
    },
  });

  const results = matches.map(({ index, score }) => {
    const c = chunks[index]; // chunk yang cocok
    const snippet = c.text.length > 300 ? c.text.slice(0, 300) + "…" : c.text;
    return {
      score: Number(score.toFixed(4)), // skor BM25
      page: c.page, // metadata dari chunk
      snippet: snippet, // atau potong biar ringkas
    };
  });

  return res.json({
    answer: response.text,
    results: results,
  });
});

// 404 handler (taruh paling akhir)
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
