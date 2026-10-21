import fs from 'fs';
const base = process.argv[2];
const m = await import(base + '/q/meta/package/dist/hafs.js');
const P = base + '/q/pkg/package/dist/';
const ar = JSON.parse(fs.readFileSync(P+'quran.json'));
const bn = JSON.parse(fs.readFileSync(P+'quran_bn.json'));
const en = JSON.parse(fs.readFileSync(P+'quran_en.json'));
const ie = JSON.parse(fs.readFileSync(P+'chapters/en/index.json'));
const ib = JSON.parse(fs.readFileSync(P+'chapters/bn/index.json'));
const A=[], B=[], E=[], S=[];
for (let s=1;s<=114;s++){
  const sm = m.getSurahMeta(s);
  const v = ar[s-1].verses, vb=bn[s-1].verses, ve=en[s-1].verses;
  if (v.length!==sm.ayahCount) throw 'count '+s;
  v.forEach((x,i)=>{A.push(x.text); B.push(vb[i].translation); E.push(ve[i].translation);});
  S.push({n:s, ar:ar[s-1].name, tr:ar[s-1].transliteration, en:ie[s-1].translation, bn:ib[s-1].translation,
    ayahs:sm.ayahCount, meccan:sm.isMeccan, order:sm.surahOrder, rukus:sm.rukuCount,
    page:m.findPage(s,1), juz:m.findJuz(s,1)});
}
// pages: [firstAyahId, lastAyahId] 1-based global ids, plus juz/hizb of first ayah
const pages=[];
for (let p=1;p<=604;p++){
  const pm=m.getPageMeta(p);
  pages.push(pm);
}
console.log(JSON.stringify(pages[1]), JSON.stringify(pages[603]));
const ayahMeta = [];
for (let id=1; id<=6236; id++){ const a=m.getAyahMeta(id); ayahMeta.push([a.surah,a.ayah,a.page,a.juz,a.hizbId]); }
const out={source:{text:'Tanzil/QuranEnc Uthmani via quran-json 3.1.2',layout:'quran-meta 7.0.0 Hafs Madani 604'},surahs:S, ayahs:ayahMeta, text:A};
fs.writeFileSync(base+'/data/quran-ar.json', JSON.stringify(out));
fs.writeFileSync(base+'/data/quran-bn.json', JSON.stringify(B));
fs.writeFileSync(base+'/data/quran-en.json', JSON.stringify(E));
console.log(A.length, S.length);
