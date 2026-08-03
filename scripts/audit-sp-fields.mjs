import fs from 'fs';

const raw = fs.readFileSync('.power/schemas/sharepointonline/proyectos_vinculacion.Schema.json', 'utf8');
const schema = JSON.parse(raw);

function findItemProperties(node, depth = 0) {
  if (!node || typeof node !== 'object' || depth > 8) return null;
  if (node.properties?.Title && node.properties?.field_1) return node.properties;
  for (const value of Object.values(node)) {
    const found = findItemProperties(value, depth + 1);
    if (found) return found;
  }
  return null;
}

const props = findItemProperties(schema);
if (!props) {
  console.error('No properties found');
  process.exit(1);
}

const rows = Object.entries(props)
  .filter(([key]) => !key.includes('#') && !key.startsWith('{') && !key.includes('@'))
  .map(([key, def]) => ({
    key,
    title: def.title || '',
    type: def.type || (def.properties ? 'choice/object' : ''),
    required: false,
  }));

for (const row of rows) {
  console.log(`${row.key}\t${row.title}\t${row.type}`);
}

console.error(`Total columns: ${rows.length}`);
