import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ENV_PATH = path.join(ROOT, '.env');
const OUT_DIR = path.join(ROOT, 'assets', 'images');

const envText = await fs.readFile(ENV_PATH, 'utf8');
const API_KEY = envText.match(/OPENAI_API_KEY=([^\n\r]+)/)?.[1]?.trim();

const STYLE = ' Setting: Tokyo, Japan. All depicted people are Japanese with East Asian facial features (NOT Caucasian, NOT Western). Editorial documentary photography, photorealistic, mid-2020s Japan, natural cinematic light, subtle film grain, no on-screen English text, no visible brand logos on uniforms or trucks, professional commercial quality.';

const EXTRAS = [
  { name: 'hero-driver-portrait', size: '1024x1536', quality: 'high',
    prompt: 'A confident young Japanese male truck driver in his early 30s wearing a clean dark navy uniform, photographed in three-quarter view standing in front of a softly out-of-focus white truck and warehouse loading bay in late afternoon golden light. Calm friendly expression, slight smile, looking off-camera into the distance. Vertical editorial portrait for a recruitment site hero. Shallow depth of field.' + STYLE },

  { name: 'group-welfare', size: '1536x1024', quality: 'high',
    prompt: 'A wide cinematic group portrait of seven Japanese logistics company employees (mix of male and female, ages 20s to 50s, drivers and warehouse staff) wearing dark navy uniforms with subtle red accents, standing relaxed and smiling together inside a clean modern Tokyo warehouse with pallet racking softly out of focus behind them. Warm overhead industrial light, friendly natural expressions, casual confident postures. Editorial documentary photography, wide angle.' + STYLE },

  { name: 'voice-4-nakamura', size: '1024x1024', quality: 'high',
    prompt: 'A bright cheerful Japanese woman in her late 20s named Aoi Nakamura, neat ponytail hair, wearing a dark navy warehouse work shirt with subtle red company accent and a yellow safety vest, standing inside a modern Tokyo warehouse holding a tablet with a slight smile. Side natural light from a window, three-quarter angle, editorial portrait close-up.' + STYLE },
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function gen(item, attempt = 1) {
  const outPath = path.join(OUT_DIR, item.name + '.jpg');
  try { await fs.access(outPath); console.log(`⊙ Skip ${item.name}`); return; } catch {}
  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-image-2', prompt: item.prompt, size: item.size, quality: item.quality, n: 1, output_format: 'jpeg', output_compression: 85 }),
    });
    if (res.status === 429 && attempt < 3) { await sleep(20000); return gen(item, attempt+1); }
    if (!res.ok) { console.error(`✗ ${item.name}: HTTP ${res.status}`, (await res.text()).slice(0,200)); return; }
    const data = await res.json();
    const buf = Buffer.from(data.data[0].b64_json, 'base64');
    await fs.writeFile(outPath, buf);
    console.log(`✓ ${item.name} (${(buf.length/1024).toFixed(0)}KB)`);
  } catch (e) { console.error(`✗ ${item.name}: ${e.message}`); }
}

console.log(`Generating ${EXTRAS.length} extra images...`);
await Promise.all(EXTRAS.map(gen));
console.log('Done.');
