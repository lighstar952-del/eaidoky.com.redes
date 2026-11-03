import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const root = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const CHANNEL_HANDLE = process.env.YOUTUBE_HANDLE || '@eaidoky';
const FALLBACK = [
  { id: 'bKbNjEP0azM', type: 'live', title: 'Live do EAIDOKY', url: 'https://www.youtube.com/live/bKbNjEP0azM', thumbnail: 'https://i.ytimg.com/vi/bKbNjEP0azM/hqdefault.jpg', published: null },
  { id: 'eTWRTfGiqHA', type: 'short', title: 'Short do EAIDOKY', url: 'https://www.youtube.com/shorts/eTWRTfGiqHA', thumbnail: 'https://i.ytimg.com/vi/eTWRTfGiqHA/hqdefault.jpg', published: null }
];
let cache = { at: 0, items: [] };
const TTL = 55_000;

async function fetchText(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; EAIDOKYSite/1.0)', 'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8' }, signal: AbortSignal.timeout(9000) });
  if (!response.ok) throw new Error(`YouTube respondeu ${response.status}`);
  return response.text();
}

function decodeXml(value = '') {
  return value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&apos;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

async function discoverChannelId() {
  const html = await fetchText(`https://www.youtube.com/${CHANNEL_HANDLE}`);
  const patterns = [
    /"channelId":"(UC[\w-]{22})"/,
    /"externalId":"(UC[\w-]{22})"/,
    /channel_id=(UC[\w-]{22})/
  ];
  for (const pattern of patterns) { const match = html.match(pattern); if (match) return match[1]; }
  throw new Error('Não foi possível localizar o ID público do canal.');
}

function parseFeed(xml) {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => {
    const block = match[1];
    const get = (tag) => decodeXml(block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))?.[1] || '');
    const id = get('yt:videoId');
    if (!id) return null;
    return { id, title: get('title') || 'Conteúdo do EAIDOKY', published: get('published') || null, url: `https://www.youtube.com/watch?v=${id}`, thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, type: 'video' };
  }).filter(Boolean);
  return entries;
}

async function classifyVideo(item) {
  try {
    const html = await fetchText(`https://www.youtube.com/watch?v=${item.id}`);
    const live = /"isLiveContent"\s*:\s*true/.test(html) || /"isLiveNow"\s*:\s*true/.test(html);
    if (live) return { ...item, type: 'live' };
    // O RSS não informa se um upload é Short. A duração ajuda a separar os formatos,
    // mas não é perfeita; o canal completo continua acessível pelos links abaixo.
    const duration = Number(html.match(/"lengthSeconds":"(\d+)"/)?.[1] || 0);
    if (duration > 0 && duration <= 180) return { ...item, type: 'short', url: `https://www.youtube.com/shorts/${item.id}` };
    return { ...item, type: 'video' };
  } catch { return item; }
}

async function getFeed() {
  if (Date.now() - cache.at < TTL && cache.items.length) return { items: cache.items, source: 'youtube-rss' };
  try {
    const channelId = await discoverChannelId();
    const xml = await fetchText(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
    const parsed = parseFeed(xml).slice(0, 15);
    const classified = await Promise.all(parsed.map(classifyVideo));
    cache = { at: Date.now(), items: classified };
    return { items: classified, source: 'youtube-rss' };
  } catch (error) {
    console.warn('[youtube-feed]', error.message);
    return { items: FALLBACK, source: 'fallback', warning: 'O YouTube não respondeu à consulta. Exibindo os dois links informados.' };
  }
}

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'eaidoky-site' }));
app.get('/api/youtube-feed', async (_req, res) => {
  res.set('Cache-Control', 'no-store');
  const result = await getFeed();
  res.json({ ...result, updatedAt: new Date().toISOString() });
});
app.use(express.static(path.join(root, 'dist')));
app.get('*', (_req, res) => res.sendFile(path.join(root, 'dist', 'index.html')));
app.listen(PORT, '0.0.0.0', () => console.log(`EAIDOKY rodando na porta ${PORT}`));
