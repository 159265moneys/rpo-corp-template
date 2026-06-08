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

const STYLE = ' Setting: Tokyo, Japan. All depicted people are Japanese with East Asian facial features (NOT Caucasian, NOT Western). Japanese language signage if any text appears. Editorial documentary photography, photorealistic, mid-2020s Japan, natural cinematic light, subtle film grain, no on-screen English text, no visible brand logos, professional commercial quality.';

const IMAGES = [
  // ===== TOP PAGE =====
  { name: 'hero-main', size: '1536x1024', quality: 'high',
    prompt: 'A cinematic wide low-angle shot of a clean white Japanese 4-ton box truck crossing an elevated Tokyo Bay expressway at golden hour. The Rainbow Bridge and Toyosu skyline glow softly in the background. Warm orange-blue gradient sky. Dynamic slight motion blur on the road. Shot on 35mm film aesthetic.' + STYLE },

  { name: 'about-visual', size: '1024x1536', quality: 'medium',
    prompt: 'A close-up cinematic photograph of a senior Japanese worker\'s weathered hands carefully securing a cargo strap on wooden pallets stacked with cardboard boxes inside a clean modern Tokyo logistics warehouse. Side window light, deep navy blue uniform sleeve visible, shallow depth of field, warm fluorescent ambient light, vertical composition.' + STYLE },

  { name: 'service-card-1', size: '1024x1024', quality: 'medium',
    prompt: 'A clean white Japanese 4-ton box truck parked at a Tokyo loading dock in early morning. Side rear doors open showing neatly stacked cardboard boxes. Cool blue morning light with slight mist. Wide-angle commercial photography, square composition.' + STYLE },

  { name: 'service-card-2', size: '1024x1024', quality: 'medium',
    prompt: 'A single white Japanese 10-ton charter truck driving alone on a curving night expressway in the Tokyo metro area. Headlights illuminating the road, red taillights of distant vehicles streaking past. Long exposure cinematic style, cool blue and amber color grading, dramatic perspective.' + STYLE },

  { name: 'service-card-3', size: '1024x1024', quality: 'medium',
    prompt: 'Interior of a tall modern Japanese pallet warehouse with neatly arranged navy blue and gray steel shelving stacked with cardboard boxes. Soft overhead industrial LED lighting, polished concrete floor reflecting light subtly, no people, symmetric architectural composition.' + STYLE },

  // ===== ABOUT PAGE =====
  { name: 'page-hero-about', size: '1536x1024', quality: 'medium',
    prompt: 'An aerial drone shot at dusk of the Toyosu waterfront business district in Tokyo. Illuminated office towers reflected on the bay. Deep blue twilight sky with warm yellow office windows glowing. Ultra-wide panorama.' + STYLE },

  { name: 'president-portrait', size: '1024x1536', quality: 'high',
    prompt: 'A medium editorial corporate portrait of a calm dignified Japanese man in his late 50s with short graying hair, wearing a dark navy business suit with a subtle red lapel pin. He stands in front of a softly out-of-focus window of a Toyosu Tokyo office overlooking the bay at late afternoon. Confident warm expression with a slight smile, looking slightly off-camera. Natural side window light.' + STYLE },

  { name: 'history-bg', size: '1536x1024', quality: 'medium',
    prompt: 'A nostalgic faded archival photograph of a small Japanese logistics yard from the late 1970s. Two vintage white box trucks parked under a weathered hand-painted shop sign. Monochrome with warm sepia tint, slight film grain.' + STYLE },

  // ===== SERVICES PAGE =====
  { name: 'page-hero-services', size: '1536x1024', quality: 'medium',
    prompt: 'A wide cinematic shot inside a vast modern Japanese logistics distribution center. Multiple forklifts moving pallets in the distance, warm overhead industrial lights, polished concrete floor catching the light. Slight motion blur in background, no faces visible.' + STYLE },

  { name: 'service-detail-1', size: '1536x1024', quality: 'medium',
    prompt: 'A row of five clean 2-ton and 4-ton white Japanese delivery trucks lined up at a Tokyo logistics depot at sunrise. Soft warm orange light hitting the side panels. Lightly wet asphalt reflecting the trucks. No drivers visible, slight low angle.' + STYLE },

  { name: 'service-detail-2', size: '1536x1024', quality: 'medium',
    prompt: 'Close-up of a Japanese 10-ton charter truck cargo bay loading high-value precision equipment crates secured with custom padded straps. Two Japanese workers in dark navy uniforms with faces turned away carefully handling the load. Warm interior cargo lighting.' + STYLE },

  { name: 'service-detail-3', size: '1536x1024', quality: 'medium',
    prompt: 'A high vantage interior shot of a modern Japanese warehouse with rows of navy blue pallet racking stretching into perspective. Illuminated by clean overhead LEDs. A Japanese worker in dark navy uniform driving a forklift in the mid-distance with back turned, motion blur on the forklift.' + STYLE },

  { name: 'fleet-card', size: '1024x1024', quality: 'medium',
    prompt: 'A clean detail shot of the front grille and headlights of a modern white Japanese 4-ton box truck, slight side angle. Warm garage lighting reflecting on the chrome bumper. Editorial automotive photography.' + STYLE },

  { name: 'warehouse-card', size: '1024x1024', quality: 'medium',
    prompt: 'Exterior morning shot of a modern square Japanese logistics warehouse facility in Kawasaki. Gray-blue corrugated metal walls, large rolling shutter doors half open showing a single forklift inside. Soft overcast natural light, no signage. Architectural editorial photography.' + STYLE },

  { name: 'system-card', size: '1024x1024', quality: 'medium',
    prompt: 'Over-shoulder shot of a Japanese office worker\'s hands operating a logistics dispatch dashboard on a wide monitor showing a Tokyo map with vehicle pins. Warm office light from the side, shallow depth of field, modern minimalist office, no faces visible.' + STYLE },

  // ===== RECRUIT PAGE =====
  { name: 'page-hero-recruit', size: '1536x1024', quality: 'medium',
    prompt: 'A wide shot of a young Japanese male and female logistics worker in dark navy uniforms walking side by side through a Toyosu warehouse loading bay at golden hour. Their backs partially turned, sunlight streaming through the open dock doors. Hopeful warm cinematic mood, motion in their step.' + STYLE },

  { name: 'position-driver', size: '1024x1024', quality: 'medium',
    prompt: 'A Japanese male driver in his early 30s in a clean dark navy uniform with a subtle red company badge, seated in the driver\'s seat of a 4-ton truck. Both hands on the steering wheel, looking forward through the windshield at the road. Side natural light, three-quarter rear view.' + STYLE },

  { name: 'position-warehouse', size: '1024x1024', quality: 'medium',
    prompt: 'A Japanese male worker in his late 20s wearing a dark navy uniform and a yellow safety vest, scanning a barcode on a cardboard box with a handheld scanner inside a bright modern warehouse. Three-quarter back view, action mid-motion.' + STYLE },

  { name: 'position-office', size: '1024x1024', quality: 'medium',
    prompt: 'A Japanese woman in her late 20s with a neat shoulder-length bob, wearing a soft beige cardigan over a white blouse. Seated at an organized minimalist office desk with a wide monitor displaying a logistics dispatch dashboard. On a desk phone, looking down at notes. Side natural window light.' + STYLE },

  { name: 'position-management', size: '1024x1024', quality: 'medium',
    prompt: 'A Japanese man in his mid-40s with short side-parted hair, wearing a dark navy uniform with a subtle red lapel pin. Standing at the entrance of a modern Japanese warehouse with arms crossed, looking off toward workers loading a truck in the soft-focus background. Confident relaxed pose.' + STYLE },

  { name: 'voice-1-sato', size: '1024x1024', quality: 'high',
    prompt: 'A friendly Japanese man in his late 20s, short black hair, wearing a dark navy delivery uniform with a small red lapel pin. Standing casually in front of a parked white 4-ton truck. Soft natural overcast daylight. Slight friendly smile, three-quarter angle, editorial portrait close-up.' + STYLE },

  { name: 'voice-2-suzuki', size: '1024x1024', quality: 'high',
    prompt: 'A warm-hearted Japanese woman in her early 30s, neat shoulder-length bob, wearing a soft cream blouse. Seated at a tidy modern office desk in front of a window overlooking Toyosu in soft afternoon light. Genuine relaxed smile, hands resting on a laptop, editorial portrait close-up.' + STYLE },

  { name: 'voice-3-takahashi', size: '1024x1024', quality: 'high',
    prompt: 'A seasoned Japanese man in his late 40s with short graying hair, wearing a dark navy work polo. Standing inside a Kawasaki warehouse with pallet racks softly out of focus behind him. Calm warm expression, kind eyes, slight smile, editorial portrait close-up.' + STYLE },

  { name: 'day-1-roll-call', size: '1024x1024', quality: 'medium',
    prompt: 'A close-up shot of a Japanese male driver holding a small alcohol breath checker device near his mouth inside a dim early morning company depot interior. Soft cool blue dawn light through windows. Documentary realistic.' + STYLE },

  { name: 'day-2-inspection', size: '1024x1024', quality: 'medium',
    prompt: 'A Japanese driver in dark navy uniform crouching beside a 4-ton truck\'s front tire, checking the tire with his hand. Soft early morning side light hitting the tire, focused documentary capture.' + STYLE },

  { name: 'day-3-departure', size: '1024x1024', quality: 'medium',
    prompt: 'A wide POV shot from the driver\'s seat perspective looking forward at the steering wheel and the road ahead. Tokyo Bay-area morning streets unfolding in soft blue-orange dawn light. Hands on wheel partially visible.' + STYLE },

  { name: 'day-4-lunch', size: '1024x1024', quality: 'medium',
    prompt: 'A casual mid-day shot of a Japanese driver sitting at a small wooden table inside a roadside service area diner, holding a teishoku tray with grilled fish, rice, and miso soup. Warm fluorescent restaurant light, candid documentary.' + STYLE },

  { name: 'day-5-afternoon', size: '1024x1024', quality: 'medium',
    prompt: 'A wide shot of a white 4-ton Japanese delivery truck pulling into a company depot driveway in late afternoon golden light. Long shadow cast on the asphalt.' + STYLE },

  { name: 'day-6-end', size: '1024x1024', quality: 'medium',
    prompt: 'A Japanese driver typing his shift report on a tablet inside the dispatch office. A digital dashboard showing routes on a wall monitor softly out of focus behind. Warm office light, documentary close-up.' + STYLE },

  // ===== CONTACT PAGE =====
  { name: 'page-hero-contact', size: '1536x1024', quality: 'medium',
    prompt: 'A clean architectural shot of a modern Toyosu Tokyo office building lobby reception desk. Deep navy accent wall behind, soft warm directional light, no people, minimal composition.' + STYLE },

  { name: 'map-aerial', size: '1536x1024', quality: 'low',
    prompt: 'A clean stylized top-down minimalist illustrated map of the Toyosu district in Tokyo. Subtle navy blue water and light gray streets, a single red location pin marking a building. Flat editorial illustration style.' + STYLE },
];

const CONCURRENCY = 2;
const MAX_RETRIES = 3;
const RETRY_WAIT_MS = 30000;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function generateOne(item, attempt = 1) {
  const outPath = path.join(OUT_DIR, item.name + '.jpg');

  try {
    await fs.access(outPath);
    console.log(`⊙ Skip ${item.name} (exists)`);
    return { ...item, ok: true, skipped: true };
  } catch {}

  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-2',
        prompt: item.prompt,
        size: item.size,
        quality: item.quality,
        n: 1,
        output_format: 'jpeg',
        output_compression: 85,
      }),
    });

    if (res.status === 429 && attempt < MAX_RETRIES) {
      console.log(`⏳ Rate limit ${item.name}, waiting ${RETRY_WAIT_MS/1000}s (attempt ${attempt})`);
      await sleep(RETRY_WAIT_MS);
      return generateOne(item, attempt + 1);
    }

    if (!res.ok) {
      const err = await res.text();
      console.error(`✗ ${item.name}: HTTP ${res.status} - ${err.slice(0, 200)}`);
      return { ...item, ok: false, error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    if (!data.data?.[0]?.b64_json) {
      console.error(`✗ ${item.name}: no b64_json in response`);
      return { ...item, ok: false, error: 'no b64_json' };
    }

    const buf = Buffer.from(data.data[0].b64_json, 'base64');
    await fs.writeFile(outPath, buf);
    const kb = (buf.length / 1024).toFixed(0);
    console.log(`✓ ${item.name.padEnd(22)} ${item.quality.padEnd(6)} ${item.size.padEnd(10)} ${kb}KB`);
    return { ...item, ok: true };
  } catch (e) {
    console.error(`✗ ${item.name}: ${e.message}`);
    return { ...item, ok: false, error: e.message };
  }
}

console.log(`Validating API key...`);
const authCheck = await fetch('https://api.openai.com/v1/models', {
  headers: { 'Authorization': `Bearer ${API_KEY}` },
});
if (!authCheck.ok) {
  console.error(`✗ API key invalid: HTTP ${authCheck.status}`);
  console.error(await authCheck.text());
  process.exit(1);
}
console.log(`✓ API key valid\n`);

console.log(`Starting generation of ${IMAGES.length} images (concurrency: ${CONCURRENCY})\n`);
const start = Date.now();

let idx = 0;
const results = [];
const worker = async () => {
  while (idx < IMAGES.length) {
    const i = idx++;
    const r = await generateOne(IMAGES[i]);
    results.push(r);
  }
};
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
const ok = results.filter(r => r.ok).length;
const fail = results.length - ok;
console.log(`\n========================================`);
console.log(`Done in ${elapsed}s  ✓ ${ok}/${results.length} success`);
if (fail > 0) {
  console.log(`✗ Failed: ${fail}`);
  results.filter(r => !r.ok).forEach(r => console.log(`  - ${r.name}: ${r.error}`));
  process.exit(1);
}
