import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const input = args[0];
const rowArg = args.indexOf('--row');
const outArg = args.indexOf('--out');
const baseArg = args.indexOf('--base');
const rowIndex = rowArg >= 0 ? Number(args[rowArg + 1]) : 0;
const outPath = outArg >= 0 ? args[outArg + 1] : 'data/config.json';
const basePath = baseArg >= 0 ? args[baseArg + 1] : 'data/config.json';

if (!input) {
  console.error('Usage: node scripts/build-config-from-csv.mjs rows.csv --row 0 --out data/config.json');
  process.exit(1);
}

const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (quoted && ch === '"' && next === '"') {
      cell += '"';
      i += 1;
    } else if (ch === '"') {
      quoted = !quoted;
    } else if (!quoted && ch === ',') {
      row.push(cell);
      cell = '';
    } else if (!quoted && (ch === '\n' || ch === '\r')) {
      if (ch === '\r' && next === '\n') i += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== '')) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }

  row.push(cell);
  if (row.some((value) => value.trim() !== '')) rows.push(row);
  return rows;
};

const setDeep = (obj, dottedPath, value) => {
  const keys = dottedPath.split('.').filter(Boolean);
  if (!keys.length || value === '') return;
  let parsed = value.replace(/\\n/g, '\n');
  if (/^\s*[\[{]/.test(parsed)) {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      // Keep the raw string when the spreadsheet cell is not valid JSON.
    }
  }
  let current = obj;
  keys.slice(0, -1).forEach((key) => {
    current[key] = current[key] && typeof current[key] === 'object' ? current[key] : {};
    current = current[key];
  });
  current[keys.at(-1)] = parsed;
};

const csv = parseCsv(fs.readFileSync(input, 'utf8'));
const [headers, ...records] = csv;
const selected = records[rowIndex];

if (!headers || !selected) {
  console.error(`Row ${rowIndex} was not found in ${input}`);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(basePath, 'utf8'));

headers.forEach((header, index) => {
  const key = header.trim();
  if (!key || key.startsWith('#')) return;
  setDeep(config, key, (selected[index] || '').trim());
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(config, null, 2)}\n`);
console.log(`Wrote ${outPath} from ${input} row ${rowIndex}`);
