import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const forbiddenPaths = [
  'app/examples',
  'lib/book/demo-book.ts',
  'lib/ai/mock-provider.ts',
  'public/images/mockup-little-explorer.jpg',
];
for (const path of forbiddenPaths) {
  if (existsSync(join(root, path))) throw new Error(`Bundled demo surface still exists: ${path}`);
}

const providerFiles = [
  'lib/ai/pipeline.ts',
  'lib/ai/openrouter.ts',
  'lib/ai/gemini.ts',
  'lib/ai/pollinations.ts',
];
const forbiddenText = /ocean-wonders|GENERATION_MODE=mock|MockTextProvider|MockImageProvider/;
for (const file of providerFiles) {
  if (forbiddenText.test(readFileSync(join(root, file), 'utf8'))) {
    throw new Error(`Mock/demo reference remains in ${file}`);
  }
}

console.log('Production surface check passed: no bundled demo book or mock provider is present.');
