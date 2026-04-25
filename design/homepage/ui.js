/* Ticker, FAQ, tweaks, edit-mode protocol */
(function () {
  // --- Ticker ---
  const tickerItems = [
    { kw: 'content optimization', c: 82, g: 76, d: '+3' },
    { kw: 'ai search ranking', c: 78, g: 91, d: '+7' },
    { kw: 'geo score meaning', c: 71, g: 88, d: '+2' },
    { kw: 'e-commerce seo', c: 64, g: 52, d: '-1' },
    { kw: 'llm content strategy', c: 85, g: 94, d: '+9' },
    { kw: 'serp analyzer', c: 88, g: 79, d: '+4' },
    { kw: 'citation density', c: 72, g: 90, d: '+6' },
    { kw: 'entity graph', c: 69, g: 83, d: '+1' },
    { kw: 'topical authority', c: 91, g: 86, d: '+5' },
    { kw: 'flesch-kincaid G8', c: 77, g: 68, d: '+2' }
  ];
  const ticker = document.getElementById('ticker');
  if (ticker) {
    const html = tickerItems.map(t => {
      const dir = t.d.startsWith('-') ? 'down' : 'up';
      const arr = dir === 'up' ? '▲' : '▼';
      return `<span class="ticker-item">
        <span class="dot"></span>
        <span>${t.kw.toUpperCase()}</span>
        <span>C ${t.c}</span>
        <span style="color: var(--accent);">G ${t.g}</span>
        <span class="${dir}">${arr} ${t.d}</span>
      </span>`;
    }).join('');
    ticker.innerHTML = html + html;
  }

  // --- FAQ ---
  const faqData = [
    { q: 'What is the GEO Score and why is it a peer to Content Score?', a: 'GEO Score measures how well your content performs in AI-mediated retrieval — the citations, entity coverage, factual density, and structural cues that models use when sourcing answers. It sits beside Content Score because the two optimize for different retrieval systems, and treating one as primary is what has kept most tools a half-step behind the actual web.' },
    { q: 'How is this different from a generic SEO checker?', a: 'Every surface you touch — the lockup, your Top 3 Actions, the terms panel, the signal breakdown — reads from a single canonical scoring function. Actions never diverge from the breakdown. Lift numbers never drift. A plus-five in the action card is a plus-five in the audit.' },
    { q: 'Does the editor interrupt my writing?', a: 'The canvas defaults to a clean state. Inline guidance is off. Assisted mode is a toggle — keyboard shortcut Cmd+Shift+H — so experienced writers keep distraction low and new writers can learn through the rail first.' },
    { q: 'Can I try it without creating an account?', a: 'Yes. The live demo loads a preloaded editor with a scored article, populated Top 3 Actions, active terms panel, and visible breakdown. Save, new projects, and fresh analysis require a free account.' },
    { q: 'What do you mean by "canonical"?', a: 'There is one scoring brain. One explanation function. Every ring, chip, lift number, and signal row in the product is rendered from that output. No shadow systems. No parallel logic for the "visual" score. It is the same output, presented at different fidelities.' },
    { q: 'Which markets and languages are supported?', a: 'English-language SERPs across US, UK, CA, AU, and EU markets at launch. Spanish and German enter public beta in Q3 2026. Other markets are on the Syndicate plan roadmap.' }
  ];
  const faqEl = document.getElementById('faq');
  if (faqEl) {
    faqEl.innerHTML = faqData.map((f, i) => `
      <div class="faq-item" data-idx="${i}">
        <div class="num mono">${String(i+1).padStart(2,'0')}</div>
        <div>
          <div class="q">${f.q}</div>
          <div class="a">${f.a}</div>
        </div>
        <div class="toggle">＋</div>
      </div>
    `).join('');
    faqEl.querySelector('.faq-item')?.classList.add('open');
    faqEl.querySelector('.faq-item .toggle').textContent = '−';
    faqEl.addEventListener('click', (e) => {
      const item = e.target.closest('.faq-item');
      if (!item) return;
      item.classList.toggle('open');
      const toggle = item.querySelector('.toggle');
      toggle.textContent = item.classList.contains('open') ? '−' : '＋';
    });
  }

  // --- Tweaks ---
  let tweakState = { ...(window.TWEAK_DEFAULTS || {}), ...(typeof TWEAK_DEFAULTS !== 'undefined' ? TWEAK_DEFAULTS : {}) };
  const tweaksEl = document.getElementById('tweaks');
  const video = document.getElementById('heroVideo');

  function applyAccent(hex) {
    document.documentElement.style.setProperty('--accent', hex);
    const av = document.getElementById('accentVal'); if (av) av.textContent = hex;
    document.querySelectorAll('#swatches .swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.color.toLowerCase() === hex.toLowerCase());
    });
  }
  function applyVidSpeed(v) {
    if (video) video.playbackRate = v;
    const el = document.getElementById('speedVal'); if (el) el.textContent = v.toFixed(2) + '×';
    const r = document.getElementById('speedRange'); if (r) r.value = v;
  }
  function applyOverlay(v) {
    document.documentElement.style.setProperty('--hero-overlay', v);
    const el = document.getElementById('overlayVal'); if (el) el.textContent = Math.round(v*100) + '%';
    const r = document.getElementById('overlayRange'); if (r) r.value = v;
  }

  function applyAll(s) {
    if (s.accent) applyAccent(s.accent);
    if (typeof s.videoSpeed === 'number') applyVidSpeed(s.videoSpeed);
    if (typeof s.heroOverlay === 'number') applyOverlay(s.heroOverlay);
  }
  function persist(patch) {
    tweakState = { ...tweakState, ...patch };
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*'); } catch (e) {}
  }

  document.querySelectorAll('#swatches .swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      const c = sw.dataset.color; applyAccent(c); persist({ accent: c });
    });
  });
  const sr = document.getElementById('speedRange');
  if (sr) sr.addEventListener('input', (e) => { const v = parseFloat(e.target.value); applyVidSpeed(v); persist({ videoSpeed: v }); });
  const or_ = document.getElementById('overlayRange');
  if (or_) or_.addEventListener('input', (e) => { const v = parseFloat(e.target.value); applyOverlay(v); persist({ heroOverlay: v }); });

  window.addEventListener('message', (ev) => {
    const d = ev.data; if (!d || typeof d !== 'object') return;
    if (d.type === '__activate_edit_mode') tweaksEl?.classList.add('visible');
    else if (d.type === '__deactivate_edit_mode') tweaksEl?.classList.remove('visible');
  });

  applyAll(tweakState);
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}
})();
