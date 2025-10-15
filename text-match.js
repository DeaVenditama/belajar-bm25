#!/usr/bin/env node

const tokenize = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter((term) => term);

const bm25 = (sentences, query, top_k = 3) => {
  const k1 = 1.2;
  const b = 0.75;

  const doc = sentences.map(tokenize);
  const qt = tokenize(query);

  const df = {};
  doc.forEach((terms) => {
    const uniqueTerms = new Set(terms);
    uniqueTerms.forEach((term) => {
      df[term] = (df[term] || 0) + 1;
    });
  });

  const avgdl = doc.reduce((sum, terms) => sum + terms.length, 0) / doc.length;

  const scores = doc.map((terms, index) => {
    let score = 0;
    qt.forEach((qi) => {
      if (df[qi]) {
        const idf = Math.log(
          (sentences.length - df[qi] + 0.5) / (df[qi] + 0.5) + 1
        );
        const tf = terms.filter((term) => term === qi).length;
        const numerator = tf * (k1 + 1);
        const denominator = tf + k1 * (1 - b + b * (terms.length / avgdl));
        score += idf * (numerator / denominator);
      }
    });
    return { index, score };
  });

  return scores.sort((a, b) => b.score - a.score).slice(0, top_k);
};

export default { bm25, tokenize };
