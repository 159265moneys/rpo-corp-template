import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ENV_PATH = path.join(ROOT, '.env');
const OUT_DIR = path.join(ROOT, 'assets', 'images');

const envText = await fs.readFile(ENV_PATH, 'utf8');
const API_KEY = envText.match(/OPENAI_API_KEY=([^\n\r]+)/)?.[1]?.trim();
if (!API_KEY || !API_KEY.startsWith('sk-')) {
  console.error('OPENAI_API_KEY not found / invalid in .env');
  process.exit(1);
}

await fs.mkdir(OUT_DIR, { recursive: true });

const STYLE = [
  'Tokyo, Japan logistics recruitment photography.',
  'All depicted people are Japanese with East Asian facial features.',
  'Natural candid editorial documentary style, premium commercial quality.',
  'Fresh sky-blue and clean white color mood, navy uniforms, subtle orange accent.',
  'No visible brand logos, no readable text, no watermarks, no Western-looking people.',
  'Shot with soft daylight, crisp detail, subtle film grain, refined art direction.',
].join(' ');

const ASSETS = [
  {
    name: 'recruit-art-hero-driver',
    size: '1536x1024',
    quality: 'high',
    prompt: `A young Japanese female delivery driver in a navy uniform smiling from the open window of a clean white kei delivery van, photographed from outside at a dynamic three-quarter angle. Bright blue sky reflected on the van, airy optimistic recruitment-site mood, generous negative space for typography. ${STYLE}`,
  },
  {
    name: 'recruit-art-hero-hands',
    size: '1024x1024',
    quality: 'medium',
    prompt: `Close-up documentary photo from inside a compact Japanese delivery van: Japanese driver's hands on the steering wheel, morning city street visible through the windshield, blue sky highlights, clean dashboard, subtle motion. ${STYLE}`,
  },
  {
    name: 'recruit-art-hero-parcel',
    size: '1024x1024',
    quality: 'medium',
    prompt: `A cheerful young Japanese female delivery worker in a navy uniform holding a small cardboard parcel in front of a white delivery van, bright outdoor daylight, cropped upper body portrait, confident and warm. ${STYLE}`,
  },
  {
    name: 'recruit-art-message',
    size: '1536x1024',
    quality: 'high',
    prompt: `Wide cinematic scene of Japanese delivery staff preparing clean white vans in a Tokyo depot at sunrise, three workers in navy uniforms checking parcels and routes, blue morning light, elegant diagonal composition, editorial recruitment campaign visual. ${STYLE}`,
  },
  {
    name: 'recruit-art-driver',
    size: '1024x1024',
    quality: 'high',
    prompt: `Portrait of a Japanese male delivery driver in his late 20s leaning casually against a white delivery van, navy uniform, relaxed smile, soft blue sky, clean modern depot, square recruitment interview portrait. ${STYLE}`,
  },
  {
    name: 'recruit-art-warehouse',
    size: '1024x1024',
    quality: 'high',
    prompt: `Portrait of a Japanese warehouse staff member in a navy uniform and light safety vest scanning parcels in a clean bright warehouse, blue structural racks, candid confident expression, square recruitment interview portrait. ${STYLE}`,
  },
  {
    name: 'recruit-art-team',
    size: '1536x1024',
    quality: 'high',
    prompt: `A refined group portrait of six Japanese delivery and warehouse staff, mixed ages and genders, navy uniforms, standing beside clean white delivery vans in a Tokyo logistics depot, natural smiles, bright blue sky, premium recruitment campaign photography. ${STYLE}`,
  },
  {
    name: 'recruit-art-welfare',
    size: '1536x1024',
    quality: 'high',
    prompt: `Candid warm scene in a clean Japanese logistics office break area: delivery workers in navy uniforms chatting over route tablets and coffee before departure, relaxed teamwork, large windows with blue daylight, refined recruitment-site lifestyle photography. ${STYLE}`,
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generate(item, attempt = 1) {
  const outPath = path.join(OUT_DIR, `${item.name}.jpg`);

  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-2',
        prompt: item.prompt,
        size: item.size,
        quality: item.quality,
        n: 1,
        output_format: 'jpeg',
        output_compression: 86,
      }),
    });

    if (res.status === 429 && attempt < 4) {
      console.log(`rate limited: ${item.name}; retrying`);
      await sleep(25000);
      return generate(item, attempt + 1);
    }

    if (!res.ok) {
      console.error(`${item.name}: HTTP ${res.status} ${(await res.text()).slice(0, 240)}`);
      return false;
    }

    const data = await res.json();
    const buf = Buffer.from(data.data?.[0]?.b64_json || '', 'base64');
    if (!buf.length) {
      console.error(`${item.name}: empty response`);
      return false;
    }

    await fs.writeFile(outPath, buf);
    console.log(`generated ${item.name} ${(buf.length / 1024).toFixed(0)}KB`);
    return true;
  } catch (error) {
    console.error(`${item.name}: ${error.message}`);
    return false;
  }
}

console.log(`Generating ${ASSETS.length} recruit art assets with gpt-image-2...`);
let ok = 0;
for (const asset of ASSETS) {
  if (await generate(asset)) ok += 1;
}

console.log(`Done: ${ok}/${ASSETS.length}`);
if (ok !== ASSETS.length) process.exit(1);
