import json, asyncio
from playwright.async_api import async_playwright
q=json.load(open('data/quran-ar.json')); L=json.load(open('data/quran-lines.json'))['pages']
words=[t.split(' ') for t in q['text']]
AR='٠١٢٣٤٥٦٧٨٩'
def ar(n): return ''.join(AR[int(c)] for c in str(n))
lines=[]
for p,pg in enumerate(L):
    if p<2: continue
    for ln in pg:
        if isinstance(ln,list):
            toks=[]
            for c in ln:
                a,j=divmod(c,256)
                toks.append(('e',ar(q['ayahs'][a][1])) if j==255 else ('w',words[a][j]))
            lines.append(toks)
import html
body=''.join('<div class="l">'+''.join(f'<span>{html.escape(t)}</span>' if k=='w' else f'<span class="ay">{t}</span>' for k,t in toks)+'</div>' for toks in lines)
page=f'''<html><head><style>
@font-face{{font-family:AQ;src:url(file://{__import__('os').getcwd()}/fm/fontsource-amiri-quran-5.3.0/package/files/amiri-quran-arabic-400-normal.woff2)}}
@font-face{{font-family:AM;src:url(file://{__import__('os').getcwd()}/fm/fontsource-amiri-5.3.0/package/files/amiri-arabic-400-normal.woff2)}}
.l{{font-family:AQ;font-size:100px;white-space:nowrap;display:inline-block;direction:rtl;word-spacing:0}}
.l span{{margin:0 .12em}}
.ay{{display:inline-flex;min-width:1.6em;height:1.6em;margin:0 .1em;font-family:AM;font-size:.56em;border:1.5px solid}}
</style></head><body dir=rtl>{body}</body></html>'''
open('m.html','w').write(page)
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch(); pg=await b.new_page()
        await pg.goto('file://'+__import__('os').getcwd()+'/m.html'); await pg.wait_for_timeout(1500)
        ws=await pg.evaluate("Array.from(document.querySelectorAll('.l')).map(e=>e.getBoundingClientRect().width)")
        fam=await pg.evaluate("document.fonts.check('100px AQ')")
        await b.close()
    json.dump(ws, open("widths.json","w")); ws=sorted(ws); n=len(ws)
    print('font ok',fam,'lines',n,'median',ws[n//2],'p95',ws[int(n*.95)],'p99',ws[int(n*.99)],'max',ws[-1])
asyncio.run(main())
