import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, '../../..');
// Not under node_modules, where tsc would stop reading the JSDoc types. Removed after the run.
const consumerFile = path.join(packageRoot, '.feature-awareness-badge-types.tmp.ts');
const composable = path.join(here, 'useFeatureAwarenessBadge.js');

// A consumer file. The lines under "must be rejected" each carry a @ts-expect-error, so tsc fails if one
// of them is accepted, as well as if a documented usage is rejected.
const consumer = (importPath) => `
import { ref } from 'vue';
import { useFeatureAwarenessBadge, provideFeatureAwarenessBadgeDefaults } from '${importPath}';

useFeatureAwarenessBadge();
useFeatureAwarenessBadge({ exposureCount: 2 });
useFeatureAwarenessBadge({ exposureCount: ref(2) });
useFeatureAwarenessBadge({ exposureCount: 2, thresholds: { release: 3, hidden: 10 } });
useFeatureAwarenessBadge({ thresholds: { hidden: 10 } });
useFeatureAwarenessBadge({ thresholds: { release: ref(3), hidden: ref(10) } });
useFeatureAwarenessBadge({ stages: { release: { variant: 'release', emphasis: 'subtle' } } });
useFeatureAwarenessBadge(ref({ exposureCount: 2 }));
provideFeatureAwarenessBadgeDefaults({ thresholds: { release: 5, hidden: 20 }, stages: { new: { emphasis: 'base' } } });

const result = useFeatureAwarenessBadge({ exposureCount: 1 });
const kind: string = result.kind.value;
const isVisible: boolean = result.isVisible.value;
void kind;
void isVisible;

// must be rejected
// @ts-expect-error misspelled field
useFeatureAwarenessBadge({ exposureCout: 2 });
// @ts-expect-error wrong value type
useFeatureAwarenessBadge({ exposureCount: 'wrong' });
// @ts-expect-error misspelled nested field
useFeatureAwarenessBadge({ thresholds: { releasee: 3 } });
// @ts-expect-error wrong nested value type
useFeatureAwarenessBadge({ thresholds: { hidden: '10' } });
// @ts-expect-error a ref of the wrong type
useFeatureAwarenessBadge({ thresholds: { release: ref('3') } });
// @ts-expect-error unknown stage
useFeatureAwarenessBadge({ stages: { hidden: { variant: 'release' } } });
// @ts-expect-error app-wide defaults take no exposureCount
provideFeatureAwarenessBadgeDefaults({ exposureCount: 2 });
`;

describe('useFeatureAwarenessBadge types', () => {
  afterEach(() => {
    fs.rmSync(consumerFile, { force: true });
  });

  it('should accept the documented usage and reject misspelled fields and wrong value types', () => {
    const tsc = createRequire(import.meta.url).resolve('typescript/bin/tsc');
    const importPath = './' + path.relative(packageRoot, composable).split(path.sep).join('/');

    fs.writeFileSync(consumerFile, consumer(importPath));

    let output = '';
    try {
      execFileSync(process.execPath, [
        tsc, '--noEmit', '--allowJs', '--skipLibCheck', '--strict',
        '--module', 'esnext', '--moduleResolution', 'bundler', '--target', 'es2020', consumerFile,
      ], { encoding: 'utf8', stdio: 'pipe' });
    } catch (error) {
      output = `${error.stdout || ''}${error.stderr || ''}`;
    }

    expect(output).toBe('');
  }, 60000);
});
