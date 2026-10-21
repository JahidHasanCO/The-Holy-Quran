import json, collections
q=json.load(open('data/quran-ar.json'))
d=json.load(open('pk/_kmaslesa_holy-quran-word-by-word-full-data/package/data.json'))
key2idx={f"{a[0]}:{a[1]}":i for i,a in enumerate(q['ayahs'])}
kw=collections.defaultdict(list); kend={}
meta_seq=collections.defaultdict(list)
for p in d:
    for A in p['ayahs']:
        lt=A['metaData'].get('lineType')
        if lt: meta_seq[p['page']].append(('s' if lt=='start_sura' else 'b', A['metaData'].get('suraName')))
        for w in A['words']:
            k=w['parentAyahVerseKey']
            if w['char_type_name']=='word': kw[k].append(w)
            else: kend[k]=w
lines={p:collections.defaultdict(list) for p in range(1,605)}
wbw=[]; mism=[]
for i,a in enumerate(q['ayahs']):
    k=f"{a[0]}:{a[1]}"; ours=q['text'][i].split(' '); K=kw[k]; nu,nk=len(ours),len(K)
    ok = nu==nk
    if not ok: mism.append(k)
    g=[]
    for j in range(nu):
        m=K[min(nk-1, round(j*(nk-1)/max(1,nu-1)))] if not ok else K[j]
        lines[m['page_number']][m['line_number']].append(i*256+j)
        g.append([m['transliteration']['text'] or '', m['translation']['text'] or ''] if ok else None)
    e=kend[k]; lines[e['page_number']][e['line_number']].append(i*256+255)
    wbw.append(g)
# surah/basmala lines: fill empty line numbers in order with meta_seq
surah_by_name={}
pages=[]
for p in range(1,605):
    L=lines[p]; used=sorted(L)
    maxl = 15 if p>2 else max(used)+ (1 if p<=2 else 0)
    seq=list(meta_seq[p]); out=[]
    rng = range(1, 16) if p>2 else range(1, max(used)+2)
    for ln in rng:
        if ln in L: out.append(L[ln])
        elif seq:
            t,name=seq.pop(0); out.append('S' if t=='s' else 'B')
        else: out.append(None)
    if seq: print('leftover meta',p,seq)
    pages.append(out)
# drop trailing None on pages 1,2
print('mismatch',len(mism))
print('p1',pages[0]); print('p2',[x if isinstance(x,str) else (len(x) if x else x) for x in pages[1]])
print('p3',[len(x) if isinstance(x,list) else x for x in pages[2]])
empties=[(p+1,j+1) for p,pg in enumerate(pages) for j,x in enumerate(pg) if x is None and p>1]
print('empty lines (p>2):',len(empties),empties[:20])
json.dump({'pages':pages}, open('data/quran-lines.json','w'), separators=(',',':'))
json.dump(wbw, open('data/quran-wbw-en.json','w'), separators=(',',':'), ensure_ascii=False)
