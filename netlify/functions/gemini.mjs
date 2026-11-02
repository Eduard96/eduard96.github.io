// Защищённый посредник для Gemini: ключ хранится только здесь (переменная окружения GEMINI_API_KEY, можно несколько через запятую).
// Приложение отправляет сюда запрос, а ключа в браузере у пользователя нет.
const WINDOW_MS = 60_000, MAX_PER_WINDOW = 40, MAX_BODY = 6_000_000;
const hits = new Map();

const keys = () => String(process.env.GEMINI_API_KEY || '').split(',').map(s => s.trim()).filter(Boolean);
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

function originOk(req) {
  const host = new URL(req.url).host;
  const o = req.headers.get('origin') || req.headers.get('referer') || '';
  if (!o) return false;
  try { const h = new URL(o).host; return h === host || /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(h); } catch { return false; }
}

function limited(ip) {
  const now = Date.now();
  const a = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  a.push(now); hits.set(ip, a);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some(t => now - t < WINDOW_MS)) hits.delete(k);
  return a.length > MAX_PER_WINDOW;
}

export default async (req) => {
  if (req.method === 'GET') return json({ ok: keys().length > 0 });
  if (req.method !== 'POST') return json({ error: { message: 'Method not allowed' } }, 405);
  if (!originOk(req)) return json({ error: { message: 'Forbidden' } }, 403);
  const ip = req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for') || 'x';
  if (limited(ip)) return json({ error: { message: 'Слишком много запросов, подождите минуту.' } }, 429);
  const ks = keys();
  if (!ks.length) return json({ error: { message: 'Server key is not set' } }, 503);
  const raw = await req.text();
  if (raw.length > MAX_BODY) return json({ error: { message: 'Too large' } }, 413);
  let d; try { d = JSON.parse(raw); } catch { return json({ error: { message: 'Bad request' } }, 400); }
  if (!d || typeof d.model !== 'string' || !/^gemini-[a-z0-9.\-]+$/.test(d.model) || typeof d.body !== 'object') return json({ error: { message: 'Bad request' } }, 400);
  let last = null;
  for (const k of ks.sort(() => Math.random() - .5)) {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + d.model + ':generateContent', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': k }, body: JSON.stringify(d.body)
    });
    if (r.status === 429 || r.status === 403 || r.status === 503) { last = r; continue; }
    return new Response(await r.text(), { status: r.status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  }
  return new Response(last ? await last.text() : '{}', { status: last ? last.status : 429, headers: { 'Content-Type': 'application/json' } });
};
