# 🔍 Aplikasi Pencarian BM25

Aplikasi Javascript sederhana yang melakukan **pencarian berbasis BM25 (keyword-based probabilistic ranking)**, kemudian mengirimkan hasil pencarian teratas sebagai **konteks** ke model bahasa besar (LLM) **Google Gemini** untuk menghasilkan ringkasan atau penjelasan berbasis data.  
Sumber data aplikasi ini berasal dari **feed JSON Berita Resmi Statistik (BRS)** milik [Badan Pusat Statistik (bps.go.id)](https://bps.go.id).

---

## 🧩 Fitur Utama

1. **Pencarian Berbasis BM25**

   - Menggunakan pustaka [text-match](https://github.com/ariya/text-match/tree/main) untuk menghitung skor BM25.
   - Mengurutkan hasil pencarian berdasarkan skor kata kunci terhadap isi teks.
   - Cocok untuk pencarian berbasis teks panjang seperti dokumen _Berita Resmi Statistik_.

2. **Integrasi LLM (Google Gemini)**

   - Hasil pencarian dengan skor tertinggi (misalnya 3 teratas) dikirim sebagai **konteks** ke model Gemini.
   - Gemini kemudian menghasilkan jawaban, ringkasan, atau penjelasan berbasis data yang relevan.

3. **Sumber Data JSON**

   - Data berasal dari feed JSON _Berita Resmi Statistik_ BPS (https://bps.go.id).
   - Setiap entri berisi metadata seperti judul, tanggal publikasi, dan isi teks.

4. **REST API dengan Express**
   - Menyediakan endpoint untuk pencarian dan integrasi konteks dengan Gemini.
   - Dapat diintegrasikan ke aplikasi frontend, dashboard, atau chatbot analitik.

---

## ⚙️ Teknologi yang Digunakan

| Komponen              | Deskripsi                                   |
| --------------------- | ------------------------------------------- |
| **Node.js**           | Lingkungan runtime JavaScript               |
| **Express.js**        | Framework server web REST API               |
| **Google Gen AI SDK** | SDK resmi untuk mengakses LLM Gemini        |
| **text-match**        | Library untuk pencarian teks berbasis BM25  |

---

## 🧠 Alur Proses

1. Pengguna mengirimkan query pencarian, misalnya:
2. Sistem menghitung skor BM25 untuk setiap teks dalam dataset JSON BRS.
3. Tiga hasil teratas digabung dan dikirim sebagai **konteks** ke Gemini.
4. Gemini menghasilkan jawaban berbasis konteks yang diberikan.

## Screenshot
<img width="1579" height="963" alt="image" src="https://github.com/user-attachments/assets/47e98276-c1a1-42bb-957e-6a85258aada9" />

