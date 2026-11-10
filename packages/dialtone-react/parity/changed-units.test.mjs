// changed-units.mjs and the lookup it shares with the gate (vue-sources.mjs), against a small fixture tree laid out
// like dialtone-vue and dialtone-react. Node's test runner, not Vitest: the harness runs in plain Node.
//   node --test packages/dialtone-react/parity/*.test.mjs
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { changedUnits } from './changed-units.mjs';
import { vueSources } from './vue-sources.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'changed-units-'));
after(() => fs.rmSync(root, { recursive: true, force: true }));

// files: paths, empty, or [path, contents] pairs.
function tree (dir, files) {
  for (const entry of files) {
    const [file, contents = ''] = [entry].flat();
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), contents);
  }
  return dir;
}

const vueRoot = tree(path.join(root, 'dialtone-vue'), [
  'components/Text/Text.vue',
  ['components/Text/index.js', "export { default as DtText } from './Text.vue';"],
  ['components/Text/text.stories.js', "import { DtTooltip } from '@/components/Tooltip';"],
  ['components/Tooltip/Tooltip.vue', "<script>\nimport ModeMixin from '@/common/mixins/mode';\n</script>"],
  ['components/Tooltip/index.js', "export { default as DtTooltip } from './Tooltip.vue';"],
  ['components/Chip/Chip.vue',
    "<script>\nimport { DtText } from '@/components/Text';\nimport { x } from '@/common/utils';\n</script>"],
  'components/Tab/Tab.vue',
  'components/Tab/TabGroup.vue',
  'components/Button/Button.vue',
  'components/Skeleton/Skeleton.vue',
  'components/ModeIsland/ModeIsland.vue',
  'components/Checkbox/Checkbox.vue',
  'components/TextList/TextList.vue',
  'directives/tooltip_directive/tooltip.js',
  'directives/tooltip_directive/tooltip.stories.js',
  'directives/mode_directive/mode.js',
  'directives/focustrap_directive/focustrap.js',
  'common/sr_only_close_button.vue',
  'common/mixins/index.js',
  'common/mixins/mode.js',
  'common/mixins/input.js',
  'common/mixins/input.test.js',
  'common/mixins/skeleton.js',
  'common/mixins/dom.js',
  'common/mixins/keyboard_list_navigation.js',
  'common/composables/useIndicatorAnimation.js',
  'common/utils/index.js',
]);
const UNITS = {
  Text: 'text',
  Tooltip: 'tooltip',
  TabGroup: 'tab-group',
  Button: 'button',
  Skeleton: 'skeleton',
  ModeIsland: 'mode-island',
  MixinInput: 'mixin-input',
  MixinKeyboardListNavigation: 'mixin-keyboard-list-navigation',
  DirectiveFocustrap: 'directive-focustrap',
  ComposableUseIndicatorAnimation: 'composable-use-indicator-animation',
  Chip: 'chip',
};
// Popover holds Tooltip's helpers and has no index.ts, so it isn't a unit; Checkbox and TextList aren't ported.
// Chip renders Text on both sides; Text's story demos a Tooltip.
const pkg = tree(path.join(root, 'dialtone-react'), [
  ...Object.keys(UNITS).filter(name => !['Text', 'Tooltip', 'Chip'].includes(name))
    .map(name => `components/${name}/index.ts`),
  ['components/Text/index.ts', "export * from './Text';"],
  'components/Text/Text.tsx',
  ['components/Text/Text.stories.tsx', "import { DtTooltip } from '../Tooltip';"],
  ['components/Tooltip/index.ts', "export * from './Tooltip';"],
  ['components/Tooltip/Tooltip.tsx', "import { createTippy } from '../Popover/TippyUtils';"],
  'components/Popover/TippyUtils.ts',
  'components/Popover/PopoverConstants.ts',
  ['components/Chip/index.ts', "export * from './Chip';"],
  ['components/Chip/Chip.tsx', "import { DtText } from '../Text';\nconst lazy = () => import('../Tooltip');"],
]);
const ALL = Object.values(UNITS).sort();

const unitsFor = (...files) => changedUnits(files, { pkg, vueRoot });
const expect = (files, units) => assert.deepEqual(unitsFor(...files), { units, errors: [] });

describe('vueSources', () => {
  test('a component unit is its directory', () => {
    assert.deepEqual(vueSources(vueRoot, 'text'), {
      dir: path.join(vueRoot, 'components/Text'), paths: ['components/Text'],
    });
  });

  test('a component in another unit\'s directory is found there', () => {
    assert.deepEqual(vueSources(vueRoot, 'tab-group').paths, ['components/Tab']);
  });

  test('folded-in pieces and owned files join the unit', () => {
    assert.deepEqual(vueSources(vueRoot, 'tooltip').paths, ['components/Tooltip', 'directives/tooltip_directive']);
    assert.deepEqual(vueSources(vueRoot, 'mode-island').paths, ['components/ModeIsland', 'directives/mode_directive']);
    assert.deepEqual(vueSources(vueRoot, 'skeleton').paths, ['components/Skeleton', 'common/mixins/skeleton.js']);
    assert.deepEqual(vueSources(vueRoot, 'button').paths, ['components/Button', 'common/sr_only_close_button.vue']);
  });

  test('directive, mixin and composable units are their own files, with a mixin\'s test', () => {
    assert.deepEqual(vueSources(vueRoot, 'directive-focustrap').paths, ['directives/focustrap_directive']);
    assert.deepEqual(vueSources(vueRoot, 'mixin-input').paths,
      ['common/mixins/input.js', 'common/mixins/input.test.js']);
    assert.deepEqual(vueSources(vueRoot, 'mixin-keyboard-list-navigation').paths,
      ['common/mixins/keyboard_list_navigation.js', 'common/mixins/dom.js']);
    assert.deepEqual(vueSources(vueRoot, 'composable-use-indicator-animation').paths,
      ['common/composables/useIndicatorAnimation.js']);
  });

  test('a unit with no .vue keeps components/<Name>/ as its directory, which may not exist', () => {
    assert.equal(vueSources(vueRoot, 'mixin-input').dir, path.join(vueRoot, 'components/MixinInput'));
    assert.deepEqual(vueSources(vueRoot, 'nothing-here'), {
      dir: path.join(vueRoot, 'components/NothingHere'), paths: [],
    });
  });
});

describe('changedUnits', () => {
  test('a React path in a unit\'s directory', () => {
    expect(['packages/dialtone-react/components/Text/Text.stories.tsx'], ['text']);
    expect(['packages/dialtone-react/components/Tooltip/Tooltip.stories.tsx'], ['tooltip']);
  });

  test('React paths in no unit\'s directory and imported by none', () => {
    expect(['packages/dialtone-react/components/Popover/PopoverConstants.ts'], []);
    expect(['packages/dialtone-react/components/Checkbox/Checkbox.tsx'], []);
    expect(['packages/dialtone-react/README.md', 'packages/dialtone-react/project.json'], []);
    expect(['packages/dialtone-react/.storybook/preview.tsx', 'packages/dialtone-react/compare/ports.json'], []);
  });

  test('a Vue path in a unit\'s component directory', () => {
    expect(['packages/dialtone-vue/components/Text/text.stories.js'], ['text']);
    expect(['packages/dialtone-vue/components/Text/README.md'], ['text']);
  });

  test('a Vue component in another unit\'s directory', () => {
    expect(['packages/dialtone-vue/components/Tab/TabGroup.vue'], ['tab-group']);
  });

  test('a directive folded into a component', () => {
    expect(['packages/dialtone-vue/directives/tooltip_directive/tooltip.js'], ['tooltip']);
    expect(['packages/dialtone-vue/directives/mode_directive/mode.js'], ['mode-island']);
  });

  test('a mixin folded into a unit, and a file a unit owns', () => {
    expect(['packages/dialtone-vue/common/mixins/skeleton.js'], ['skeleton']);
    expect(['packages/dialtone-vue/common/mixins/dom.js'], ['mixin-keyboard-list-navigation']);
    expect(['packages/dialtone-vue/common/sr_only_close_button.vue'], ['button']);
  });

  test('a directive, mixin or composable unit\'s own files', () => {
    expect(['packages/dialtone-vue/directives/focustrap_directive/focustrap.js'], ['directive-focustrap']);
    expect(['packages/dialtone-vue/common/mixins/input.test.js'], ['mixin-input']);
    expect(['packages/dialtone-vue/common/composables/useIndicatorAnimation.js'],
      ['composable-use-indicator-animation']);
  });

  test('Vue paths in no ported unit, and imported by none', () => {
    expect(['packages/dialtone-vue/components/Checkbox/Checkbox.vue'], []);
    expect(['packages/dialtone-vue/common/mixins/index.js'], []);
    // components/Text is a prefix of components/TextList, but not its directory.
    expect(['packages/dialtone-vue/components/TextList/TextList.vue'], []);
  });

  test('a file a unit imports, directly or not, on either side', () => {
    // Chip imports Text; dynamic imports count.
    expect(['packages/dialtone-react/components/Text/Text.tsx'], ['chip', 'text']);
    expect(['packages/dialtone-react/components/Tooltip/Tooltip.tsx'], ['chip', 'tooltip']);
    // A helper directory that isn't a unit, through Tooltip to Chip.
    expect(['packages/dialtone-react/components/Popover/TippyUtils.ts'], ['chip', 'tooltip']);
    // Vue: a component through its index.js, a shared util, and a mixin that's no ported unit.
    expect(['packages/dialtone-vue/components/Text/Text.vue'], ['chip', 'text']);
    expect(['packages/dialtone-vue/common/utils/index.js'], ['chip']);
    expect(['packages/dialtone-vue/common/mixins/mode.js'], ['tooltip']);
  });

  test('a story\'s imports aren\'t followed', () => {
    expect(['packages/dialtone-vue/components/Tooltip/Tooltip.vue'], ['tooltip']);
    expect(['packages/dialtone-react/components/Tooltip/index.ts'], ['chip', 'tooltip']);
  });

  test('a deleted Vue path, placed by its shape', () => {
    // None of these exist in this tree.
    const bare = tree(path.join(root, 'bare-vue'), ['components/Tooltip/Tooltip.vue']);
    const unitsIn = (...files) => changedUnits(files.map(f => `packages/dialtone-vue/${f}`), { pkg, vueRoot: bare });
    for (const [file, units] of [
      ['components/Text/Text.vue', ['text']],
      ['components/Tab/TabGroup.vue', ['tab-group']],
      ['directives/tooltip_directive/tooltip.js', ['tooltip']],
      ['directives/mode_directive/mode.js', ['mode-island']],
      ['directives/focustrap_directive/focustrap.js', ['directive-focustrap']],
      ['common/mixins/skeleton.js', ['skeleton']],
      ['common/mixins/input.test.js', ['mixin-input']],
      ['common/mixins/dom.js', ['mixin-keyboard-list-navigation']],
      ['common/composables/useIndicatorAnimation.js', ['composable-use-indicator-animation']],
      ['common/mixins/index.js', []],
    ]) assert.deepEqual(unitsIn(file), { units, errors: [] }, file);
  });

  test('a shared file gates every ported unit', () => {
    for (const file of [
      'packages/dialtone-react/parity/gate.mjs',
      'packages/dialtone-react/common/localization/index.ts',
      'packages/dialtone-react/tests/setup.ts',
      'packages/dialtone-react/scripts/build-index.mjs',
      'packages/dialtone-react/package.json',
      'packages/dialtone-react/tsconfig.json',
      'packages/dialtone-react/vite.config.ts',
      'packages/dialtone-react/vite.build.config.ts',
      'packages/dialtone-react/eslint.config.js',
      'pnpm-lock.yaml',
      '.github/workflows/dialtone-react.yml',
      '.github/workflows/dialtone-react-scope.yml',
    ]) assert.deepEqual(unitsFor(file), { units: ALL, errors: [] }, file);
  });

  test('look-alikes of shared files don\'t', () => {
    expect([
      'packages/dialtone-react-native/parity/gate.mjs',
      'packages/dialtone-vue/package.json',
      '.github/workflows/unit_tests.yml',
      'docs/pnpm-lock.yaml',
    ], []);
  });

  test('several paths: units deduplicated and sorted, blank lines and whitespace ignored', () => {
    expect([
      '  packages/dialtone-vue/directives/tooltip_directive/tooltip.js',
      '',
      'packages/dialtone-react/components/Tooltip/Tooltip.tsx',
      'packages/dialtone-react/components/Text/Text.tsx\r',
    ], ['chip', 'text', 'tooltip']);
  });

  test('no paths, or nothing ported', () => {
    expect([], []);
    const empty = tree(path.join(root, 'empty-react'), ['package.json']);
    assert.deepEqual(changedUnits(['pnpm-lock.yaml'], { pkg: empty, vueRoot }), { units: [], errors: [] });
  });

  test('a directory with no unit id, and a component in more than one Vue directory, are errors', () => {
    const badPkg = tree(path.join(root, 'bad-react'), ['components/DTThing/index.ts', 'components/Twin/index.ts']);
    const badVue = tree(path.join(root, 'bad-vue'), ['components/A/Twin.vue', 'components/B/Twin.vue']);
    const { units, errors } = changedUnits(['packages/dialtone-vue/components/A/Twin.vue'],
      { pkg: badPkg, vueRoot: badVue });
    // Still gated, by the path's shape: the gate then reports the same error.
    assert.deepEqual(units, ['twin']);
    assert.equal(errors.length, 2);
    assert.match(errors[0], /^components\/DTThing has no unit id/);
    assert.match(errors[1], /^twin: Twin\.vue is in more than one directory: A, B$/);
  });
});

test('the CLI reads paths on stdin and prints this package\'s units, one per line', () => {
  const script = fileURLToPath(new URL('./changed-units.mjs', import.meta.url));
  const realPkg = path.resolve(path.dirname(script), '..');
  const realVue = path.resolve(realPkg, '../dialtone-vue');
  const { units } = changedUnits(['pnpm-lock.yaml'], { pkg: realPkg, vueRoot: realVue });
  const input = 'packages/dialtone-icons/README.md\npnpm-lock.yaml\n';
  const proc = spawnSync(process.execPath, [script], { input, encoding: 'utf8' });
  assert.equal(proc.status, 0, proc.stderr);
  assert.equal(proc.stdout, units.map(id => `${id}\n`).join(''));
});
