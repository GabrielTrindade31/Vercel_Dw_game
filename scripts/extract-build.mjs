import { readFile, readdir, mkdir, rm, writeFile, cp, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { unzipSync } from 'fflate';

const root = fileURLToPath(new URL('../', import.meta.url));
const uploads = path.join(root, 'uploads');
const output = path.join(root, 'public');

try {
  const archives = (await readdir(uploads)).filter(name => name.toLowerCase().endsWith('.zip'));
  const hasIndex = await stat(path.join(uploads, 'index.html')).then(info => info.isFile()).catch(() => false);
  if (hasIndex) {
    if (archives.length) throw new Error('Use a build extraída ou um ZIP em uploads/, sem misturar os dois formatos.');
    const hasBuild = await stat(path.join(uploads, 'Build')).then(info => info.isDirectory()).catch(() => false);
    if (!hasBuild) throw new Error('A build extraída precisa de uploads/Build/.');
    await rm(output, { recursive: true, force: true });
    await cp(uploads, output, { recursive: true, filter: source => path.basename(source) !== '.gitkeep' });
    console.log('Build já extraída copiada de uploads/ para public/.');
    process.exit(0);
  }
  if (archives.length !== 1) {
    throw new Error('Coloque a build extraída (index.html e Build/) ou exatamente um ZIP em uploads/.');
  }
  const files = unzipSync(await readFile(path.join(uploads, archives[0])));
  const names = Object.keys(files).filter(name => !name.startsWith('__MACOSX/'));
  for (const name of names) {
    if (name.includes('\\') || name.startsWith('/') || name.split('/').includes('..') || /^[A-Za-z]:/.test(name)) {
      throw new Error(`Caminho inseguro no ZIP: ${name}`);
    }
  }
  const indexes = names.filter(name => name === 'index.html' || name.endsWith('/index.html'));
  const candidates = indexes.filter(name => {
    const prefix = name.slice(0, -'index.html'.length);
    return names.some(entry => entry.startsWith(`${prefix}Build/`) && !entry.endsWith('/'));
  });
  if (candidates.length !== 1) {
    throw new Error('O ZIP deve conter uma única build com index.html e Build/ na mesma pasta.');
  }
  const prefix = candidates[0].slice(0, -'index.html'.length);
  // Validate the archive before replacing previously generated output.
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  let count = 0;
  for (const name of names) {
    if (!name.startsWith(prefix) || name.endsWith('/')) continue;
    const relative = name.slice(prefix.length);
    const destination = path.join(output, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, files[name]);
    count++;
  }
  console.log(`Build extraída: ${count} arquivos em public/.`);
} catch (error) {
  console.error(`Falha ao preparar a build: ${error.message}`);
  process.exitCode = 1;
}
