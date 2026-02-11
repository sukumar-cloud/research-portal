function chunkText(text, maxLength = 4000) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = start + maxLength;
    chunks.push(text.slice(start, end));
    start = end;
  }

  return chunks;
}

module.exports = { chunkText };
