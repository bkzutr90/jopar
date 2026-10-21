// Atur reaksi avatar saat ada gift.
// effect yang tersedia: senang, cinta, kaget, jahil, marah, sedih, wow, rainbow
// "match" dicocokkan (tanpa huruf besar/kecil) dengan nama gift. Urutan atas = prioritas.
module.exports = {
  rules: [
    { match: /mata/i,                  effect: 'rainbow', ms: 9000 },  // gift "Mata Dibayar Mata"
    { match: /mawar|rose|jan hati|heart|love/i, effect: 'cinta', ms: 5000 },
    { match: /kopi|coffee|tea|teh/i,   effect: 'senang',  ms: 4000 },
    { match: /lion|universe|galaxy|rocket|dragon|castle/i, effect: 'wow', ms: 8000 },
  ],
  // Kalau tidak ada rule yang cocok, dilihat dari total diamond (nilai x jumlah)
  tiers: [
    { min: 100, effect: 'wow',    ms: 8000 },
    { min: 20,  effect: 'kaget',  ms: 5000 },
    { min: 0,   effect: 'senang', ms: 4000 },
  ],
};
