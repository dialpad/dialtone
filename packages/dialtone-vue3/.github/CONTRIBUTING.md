# Contributing

Before contributing a new component to Dialtone Vue, please check the [Jira board](https://dialpad.atlassian.net/jira/software/c/projects/DLT/boards/548/backlog)
to see if there is already an issue for it and if not, add it.

## Overview

### What Is Dialtone Vue?

Dialtone is a design system by Dialpad comprised of CSS components, Vue components, utility classes, visual assets, documentation.
Dialtone Vue is the Vue component portion of Dialtone and is distributed as a separate package as well as included in the combined package.
It is recommended that you are familiar with the [Dialtone CSS](https://github.com/dialpad/dialtone/tree/staging/packages/dialtone) package and it's [contribution guide](../../dialtone/.github/CONTRIBUTING.md),
as well as the general [contribution guide](../../.github/CONTRIBUTING.md) before you contribute to Dialtone Vue.

Dialtone is a dependency of Dialtone Vue.

## Coding Guidelines

### CSS

We should use [Dialtone tokens](https://dialtone.dialpad.com/tokens/) in Dialtone Vue for all component styling. For core components we should write CSS in a new component in the dialtone-css package. For recipe components we should write CSS in the component itself.
Avoid using [utility classes](https://dialtone.dialpad.com/utilities/) in Dialtone Vue as they cannot be easily overidden in the product, those should be only used at the application level.

### Transparent Components

It is common for us to put a wrapper around a native control such as in the below example of an input component:

```html
<template>
  <div id="container">
    <label>Input Label<label/>
    <input>
  </div>
</template>
```

In this case we bind $attrs to the native input with the flag `inheritAttrs: false` set like so:

```html
<template>
  <div id="container">
    <label>Input Label<label/>
    <input v-bind="$attrs">
  </div>
</template>
<script>
export default {
  name: 'DtInput',
  inheritAttrs: false,
}
</script>
```

This means any html attributes you pass into the component will be set on the input itself rather than the wrapper div. See the following usage:

```html
<template>
  <dt-input placeholder="Enter text">
</template>
```

In this case the placeholder is set on the input rather than the container div. This is considered a "transparent" component.

### CSS Class Props

It is common for us to put a wrapper around a native control such as in the below example of an input component:

```html
<template>
  <div id="container">
    <label>Input Label<label/>
    <input>
  </div>
</template>
```

If you wanted to add a utility class to this component it would be applied to the container div rather than the input.

Our solution to this problem is to add a prop to the component which allows you to modify the class on the input.
These types of props use the standard naming convention `nameClass` ex: `inputClass`, `labelClass`

```html
<template>
  <div id="container">
    <label :class="labelClass">Input Label<label/>
    <input :class="inputClass">
  </div>
</template>
```

### Data-qa Attributes

We use data-qa attributes on important elements within our components, so they can be easily identified by QA and automation tests.
Follow these guidelines when writing data-qa attributes.

- The name should be unique to the component, but does not have to be unique for every instance of that component on the page.
- They should have no dynamically generated names or numbers.
- The naming should be descriptive enough that you understand what it is by reading the name.

Here is a simple example of an input component:

```html
<template>
  <div id="container" data-qa="dt-input">
    <label data-qa="dt-input-label">Input Label<label/>
    <input data-qa="dt-input-input">
  </div>
</template>
```

### Generate Unique IDs

If a consumer does not provide an id to a component as a prop we will generate a default ID. See the below example:

```vue
<script>
import { getUniqueString } from '@/common/utils';
export default {
  props: {
    id: {
      type: String,
      default () { return getUniqueString(); },
    },
  }
}
</script>
```

### Accessibility in Mind

Keep accessibility in mind for every new component, improvement or bug fix you make.
Always test your change with a screen reader, keyboard navigation and contrast-ratio if applicable.

### Invalid External Dependencies

Dialtone Vue components are designed to be used in a variety of different projects.
As such, Dialtone Vue components should be pure Vue components with no dependencies on global Vue plugins or stores,
except when noted below. This in particular means:

- **No access to the Vuex store:** Different projects will have different store structures, and so Dialtone Vue components cannot access the Vuex store. Dialtone Vue components should take data as props only.
- **No I18n:** Each project will have its own i18n implementation. Any text needed in a Dialtone Vue component should be passed as props or slots.
- **No custom directives:** Directives in Vue are installed globally and vary from project to project. Custom directives (such as `v-tooltip`) cannot be used in Dialtone Vue components, unless they exist in dialtone itself.
- **No other custom global methods:** Some projects may implement custom global methods on the Vue object. Dialtone Vue components are limited to the built-in Vue methods.
- **No imports outside the dialtone-vue directory**
- **Vue 2 compatibility:** Dialtone Vue components should support Vue 2 and Vue 3. Vue 2 components are in the dialtone-vue2 package, Vue 3 components are in the dialtone-vue3 package. You may copy your changes from one to the other via `<dialtone-root>/scripts/dialtone-vue-sync.sh`

### Dialtone Vue Sync script

This script will allow you to copy your changes from Vue 2 to Vue 3 or vice versa. to run it, you can use the following command from the root dialtone directory:

```bash
./scripts/dialtone-vue-sync.sh
```

With no parameter this will simply copy the most recent commit from Vue 2 to Vue 3. The script will prompt you to input whether you made your initial changes in Vue 2 or Vue 3.

If you would like to copy more than one commit you can enter the git SHA of the commit BEFORE the first one one you would like to copy, example below:

```bash
./scripts/dialtone-vue-sync.sh 16eb2969894dd93bbb09b4baa28677fa2fa970c2
```

This will copy the first commit after the SHA you entered, up to the most recent commit.

You may also enter two SHA's to copy the specified range of commits.

```bash
./scripts/dialtone-vue-sync.sh 16eb2969894dd93bbb09b4baa28677fa2fa970c2 59f4882be487d05eb20696162b14e9c7fcf5fdf5
```

When the script completes it will have created new uncommited changes in the Vue 2 or Vue 3 folder. It is possible for there to be conflicts when running the script. If this happens, you will need to resolve the conflicts manually, and then commit the resolved changes.

Note that the script only copies your exact changes from one version to the other, it does not migrate your changes to Vue 3 code.

Here are some of the most common changes you will need to make between Vue 2 and Vue 3:

- $listeners no longer exists in Vue 3. You will have to handle your listeners within $attrs. <https://v3-migration.vuejs.org/breaking-changes/listeners-removed.html>
- prop.sync="value" has been changed to v-model:prop="value" in Vue 3 <https://v3-migration.vuejs.org/breaking-changes/v-model.html#v-model>
- In Vue 3 you should only use the emits option for custom events you are emitting via `this.$emit`. Emits should not contain native events like `click` or `input`, unless you are manually emitting them. <https://v3-migration.vuejs.org/breaking-changes/emits-option.html>
- In unit tests, the "propsData" property has been renamed to just "props". You will have to rename this in your test setup. <https://v3-migration.vuejs.org/breaking-changes/props-data.html>

For the full list, see the Vue 3 migration guide: <https://v3-migration.vuejs.org/>

### Exports

When adding a new component, please add its exports to `index.js`, including any named exports, so they're available for import to users of Dialtone Vue:

```js
export {
  default as DtInput,
  INPUT_SIZES,
} from './components/input.vue';
```

### Unit Testing

Our unit tests are written with [Vitest](https://vitest.dev/) and can be found alongside any javascript/vue code files existing in Dialtone Vue.
Tests are suffixed with `.test.js` of the corresponding javascript/vue file. ex: `link.vue` is tested by `link.test.js`.
All code in Dialtone Vue should have tests written for it.
You can see more details on writing tests in the following [documentation](https://dialtone.dialpad.com/vue/?path=/story/docs-component-driven-development-unit-tests--page).

Before you start to write tests, please follow the [Contributing Guideline - Writing Tests for Dialtone-vue Components](TEST_CONTRIBUTING/TEST_GUIDELINE.md).

### Dialtone Usage

Consumers of Dialtone Vue should utilize the global immutable CSS classes provided by Dialtone whenever possible.
If needed, you can also write custom CSS using [Dialtone Tokens CSS variables](https://dialtone.dialpad.com/tokens/).

Please **do not** use any mixins or utility classes in Dialtone Vue components.

### Breaking Changes

Dialtone Vue is a dependency of other projects, so you must always be aware of making a breaking change.
It is possible to make breaking changes to a component, however if you do so you will need to update / verify
all instances of usage of the component in ubervoice/uberconf before updating and communicate the breaking
change via a blog post on [dialtone.dialpad.com](https://dialtone.dialpad.com/about/whats-new/).

### Folder Structure

- **`.github`:** Contains GitHub documentation and GitHub actions workflows.
- **`.storybook`:** Build time configuration files for storybook. If you need to edit the storybook webpack config for example, you would do so here.
- **`components`:** Everything related to a specific component is stored here in a folder with the component name. This includes the component itself, tests, documentation and storybook files.
- **`css`:** We store any global less/css in here. Right now it is only used for Dialtone overrides.
- **`directives`:** Vue directives we output as part of the Dialtone Vue library.
- **`dist`:** The Dialtone Vue library is output here upon `npm run build`.
- **`docs`:** Any storybook documentation not directly related to a component.
- **`functions`:** Contains documentation for any functions we export as part of the library.
- **`recipes`:** Everything related to recipe components is stored here in a folder with the component name. This includes the component itself, tests, documentation and storybook files.
- **`scripts`:** - Contains shell scripts.
- **`tests`:** For utility/helper files to be used in multiple tests and test configuration. Actual tests are stored in the component folder.

## Tooling

### Vite

We use [Vite](https://vitejs.dev/) to run our local server and bundle our build.

### Storybook

We use [Storybook](https://storybook.js.org/) for our Dialtone Vue component documentation.
Storybook allows you to render each component in isolation and change any available properties.
Our storybook is hosted at <https://dialtone.dialpad.com/vue>, and can also be run locally via `npm start`.
For more detailed info on how to use storybook in Dialtone Vue, refer to our [storybook documentation](https://dialtone.dialpad.com/vue/?path=/story/docs-storybook-getting-started--page).

#### Function Documentation via TypeDoc

Storybook does not support documentation of functions by default, however we have a custom solution to this problem.
[TypeDoc](https://typedoc.org/) can generate documentation for functions as markdown files, and then we can include
these markdown files in our storybook mdx files. See the functions folder in the root of the project. To generate
the function documentation run `npm run build:documentation:functions`. This will not happen automatically when you are
running the server locally so you must do this manually to get function documentation to update locally. Currently all
(non-test) javascript files within the common folder will have md generated for them. The files will then
be output in `functions/generated/modules` folder and you can then include them in your MDX files within the "functions"
directory. See any existing examples of mdx files within that folder for more details.

### ESLint

We use ESLint to promote best practices throughout our codebase.
ESLint will check any of our javascript or vue code for styling or syntax errors.
The configuration can be found in [.eslintrc.cjs](../.eslintrc.cjs).
Any changes code changes you make will be automatically linted upon commit (configuration in
[lintstagedrc.cjs](../../../lintstagedrc.cjs)).
You can manually run ESLint via `npm run lint`.

### Yeoman

We use Yeoman as our generator to scaffold new components.
This means if you are creating a new component you can simply just run `pnpm exec yo @dialpad/dialtone:vue3` and enter the name of your component.
All files for your component (component, tests, storybook files) will be generated with starter templates and proper naming conventions.
For more details on how to use yeoman, see [the docs](https://dialtone.dialpad.com/vue/?path=/story/docs-component-driven-development-yeoman-generator--page).
