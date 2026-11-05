/* Edit Assistant: a small Qwen model that runs inside the browser (WebLLM + WebGPU).
   Nothing is downloaded until the user taps "Install Edit Assistant". After that the model
   lives in the browser cache and works offline. Everything stays on the device. */
(function () {
  'use strict';
  const LS_KEY = 'ss_ea_v1';
  const MODEL = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC';
  const LIB = 'https://esm.run/@mlc-ai/web-llm@0.2.87';
  const SIZE_MB = 400; // upper estimate shown to the user

  const App = () => window.SSApp || {};
  const lang = () => { const u = App().ui; return u === 'ru' || u === 'hy' ? u : 'en'; };
  const L = (ru, en, hy) => { const u = lang(); return u === 'ru' ? ru : u === 'hy' ? hy : en; };
  const say = (m, ms) => { try { App().toast(m, ms); } catch (e) { console.log('[EditAssistant]', m); } };
  const confirmBox = (m, o) => App().appConfirm ? App().appConfirm(m, o) : Promise.resolve(window.confirm(m));
  const store = {
    get() { try { return localStorage.getItem(LS_KEY) === '1'; } catch (e) { return false; } },
    set(v) { try { v ? localStorage.setItem(LS_KEY, '1') : localStorage.removeItem(LS_KEY); } catch (e) {} }
  };

  let webllm = null, engine = null, busy = false, pct = 0, wake = null;
  const btn = document.createElement('button');
  btn.className = 'mi'; btn.id = 'mEA'; btn.type = 'button';

  function paint() {
    btn.disabled = false;
    if (busy) {
      btn.textContent = '⏳ Edit Assistant ' + pct + '%';
      btn.disabled = true;
    } else if (store.get()) {
      btn.textContent = '✓ Edit Assistant: ' + L('готов', 'ready', 'պատրաստ է');
    } else {
      btn.textContent = '🤖 ' + L('Установить Edit Assistant', 'Install Edit Assistant', 'Տեղադրել Edit Assistant');
    }
  }

  async function supported() {
    try {
      if (!navigator.gpu) return false;
      const a = await navigator.gpu.requestAdapter();
      return !!a;
    } catch (e) { return false; }
  }

  async function loadLib() {
    if (!webllm) webllm = await import(LIB);
    return webllm;
  }

  async function ensure(onProgress) {
    if (engine) return engine;
    const w = await loadLib();
    engine = await w.CreateMLCEngine(MODEL, {
      initProgressCallback: r => { if (onProgress) onProgress(Math.max(0, Math.min(1, r.progress || 0)), r.text || ''); }
    });
    return engine;
  }

  async function keepAwake(on) {
    try {
      if (on && navigator.wakeLock) wake = await navigator.wakeLock.request('screen');
      else if (!on && wake) { await wake.release(); wake = null; }
    } catch (e) {}
  }

  async function install() {
    if (busy) return;
    if (store.get()) return manage();
    if (!(await supported())) {
      say(L('Для помощника нужен WebGPU: Chrome 121+ на Android 12+ или свежий Chrome на компьютере.',
            'The assistant needs WebGPU: Chrome 121+ on Android 12+ or a recent desktop Chrome.',
            'Օգնականին անհրաժեշտ է WebGPU՝ Chrome 121+ Android 12+-ում կամ թարմ Chrome համակարգչում։'), 7000);
      return;
    }
    const ok = await confirmBox(
      L('Edit Assistant скачается на это устройство один раз (до ' + SIZE_MB + ' МБ), дальше работает без интернета. Лучше подключиться к Wi‑Fi.',
        'Edit Assistant downloads to this device once (up to ' + SIZE_MB + ' MB) and then works offline. Wi‑Fi is recommended.',
        'Edit Assistant-ը մեկ անգամ կներբեռնվի այս սարքում (մինչև ' + SIZE_MB + ' ՄԲ), հետո կաշխատի առանց համացանցի։ Խորհուրդ է Wi‑Fi։'),
      { yes: L('Установить', 'Install', 'Տեղադրել'), no: L('Отмена', 'Cancel', 'Չեղարկել') });
    if (!ok) return;
    busy = true; pct = 0; paint(); bar(0);
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
    await keepAwake(true);
    try {
      await ensure(p => { const n = Math.round(p * 100); if (n !== pct) { pct = n; paint(); bar(n); } });
      store.set(true);
      say(L('Edit Assistant установлен и готов.', 'Edit Assistant is installed and ready.', 'Edit Assistant-ը տեղադրված է և պատրաստ։'), 4500);
    } catch (e) {
      engine = null;
      console.error('[EditAssistant]', e);
      say(L('Не удалось скачать помощника. Проверьте интернет и свободное место, затем повторите.',
            'Could not download the assistant. Check the connection and free space, then try again.',
            'Չհաջողվեց ներբեռնել օգնականին։ Ստուգեք կապը և ազատ տարածքը, ապա կրկնեք։'), 7000);
    } finally {
      busy = false; await keepAwake(false); bar(null); paint();
    }
  }

  /* progress bar: reuse the app's banner (VE.prog / VE.progEnd) */
  function bar(n) {
    try {
      const VE = App().VE;
      if (!VE || !VE.prog) return;
      if (n == null) VE.progEnd && VE.progEnd();
      else VE.prog(L('Скачивание Edit Assistant', 'Downloading Edit Assistant', 'Edit Assistant-ի ներբեռնում'), n);
    } catch (e) {}
  }

  async function manage() {
    const del = await confirmBox(
      L('Edit Assistant установлен. Удалить его с устройства?', 'Edit Assistant is installed. Remove it from this device?', 'Edit Assistant-ը տեղադրված է։ Հեռացնե՞լ այս սարքից։'),
      { yes: L('Удалить', 'Remove', 'Հեռացնել'), no: L('Оставить', 'Keep', 'Թողնել'), danger: true });
    if (!del) return;
    try {
      const w = await loadLib();
      if (engine) { try { await engine.unload(); } catch (e) {} engine = null; }
      await w.deleteModelAllInfoInCache(MODEL);
    } catch (e) { console.error('[EditAssistant]', e); }
    store.set(false); paint();
    say(L('Edit Assistant удалён.', 'Edit Assistant removed.', 'Edit Assistant-ը հեռացված է։'), 3500);
  }

  /* ---------------- commands ---------------- */
  const ACTIONS = ['start_recording', 'stop_recording', 'pause', 'resume', 'flip_camera', 'next_step', 'prev_step', 'go_step', 'export', 'none'];
  const SYSTEM = 'You control a video subtitle studio app by voice. Reply with exactly one JSON action: ' +
    '{"action":"start_recording"} | {"action":"stop_recording"} | {"action":"pause"} | {"action":"resume"} | {"action":"flip_camera"} | ' +
    '{"action":"next_step"} | {"action":"prev_step"} | {"action":"go_step","n":N} | {"action":"export"} | {"action":"none"}. ' +
    'Steps: 1 record or upload, 2 text, 3 voice-over, 4 subtitle style, 5 tracks and editing, 6 export. Use "none" when the command does not match.';

  /* instant keyword path (ru/en): works even before the model is installed */
  function fast(text) {
    const s = String(text || '').toLowerCase().replace(/ё/g, 'е').trim();
    let m;
    if ((m = s.match(/(?:шаг|step)\s*([1-6])/))) return { action: 'go_step', n: +m[1] };
    if (/монтаж|дорожк|tracks|editing/.test(s)) return { action: 'go_step', n: 5 };
    if (/стоп|останов|заверши|stop/.test(s)) return { action: 'stop_recording' };
    if (/продолж|resume|continue/.test(s)) return { action: 'resume' };
    if (/пауз|pause/.test(s)) return { action: 'pause' };
    if (/начн|начина|запиш|запись|старт|record|start/.test(s)) return { action: 'start_recording' };
    if (/перевер|друга[яй] камер|flip|switch camera/.test(s)) return { action: 'flip_camera' };
    if (/дальше|следующ|далее|next/.test(s)) return { action: 'next_step' };
    if (/назад|предыдущ|back|previous/.test(s)) return { action: 'prev_step' };
    if (/экспорт|export|сохрани видео/.test(s)) return { action: 'export' };
    return null;
  }

  function state() {
    /* the main script exposes what we need through window.SSApp */
    return { step: +(document.body.dataset.step || 1), recording: !!App().recording, hasVideo: !!App().hasVideo };
  }

  async function parse(text) {
    const f = fast(text);
    if (f) return f;
    if (!store.get()) return { action: 'none' };
    const e = await ensure();
    const st = state();
    const r = await e.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: 'State: step=' + st.step + ' recording=' + st.recording + ' hasVideo=' + st.hasVideo + '\nCommand: ' + text }
      ],
      temperature: 0, max_tokens: 40, response_format: { type: 'json_object' }
    });
    try {
      const j = JSON.parse(r.choices[0].message.content);
      if (j && ACTIONS.includes(j.action)) return j;
    } catch (err) {}
    return { action: 'none' };
  }

  function click(sel) {
    const b = document.querySelector(sel);
    if (!b || b.disabled) return false;
    b.click();
    return true;
  }

  /* executes one action by pressing the same buttons a finger would press */
  function run(a) {
    if (!a || !a.action) return false;
    const st = state();
    switch (a.action) {
      case 'start_recording': return st.recording ? false : click('#rec');
      case 'stop_recording': return st.recording ? click('#rec') : false;
      case 'pause':
      case 'resume': return click('#pz');
      case 'flip_camera': return click('#camFlip');
      case 'next_step': return click('#fNext');
      case 'prev_step': return click('#fBack');
      case 'go_step': return a.n >= 1 && a.n <= 6 ? click('#fsteps button[data-n="' + a.n + '"]') : false;
      case 'export': return st.step === 6 ? click('#fNext') : click('#exp');
      default: return false;
    }
  }

  async function command(text) { const a = await parse(text); return { action: a, done: run(a) }; }

  window.EditAssistant = { install, ensure, parse, run, command, isInstalled: () => store.get(), MODEL };

  function mount() {
    if (document.getElementById('mEA')) return;
    const fm = document.getElementById('fmenu');           /* Settings popup in wizard mode */
    const legacy = document.getElementById('menuR');
    const host = fm || legacy;
    if (!host) return;
    btn.className = fm ? 'nb' : 'mi';
    const first = fm && fm.querySelector('button');        /* "API keys" */
    first ? first.after(btn) : host.appendChild(btn);
    btn.onclick = () => {
      if (fm) fm.style.display = 'none';
      try { App().closeMenus(); } catch (e) {}
      install();
    };
    /* refresh the label every time the Settings popup is opened */
    document.addEventListener('click', () => setTimeout(paint, 40), true);
    paint();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
