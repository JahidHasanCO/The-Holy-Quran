// Reader markup. `v` is the view model; `on(fn)` registers an event handler and returns its id.
import { esc, attr, bool } from './escape.js';

export function readerView(v, on) {
  return `<div style="min-height: 100vh; box-sizing: border-box; background: ${attr(v.shellBg)}; color: var(--ink); font-family: 'Noto Sans', system-ui, sans-serif; ${attr(v.cssVars)}">

  
  <header style="position: sticky; top: 0; z-index: 10; ${attr(v.headerStyle)}">
    <div style="max-width: 1600px; margin: 0 auto; height: 52px; padding: 0 ${attr(v.edgePx)}; display: flex; align-items: center; justify-content: space-between; gap: 8px">
      <div style="display: flex; align-items: center; gap: 2px; min-width: 0">
        ${v.isOpen ? `<button class="btn icon ghost" aria-label="Surah and juz list" data-on-click="${on(v.openContents)}">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h10"></path></svg>
        </button>` : ''}
        ${v.isOpen ? `
          <button class="btn icon ghost" aria-label="Close the book" data-on-click="${on(v.closeBook)}">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"></path><path d="M5 17a3 3 0 0 1 3-3h11"></path></svg>
          </button>
        ` : ''}
        <button data-on-click="${on(v.openInfo)}" aria-label="About this surah" style="display: flex; align-items: center; gap: 10px; min-height: 44px; padding: 0 10px; border: 0; border-radius: 10px; background: transparent; color: var(--ink); cursor: pointer; min-width: 0">
          <span lang="ar" dir="rtl" style="font-family: 'Amiri', serif; font-size: 19px; font-weight: 700; color: var(--accent); white-space: nowrap">${esc(v.topArShort)}</span>
          <span style="font-size: 13px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">${esc(v.topLine)}</span>
        </button>
      </div>
      <div style="display: flex; align-items: center; gap: 2px">
        ${v.isOpen ? `
          <button class="btn icon ghost" aria-label="${attr(v.bookmarkLabel)}" aria-pressed="${attr(v.isBookmarked)}" data-on-click="${on(v.toggleBookmark)}">
            <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="${attr(v.bookmarkFill)}" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 4h12v17l-6-4-6 4z"></path></svg>
          </button>
        ` : ''}
        ${v.signedOut ? `
          <button class="btn" data-on-click="${on(v.openSignin)}" style="height: 36px; padding: 0 14px; font-size: 13px">Sign in</button>
        ` : ''}
        ${v.signedIn ? `
          <button class="btn icon primary" aria-label="Account" data-on-click="${on(v.openAccount)}" style="width: 36px; height: 36px; font-weight: 700; font-size: 14px">${esc(v.userInitial)}</button>
        ` : ''}
      </div>
    </div>
  </header>

  
  ${v.loading ? `
    <div style="max-width: 560px; margin: 32px auto; padding: 0 16px">
      <div style="background: var(--paper); border-radius: 8px; padding: 18px; box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 14px 36px rgba(0,0,0,.08)">
        <div style="min-height: 560px; border: 1px solid var(--gold); outline: 4px double var(--rule); outline-offset: -9px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px">
          <div lang="ar" style="font-family: 'Amiri', serif; font-size: 36px; font-weight: 700; color: var(--accent)">القرآن الكريم</div>
          <div style="font-size: 14px; color: var(--muted)">Opening the Mushaf…</div>
        </div>
      </div>
    </div>
  ` : ''}

  
  ${v.showCover ? `
    <div style="height: calc(100vh - 53px); overflow: hidden; box-sizing: border-box; display: flex; ${attr(v.cv?.pageLayout)}; padding: 4px 12px 8px; background: ${attr(v.coverBg)}">
      <div role="img" aria-label="The Mushaf as a 3D book. Drag to turn it all the way around." data-on-pointerdown="${on(v.cv?.down)}" data-on-pointermove="${on(v.cv?.move)}" data-on-pointerup="${on(v.cv?.up)}" data-on-pointercancel="${on(v.cv?.up)}" style="perspective: 1600px; width: ${attr(v.cv?.stageW)}; height: ${attr(v.cv?.stageH)}; display: flex; align-items: center; justify-content: center; cursor: ${attr(v.cv?.cursor)}; touch-action: none; user-select: none">
        <div style="position: relative; transform-style: preserve-3d; width: var(--bw); height: var(--bh); transform: ${attr(v.cv?.transform)}; transition: ${attr(v.cv?.transition)}; ${attr(v.cv?.dims)}">

          
          <div style="position: absolute; inset: 0; transform: rotateY(180deg) translateZ(calc(var(--bt) / 2)); backface-visibility: hidden; border-radius: 6px 10px 10px 6px; background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 88%, black), color-mix(in srgb, var(--primary) 55%, black) 60%, color-mix(in srgb, var(--primary) 42%, black)); box-shadow: inset 0 0 0 1px rgba(255,255,255,.06)">
            <div style="position: absolute; inset: 7%; border: 1.5px solid #C9A961; border-radius: 4px; opacity: .8"></div>
            <svg aria-hidden="true" viewBox="0 0 100 100" style="position: absolute; left: 50%; top: 50%; width: 26%; transform: translate(-50%, -50%); color: #C9A961; opacity: .85" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="22" y="22" width="56" height="56"></rect><rect x="22" y="22" width="56" height="56" transform="rotate(45 50 50)"></rect><circle cx="50" cy="50" r="9"></circle></svg>
          </div>

          
          <div style="position: absolute; top: 2%; height: 96%; width: calc(var(--bt) - 6px); left: calc(50% - (var(--bt) - 6px) / 2); transform: rotateY(-90deg) translateZ(calc(var(--bw) / 2 - 4px)); background: repeating-linear-gradient(90deg, #F5EEDC 0 2px, #E3D7BA 2px 3px)"></div>
          <div style="position: absolute; left: 1%; width: 97%; height: calc(var(--bt) - 6px); top: calc(50% - (var(--bt) - 6px) / 2); transform: rotateX(90deg) translateZ(calc(var(--bh) / 2 - 4px)); background: repeating-linear-gradient(0deg, #F5EEDC 0 2px, #E3D7BA 2px 3px)"></div>
          <div style="position: absolute; left: 1%; width: 97%; height: calc(var(--bt) - 6px); top: calc(50% - (var(--bt) - 6px) / 2); transform: rotateX(-90deg) translateZ(calc(var(--bh) / 2 - 4px)); background: repeating-linear-gradient(0deg, #F5EEDC 0 2px, #E3D7BA 2px 3px)"></div>

          
          <div style="position: absolute; top: 0; height: 100%; width: var(--bt); left: calc(50% - var(--bt) / 2); transform: rotateY(90deg) translateZ(calc(var(--bw) / 2)); background: linear-gradient(90deg, color-mix(in srgb, var(--primary) 42%, black), color-mix(in srgb, var(--primary) 88%, black) 30%, var(--primary) 50%, color-mix(in srgb, var(--primary) 88%, black) 70%, color-mix(in srgb, var(--primary) 42%, black)); display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 14% 0; box-sizing: border-box">
            <span style="width: 70%; height: 3px; background: #C9A961; box-shadow: 0 6px 0 #C9A961"></span>
            <span lang="ar" style="writing-mode: vertical-rl; font-family: 'Amiri', serif; font-weight: 700; font-size: calc(var(--bt) * .42); color: #E2C77E; letter-spacing: .04em">القرآن الكريم</span>
            <span style="width: 70%; height: 3px; background: #C9A961; box-shadow: 0 -6px 0 #C9A961"></span>
          </div>

          
          <div style="position: absolute; inset: 0; transform-style: preserve-3d; transform-origin: right center; transform: translateZ(calc(var(--bt) / 2)) rotateY(${attr(v.cv?.coverAngle)}); transition: transform 1.1s cubic-bezier(.4,.1,.2,1) .35s">
            <div style="position: absolute; inset: 0; backface-visibility: hidden; border-radius: 6px 10px 10px 6px; background: radial-gradient(ellipse at 40% 30%, color-mix(in srgb, var(--primary) 85%, white), color-mix(in srgb, var(--primary) 75%, black) 55%, color-mix(in srgb, var(--primary) 50%, black)); box-shadow: inset 0 0 0 1px rgba(255,255,255,.08), inset -10px 0 18px rgba(0,0,0,.35)">
              <div style="position: absolute; inset: 6%; border: 2px solid #C9A961; border-radius: 5px"></div>
              <div style="position: absolute; inset: 8.5%; border: 1px solid rgba(201,169,97,.6); border-radius: 3px"></div>
              <svg aria-hidden="true" viewBox="0 0 40 40" style="position: absolute; left: 8%; top: 8%; width: 11%; color: #C9A961" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 2h14M2 2v14M6 6l10 10M2 2c10 2 14 6 14 14"></path></svg>
              <svg aria-hidden="true" viewBox="0 0 40 40" style="position: absolute; right: 8%; top: 8%; width: 11%; color: #C9A961; transform: scaleX(-1)" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 2h14M2 2v14M6 6l10 10M2 2c10 2 14 6 14 14"></path></svg>
              <svg aria-hidden="true" viewBox="0 0 40 40" style="position: absolute; left: 8%; bottom: 8%; width: 11%; color: #C9A961; transform: scaleY(-1)" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 2h14M2 2v14M6 6l10 10M2 2c10 2 14 6 14 14"></path></svg>
              <svg aria-hidden="true" viewBox="0 0 40 40" style="position: absolute; right: 8%; bottom: 8%; width: 11%; color: #C9A961; transform: scale(-1, -1)" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 2h14M2 2v14M6 6l10 10M2 2c10 2 14 6 14 14"></path></svg>
              <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6%">
                <svg aria-hidden="true" viewBox="0 0 100 100" style="width: 46%; color: #D9BC72" fill="none" stroke="currentColor" stroke-width="1.3">
                  <rect x="18" y="18" width="64" height="64"></rect><rect x="18" y="18" width="64" height="64" transform="rotate(45 50 50)"></rect>
                  <circle cx="50" cy="50" r="27"></circle><circle cx="50" cy="50" r="22"></circle>
                </svg>
                <span lang="ar" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -62%); font-family: 'Amiri', serif; font-weight: 700; font-size: calc(var(--bw) * .1); color: #E8CD84; white-space: nowrap; text-shadow: 0 1px 0 rgba(0,0,0,.4)">القرآن</span>
                <span lang="ar" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, 30%); font-family: 'Amiri', serif; font-weight: 700; font-size: calc(var(--bw) * .065); color: #E8CD84; white-space: nowrap">الكريم</span>
              </div>
            </div>
            <div style="position: absolute; inset: 0; transform: rotateY(180deg); backface-visibility: hidden; border-radius: 10px 6px 6px 10px; background: repeating-linear-gradient(45deg, #EADFC4 0 6px, #E2D4B4 6px 12px); box-shadow: inset 0 0 0 10px color-mix(in srgb, var(--primary) 75%, black)"></div>
          </div>

          
          <div style="position: absolute; inset: 1.5% 2% 1.5% 1%; visibility: ${attr(v.cv?.firstPage)}; transform: translateZ(calc(var(--bt) / 2 - 2px)); background: #FBF6EA; border-radius: 2px; display: flex; align-items: center; justify-content: center">
            <span lang="ar" style="font-family: 'Amiri', serif; font-size: calc(var(--bw) * .08); color: var(--primary)">بِسۡمِ ٱللَّهِ</span>
          </div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; ${attr(v.cv?.infoLayout)}; gap: 14px">
        <div style="display: flex; flex-direction: column; gap: 2px">
          <span style="font-size: 22px; font-weight: 700">The Holy Quran</span>
          <span style="font-size: 14px; color: var(--muted)">114 surahs · 604 pages · Madinah Mushaf</span>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: ${attr(v.cv?.alignItems)}">
          <button class="btn primary" data-on-click="${on(v.cv?.open)}" style="height: 48px; padding: 0 26px; font-size: 15px; font-weight: 600">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2z"></path><path d="M12 6v14"></path></svg>
            Open the Mushaf
          </button>
          <button class="btn" data-on-click="${on(v.cv?.resume)}" style="height: 48px; padding: 0 20px; font-size: 15px">${esc(v.cv?.resumeLabel)}</button>
        </div>
        <div style="display: flex; align-items: center; gap: 6px; color: var(--muted)">
          <button class="btn icon ghost" aria-label="Turn the book left" data-on-click="${on(v.cv?.left)}">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"></path><path d="M3 3v5h5"></path></svg>
          </button>
          <button class="btn icon ghost" aria-label="Turn the book right" data-on-click="${on(v.cv?.right)}">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"></path><path d="M21 3v5h-5"></path></svg>
          </button>
          <button class="btn icon ghost" aria-label="${attr(v.cv?.spinLabel)}" aria-pressed="${attr(v.cv?.spinning)}" data-on-click="${on(v.cv?.toggleSpin)}">
            ${v.cv?.spinning ? `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"></path></svg>` : ''}
            ${v.cv?.still ? `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"></path></svg>` : ''}
          </button>
        </div>
      </div>
    </div>
  ` : ''}

  
  ${v.showBody ? `
    <div style="${attr(v.bodyStyle)}">
      <div style="flex: 999 1 640px; min-width: 0">

        
        ${v.m?.book ? `
          <div style="display: flex; justify-content: center; padding: ${attr(v.bookPad)}; perspective: 2600px">
            <div style="position: relative; width: ${attr(v.spreadW)}; transform-style: preserve-3d">
              <div aria-hidden="true" style="${attr(v.boardStyle)}"></div>
              <main dir="rtl" style="position: relative; display: flex">
                ${(v.pages ?? []).map((pg) => `
                  <section aria-label="${attr(pg?.label)}" style="${attr(pg?.secStyle)}">
                    <div style="height: 100%; box-sizing: border-box; border: 1px solid var(--gold); outline: 4px double var(--rule); outline-offset: -9px; display: flex; flex-direction: column; ${attr(pg?.framePad)}">
                      <div lang="ar" style="display: flex; justify-content: space-between; align-items: baseline; padding: 0 2px 4px; font-family: 'Amiri', serif; font-size: ${attr(v.headPx)}; color: var(--muted)">
                        <span>${esc(pg?.surahName)}</span>
                        <span>${esc(pg?.juzLabel)}</span>
                      </div>
                      <div style="container-type: inline-size; flex: 1; display: flex; flex-direction: column; justify-content: ${attr(pg?.vjustify)}">
                        ${(pg?.lines ?? []).map((ln) => `
                          ${ln?.isSurah ? `
                            <div style="font-size: ${attr(ln?.fs)}; height: 2.25em; display: flex; align-items: center">
                              <button data-on-click="${on(ln?.info)}" aria-label="${attr(ln?.aria)}" style="width: 100%; height: 1.7em; display: flex; align-items: center; justify-content: space-between; padding: 0 .7em; box-sizing: border-box; border: 1px solid var(--gold); border-radius: .85em; background: var(--cartouche); color: var(--ink); cursor: pointer; font: inherit">
                                <span lang="ar" style="font-family: 'Amiri', serif; font-size: .5em; color: var(--muted)">${esc(ln?.left)}</span>
                                <span lang="ar" style="font-family: 'Amiri', serif; font-size: .9em; font-weight: 700; color: var(--accent); line-height: 1">${esc(ln?.title)}</span>
                                <span lang="ar" style="font-family: 'Amiri', serif; font-size: .5em; color: var(--muted)">${esc(ln?.right)}</span>
                              </button>
                            </div>
                          ` : ''}
                          ${ln?.isBasm ? `
                            <div lang="ar" style="font-size: ${attr(ln?.fs)}; height: 2.25em; display: flex; align-items: center; justify-content: center; font-family: 'Amiri Quran', 'Amiri', serif">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</div>
                          ` : ''}
                          ${ln?.isWords ? `
                            <div lang="ar" style="${attr(ln?.style)}">
                              ${(ln?.t ?? []).map((k) => `
                                ${k?.isWord ? `<button class="w" data-on-click="${on(k?.click)}" aria-label="${attr(k?.aria)}" style="${attr(k?.style)}">${esc(k?.text)}</button>` : ''}
                                ${k?.isEnd ? `<span class="ay" style="${attr(k?.style)}">${esc(k?.num)}</span>` : ''}
                              `).join('')}
                            </div>
                          ` : ''}
                        `).join('')}
                      </div>
                      <div style="display: flex; justify-content: center; padding-top: 4px">
                        <span style="display: inline-flex; align-items: center; gap: 8px; font-family: 'Amiri', serif; font-size: ${attr(v.headPx)}; color: var(--muted)">
                          <svg aria-hidden="true" width="8" height="8" viewBox="0 0 8 8" style="color: var(--gold)"><path d="M4 0l4 4-4 4-4-4z" fill="currentColor"></path></svg>
                          ${esc(pg?.num)}
                          <svg aria-hidden="true" width="8" height="8" viewBox="0 0 8 8" style="color: var(--gold)"><path d="M4 0l4 4-4 4-4-4z" fill="currentColor"></path></svg>
                        </span>
                      </div>
                    </div>
                  </section>
                `).join('')}
              </main>

              
              ${v.leafOn ? `
                <div aria-hidden="true" style="position: absolute; top: 0; height: 100%; left: ${attr(v.leaf?.left)}; width: var(--pw); z-index: 6; transform-style: preserve-3d; transform-origin: ${attr(v.leaf?.origin)}; animation: ${attr(v.leaf?.anim)}">
                  ${(v.leaf?.faces ?? []).map((lf) => `
                    <div style="${attr(lf?.faceStyle)}">
                      <div style="height: 100%; box-sizing: border-box; border: 1px solid var(--gold); outline: 4px double var(--rule); outline-offset: -9px; display: flex; flex-direction: column; ${attr(lf?.pg?.framePad)}">
                        <div lang="ar" style="display: flex; justify-content: space-between; padding: 0 2px 4px; font-family: 'Amiri', serif; font-size: ${attr(v.headPx)}; color: var(--muted)"><span>${esc(lf?.pg?.surahName)}</span><span>${esc(lf?.pg?.juzLabel)}</span></div>
                        <div style="container-type: inline-size; flex: 1; display: flex; flex-direction: column; justify-content: ${attr(lf?.pg?.vjustify)}">
                          ${(lf?.pg?.lines ?? []).map((ln) => `
                            ${ln?.isSurah ? `
                              <div style="font-size: ${attr(ln?.fs)}; height: 2.25em; display: flex; align-items: center"><span style="width: 100%; height: 1.7em; display: flex; align-items: center; justify-content: center; border: 1px solid var(--gold); border-radius: .85em; background: var(--cartouche)"><span lang="ar" style="font-family: 'Amiri', serif; font-size: .9em; font-weight: 700; color: var(--accent); line-height: 1">${esc(ln?.title)}</span></span></div>
                            ` : ''}
                            ${ln?.isBasm ? `
                              <div lang="ar" style="font-size: ${attr(ln?.fs)}; height: 2.25em; display: flex; align-items: center; justify-content: center; font-family: 'Amiri Quran', 'Amiri', serif">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</div>
                            ` : ''}
                            ${ln?.isWords ? `
                              <div lang="ar" style="${attr(ln?.style)}">
                                ${(ln?.t ?? []).map((k) => `
                                  ${k?.isWord ? `<span style="padding: 0 .04em">${esc(k?.text)}</span>` : ''}
                                  ${k?.isEnd ? `<span class="ay">${esc(k?.num)}</span>` : ''}
                                `).join('')}
                              </div>
                            ` : ''}
                          `).join('')}
                        </div>
                        <div style="text-align: center; padding-top: 4px; font-family: 'Amiri', serif; font-size: ${attr(v.headPx)}; color: var(--muted)">${esc(lf?.pg?.num)}</div>
                      </div>
                      <div style="position: absolute; inset: 0; pointer-events: none; background: ${attr(lf?.shade)}; animation: shade ${attr(v.turnMs)} ease-in-out forwards"></div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}

        
        ${v.m?.wbw ? `
          <main style="${attr(v.listWrap)}">
            ${(v.wbwRows ?? []).map((r) => `
              ${r?.isHeader ? `
                <div style="margin: 8px 0 12px; padding: 18px 16px 12px; display: flex; flex-direction: column; align-items: center; gap: 2px; border: 1px solid var(--gold); border-radius: 14px; background: var(--cartouche)">
                  <span lang="ar" style="font-family: 'Amiri', serif; font-size: 28px; font-weight: 700; color: var(--accent); line-height: 1.5">${esc(r?.title)}</span>
                  <span style="font-size: 13px; color: var(--muted)">${esc(r?.sub)}</span>
                </div>
              ` : ''}
              ${r?.isVerse ? `
                <article style="margin-bottom: 12px; padding: 14px; background: var(--paper); border: 1px solid var(--line); border-radius: 14px; display: flex; flex-direction: column; gap: 12px; ${attr(r?.cardStyle)}">
                  <div style="display: flex; justify-content: space-between; align-items: center">
                    <span style="font-size: 12px; font-weight: 600; color: var(--accent); background: var(--chip); padding: 3px 10px; border-radius: 999px">${esc(r?.key)}</span>
                    <button class="btn icon ghost" aria-label="${attr(r?.playAria)}" data-on-click="${on(r?.play)}" style="width: 36px; height: 36px">
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"></path></svg>
                    </button>
                  </div>
                  <div dir="rtl" style="display: flex; flex-wrap: wrap; gap: 8px">
                    ${(r?.words ?? []).map((w) => `
                      <button class="chip" data-on-click="${on(w?.click)}" style="${attr(w?.style)}">
                        <span lang="ar" style="font-family: 'Amiri Quran', 'Amiri', serif; font-size: ${attr(v.wbwArPx)}; line-height: 1.9">${esc(w?.ar)}</span>
                        <span style="font-size: 12px; font-style: italic; color: var(--muted)">${esc(w?.tr)}</span>
                        <span style="font-size: 13px; font-weight: 500; max-width: 140px; text-align: center; line-height: 1.3">${esc(w?.mean)}</span>
                      </button>
                    `).join('')}
                    <span class="ay" style="font-size: 30px; align-self: center">${esc(r?.num)}</span>
                  </div>
                  <p lang="${attr(v.lang)}" style="margin: 0; padding-top: 10px; border-top: 1px solid var(--line); font-family: ${attr(v.trFont)}; font-size: ${attr(v.trPx)}; line-height: 1.7; color: var(--ink2)">${esc(r?.tr)}</p>
                </article>
              ` : ''}
            `).join('')}
          </main>
        ` : ''}

        
        ${v.m?.trans ? `
          <main style="${attr(v.listWrap)}">
            <div style="background: var(--paper); border: 1px solid var(--line); border-radius: 14px; overflow: hidden">
              ${(v.transRows ?? []).map((r) => `
                ${r?.isHeader ? `
                  <div style="padding: 22px 16px 14px; display: flex; flex-direction: column; align-items: center; gap: 2px; border-bottom: 1px solid var(--line); background: var(--cartouche)">
                    <span lang="ar" style="font-family: 'Amiri', serif; font-size: 28px; font-weight: 700; color: var(--accent); line-height: 1.5">${esc(r?.title)}</span>
                    <span style="font-size: 13px; color: var(--muted)">${esc(r?.sub)}</span>
                    ${r?.basmala ? `
                      <span lang="ar" style="font-family: 'Amiri Quran', 'Amiri', serif; font-size: 24px; line-height: 2.1">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</span>
                    ` : ''}
                  </div>
                ` : ''}
                ${r?.isVerse ? `
                  <article style="padding: 18px 18px 20px; border-bottom: 1px solid var(--line); display: grid; grid-template-columns: 44px minmax(0, 1fr); gap: 4px 12px; ${attr(r?.cardStyle)}">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 6px">
                      <span style="font-size: 12px; font-weight: 600; color: var(--accent)">${esc(r?.key)}</span>
                      <button class="btn icon ghost" aria-label="${attr(r?.playAria)}" data-on-click="${on(r?.play)}" style="width: 36px; height: 36px">
                        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"></path></svg>
                      </button>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 10px">
                      <p lang="ar" dir="rtl" style="margin: 0; font-family: 'Amiri Quran', 'Amiri', serif; font-size: ${attr(v.trArPx)}; line-height: 2.2; text-align: right">${esc(r?.ar)}<span class="ay">${esc(r?.num)}</span></p>
                      <p lang="${attr(v.lang)}" style="margin: 0; font-family: ${attr(v.trFont)}; font-size: ${attr(v.trPx)}; line-height: 1.75; color: var(--ink2)">${esc(r?.tr)}</p>
                    </div>
                  </article>
                ` : ''}
              `).join('')}
            </div>
          </main>
        ` : ''}

      </div>

      
      ${v.sideOpen ? `
        <aside aria-label="${attr(v.sideTitle)}" style="${attr(v.sideStyle)}">
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 8px 10px 18px; border-bottom: 1px solid var(--line)">
            <h2 style="margin: 0; font-size: 16px; font-weight: 700">${esc(v.sideTitle)}</h2>
            <button class="btn icon ghost" aria-label="Close panel" data-on-click="${on(v.closeSide)}">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>
            </button>
          </div>

          
          ${v.sideWord ? `
            <div class="scroll" style="flex: 1; padding: 20px 18px; display: flex; flex-direction: column; gap: 18px">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 18px 12px 16px; border-radius: 14px; background: var(--cartouche); border: 1px solid var(--line)">
                <span lang="ar" style="font-family: 'Amiri Quran', 'Amiri', serif; font-size: 52px; line-height: 1.8; color: var(--ink)">${esc(v.wd?.ar)}</span>
                <span style="font-size: 16px; font-style: italic; color: var(--muted)">${esc(v.wd?.tr)}</span>
                <span style="font-size: 20px; font-weight: 700; text-align: center">${esc(v.wd?.mean)}</span>
                <span style="font-size: 12px; color: var(--muted)">Meaning · English word-by-word</span>
              </div>
              <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap">
                <button class="btn" data-on-click="${on(v.wd?.prevWord)}"${bool('disabled', v.wd?.isFirst)} aria-label="Previous word">
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>
                </button>
                <button class="btn primary" data-on-click="${on(v.wd?.play)}">
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"></path><path d="M16 9a4 4 0 0 1 0 6"></path></svg>
                  Hear this word
                </button>
                <button class="btn" data-on-click="${on(v.wd?.nextWord)}"${bool('disabled', v.wd?.isLast)} aria-label="Next word">
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"></path></svg>
                </button>
              </div>
              <dl style="margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 16px; border-top: 1px solid var(--line)">
                <div style="padding: 10px 0; border-bottom: 1px solid var(--line)"><dt style="font-size: 12px; color: var(--muted)">Surah</dt><dd style="margin: 2px 0 0; font-size: 14px; font-weight: 600">${esc(v.wd?.surah)}</dd></div>
                <div style="padding: 10px 0; border-bottom: 1px solid var(--line)"><dt style="font-size: 12px; color: var(--muted)">Ayah · word</dt><dd style="margin: 2px 0 0; font-size: 14px; font-weight: 600">${esc(v.wd?.pos)}</dd></div>
              </dl>
              <div style="display: flex; flex-direction: column; gap: 8px">
                <span style="font-size: 12px; font-weight: 600; color: var(--muted)">In this ayah</span>
                <div dir="rtl" style="display: flex; flex-wrap: wrap; gap: 4px 6px; font-family: 'Amiri Quran', 'Amiri', serif; font-size: 22px; line-height: 2">
                  ${(v.wd?.ayahWords ?? []).map((aw) => `
                    <button class="w" data-on-click="${on(aw?.click)}" aria-label="${attr(aw?.aria)}" style="${attr(aw?.style)}">${esc(aw?.text)}</button>
                  `).join('')}
                </div>
                <p lang="${attr(v.lang)}" style="margin: 0; font-family: ${attr(v.trFont)}; font-size: 15px; line-height: 1.7; color: var(--ink2)">${esc(v.wd?.ayahTr)}</p>
              </div>
            </div>
          ` : ''}

          
          ${v.sidePractice ? `
            <div class="scroll" style="flex: 1; padding: 18px; display: flex; flex-direction: column; gap: 16px">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px">
                <button class="btn icon" aria-label="Previous ayah" data-on-click="${on(v.pr?.prevAyah)}"${bool('disabled', v.pr?.isFirst)}>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>
                </button>
                <span style="display: flex; flex-direction: column; align-items: center">
                  <span style="font-size: 14px; font-weight: 600">${esc(v.pr?.title)}</span>
                  <span style="font-size: 12px; color: var(--muted)">${esc(v.pr?.sub)}</span>
                </span>
                <button class="btn icon" aria-label="Next ayah" data-on-click="${on(v.pr?.nextAyah)}"${bool('disabled', v.pr?.isLast)}>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"></path></svg>
                </button>
              </div>
              <div dir="rtl" style="padding: 16px 12px; border-radius: 14px; background: var(--cartouche); border: 1px solid var(--line); display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 8px; font-family: 'Amiri Quran', 'Amiri', serif; font-size: ${attr(v.pr?.fs)}; line-height: 2.1">
                ${(v.pr?.words ?? []).map((pw) => `
                  <span lang="ar" style="${attr(pw?.style)}">${esc(pw?.text)}</span>
                `).join('')}
              </div>

              ${v.pr?.isIdle ? `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 8px 0">
                  <button data-on-click="${on(v.pr?.start)}" aria-label="Start reciting" style="width: 84px; height: 84px; border-radius: 999px; border: 0; background: var(--accent); color: var(--onAccent); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 6px 18px rgba(0,0,0,.18)">
                    <svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"></rect><path d="M5 11a7 7 0 0 0 14 0M12 18v3"></path></svg>
                  </button>
                  <span style="font-size: 15px; font-weight: 600">Tap and recite this ayah</span>
                  <span style="font-size: 13px; color: var(--muted); text-align: center; max-width: 280px; line-height: 1.5">Each word you say is checked against the Mushaf text.</span>
                  <button class="btn" data-on-click="${on(v.pr?.listenFirst)}">
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"></path></svg>
                    Listen first
                  </button>
                </div>
              ` : ''}

              ${v.pr?.isListening ? `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 8px 0">
                  <button data-on-click="${on(v.pr?.stop)}" aria-label="Stop and check" style="width: 84px; height: 84px; border-radius: 999px; border: 0; background: var(--bad); color: var(--paper); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; animation: pulse 1.6s infinite">
                    <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>
                  </button>
                  <div aria-hidden="true" style="height: 34px; display: flex; align-items: center; gap: 4px">
                    ${(v.bars ?? []).map((b) => `
                      <span style="width: 4px; height: 34px; border-radius: 2px; background: var(--accent); transform-origin: center; animation: bar 0.9s ease-in-out infinite; animation-delay: ${attr(b?.d)}"></span>
                    `).join('')}
                  </div>
                  <span role="status" style="font-size: 15px; font-weight: 600">Listening… tap to stop</span>
                </div>
              ` : ''}

              ${v.pr?.isResult ? `
                <div style="display: flex; flex-direction: column; gap: 14px">
                  <div role="status" style="display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 14px; background: ${attr(v.pr?.scoreBg)}">
                    <span style="font-size: 30px; font-weight: 700; color: ${attr(v.pr?.scoreFg)}">${esc(v.pr?.score)}</span>
                    <span style="display: flex; flex-direction: column; gap: 2px">
                      <span style="font-size: 15px; font-weight: 700">${esc(v.pr?.headline)}</span>
                      <span style="font-size: 13px; color: var(--ink2)">${esc(v.pr?.detail)}</span>
                    </span>
                  </div>
                  <div style="display: flex; flex-wrap: wrap; gap: 8px 14px; font-size: 12px; color: var(--muted)">
                    <span style="display: inline-flex; align-items: center; gap: 6px"><span style="width: 14px; height: 4px; border-radius: 2px; background: var(--good)"></span>Correct</span>
                    <span style="display: inline-flex; align-items: center; gap: 6px"><span style="width: 14px; height: 4px; border-radius: 2px; background: var(--warn)"></span>Not clear</span>
                    <span style="display: inline-flex; align-items: center; gap: 6px"><span style="width: 14px; height: 4px; border-radius: 2px; background: var(--bad)"></span>Missed</span>
                  </div>
                  ${(v.pr?.issues ?? []).map((is) => `
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 12px; border: 1px solid var(--line); border-radius: 12px">
                      <span style="display: flex; flex-direction: column; gap: 2px">
                        <span style="font-size: 13px; font-weight: 600; color: ${attr(is?.fg)}">${esc(is?.label)}</span>
                        <span style="font-size: 13px; color: var(--muted)">${esc(is?.hint)}</span>
                      </span>
                      <span style="display: flex; align-items: center; gap: 8px">
                        <span lang="ar" style="font-family: 'Amiri Quran', 'Amiri', serif; font-size: 24px; line-height: 1.8">${esc(is?.ar)}</span>
                        <button class="btn icon" aria-label="${attr(is?.aria)}" data-on-click="${on(is?.play)}" style="width: 38px; height: 38px">
                          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"></path><path d="M16 9a4 4 0 0 1 0 6"></path></svg>
                        </button>
                      </span>
                    </div>
                  `).join('')}
                  <div style="display: flex; gap: 8px; flex-wrap: wrap">
                    <button class="btn" data-on-click="${on(v.pr?.start)}" style="flex: 1 1 120px">Try again</button>
                    <button class="btn primary" data-on-click="${on(v.pr?.nextAyah)}"${bool('disabled', v.pr?.isLast)} style="flex: 1 1 120px">Next ayah</button>
                  </div>
                </div>
              ` : ''}
              <p style="margin: 4px 0 0; font-size: 12px; line-height: 1.5; color: var(--muted)">Checks which words you said and in what order. Detailed tajweed feedback (madd, ghunnah, qalqalah) is coming later.</p>
            </div>
          ` : ''}
        </aside>
      ` : ''}
    </div>
  ` : ''}

  
  ${v.isOpen ? `
    <div style="position: fixed; left: 0; right: 0; bottom: 12px; z-index: 20; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 0 8px; pointer-events: none">

      
      ${v.panelGoto ? `
        <div role="dialog" aria-label="Go to page" style="pointer-events: auto; width: min(420px, 100%); box-sizing: border-box; padding: 14px 16px; border-radius: 18px; background: var(--dock); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); border: 1px solid var(--line); box-shadow: 0 12px 36px rgba(0,0,0,.16); display: flex; flex-direction: column; gap: 10px">
          <div style="display: flex; align-items: center; justify-content: space-between">
            <span style="font-size: 14px; font-weight: 600">${esc(v.pageLabel)} of 604</span>
            <div style="display: flex; gap: 6px; align-items: center">
              <label for="goto" class="sr">Page number</label>
              <input id="goto" type="number" min="1" max="604" inputmode="numeric" value="${attr(v.gotoVal)}" data-on-change="${on(v.onGotoInput)}" placeholder="Page" style="width: 76px; height: 36px; box-sizing: border-box; padding: 0 10px; border: 1px solid var(--rule); border-radius: 10px; background: var(--paper); color: var(--ink); font: inherit; font-size: 14px">
              <button class="btn primary" data-on-click="${on(v.goGoto)}" style="height: 36px; padding: 0 14px">Go</button>
            </div>
          </div>
          <label for="slider" class="sr">Page slider</label>
          <input id="slider" class="slider" type="range" min="1" max="604" dir="rtl" value="${attr(v.page)}" data-on-change="${on(v.onSlide)}" style="width: 100%">
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--muted)"><span>604 · An-Nas</span><span>1 · Al-Fatihah</span></div>
        </div>
      ` : ''}

      

      
      <nav aria-label="Reading controls" style="pointer-events: auto; position: relative; overflow: hidden; max-width: 100%; box-sizing: border-box; display: flex; align-items: center; gap: 2px; padding: 5px; border-radius: 999px; background: var(--dock); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); border: 1px solid var(--line); box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 14px 40px rgba(0,0,0,.16)">
        ${v.playerOn ? `<div aria-hidden="true" style="position: absolute; left: 0; bottom: 0; height: 3px; width: ${attr(v.pl?.pct)}; background: var(--accent)"></div>` : ''}
        <button class="btn icon ghost" aria-label="Next page" data-on-click="${on(v.next)}"${bool('disabled', v.atEnd)} style="width: 42px; height: 42px">
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"></path></svg>
        </button>
        <span aria-hidden="true" style="${attr(v.divStyle)}"></span>
        ${v.notSingle ? `
          <div role="group" aria-label="Reading mode" style="display: inline-flex; padding: 3px; border-radius: 999px; background: var(--chip)">
            <button class="seg" aria-pressed="${attr(v.m?.book)}" data-on-click="${on(v.setBook)}" style="${attr(v.seg?.book)}">Mushaf</button>
            <button class="seg" aria-pressed="${attr(v.m?.wbw)}" data-on-click="${on(v.setWbw)}" style="${attr(v.seg?.wbw)}">Words</button>
            <button class="seg" aria-pressed="${attr(v.m?.trans)}" data-on-click="${on(v.setTrans)}" style="${attr(v.seg?.trans)}">Translation</button>
          </div>
          <span aria-hidden="true" style="${attr(v.divStyle)}"></span>
        ` : ''}
        ${v.isSingle && v.dockExtras ? `
          <button class="btn icon ghost" aria-label="${attr(v.modeCycleLabel)}" data-on-click="${on(v.cycleMode)}" style="width: 42px; height: 42px; flex-direction: column; gap: 0">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2z"></path><path d="M12 6v14"></path></svg>
            <span style="font-size: 9px; font-weight: 700; line-height: 1">${esc(v.modeShort)}</span>
          </button>
        ` : ''}
        ${v.playerOn ? `
          <button class="btn icon ghost" aria-label="Previous ayah" data-on-click="${on(v.pl?.prev)}" style="width: 38px; height: 38px">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h2v14H6zM20 5v14L9 12z"></path></svg>
          </button>
        ` : ''}
        <button class="btn icon primary" aria-label="${attr(v.listenLabel)}" aria-pressed="${attr(v.playerOn)}" data-on-click="${on(v.startListen)}" style="width: 44px; height: 44px">
          ${v.listenPlaying ? `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"></path></svg>` : ''}
          ${v.listenIdle ? `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"></path></svg>` : ''}
        </button>
        ${v.playerOn ? `
          <button class="btn icon ghost" aria-label="Next ayah" data-on-click="${on(v.pl?.next)}" style="width: 38px; height: 38px">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 5h2v14h-2zM4 5v14l11-7z"></path></svg>
          </button>
          <span title="${attr(v.pl?.title)}" style="padding: 0 6px; font-size: 12px; font-weight: 600; color: var(--accent); white-space: nowrap; font-variant-numeric: tabular-nums">${esc(v.pl?.short)}</span>
          <button class="btn" data-on-click="${on(v.pl?.cycleSpeed)}" aria-label="Playback speed" style="height: 30px; padding: 0 8px; font-size: 12px">${esc(v.pl?.speed)}</button>
          <button class="btn icon ghost" aria-label="Repeat ayah" aria-pressed="${attr(v.pl?.repeat)}" data-on-click="${on(v.pl?.toggleRepeat)}" style="width: 34px; height: 34px; ${attr(v.pl?.repeatStyle)}">
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"></path><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"></path><path d="M21 13v2a3 3 0 0 1-3 3H3"></path></svg>
          </button>
          <button class="btn icon ghost" aria-label="Stop recitation" data-on-click="${on(v.pl?.close)}" style="width: 34px; height: 34px">
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>
          </button>
          <span aria-hidden="true" style="${attr(v.divStyle)}"></span>
        ` : ''}
        ${v.dockExtras ? `
        <button class="btn icon ghost" aria-label="Practice recitation" aria-pressed="${attr(v.sidePractice)}" data-on-click="${on(v.openPractice)}" style="width: 42px; height: 42px; ${attr(v.practiceBtnStyle)}">
          <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"></rect><path d="M5 11a7 7 0 0 0 14 0M12 18v3"></path></svg>
        </button>
        <button class="btn icon ghost" aria-label="Reading settings" data-on-click="${on(v.openSettings)}" style="width: 42px; height: 42px"><span style="font-family: 'Amiri', serif; font-size: 17px; font-weight: 700">Aa</span></button>
        <span aria-hidden="true" style="${attr(v.divStyle)}"></span>
        <button class="btn" data-on-click="${on(v.openGoto)}" aria-label="${attr(v.gotoAria)}" style="height: 36px; padding: 0 12px; border: 0; background: var(--chip); font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums">${esc(v.pageShort)}</button>
        <span aria-hidden="true" style="${attr(v.divStyle)}"></span>
        ` : ''}
        <button class="btn icon ghost" aria-label="Previous page" data-on-click="${on(v.prev)}"${bool('disabled', v.atStart)} style="width: 42px; height: 42px">
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>
        </button>
      </nav>
    </div>
  ` : ''}

  
  ${v.panelContents ? `
    <div style="position: fixed; inset: 0; z-index: 30; display: flex">
      <aside aria-label="Surah and juz list" style="position: relative; z-index: 1; width: min(440px, 100%); height: 100%; background: var(--paper); box-shadow: 0 0 40px rgba(0,0,0,.2); display: flex; flex-direction: column">
        <div style="padding: 14px 16px 12px; display: flex; flex-direction: column; gap: 12px; border-bottom: 1px solid var(--line)">
          <div style="display: flex; align-items: center; justify-content: space-between">
            <h2 style="margin: 0; font-size: 18px; font-weight: 700">Go to</h2>
            <button class="btn icon ghost" aria-label="Close" data-on-click="${on(v.closePanel)}">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>
            </button>
          </div>
          <div style="display: inline-flex; align-self: flex-start; padding: 3px; border-radius: 999px; background: var(--chip)" role="group" aria-label="Browse by">
            <button class="seg" aria-pressed="${attr(v.tabSurah)}" data-on-click="${on(v.showSurahTab)}" style="${attr(v.seg?.surahTab)}">Surah · 114</button>
            <button class="seg" aria-pressed="${attr(v.tabJuz)}" data-on-click="${on(v.showJuzTab)}" style="${attr(v.seg?.juzTab)}">Juz · 30</button>
          </div>
          ${v.tabSurah ? `
            <div>
              <label for="q" class="sr">Search surah</label>
              <input id="q" type="search" value="${attr(v.query)}" data-on-change="${on(v.onQuery)}" placeholder="Name or number — Kahf, 36, ইয়াসীন" style="width: 100%; height: 44px; box-sizing: border-box; padding: 0 14px; border: 1px solid var(--rule); border-radius: 10px; background: var(--bg); color: var(--ink); font: inherit; font-size: 14px">
            </div>
          ` : ''}
        </div>
        <div class="scroll" style="flex: 1">
          ${v.tabSurah ? `
            ${(v.surahRows ?? []).map((s) => `
              <button class="row" data-on-click="${on(s?.go)}" style="${attr(s?.rowStyle)}">
                <span style="width: 34px; height: 34px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; border: 1.5px solid var(--gold); transform: rotate(45deg); border-radius: 6px"><span style="transform: rotate(-45deg); font-size: 12px; font-weight: 700; color: var(--accent)">${esc(s?.n)}</span></span>
                <span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px">
                  <span style="font-size: 15px; font-weight: 600">${esc(s?.tr)}</span>
                  <span style="font-size: 12px; color: var(--muted)">${esc(s?.meaning)} · ${esc(s?.meta)}</span>
                </span>
                <span lang="ar" dir="rtl" style="font-family: 'Amiri', serif; font-size: 22px; font-weight: 700; color: var(--accent)">${esc(s?.ar)}</span>
              </button>
            `).join('')}
            ${v.noResults ? `
              <p style="padding: 24px 16px; margin: 0; font-size: 14px; color: var(--muted)">No surah matches “${esc(v.query)}”.</p>
            ` : ''}
          ` : ''}
          ${v.tabJuz ? `
            ${(v.juzRows ?? []).map((j) => `
              <button class="row" data-on-click="${on(j?.go)}" style="${attr(j?.rowStyle)}">
                <span style="width: 34px; height: 34px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; background: var(--chip); color: var(--accent); font-size: 13px; font-weight: 700">${esc(j?.n)}</span>
                <span style="flex: 1; display: flex; flex-direction: column; gap: 2px">
                  <span style="font-size: 15px; font-weight: 600">Juz ${esc(j?.n)}</span>
                  <span style="font-size: 12px; color: var(--muted)">${esc(j?.meta)}</span>
                </span>
                <span lang="ar" style="font-family: 'Amiri', serif; font-size: 18px">${esc(j?.ar)}</span>
              </button>
            `).join('')}
          ` : ''}
        </div>
        <a href="/about.html" style="display: flex; align-items: center; justify-content: space-between; min-height: 52px; padding: 0 16px; border-top: 1px solid var(--line); font-size: 14px; color: var(--muted); text-decoration: none">About &amp; sources
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>
        </a>
      </aside>
      <button aria-label="Close" data-on-click="${on(v.closePanel)}" style="flex: 1; border: 0; background: rgba(10,10,8,.4); cursor: pointer"></button>
    </div>
  ` : ''}

  
  ${v.panelSettings ? `
    <div style="position: fixed; inset: 0; z-index: 30">
      <button aria-label="Close settings" data-on-click="${on(v.closePanel)}" style="position: absolute; inset: 0; border: 0; background: transparent; cursor: default"></button>
      <div role="dialog" aria-label="Reading settings" style="position: absolute; top: 68px; right: 16px; width: min(340px, calc(100% - 32px)); background: var(--paper); border: 1px solid var(--line); border-radius: 16px; box-shadow: 0 18px 48px rgba(0,0,0,.18); padding: 16px; box-sizing: border-box; display: flex; flex-direction: column; gap: 16px">
        <div style="display: flex; flex-direction: column; gap: 8px">
          <span style="font-size: 12px; font-weight: 600; color: var(--muted)">Theme</span>
          <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px">
            <button class="btn" data-on-click="${on(v.setPaper)}" aria-pressed="${attr(v.isPaper)}" style="height: 44px; border-radius: 10px; ${attr(v.seg?.paper)}">Paper</button>
            <button class="btn" data-on-click="${on(v.setNight)}" aria-pressed="${attr(v.isNight)}" style="height: 44px; border-radius: 10px; ${attr(v.seg?.night)}">Night</button>
          </div>
        </div>
        ${v.notSingle ? `
          <div style="display: flex; flex-direction: column; gap: 8px">
            <span style="font-size: 12px; font-weight: 600; color: var(--muted)">Page size</span>
            <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px">
              <button class="btn" data-on-click="${on(v.setFitWidth)}" aria-pressed="${attr(v.fitWidth)}" style="height: 44px; border-radius: 10px; ${attr(v.seg?.fitWidth)}">Fill width</button>
              <button class="btn" data-on-click="${on(v.setFitScreen)}" aria-pressed="${attr(v.fitScreen)}" style="height: 44px; border-radius: 10px; ${attr(v.seg?.fitScreen)}">Fit screen</button>
            </div>
          </div>
        ` : ''}
        <div style="display: flex; flex-direction: column; gap: 8px">
          <span style="font-size: 12px; font-weight: 600; color: var(--muted)">Text size</span>
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px">
            <button class="btn icon" aria-label="Smaller text" data-on-click="${on(v.fontDown)}"><span style="font-size: 13px; font-weight: 700">A−</span></button>
            <span style="font-size: 14px; font-weight: 600">${esc(v.fontPct)}</span>
            <button class="btn icon" aria-label="Larger text" data-on-click="${on(v.fontUp)}"><span style="font-size: 17px; font-weight: 700">A+</span></button>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px">
          <span style="font-size: 12px; font-weight: 600; color: var(--muted)">Translation</span>
          <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px">
            <button class="btn" data-on-click="${on(v.setBn)}" aria-pressed="${attr(v.isBn)}" style="height: 44px; border-radius: 10px; ${attr(v.seg?.bn)}">বাংলা</button>
            <button class="btn" data-on-click="${on(v.setEn)}" aria-pressed="${attr(v.isEn)}" style="height: 44px; border-radius: 10px; ${attr(v.seg?.en)}">English</button>
          </div>
          <span style="font-size: 12px; color: var(--muted)">${esc(v.transSource)}</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px">
          <label for="reciter" style="font-size: 12px; font-weight: 600; color: var(--muted)">Reciter</label>
          <select id="reciter" value="${attr(v.reciterId)}" data-on-change="${on(v.onReciter)}" style="height: 44px; padding: 0 12px; border: 1px solid var(--rule); border-radius: 10px; background: var(--paper); color: var(--ink); font: inherit; font-size: 14px; cursor: pointer">
            ${(v.reciters ?? []).map((rc) => `<option value="${attr(rc?.id)}">${esc(rc?.name)}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>
  ` : ''}

  
  ${v.panelInfo ? `
    <div role="dialog" aria-modal="true" aria-label="About this surah" style="position: fixed; inset: 0; z-index: 30; display: flex; align-items: center; justify-content: center; padding: 16px">
      <button aria-label="Close" data-on-click="${on(v.closePanel)}" style="position: absolute; inset: 0; border: 0; background: rgba(10,10,8,.4); cursor: pointer"></button>
      <div style="position: relative; width: min(460px, 100%); background: var(--paper); border-radius: 18px; box-shadow: 0 24px 60px rgba(0,0,0,.25); overflow: hidden">
        <div style="padding: 26px 24px 18px; display: flex; flex-direction: column; align-items: center; gap: 2px; background: var(--cartouche); border-bottom: 1px solid var(--gold)">
          <span lang="ar" style="font-family: 'Amiri', serif; font-size: 42px; font-weight: 700; color: var(--accent); line-height: 1.4">${esc(v.info?.ar)}</span>
          <span style="font-size: 18px; font-weight: 700">${esc(v.info?.n)}. ${esc(v.info?.tr)}</span>
          <span style="font-size: 14px; color: var(--muted)">${esc(v.info?.en)} · <span lang="bn" style="font-family: 'Noto Serif Bengali', serif">${esc(v.info?.bn)}</span></span>
        </div>
        <dl style="margin: 0; padding: 6px 24px 4px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 20px">
          <div style="padding: 12px 0; border-bottom: 1px solid var(--line)"><dt style="font-size: 12px; color: var(--muted)">Revealed in</dt><dd style="margin: 2px 0 0; font-size: 15px; font-weight: 600">${esc(v.info?.place)}</dd></div>
          <div style="padding: 12px 0; border-bottom: 1px solid var(--line)"><dt style="font-size: 12px; color: var(--muted)">Order of revelation</dt><dd style="margin: 2px 0 0; font-size: 15px; font-weight: 600">${esc(v.info?.order)}</dd></div>
          <div style="padding: 12px 0; border-bottom: 1px solid var(--line)"><dt style="font-size: 12px; color: var(--muted)">Ayahs</dt><dd style="margin: 2px 0 0; font-size: 15px; font-weight: 600">${esc(v.info?.ayahs)}</dd></div>
          <div style="padding: 12px 0; border-bottom: 1px solid var(--line)"><dt style="font-size: 12px; color: var(--muted)">Rukus</dt><dd style="margin: 2px 0 0; font-size: 15px; font-weight: 600">${esc(v.info?.rukus)}</dd></div>
          <div style="padding: 12px 0"><dt style="font-size: 12px; color: var(--muted)">Starts on</dt><dd style="margin: 2px 0 0; font-size: 15px; font-weight: 600">Page ${esc(v.info?.page)}</dd></div>
          <div style="padding: 12px 0"><dt style="font-size: 12px; color: var(--muted)">Juz</dt><dd style="margin: 2px 0 0; font-size: 15px; font-weight: 600">${esc(v.info?.juz)}</dd></div>
        </dl>
        <div style="padding: 12px 24px 22px; display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap">
          <button class="btn" data-on-click="${on(v.info?.listen)}">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"></path></svg>
            Listen
          </button>
          <button class="btn primary" data-on-click="${on(v.info?.go)}">Read from start</button>
        </div>
      </div>
    </div>
  ` : ''}

  
  ${v.panelSignin ? `
    <div role="dialog" aria-modal="true" aria-label="Sign in" style="position: fixed; inset: 0; z-index: 30; display: flex; align-items: center; justify-content: center; padding: 16px">
      <button aria-label="Close" data-on-click="${on(v.closePanel)}" style="position: absolute; inset: 0; border: 0; background: rgba(10,10,8,.4); cursor: pointer"></button>
      <div style="position: relative; width: min(420px, 100%); background: var(--paper); border-radius: 18px; box-shadow: 0 24px 60px rgba(0,0,0,.25); padding: 30px 26px 22px; box-sizing: border-box; display: flex; flex-direction: column; gap: 18px">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center">
          <span lang="ar" style="font-family: 'Amiri', serif; font-size: 30px; font-weight: 700; color: var(--accent)">القرآن الكريم</span>
          <h2 style="margin: 0; font-size: 20px; font-weight: 700">Keep your place on every device</h2>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: var(--muted)">Reading, listening and practice work without an account. Sign in to sync your progress.</p>
        </div>
        <ul style="margin: 0; padding: 14px 16px; list-style: none; display: flex; flex-direction: column; gap: 10px; background: var(--chip); border-radius: 12px; font-size: 14px">
          <li style="display: flex; gap: 10px; align-items: center"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent); flex: none"><path d="M5 12l4 4 10-10"></path></svg>Last page read and bookmarks</li>
          <li style="display: flex; gap: 10px; align-items: center"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent); flex: none"><path d="M5 12l4 4 10-10"></path></svg>Practice history for each surah</li>
          <li style="display: flex; gap: 10px; align-items: center"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent); flex: none"><path d="M5 12l4 4 10-10"></path></svg>Reciter, theme and text size</li>
        </ul>
        <button class="btn" data-on-click="${on(v.mockGoogle)}" style="height: 48px; border-radius: 10px; border: 1px solid #747775; background: #FFFFFF; color: #1F1F1F; font-size: 15px; font-weight: 600">
          <span aria-hidden="true" style="width: 22px; height: 22px; border-radius: 4px; border: 1px dashed #9AA0A6; font-size: 10px; display: inline-flex; align-items: center; justify-content: center; color: #5F6368">G</span>
          Continue with Google
        </button>
        <p style="margin: 0; font-size: 12px; line-height: 1.5; color: var(--muted); text-align: center">We only read your name and email from Google. Sign out at any time.</p>
      </div>
    </div>
  ` : ''}

  
  ${v.panelAccount ? `
    <div style="position: fixed; inset: 0; z-index: 30">
      <button aria-label="Close account menu" data-on-click="${on(v.closePanel)}" style="position: absolute; inset: 0; border: 0; background: transparent; cursor: default"></button>
      <div role="dialog" aria-label="Account" style="position: absolute; top: 68px; right: 16px; width: min(340px, calc(100% - 32px)); background: var(--paper); border: 1px solid var(--line); border-radius: 16px; box-shadow: 0 18px 48px rgba(0,0,0,.18); overflow: hidden">
        <div style="padding: 16px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--line)">
          <span style="width: 44px; height: 44px; border-radius: 999px; background: var(--accent); color: var(--onAccent); display: inline-flex; align-items: center; justify-content: center; font-weight: 700">${esc(v.userInitial)}</span>
          <span style="display: flex; flex-direction: column; min-width: 0">
            <span style="font-size: 15px; font-weight: 600">${esc(v.userName)}</span>
            <span style="font-size: 13px; color: var(--muted)">${esc(v.userEmail)}</span>
          </span>
        </div>
        <div style="padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 10px; border-bottom: 1px solid var(--line)">
          <span style="display: flex; flex-direction: column"><span style="font-size: 12px; color: var(--muted)">Last read · synced</span><span style="font-size: 14px; font-weight: 600">${esc(v.pageLabel)} · ${esc(v.topTr)}</span></span>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent)"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"></path></svg>
        </div>
        <div style="padding: 10px 16px 4px; display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 12px; font-weight: 600; color: var(--muted)">Bookmarks</span>
          <button class="btn" data-on-click="${on(v.toggleBookmark)}" style="height: 32px; font-size: 12px; padding: 0 10px">${esc(v.bookmarkLabel)}</button>
        </div>
        <div class="scroll" style="max-height: 220px">
          ${(v.bookmarkRows ?? []).map((bm) => `
            <button class="row" data-on-click="${on(bm?.go)}" style="min-height: 48px; padding: 8px 16px">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color: var(--accent)"><path d="M6 4h12v17l-6-4-6 4z"></path></svg>
              <span style="flex: 1; font-size: 14px">${esc(bm?.label)}</span>
              <span lang="ar" style="font-family: 'Amiri', serif; font-size: 16px">${esc(bm?.ar)}</span>
            </button>
          `).join('')}
          ${v.noBookmarks ? `
            <p style="margin: 0; padding: 6px 16px 14px; font-size: 13px; color: var(--muted)">No bookmarks yet.</p>
          ` : ''}
        </div>
        <div style="padding: 10px 16px 14px; border-top: 1px solid var(--line); display: flex; justify-content: flex-end">
          <button class="btn" data-on-click="${on(v.signOut)}" style="height: 40px">Sign out</button>
        </div>
      </div>
    </div>
  ` : ''}

  
  ${v.hasToast ? `
    <div role="status" style="position: fixed; left: 50%; bottom: 150px; transform: translateX(-50%); z-index: 40; max-width: calc(100% - 32px); padding: 12px 18px; border-radius: 999px; background: var(--ink); color: var(--bg); font-size: 14px; box-shadow: 0 10px 30px rgba(0,0,0,.2)">${esc(v.toast)}</div>
  ` : ''}
</div>
`;
}
