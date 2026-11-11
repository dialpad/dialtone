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

  test('a unit with no .vue keeps components/<Name>/ as its directory, which may not exist', () => {
    assert.equal(vueSources(vueRoot, 'mixin-input').dir, path.join(vueRoot, 'components/MixinInput'));
    assert.equal(vueSources(vueRoot, 'mixin-input').file, null);
    assert.deepEqual(vueSources(vueRoot, 'nothing-here'), {
      dir: path.join(vueRoot, 'components/NothingHere'), paths: [], file: null, own: [],
    });
  });

  test('a directive, mixin or composable is never a component, even one named like it', () => {
    const twin = tree(path.join(root, 'vue-twin'), [
      'components/MixinInput/MixinInput.vue',
      'components/MixinInput/MixinInput.test.js',
      'common/mixins/input.js',
    ]);
    assert.deepEqual(vueSources(twin, 'mixin-input'), {
      dir: path.join(twin, 'components/MixinInput'), paths: ['common/mixins/input.js'], file: null,
      own: ['common/mixins/input.js'],
    });
    assert.deepEqual(unitsOfPath('components/MixinInput/MixinInput.vue'), []);
  });

  test('a unit\'s own files are apart from what\'s folded into it, which may outlive them', () => {
    assert.deepEqual(vueSources(vueRoot, 'mixin-keyboard-list-navigation').own,
      ['common/mixins/keyboard_list_navigation.js']);
    const leftover = tree(path.join(root, 'vue-leftover'), ['common/mixins/dom.js']);
    assert.deepEqual(vueSources(leftover, 'mixin-keyboard-list-navigation'), {
      dir: path.join(leftover, 'components/MixinKeyboardListNavigation'), paths: ['common/mixins/dom.js'], file: null,
      own: [],
    });
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
      'packages/dialtone-react/common/localization/index.ts',
      'packages/dialtone-react/common/input/useInput.ts',
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
