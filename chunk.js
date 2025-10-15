export function chunkPerPage(data, size = 1000, overlap = 200) {
  if (overlap >= size) {
    throw new Error("overlap harus lebih kecil dari size");
  }

  const chunks = [];
  let globalChunkIndex = 0;

  for (const item of data) {
    const pageText = String(item.Text ?? "");
    const step = size - overlap;

    for (let start = 0; start < pageText.length; start += step) {
      const end = Math.min(start + size, pageText.length);
      const text = pageText.slice(start, end);

      chunks.push({
        page: item.Page, // halaman asal
        chunkIndexInPage: Math.floor(start / step) + 1,
        globalChunkIndex: ++globalChunkIndex,
        start, // offset awal (karakter) di halaman tsb
        end, // offset akhir (eksklusif) di halaman tsb
        text, // isi chunk
      });

      if (end === pageText.length) break; // selesai untuk halaman ini
    }
  }

  return chunks;
}

export default chunkPerPage;
