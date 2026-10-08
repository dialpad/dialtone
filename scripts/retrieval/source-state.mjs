import { execFileSync } from 'node:child_process';
import { lstatSync, readFileSync, readlinkSync } from 'node:fs';
import { join } from 'node:path';
import { sha256 as hash } from './fixtures.mjs';

export function fingerprintSourceState(root) {
  const sourceDiffSha256 = hash(
    execFileSync('git', ['diff', 'HEAD', '--binary'], { cwd: root }),
  );
  const paths = execFileSync(
    'git',
    ['ls-files', '--others', '--exclude-standard', '-z'],
    { cwd: root, encoding: 'utf8' },
  )
    .split('\0')
    .filter(Boolean)
    .sort();
  const sourceUntrackedFiles = paths.map((path) => {
    const file = join(root, path);
    const symlink = lstatSync(file).isSymbolicLink();
    return {
      path,
      kind: symlink ? 'symlink' : 'file',
      sha256: hash(symlink ? readlinkSync(file) : readFileSync(file)),
    };
  });
  return {
    sourceDiffSha256,
    sourceUntrackedFiles,
    sourceStateSha256: hash(
      JSON.stringify({ sourceDiffSha256, sourceUntrackedFiles }),
    ),
  };
}
