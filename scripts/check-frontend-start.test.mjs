import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { globSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifests = globSync('services/*/*-app/package.json', { cwd: root }).sort();
assert.ok(manifests.length > 0, 'expected frontend packages');

for (const manifest of manifests) {
  const cwd = dirname(join(root, manifest));
  test(`${manifest}: can build and invoke its start command`, () => {
    for (const args of [['run', 'build'], ['run', 'start', '--help']]) {
      const result = spawnSync('bun', args, { cwd, encoding: 'utf8', timeout: 30_000 });
      if (result.error) throw result.error;
      assert.equal(result.status, 0, result.stderr || result.stdout);
    }
  });
}
