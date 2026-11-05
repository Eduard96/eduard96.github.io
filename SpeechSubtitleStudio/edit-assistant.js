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
  /* language of the voice (speech recognition + spoken answers): own setting, else the app's spoken language */
  const VL_KEY = 'ss_ea_vl';
  const vlang = () => {
    let v = null; try { v = localStorage.getItem(VL_KEY); } catch (e) {}
    if (v !== 'ru' && v !== 'en' && v !== 'hy') v = App().lang;
    return v === 'ru' || v === 'hy' || v === 'en' ? v : lang();
  };
  const VCODE = { ru: 'ru-RU', en: 'en-US', hy: 'hy-AM' };
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
    try { paintT(); } catch (e) {}
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
      lst.set(true); lfatal = false;
      setTimeout(() => speak(L('Помощник готов и слушает. Скажите: что можно сказать.', 'The assistant is ready and listening. Say: what can I say.', 'Օգնականը պատրաստ է և լսում է։')), 600);
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
  /* One table drives everything: keyword recognition (ru / en / hy), the prompt for Qwen and the button each action presses.
     Armenian words are a first draft and should be reviewed by a native speaker. */
  const FN = [
    { id: 'go_step',        kw: /(?:шаг|step|քայլ)\s*([1-6])/,                       d: 'jump to wizard step N (1 record or upload, 2 text, 3 voice-over, 4 subtitle style, 5 tracks and editing, 6 export); also {"n":N}' },
    { id: 'stop_recording', kw: /стоп|останов|заверш|законч|stop|կանգ|ավարտ/,        d: 'stop filming (стоп, остановить запись, կանգնեցնել)' },
    { id: 'resume',         kw: /продолж|resume|continue|շարունակ/,                  d: 'resume a paused recording (продолжить, շարունակել)' },
    { id: 'pause',          kw: /пауз|pause|դադար|պաուզ/,                            d: 'pause the recording (пауза, դադար)' },
    { id: 'flip_camera',    kw: /перевер|друг\S* камер|смени\S* камер|flip|switch camera|շրջ|այլ տեսախ/, d: 'switch front/back camera (переверни камеру, flip camera)' },
    { id: 'dub_no',         kw: /без озвуч|no dub|without dub|առանց ձայնավոր/,       d: 'skip voice-over' },
    { id: 'dub_yes',        kw: /озвуч|dub|ձայնավոր/,                                d: 'record a voice-over (озвучить)' },
    { id: 'dub_retry',      kw: /(?:ещ[её] раз|повтори озвуч|retry|again|կրկին)/,    d: 'redo the voice-over' },
    { id: 'upload_video',   kw: /загруз|upload|բեռնել/,                              d: 'upload a video file (загрузить видео)' },
    { id: 'open_project',   kw: /проект|project|նախագիծ/,                            d: 'open a saved project (открыть проект)' },
    { id: 'add_text',       kw: /свой текст|добавь текст|add text|own text|ավելացնել տեքստ/, d: 'add own text' },
    { id: 'load_subtitles', kw: /файл субтитр|load srt|load subtitles|srt файл/,     d: 'load an .srt / .txt subtitle file' },
    { id: 'open_tracks',    kw: /монтаж|дорожк|tracks|editing|մոնտաժ/,               d: 'open tracks and editing (монтаж)' },
    { id: 'split',          kw: /раздел|разрез|split|cut here|բաժան/,                d: 'split the clip at the playhead' },
    { id: 'save_srt',       kw: /субтитр|srt|ենթագր/,                                d: 'download subtitles as .srt' },
    { id: 'new_video',      kw: /нов\S* видео|new video|նոր տեսանյութ/,              d: 'start a new video' },
    { id: 'back_to_edit',   kw: /к правке|back to edit|վերադառնալ խմբագր/,           d: 'return to editing from the result screen' },
    { id: 'export',         kw: /экспорт|export|արտահան/,                            d: 'render and export the video (экспорт)' },
    { id: 'play_result',    kw: /воспроизв|покажи|смотр|play|ցուցադր/,               d: 'play the finished video' },
    { id: 'share',          kw: /поделись|отправ|share|կիսվ/,                        d: 'share the finished video' },
    { id: 'copy',           kw: /скопируй|копир|copy|պատճեն/,                        d: 'copy the subtitle text' },
    { id: 'save_video',     kw: /сохрани|save|պահպան/,                               d: 'save the video to the device (сохранить)' },
    { id: 'toggle_theme',   kw: /тем[ауы]|theme|dark|light|թեմա/,                    d: 'switch light / dark theme' },
    { id: 'start_recording',kw: /начн|начина|запиш|запись|старт|record|start|սկս|ձայնագր/, d: 'start filming (начни запись, start recording, սկսել ձայնագրությունը)' },
    { id: 'next_step',      kw: /дальше|следующ|далее|вперед|вперёд|next|հաջորդ|առաջ/, d: 'go to the next step (дальше, next)' },
    { id: 'prev_step',      kw: /назад|предыдущ|back|previous|նախորդ|հետ/,           d: 'go to the previous step (назад, back)' },
    { id: 'help',           kw: /что (?:можно|умеешь|ты умеешь)|помощь|команды|help|what can|commands|օգնություն|հրաման/, d: 'tell the user what can be said' }
  ];
  const BTN = {
    upload_video: '#m1U', open_project: '#f1prj', add_text: '#m1Txt', load_subtitles: '#srtBtn', dub_yes: '#dYes', dub_no: '#dNo',
    dub_retry: '#dRetry', open_tracks: '#fTracks', split: '#trSplit', save_srt: '#dnSrt', new_video: '#dnNew', back_to_edit: '#dnBack',
    play_result: '#dnPlay', share: '#dnShare', copy: '#dnCopy', save_video: '#dnSave', toggle_theme: '#theme',
    flip_camera: '#camFlip', next_step: '#fNext', prev_step: '#fBack', pause: '#pz', resume: '#pz'
  };
  const ACTIONS = FN.map(f => f.id).concat(['none']);
  const SYSTEM = 'You control a video subtitle studio app by voice. The user may speak Russian, English or Armenian. ' +
    'Reply with exactly one JSON object {"action":NAME} (go_step also needs "n"). Available actions: ' +
    FN.map(f => f.id + ' = ' + f.d).join('; ') + '. Use {"action":"none"} when the command matches none of them.';
  const HELP = {
    ru: 'Можно сказать: начни запись, стоп, пауза, продолжи, переверни камеру, дальше, назад, шаг и номер, монтаж, озвучить, без озвучки, экспорт, сохранить, поделиться, новое видео. Во время записи остановить можно двойным касанием экрана.',
    en: 'You can say: start recording, stop, pause, resume, flip camera, next, back, step and a number, tracks, dub, no dub, export, save, share, new video. While recording, double-tap the screen to stop.',
    hy: 'Կարող եք ասել՝ սկսել ձայնագրությունը, կանգ, դադար, շարունակել, հաջորդ, հետ, քայլ և թիվ, արտահանել, պահպանել։ Ձայնագրության ժամանակ կանգնեցնելու համար երկու անգամ հպեք էկրանին։'
  };

  /* instant keyword path (ru/en/hy): works even before the model is installed */
  function fast(text) {
    const s = String(text || '').toLowerCase().replace(/ё/g, 'е').trim();
    if (!s) return null;
    for (const f of FN) {
      const m = s.match(f.kw);
      if (m) return f.id === 'go_step' ? { action: 'go_step', n: +m[1] } : { action: f.id };
    }
    return null;
  }

  function state() {
    /* the main script exposes what we need through window.SSApp */
    return { step: +(document.body.dataset.step || 1), recording: !!App().recording, hasVideo: !!App().hasVideo };
  }

  async function parse(text) { return (await parseEx(text)).a; }

  async function parseEx(text) {
    const t0 = performance.now();
    const ms = () => Math.round(performance.now() - t0);
    const f = fast(text);
    if (f) return { a: f, src: 'words', ms: ms() };
    if (!store.get()) return { a: { action: 'none' }, src: 'no-model', ms: ms() };
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
      if (j && ACTIONS.includes(j.action)) return { a: j, src: 'qwen', ms: ms() };
    } catch (err) {}
    return { a: { action: 'none' }, src: 'qwen', ms: ms() };
  }

  const visible = b => !!b && !b.disabled && b.getClientRects().length > 0;
  function click(sel, needVisible) {
    const b = document.querySelector(sel);
    if (!b || b.disabled) return false;
    if (needVisible !== false && !visible(b)) return false;
    b.click();
    return true;
  }

  function speak(text) {
    try {
      if (!window.speechSynthesis || !text) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = VCODE[vlang()];
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  /* executes one action by pressing the same buttons a finger would press */
  function run(a) {
    if (!a || !a.action) return false;
    const st = state();
    switch (a.action) {
      case 'start_recording': return st.recording ? false : (click('#rec') || click('#fRec') || click('#m1R'));
      case 'stop_recording': return st.recording ? click('#rec', false) : false;
      case 'go_step': return a.n >= 1 && a.n <= 6 ? click('#fsteps button[data-n="' + a.n + '"]') : false;
      case 'export': return st.step === 6 ? click('#fNext') : (click('#exp') || click('#fNext'));
      case 'help': speak(HELP[vlang()]); return true;
      case 'none': return false;
      default: return BTN[a.action] ? click(BTN[a.action]) : false;
    }
  }

  async function command(text) { const a = await parse(text); return { action: a, done: run(a) }; }


  /* ---------- test panel (Settings → Test Edit Assistant) ---------- */
  const tbtn = document.createElement('button');
  tbtn.id = 'mEAT'; tbtn.type = 'button'; tbtn.className = 'nb';
  let panel = null, rec = null;

  function paintT() {
    tbtn.style.display = store.get() ? '' : 'none';
    tbtn.textContent = '🎤 ' + L('Проверить Edit Assistant', 'Test Edit Assistant', 'Փորձարկել Edit Assistant');
  }

  function buildPanel() {
    const d = document.createElement('div');
    d.className = 'ovl'; d.id = 'eaPanel'; d.style.touchAction = 'auto';
    d.innerHTML = '<div class="box" style="text-align:left">' +
      '<h3 id="eaT"></h3><p id="eaH"></p>' +
      '<input id="eaIn" type="text" style="width:100%;margin-top:10px;padding:10px;border-radius:10px;border:1px solid var(--line);background:var(--bg);color:inherit;font-size:16px">' +
      '<div style="display:flex;gap:8px;margin-top:10px">' +
      '<button class="nb" id="eaMic" type="button" style="flex:1"></button>' +
      '<button class="nb pri" id="eaGo" type="button" style="flex:1"></button></div>' +
      '<label style="display:flex;gap:8px;align-items:center;margin-top:10px;font-size:13px"><input type="checkbox" id="eaEx"><span id="eaExT"></span></label>' +
      '<pre id="eaOut" aria-live="polite" style="white-space:pre-wrap;margin:10px 0 0;padding:10px;border-radius:10px;background:var(--bg);font-size:13px;min-height:54px"></pre>' +
      '<button class="nb" id="eaClose" type="button" style="width:100%;margin-top:10px"></button></div>';
    document.body.appendChild(d);
    const $ = id => d.querySelector('#' + id);
    const fill = () => {
      $('eaT').textContent = L('Проверка помощника', 'Assistant test', 'Օգնականի փորձարկում');
      $('eaH').textContent = L('Скажите или напишите: «начни запись», «следующий шаг», «шаг 5», «переверни камеру».',
        'Say or type: "start recording", "next step", "step 5", "flip camera".',
        'Ասեք կամ գրեք՝ «start recording», «next step», «step 5».');
      $('eaIn').placeholder = L('Команда…', 'Command…', 'Հրաման…');
      $('eaMic').textContent = '🎤 ' + L('Говорить', 'Speak', 'Խոսել');
      $('eaGo').textContent = L('Понять', 'Understand', 'Հասկանալ');
      $('eaExT').textContent = L('Выполнять команду (нажимать кнопки)', 'Execute the command (press buttons)', 'Կատարել հրամանը');
      $('eaClose').textContent = L('Закрыть', 'Close', 'Փակել');
    };
    const out = t => { $('eaOut').textContent = t; };
    async function go() {
      const text = $('eaIn').value.trim();
      if (!text) return;
      out('…');
      try {
        const r = await parseEx(text);
        let t = JSON.stringify(r.a) + '\n' + L('Источник: ', 'Source: ', 'Աղբյուր՝ ') +
          (r.src === 'qwen' ? 'Qwen' : r.src === 'words' ? L('ключевые слова', 'keywords', 'բանալի բառեր') : L('модель не установлена', 'model not installed', 'մոդելը տեղադրված չէ')) +
          ' · ' + r.ms + ' ms';
        if ($('eaEx').checked) {
          const ok = run(r.a);
          t += '\n' + (ok ? L('✓ выполнено', '✓ done', '✓ կատարված է') : L('— не выполнено (сейчас нельзя)', '— not executed (not possible now)', '— չի կատարվել'));
        }
        out(t);
      } catch (e) { out('Error: ' + (e && e.message || e)); }
    }
    function mic() {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (App().recording) { out(L('Идёт запись: команды слушает сама запись. Скажите «стоп» в кадре.', 'Recording is on: commands are heard through the recording itself. Say "stop".', 'Ձայնագրման ժամանակ հրամանները լսվում են ձայնագրությամբ։ Ասեք «stop»։')); return; }
      if (!SR) { out(L('Распознавание речи не поддерживается в этом браузере.', 'Speech recognition is not supported in this browser.', 'Խոսքի ճանաչումը չի աջակցվում։')); return; }
      if (rec) { try { rec.stop(); } catch (e) {} return; }
      rec = new SR();
      rec.lang = VCODE[vlang()];
      rec.interimResults = true; rec.maxAlternatives = 1;
      $('eaMic').textContent = '⏺ ' + L('Слушаю…', 'Listening…', 'Լսում եմ…');
      rec.onresult = ev => {
        let t = ''; for (const r of ev.results) t += r[0].transcript;
        $('eaIn').value = t;
        if (ev.results[ev.results.length - 1].isFinal) go();
      };
      rec.onerror = ev => out('Mic: ' + (ev.error || 'error'));
      rec.onend = () => { rec = null; $('eaMic').textContent = '🎤 ' + L('Говорить', 'Speak', 'Խոսել'); };
      try { rec.start(); } catch (e) { rec = null; }
    }
    $('eaGo').onclick = go;
    $('eaIn').onkeydown = e => { if (e.key === 'Enter') go(); };
    $('eaMic').onclick = mic;
    $('eaClose').onclick = () => { if (rec) { try { rec.stop(); } catch (e) {} } d.classList.remove('show'); };
    d._fill = fill;
    return d;
  }

  function openPanel() {
    if (!panel) panel = buildPanel();
    panel._fill();
    panel.classList.add('show');
  }


  /* ---------- voice commands while recording: listen through the app's own recognizer (a second one would fight for the microphone) ---------- */
  let lastFire = 0;
  function onSpeech(txt) {
    if (!store.get() || !App().recording) return false;
    const s = String(txt || '').toLowerCase().replace(/ё/g, 'е').replace(/[.,!?]/g, '').trim();
    if (!s || Date.now() - lastFire < 2500) return false;
    let act = null;
    if (/(^|\s)(стоп|остановить запись|останови запись|закончить запись|stop recording|stop)$/.test(s) && s.split(/\s+/).length <= 5) act = 'stop_recording';
    else if (/(^|\s)(пауза|поставь на паузу|pause)$/.test(s) && s.split(/\s+/).length <= 5) act = 'pause';
    if (!act) return false;
    lastFire = Date.now();
    setTimeout(() => run({ action: act }), 150);
    return true;           /* the command phrase is removed from the subtitles */
  }
  window.SSApp && (window.SSApp.onSpeech = onSpeech);


  /* ---------- hands-free listening + double-tap stop ---------- */
  const LS_L = 'ss_ea_listen';
  const lst = {
    on() { try { return localStorage.getItem(LS_L) !== '0'; } catch (e) { return true; } },
    set(v) { try { localStorage.setItem(LS_L, v ? '1' : '0'); } catch (e) {} }
  };
  let lrec = null, lfatal = false, lbusy = false, lgap = 0, lnote = '';
  const badge = document.createElement('button');
  badge.id = 'eaBadge'; badge.type = 'button';
  badge.style.cssText = 'position:fixed;left:10px;bottom:10px;z-index:150;max-width:70vw;padding:8px 12px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:inherit;font-size:13px;box-shadow:var(--shadow);display:none';

  function paintBadge() {
    if (!store.get() || busy) { badge.style.display = 'none'; return; }
    badge.style.display = '';
    let t;
    if (App().recording) t = '👆👆 ' + L('двойное касание = стоп', 'double-tap = stop', 'երկու հպում = կանգ');
    else if (lfatal) t = '🎤✕ ' + L('нет доступа к микрофону', 'no microphone access', 'խոսափողը անհասանելի է');
    else if (!lst.on()) t = '🔇 ' + L('слух выключен', 'listening off', 'լսելը անջատված է');
    else t = '🎤 ' + (lnote || L('слушаю', 'listening', 'լսում եմ'));
    paintLang();
    badge.textContent = t;
    badge.setAttribute('aria-label', t);
  }
  badge.onclick = () => {
    if (lfatal) { lfatal = false; lst.set(true); } else lst.set(!lst.on());
    if (!lst.on()) stopL();
    speak(lst.on() ? L('Слушаю.', 'Listening.', 'Լսում եմ։') : L('Слух выключен.', 'Listening off.', 'Լսելը անջատված է։'));
    paintBadge();
  };

  const lb = document.createElement('button');
  lb.id = 'eaLang'; lb.type = 'button';
  lb.style.cssText = 'position:fixed;left:10px;bottom:56px;z-index:150;padding:6px 12px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:inherit;font-size:13px;box-shadow:var(--shadow);display:none';
  const paintLang = () => {
    const v = vlang();
    lb.style.display = store.get() && !busy && !App().recording ? '' : 'none';
    lb.textContent = '🌐 ' + { ru: 'Русский', en: 'English', hy: 'Հայերեն' }[v];
    lb.setAttribute('aria-label', L('Язык голоса: ', 'Voice language: ', 'Ձայնի լեզուն՝ ') + lb.textContent);
  };
  lb.onclick = () => {
    const order = ['ru', 'en', 'hy'];
    const n = order[(order.indexOf(vlang()) + 1) % 3];
    try { localStorage.setItem(VL_KEY, n); } catch (e) {}
    stopL();                                   /* the loop restarts it in the new language */
    paintLang();
    speak({ ru: 'Русский язык.', en: 'English.', hy: 'Հայերեն։' }[n]);
  };
  const SRC = () => window.SpeechRecognition || window.webkitSpeechRecognition;
  const testOpen = () => !!(panel && panel.classList.contains('show'));

  function startL() {
    const SR = SRC();
    if (!SR || lrec || lfatal) return;
    const r = new SR();
    r.lang = VCODE[vlang()];
    r.continuous = true; r.interimResults = false; r.maxAlternatives = 1;
    r.onresult = ev => {
      for (let i = ev.resultIndex; i < ev.results.length; i++) if (ev.results[i].isFinal) heard(ev.results[i][0].transcript);
    };
    r.onerror = ev => {
      if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') { lfatal = true; paintBadge(); }
    };
    r.onend = () => { if (lrec === r) lrec = null; lgap = Date.now() + 400; };
    lrec = r;
    try { r.start(); } catch (e) { lrec = null; }
  }
  function stopL() {
    const r = lrec; lrec = null;
    if (r) { r.onend = null; r.onresult = null; r.onerror = null; try { r.abort(); } catch (e) {} }
  }

  async function heard(text) {
    text = String(text || '').trim();
    if (!text || lbusy || text.split(/\s+/).length > 8) return;   /* commands are short; longer speech is ignored */
    lbusy = true;
    try {
      const r = await parseEx(text);
      if (!r.a || r.a.action === 'none') { lnote = ''; return; }
      const ok = run(r.a);
      lnote = (ok ? '✓ ' : '× ') + text;
      if (ok && r.a.action !== 'help') speak(L('Готово', 'Done', 'Պատրաստ է'));
      if (!ok) speak(L('Сейчас это недоступно', 'Not available right now', 'Հիմա հասանելի չէ'));
      setTimeout(() => { lnote = ''; paintBadge(); }, 4000);
    } catch (e) { console.error('[EditAssistant]', e); }
    finally { lbusy = false; paintBadge(); }
  }

  /* the main loop: listen when idle, hand the microphone over to the recording while filming */
  let wasRec = false;
  setInterval(() => {
    const rec = !!App().recording;
    const want = store.get() && lst.on() && !rec && !busy && !document.hidden && !testOpen();
    if (want && !lrec && Date.now() >= lgap) startL();
    if (!want && lrec) stopL();
    if (rec !== wasRec) {
      wasRec = rec;
      if (rec) { try { speechSynthesis.cancel(); } catch (e) {} }
      else if (store.get()) speak(L('Запись остановлена.', 'Recording stopped.', 'Ձայնագրությունը կանգնեցվեց։'));
    }
    paintBadge();
  }, 700);

  /* double tap anywhere (not on a control) stops the recording */
  let lastTap = null;
  document.addEventListener('pointerup', ev => {
    if (!store.get() || !App().recording) { lastTap = null; return; }
    if (ev.target.closest && ev.target.closest('button,a,input,select,textarea,label')) { lastTap = null; return; }
    const now = Date.now();
    if (lastTap && now - lastTap.t < 450 && Math.hypot(ev.clientX - lastTap.x, ev.clientY - lastTap.y) < 60) {
      lastTap = null;
      try { navigator.vibrate && navigator.vibrate(80); } catch (e) {}
      run({ action: 'stop_recording' });
    } else lastTap = { t: now, x: ev.clientX, y: ev.clientY };
  }, true);

  function mountBadge() { if (!badge.isConnected) { document.body.appendChild(badge); document.body.appendChild(lb); } }

  window.EditAssistant = { install, ensure, parse, parseEx, run, test: openPanel, command, isInstalled: () => store.get(), MODEL };

  function mount() {
    if (document.getElementById('mEA')) return;
    const fm = document.getElementById('fmenu');           /* Settings popup in wizard mode */
    const legacy = document.getElementById('menuR');
    const host = fm || legacy;
    if (!host) return;
    btn.className = fm ? 'nb' : 'mi';
    const first = fm && fm.querySelector('button');        /* "API keys" */
    first ? first.after(btn) : host.appendChild(btn);
    tbtn.className = fm ? 'nb' : 'mi';
    btn.after(tbtn);
    tbtn.onclick = () => {
      if (fm) fm.style.display = 'none';
      try { App().closeMenus(); } catch (e) {}
      openPanel();
    };
    btn.onclick = () => {
      if (fm) fm.style.display = 'none';
      try { App().closeMenus(); } catch (e) {}
      install();
    };
    /* refresh the label every time the Settings popup is opened */
    document.addEventListener('click', () => setTimeout(() => { paint(); paintT(); }, 40), true);
    paint(); paintT(); mountBadge();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
