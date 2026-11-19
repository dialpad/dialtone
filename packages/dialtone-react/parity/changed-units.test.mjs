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
import { changedUnits, extraCasesAgainst, extraCasesDiff, extraCasesSnapshot } from './changed-units.mjs';
import { storyParity } from './story-parity.mjs';
import { commonUnit, reactDir, testFiles, unitsOfPath, vueSources } from './vue-sources.mjs';

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
  'components/Tooltip/Tooltip.test.js',
  'components/Toast/Toast.vue',
  'components/Toast/Toast.test.js',
  'components/Toast/Layouts/ToastLayoutDefault.vue',
  'components/Toast/Layouts/ToastLayoutDefault.test.js',
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
  'directives/tooltip_directive/tooltip.test.js',
  'directives/mode_directive/mode.js',
  'directives/focustrap_directive/focustrap.js',
  'directives/focustrap_directive/focustrap.test.js',
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
  Chip: 'chip',
};
// The directive, mixin and composable units: in common/, under their id without the prefix.
const COMMON_UNITS = {
  input: 'mixin-input',
  'keyboard-list-navigation': 'mixin-keyboard-list-navigation',
  focustrap: 'directive-focustrap',
  'use-indicator-animation': 'composable-use-indicator-animation',
};
// Popover holds Tooltip's helpers and has no index.ts, so it isn't a unit; Checkbox and TextList aren't ported.
// common/link is a foundation, no unit. Chip renders Text on both sides; Text's story demos a Tooltip.
const pkg = tree(path.join(root, 'dialtone-react'), [
  ...Object.keys(UNITS).filter(name => !['Text', 'Tooltip', 'Chip'].includes(name))
    .map(name => `components/${name}/index.ts`),
  ...Object.keys(COMMON_UNITS).map(name => `common/${name}/index.ts`),
  'common/link/index.ts',
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
const ALL = [...Object.values(UNITS), ...Object.values(COMMON_UNITS)].sort();
// Combinator next to pkg (changedUnits' default variantsDir): its registry, three variants files, and a helper
// one of them imports.
tree(path.join(root, 'combinator/src'), [
  ['variants/variants.js', "import DtText from './variants_text.js';\nimport DtTabGroup from './variants_tab_group.js';\n"
    + "import DtCheckbox from './variants_checkbox.js';\n"],
  'variants/variants_text.js',
  ['variants/variants_tab_group.js', "import { hasValue } from '@/src/lib/exclusion_rules';"],
  'variants/variants_checkbox.js',
  'lib/exclusion_rules.js',
  'lib/option_bar.js',
]);

const unitsFor = (...files) => changedUnits(files, { pkg, vueRoot });
const expect = (files, units) => assert.deepEqual(unitsFor(...files), { units, errors: [] });

describe('vueSources', () => {
  test('a component unit is its directory, and its .vue the file', () => {
    assert.deepEqual(vueSources(vueRoot, 'text'), {
      dir: path.join(vueRoot, 'components/Text'), paths: ['components/Text'],
      file: path.join(vueRoot, 'components/Text/Text.vue'), own: [],
    });
  });

  test('a component in another unit\'s directory is found there', () => {
    assert.deepEqual(vueSources(vueRoot, 'tab-group').paths, ['components/Tab']);
    assert.equal(vueSources(vueRoot, 'tab-group').file, path.join(vueRoot, 'components/Tab/TabGroup.vue'));
  });

  test('a component whose .vue is gone, though the rest of its directory isn\'t, has no file', () => {
    const gone = tree(path.join(root, 'vue-without-text'), ['components/Text/index.js', 'components/Text/text.stories.js']);
    assert.deepEqual(vueSources(gone, 'text'), {
      dir: path.join(gone, 'components/Text'), paths: ['components/Text'], file: null, own: [],
    });
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

  test('a directive, mixin or composable has no component directory; a component keeps one that may not exist', () => {
    assert.equal(vueSources(vueRoot, 'mixin-input').dir, null);
    assert.equal(vueSources(vueRoot, 'mixin-input').file, null);
    assert.deepEqual(vueSources(vueRoot, 'nothing-here'), {
      dir: path.join(vueRoot, 'components/NothingHere'), paths: [], file: null, own: [],
    });
  });

  test('a directive, mixin or composable is never a component, even one named like it, stories included', () => {
    const twin = tree(path.join(root, 'vue-twin'), [
      'components/MixinInput/MixinInput.vue',
      'components/MixinInput/MixinInput.test.js',
      'components/MixinInput/MixinInput.stories.js',
      'common/mixins/input.js',
    ]);
    const sources = vueSources(twin, 'mixin-input');
    assert.deepEqual(sources, {
      dir: null, paths: ['common/mixins/input.js'], file: null, own: ['common/mixins/input.js'],
    });
    assert.deepEqual(unitsOfPath('components/MixinInput/MixinInput.vue'), []);
    const reactDir = tree(path.join(root, 'react-twin/common/input'), ['index.ts']);
    assert.deepEqual(
      storyParity({ vueDir: sources.dir, reactDir, name: 'MixinInput', pkg, vueRoot: twin, vuePaths: sources.paths }),
      { status: 'na', summary: 'no Vue stories' });
  });

  test('a unit\'s own files are apart from what\'s folded into it, which may outlive them', () => {
    assert.deepEqual(vueSources(vueRoot, 'mixin-keyboard-list-navigation').own,
      ['common/mixins/keyboard_list_navigation.js']);
    const leftover = tree(path.join(root, 'vue-leftover'), ['common/mixins/dom.js']);
    assert.deepEqual(vueSources(leftover, 'mixin-keyboard-list-navigation'), {
      dir: null, paths: ['common/mixins/dom.js'], file: null, own: [],
    });
  });

  test('a folded-in directive left without the directive itself still brings its tests', () => {
    const orphaned = tree(path.join(root, 'vue-folded-test'), [
      'components/Tooltip/Tooltip.vue',
      'directives/tooltip_directive/tooltip.test.js',
    ]);
    const { paths } = vueSources(orphaned, 'tooltip');
    assert.deepEqual(paths, ['components/Tooltip', 'directives/tooltip_directive']);
    assert.deepEqual(testFiles(orphaned, paths), ['directives/tooltip_directive/tooltip.test.js']);
  });

  test('a directive\'s directory counts only while it holds the directive itself', () => {
    const hollow = tree(path.join(root, 'vue-hollow'), [
      'directives/focustrap_directive/index.js',
      'directives/focustrap_directive/focustrap.test.js',
      'directives/focustrap_directive/focustrap.stories.js',
    ]);
    assert.deepEqual(vueSources(hollow, 'directive-focustrap').own, []);
    assert.deepEqual(vueSources(hollow, 'directive-focustrap').paths, []);
    assert.equal(commonUnit(hollow, 'focustrap'), null);
  });

  test('a unit\'s Vue tests are the test files in its sources, nested and folded-in ones too', () => {
    const tests = unit => testFiles(vueRoot, vueSources(vueRoot, unit).paths);
    assert.deepEqual(tests('tooltip'),
      ['components/Tooltip/Tooltip.test.js', 'directives/tooltip_directive/tooltip.test.js']);
    assert.deepEqual(tests('toast'),
      ['components/Toast/Layouts/ToastLayoutDefault.test.js', 'components/Toast/Toast.test.js']);
    assert.deepEqual(tests('directive-focustrap'), ['directives/focustrap_directive/focustrap.test.js']);
    assert.deepEqual(tests('mixin-input'), ['common/mixins/input.test.js']);
    assert.deepEqual(tests('text'), []);
  });

  test('a unit lives in components/<Name>/, or in common/ under its id without the prefix', () => {
    for (const [unit, dir] of [
      ['text', 'components/Text'],
      ['tab-group', 'components/TabGroup'],
      ['mixin-input', 'common/input'],
      ['mixin-keyboard-list-navigation', 'common/keyboard-list-navigation'],
      ['directive-focustrap', 'common/focustrap'],
      ['composable-use-indicator-animation', 'common/use-indicator-animation'],
    ]) assert.equal(reactDir(unit), dir, unit);
  });

  test('a common/ directory is the directive, mixin or composable of its name, unless that one is folded in', () => {
    assert.equal(commonUnit(vueRoot, 'input'), 'mixin-input');
    assert.equal(commonUnit(vueRoot, 'focustrap'), 'directive-focustrap');
    assert.equal(commonUnit(vueRoot, 'use-indicator-animation'), 'composable-use-indicator-animation');
    // directive-mode is part of mode-island, so common/mode is the mode mixin's.
    assert.equal(commonUnit(vueRoot, 'mode'), 'mixin-mode');
    // Folded into another unit, or a foundation no Vue directive, mixin or composable names.
    for (const name of ['tooltip', 'dom', 'skeleton', 'link', 'utils']) assert.equal(commonUnit(vueRoot, name), null, name);
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
    expect(['packages/dialtone-react/README.md'], []);
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
    // None of these exist in this tree. Nor do the other common/ units' Vue files, so those are errors here.
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
    ]) {
      const { units: found, errors } = unitsIn(file);
      assert.deepEqual(found, units, file);
      assert.ok(errors.every(e => / matches no foundation /.test(e)), `${file}: ${errors.join('; ')}`);
    }
  });

  test('a shared file gates every ported unit', () => {
    for (const file of [
      'packages/dialtone-react/parity/gate.mjs',
      'packages/dialtone-react/parity/cases.mjs',
      'packages/dialtone-react/tests/setup.ts',
      'packages/dialtone-react/scripts/build-index.mjs',
      'packages/dialtone-react/package.json',
      'packages/dialtone-react/tsconfig.json',
      'packages/dialtone-react/vite.config.ts',
      'packages/dialtone-react/vite.build.config.ts',
      'packages/dialtone-react/eslint.config.js',
      'pnpm-lock.yaml',
      '.github/workflows/dialtone-react.yml',
      'packages/dialtone-vue/vite.config.js',
      'packages/dialtone-vue/tests/setupTests.js',
      'packages/dialtone-react/project.json',
      'package.json',
      'nx.json',
      '.github/actions/setup-environment/action.yml',
    ]) assert.deepEqual(unitsFor(file), { units: ALL, errors: [] }, file);
  });

  test('a Combinator variants file gates the units whose presets it holds; the registry gates every unit', () => {
    const variants = file => `packages/combinator/src/variants/${file}`;
    expect([variants('variants_text.js')], ['text']);
    expect([variants('variants_tab_group.js'), variants('variants_text.js')], ['tab-group', 'text']);
    expect([variants('variants_checkbox.js')], []); // Checkbox isn't ported
    expect([variants('variants_nothing.js')], []);
    expect([variants('variants.js')], ALL);
    // What a variants file imports inside Combinator is part of the unit's presets.
    expect(['packages/combinator/src/lib/exclusion_rules.js'], ['tab-group']);
  });

  // CI checks out the change's head, so a file the change deletes is gone while `git diff` still lists it.
  test('a deleted file a unit imports still gates it: a Combinator helper, a React or a Vue file', () => {
    const gone = path.join(root, 'gone');
    const react = tree(path.join(gone, 'dialtone-react'), [
      'components/TabGroup/index.ts',
      ['components/Tooltip/index.ts', "export * from './Tooltip';"],
      ['components/Tooltip/Tooltip.tsx', "import { createTippy } from '../Popover/TippyUtils';"],
    ]);
    const vue = tree(path.join(gone, 'dialtone-vue'), [
      'components/Tab/TabGroup.vue',
      ['components/Tooltip/Tooltip.vue', "<script>\nimport ModeMixin from '@/common/mixins/mode';\n</script>"],
    ]);
    // Combinator next to it, where tab-group's presets import a helper that's gone too.
    tree(path.join(gone, 'combinator/src'), [
      ['variants/variants.js', "import DtTabGroup from './variants_tab_group.js';\n"],
      ['variants/variants_tab_group.js', "import { hasValue } from '@/src/lib/exclusion_rules';"],
    ]);
    const deleted = (file, units) => assert.deepEqual(changedUnits([file], { pkg: react, vueRoot: vue }),
      { units, errors: [] }, file);
    deleted('packages/combinator/src/lib/exclusion_rules.js', ['tab-group']);
    deleted('packages/dialtone-react/components/Popover/TippyUtils.ts', ['tooltip']);
    deleted('packages/dialtone-vue/common/mixins/mode.js', ['tooltip']);
    // A deleted file nothing imports still gates nothing.
    deleted('packages/combinator/src/lib/option_bar.js', []);
    deleted('packages/dialtone-react/components/Popover/PopoverConstants.ts', []);
    deleted('packages/dialtone-vue/common/mixins/input.js', []);
  });

  // cases.mjs › RENDERS: the tab unit's cases are DtTabGroup's presets, so those are what gate it.
  test('a unit whose cases render another component is gated by that component\'s presets', () => {
    const dir = path.join(root, 'renders');
    const react = tree(path.join(dir, 'dialtone-react'), ['components/Tab/index.ts']);
    const vue = tree(path.join(dir, 'dialtone-vue'), ['components/Tab/Tab.vue', 'components/Tab/TabGroup.vue']);
    tree(path.join(dir, 'combinator/src'), [
      ['variants/variants.js', "import DtTabGroup from './variants_tab_group.js';\n"],
      ['variants/variants_tab_group.js', "import { hasValue } from '@/src/lib/exclusion_rules';"],
      'lib/exclusion_rules.js',
    ]);
    const units = file => changedUnits([file], { pkg: react, vueRoot: vue });
    assert.deepEqual(units('packages/combinator/src/variants/variants_tab_group.js'), { units: ['tab'], errors: [] });
    assert.deepEqual(units('packages/combinator/src/lib/exclusion_rules.js'), { units: ['tab'], errors: [] });
  });

  test('an import with a query (Vite\'s ?raw) gates on the file before it, changed or deleted', () => {
    const dir = path.join(root, 'query');
    const react = tree(path.join(dir, 'dialtone-react'), ['components/Pagination/index.ts']);
    const vue = tree(path.join(dir, 'dialtone-vue'), [
      ['components/Pagination/Pagination.vue', "<script>\nimport { t } from '@/localization';\n</script>"],
      ['localization/index.js', "import enUS from './en-US.ftl?raw';\nimport frCA from './fr-CA.ftl?raw';"],
      'localization/en-US.ftl',
    ]);
    const units = file => changedUnits([file], { pkg: react, vueRoot: vue });
    for (const file of ['packages/dialtone-vue/localization/en-US.ftl', 'packages/dialtone-vue/localization/fr-CA.ftl']) {
      assert.deepEqual(units(file), { units: ['pagination'], errors: [] }, file);
    }
  });

  test('icons and emoji gate every unit, but not their Markdown; tokens and other Combinator files gate none', () => {
    for (const file of ['packages/dialtone-icons/src/svg/close.svg', 'packages/dialtone-icons/package.json',
      'packages/dialtone-emojis/src/emojis.json']) assert.deepEqual(unitsFor(file), { units: ALL, errors: [] }, file);
    expect(['packages/dialtone-icons/CHANGELOG.md', 'packages/dialtone-emojis/README.md',
      'packages/dialtone-tokens/tokens/base/color.json', 'packages/combinator/src/lib/option_bar.js'], []);
  });

  test('common/ isn\'t shared: a directive, mixin or composable, or a foundation, gates itself and what imports it', () => {
    // Button imports the keyboard-list-navigation mixin and the link foundation; the mixin imports cx.
    const own = tree(path.join(root, 'dialtone-react-common'), [
      ...Object.keys(COMMON_UNITS).map(name => `common/${name}/index.ts`),
      'common/link/index.ts',
      'common/localization/index.ts',
      'common/utils.ts',
      ['common/cx.ts', 'export const cx = () => \'\';'],
      ['common/keyboard-list-navigation/useKeyboardListNavigation.ts', "import { cx } from '../cx';"],
      ['components/Button/index.ts', "export * from './Button';"],
      ['components/Button/Button.tsx',
        "import { useKeyboardListNavigation } from '../../common/keyboard-list-navigation/useKeyboardListNavigation';\n"
        + "import { DtLinkProvider } from '../../common/link';"],
      'components/Skeleton/index.ts',
    ]);
    const unitsIn = (...files) => changedUnits(files, { pkg: own, vueRoot });
    const at = file => `packages/dialtone-react/common/${file}`;
    assert.deepEqual(unitsIn(at('keyboard-list-navigation/useKeyboardListNavigation.ts')),
      { units: ['button', 'mixin-keyboard-list-navigation'], errors: [] });
    assert.deepEqual(unitsIn(at('cx.ts')), { units: ['button', 'mixin-keyboard-list-navigation'], errors: [] });
    assert.deepEqual(unitsIn(at('link/index.ts')), { units: ['button'], errors: [] });
    // Its own directory gates a unit even when nothing imports the file; a file nobody imports gates nothing.
    assert.deepEqual(unitsIn(at('input/useInput.ts')), { units: ['mixin-input'], errors: [] });
    assert.deepEqual(unitsIn(at('localization/index.ts'), at('utils.ts')), { units: [], errors: [] });
    // The harness and the package's tests are still shared.
    const every = ['button', 'skeleton', ...Object.values(COMMON_UNITS)].sort();
    assert.deepEqual(unitsIn('packages/dialtone-react/parity/gate.mjs'), { units: every, errors: [] });
    assert.deepEqual(unitsIn('packages/dialtone-react/tests/helpers/link.tsx'), { units: every, errors: [] });
  });

  test('extra-cases.mjs gates the ported units whose cases changed, and every one when that isn\'t known', () => {
    const file = 'packages/dialtone-react/parity/extra-cases.mjs';
    const cases = extraCases => changedUnits([file], { pkg, vueRoot, extraCases });
    assert.deepEqual(cases(['tooltip', 'resizable']), { units: ['tooltip'], errors: [] }); // resizable isn't ported
    assert.deepEqual(cases([]), { units: [], errors: [] });
    assert.deepEqual(cases('all'), { units: ALL, errors: [] });
    assert.deepEqual(cases(undefined), { units: ALL, errors: [] });
    // With other paths, their units too.
    assert.deepEqual(changedUnits([file, 'packages/dialtone-react/components/Text/Text.tsx'], { pkg, vueRoot, extraCases: ['button'] }),
      { units: ['button', 'chip', 'text'], errors: [] });
    // A look-alike is part of the harness, so shared.
    assert.deepEqual(changedUnits(['packages/dialtone-react/parity/extra-cases.test.mjs'], { pkg, vueRoot, extraCases: [] }),
      { units: ALL, errors: [] });
  });

  test('look-alikes of shared files don\'t', () => {
    expect([
      'packages/combinator/src/variants.js',
      'packages/dialtone-vue/tests/other_helper.js',
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

  test('a common/ directory that\'s no foundation and no unit, or a misplaced unit, is an error', () => {
    const dir = path.join(root, 'layout');
    const react = tree(path.join(dir, 'dialtone-react'), [
      'components/MixinInput/index.ts',
      'common/input/index.ts',
      'common/focus/index.ts',
      'common/input_group/index.ts',
      'common/link/index.ts',
      'common/localization/index.ts',
      'common/orphan/index.ts',
      'common/useIndicatorAnimation/index.ts',
      'common/hooks/useThing.ts',
    ]);
    const vue = tree(path.join(dir, 'dialtone-vue'), [
      'common/mixins/input.js',
      'common/mixins/input_group.js',
      'common/mixins/focus.js',
      'directives/focus_directive/focus.js',
      'common/mixins/link.js',
      'common/composables/useIndicatorAnimation.js',
    ]);
    assert.deepEqual(changedUnits(['pnpm-lock.yaml'], { pkg: react, vueRoot: vue }), {
      units: ['mixin-input'],
      errors: [
        'components/MixinInput: mixin-input belongs in common/input',
        'common/focus could be directive-focus or mixin-focus',
        'common/input_group: mixin-input-group belongs in common/input-group',
        'common/link is a foundation, so mixin-link can\'t live there',
        'common/orphan matches no foundation (link, localization, transition) and no Vue directive, mixin or composable',
        'common/useIndicatorAnimation: composable-use-indicator-animation belongs in common/use-indicator-animation',
      ],
    });
  });

  test('a unit whose Vue files a change deleted is still one; a later change reports it', () => {
    const dir = path.join(root, 'orphaned');
    const react = tree(path.join(dir, 'dialtone-react'), ['common/input/index.ts']);
    const vue = tree(path.join(dir, 'dialtone-vue'), ['components/Text/Text.vue']);
    assert.deepEqual(changedUnits(['packages/dialtone-vue/common/mixins/input.js'], { pkg: react, vueRoot: vue }),
      { units: ['mixin-input'], errors: [] });
    assert.deepEqual(changedUnits(['packages/dialtone-react/common/input/index.ts'], { pkg: react, vueRoot: vue }), {
      units: [],
      errors: ['common/input matches no foundation (link, localization, transition) and no Vue directive, mixin or composable'],
    });
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

test('extraCasesDiff: the units whose cases differ, or all when another export does', () => {
  const tip = [{ name: 'open (harness)', props: { open: true }, slots: {}, attrs: {} }];
  const box = [{ name: 'checked (harness)', props: { modelValue: true }, slots: {}, attrs: {} }];
  const diff = (a, b) => extraCasesDiff(extraCasesSnapshot(a), extraCasesSnapshot(b));
  const base = { EXTRA_CASES: { tooltip: tip, checkbox: box } };
  assert.deepEqual(diff(base, { EXTRA_CASES: { tooltip: tip, checkbox: box } }), []);
  // Changed, added and removed entries.
  assert.deepEqual(diff(base, { EXTRA_CASES: { tooltip: [{ ...tip[0], props: { open: false } }], checkbox: box } }), ['tooltip']);
  assert.deepEqual(diff(base, { EXTRA_CASES: { tooltip: tip, checkbox: box, resizable: [] } }), ['resizable']);
  assert.deepEqual(diff(base, { EXTRA_CASES: { checkbox: box } }), ['tooltip']);
  // Another export, added, changed or removed, could reach any unit.
  assert.equal(diff(base, { ...base, HELPER: 1 }), 'all');
  assert.equal(diff({ ...base, HELPER: 1 }, { ...base, HELPER: 2 }), 'all');
  assert.equal(diff({ ...base, HELPER: 1 }, base), 'all');
  assert.equal(diff({ ...base, helper: () => 1 }, { ...base, helper: () => 1 }), 'all');
  // An entry plain JSON can't hold exactly always counts as changed: a function, a RegExp, a Set, undefined, NaN, or a
  // Date (which serializes through toJSON to the string it would equal).
  const when = '2026-11-18T00:00:00.000Z';
  for (const value of [() => {}, /a/, new Set([1]), undefined, NaN, new Date(when)]) {
    const odd = { EXTRA_CASES: { tooltip: [{ name: 'x', props: { value } }] } };
    assert.deepEqual(diff(odd, odd), ['tooltip'], String(value));
  }
  const at = value => ({ EXTRA_CASES: { tooltip: [{ name: 'x', props: { value } }] } });
  assert.deepEqual(diff(at(when), at(new Date(when))), ['tooltip']);
  assert.deepEqual(diff(at(when), at(when)), []);
  // A snapshot is taken when it's made: changing the module's objects afterwards doesn't change it.
  const live = { EXTRA_CASES: { tooltip: [{ name: 'x', attrs: { id: 'a' } }] } };
  const before = extraCasesSnapshot(live);
  live.EXTRA_CASES.tooltip[0].attrs.id = 'b';
  assert.deepEqual(extraCasesDiff(before, extraCasesSnapshot(live)), ['tooltip']);
});

test('the CLI compares extra-cases.mjs with CHANGED_UNITS_BASE, and gates every unit without one it can read', async () => {
  const script = fileURLToPath(new URL('./changed-units.mjs', import.meta.url));
  const realPkg = path.resolve(path.dirname(script), '..');
  const all = changedUnits(['pnpm-lock.yaml'], { pkg: realPkg, vueRoot: path.resolve(realPkg, '../dialtone-vue') }).units;
  const input = 'packages/dialtone-react/parity/extra-cases.mjs\n';
  const cli = env => spawnSync(process.execPath, [script], { input, encoding: 'utf8', env: { ...process.env, ...env } });
  for (const env of [{ CHANGED_UNITS_BASE: '' }, { CHANGED_UNITS_BASE: 'no-such-ref' }]) {
    const proc = cli(env);
    assert.equal(proc.status, 0, proc.stderr);
    assert.equal(proc.stdout, all.map(id => `${id}\n`).join(''), JSON.stringify(env));
  }
  assert.match(cli({ CHANGED_UNITS_BASE: 'no-such-ref' }).stderr, /can't compare extra-cases\.mjs with no-such-ref/);
  // A readable base loads, its own imports and all, and leaves no copy behind.
  const diff = await extraCasesAgainst('HEAD');
  assert.ok(diff === 'all' || Array.isArray(diff), String(diff));
  assert.equal(fs.existsSync(path.join(path.dirname(script), `.extra-cases.${process.pid}.base.mjs`)), false);
});
