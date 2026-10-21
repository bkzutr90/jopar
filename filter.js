// Filter komen toxic. Komen yang kena TIDAK ditampilkan, TIDAK dibacakan, dan TIDAK dijawab.
// Edit daftar di bawah sesuai kebutuhan, atau tambah lewat BLOCK_WORDS di .env (pisahkan koma).

// Dicocokkan sebagai potongan kata (tetap kena meski menempel, mis. "dasaranjing").
// Catatan: "anjing" juga memblokir pembicaraan soal hewannya. Hapus dari daftar jika tidak mau.
const STRICT = [
  'anjing', 'bangsat', 'bajingan', 'kontol', 'memek', 'ngentot', 'ngewe', 'jancok', 'jancuk',
  'goblok', 'tolol', 'brengsek', 'keparat', 'pelacur', 'lonte', 'pepek', 'jembut', 'colmek',
  'bokep', 'sange', 'kampang', 'bedebah', 'imbecil', 'fuck', 'shit', 'bitch', 'asshole', 'dick', 'nigga', 'nigger', 'faggot',
];

// Hanya cocok jika berdiri sebagai kata utuh (supaya "asumsi" atau "tainted" tidak ikut kena).
const WORDS = [
  'asu', 'babi', 'tai', 'taik', 'idiot', 'mampus', 'monyet', 'kunyuk', 'anjg', 'bgst', 'bngst',
  'ajg', 'kntl', 'mmk', 'ngtd', 'perek', 'coli', 'bacot', 'sinting', 'gila', 'autis', 'bego',
];
// "anjir", "gila", "bego", "bacot" itu ringan; hapus dari WORDS kalau mau tetap diizinkan.

const PHRASES = [
  /bunuh\s*(lo|lu|kamu|dia|diri)/, /mati\s*(aja|saja)\s*(lo|lu|kamu)?/, /(lo|lu|kamu)\s*mati/, /gantung\s*diri/,
];

const LEET = { 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', 8: 'b', '@': 'a', $: 's', '!': 'i', '|': 'i' };
const collapse = (s) => s.replace(/(\p{L})\1+/gu, '$1');            // "anjiiiing" -> "anjing"
function norm(s) {
  return collapse(
    String(s || '')
      .normalize('NFKD').replace(/[\u0300-\u036f\u200b-\u200f\u2060\ufeff]/g, '')
      .toLowerCase()
      .replace(/[0134578@$!|]/g, (c) => LEET[c])
  );
}

const extra = (process.env.BLOCK_WORDS || '').split(',').map((s) => norm(s.trim())).filter(Boolean);
const STRICT_N = STRICT.map(norm);
const LONG_N = STRICT_N.filter((w) => w.length >= 6);              // untuk deteksi "a.n.j.i.n.g"
const WORDS_SET = new Set([...WORDS.map(norm), ...extra]);

function isToxic(text) {
  if (process.env.TOXIC_FILTER === '0') return false;
  const n = norm(text);
  if (!n) return false;
  const words = n.split(/[^\p{L}]+/u).filter(Boolean);
  if (words.some((w) => WORDS_SET.has(w))) return true;
  if (STRICT_N.some((w) => n.includes(w))) return true;
  const squeezed = n.replace(/[^\p{L}]+/gu, '');                    // hilangkan spasi/titik di antara huruf
  if (LONG_N.some((w) => squeezed.includes(w))) return true;
  return PHRASES.some((re) => re.test(n));
}
module.exports = { isToxic };
