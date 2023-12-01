# Contributing

Before contributing a new component to Dialtone Vue, please check the [Jira board](https://switchcomm.atlassian.net/jira/software/projects/DT/boards/187/backlog)
to see if there is already an issue for it and if not, add it.

## Overview

### What Is Dialtone Vue?

Dialtone is a design system by Dialpad comprised of CSS components, Vue components, utility classes, visual assets, documentation.
Dialtone Vue is the Vue component portion of Dialtone and is distributed as a separate package.
It is recommended that you are familiar with [Dialtone](https://github.com/dialpad/dialtone/tree/staging)
as well as it's [contribution guide](https://github.com/dialpad/dialtone/blob/staging/.github/CONTRIBUTING.md) before you contribute to Dialtone Vue.

Dialtone is a peer dependency of Dialtone Vue.

### What Is a Contribution?

A contribution is any proposal, design, code, or documentation completed by someone not on the core Dialtone team,
and released through Dialtone Vue for other people to use.
It can be created by anyone who'd like to help make Dialtone Vue better.

Types of contributions:

- **Fix:** Fixes a technical or documentation defect.
- **Enhancement:** Extends an existing component without changing the underlying architecture or behavior.
- **New feature:** Adds something new, like a component.

### What Belongs in Dialtone Vue?

There are a couple important considerations when thinking about contributing to Dialtone Vue.
The first is to remember that Dialtone Vue strives to offer components to be shared by multiple teams or features.
Generally, one-off or first-time elements (i.e. snowflakes) aren't a great fit, though there may be the occasional exception.

The second is to check with the Dialtone team (in [#dialtone](https://dialpad.slack.com/messages/dialtone/)) to ensure the contribution isn't already requested, planned, or even complete.

### Roles

- **Contributor:** Has the ability to create PRs and merge their change into staging after at least one approving review.
- **Maintainer:** A trusted contributor with the ability to release Dialtone.
- **Admin:** Has the ability to change any configuration on the Dialtone repository and release Dialtone. Usually for members of the Dialtone team.

## Making a Pull Request

### Before Submitting

Before submitting a pull request, make sure to communicate what you wish to change to the Dialtone team.
The easiest way to do this is via the [#dialtone](https://dialpad.slack.com/messages/dialtone/) Slack channel.
It's possible your change is already being worked on, has already been fixed, or maybe we just need to discuss the best solution to the problem.
This prevents you from having to re-write your entire change, or even having to scrap it entirely.

The Dialtone library exists to serve multiple teams, so it is important to ensure that your PR does not introduce any unnecessary breaking changes.
Breaking changes will require extra steps that may prolong the submission review process.
If breaking changes are absolutely necessary for your use case, then you must communicate them to the Dialtone team in advance to allow for a smooth migration strategy for all dependant projects.

Examples of breaking include the following:

- **Changing or removing the component API**: renaming or removing props and emits, or changing their expected types

Examples of non-breaking changes:

- **Making new additions to the component API**: for example, adding a new prop to a component that triggers a different flow of behaviour or output, or adding a new emit event to detect specific changes.
- **Refactoring**: changing the internal code of a component without changing any external behaviour.

Some updates can unintentionally cause breaking changes, or cause changes to a component's output behaviour or functionality without necessary breaking it.
This is why it is important to evaluate the change carefully and asses its impact on existing usage.

Any new components or updates to existing components require the following:

- Unit tests covering the entire change.
- Storybook documentation including a live rendered component via controls and MDX. See [the documentation](https://vue.dialpad.design/?path=/story/docs-storybook-getting-started--page)
- Component is accessible according to requirements.
  - Navigable by keyboard.
  - Read by a screen reader.
  - Minimum contrast ratio.
- Changes must be made for Vue 2 as well as Vue 3, `staging` and `staging-vue3` branches respectively
- Unit tests are passing locally.
  - `npm run test`
- Linters are passing locally.
  - `npm run lint`
- Library builds locally.
  - `npm run build`
- Documentation builds locally.
  - `npm run storybook:build`

### How to Submit

After you have discussed your change with the Dialtone team, follow these steps to submit it:

1. See [README.md](../README.md) for instructions on how to initially clone and run the project.
2. First make sure you are on the `staging` branch with `git checkout staging`, and that it is up-to-date with `git pull`.
3. Create a personal branch to make your change off of `staging` with `git checkout -b my-change-branch`. We use kebab-case for branch names.
4. Make and commit your changes. Note our [commit message conventions](COMMIT_CONVENTION.md).
5. Push your branch to remote. `git push -u origin my-change-branch`.
6. Create a pull request into the `staging` branch, reviewers will be automatically added and notified of your PR.
7. Set the label on your PR:

- 'visual-test-ready' if your PR includes visual UI changes.
- 'no-visual-test' if not UI changes.

8. Run `./copy_pr_vue3.sh` in the root of the repository to copy your changes to a vue3 branch titled `my-change-branch-vue3`
9. Create a pull request into the `staging-vue3` branch, reviewers will be automatically added and notified of your PR.
10. Any subsequent changes that need to be copied to your Vue 3 branch can be done so with `./copy_pr_vue3.sh GIT_SHA` where GIT_SHA is the commit SHA before the first one you wish to copy.
11. Once your changes have been approved, you may squash merge your branch into `staging` and `staging-vue3`.

Once your change is in `staging` it will go live with the next Dialtone Vue release.
Releases are done on demand by the Dialtone team, and are done fairly regularly.

If you made a local style change, or you need your change to be released promptly, please ask in the [#dialtone](https://dialpad.slack.com/messages/dialtone/) Slack channel for a release as dialtone-vue styles are now
[included within dialtone](https://dialpad.design/about/whats-new/posts/2023-8-14.html).

## Coding Guidelines

### CSS

We should to use `<style scoped>` sections with custom styling using [Dialtone tokens](https://dialpad.design/tokens/) in Dialtone Vue for all component styling.
Avoid using [utility classes](https://dialpad.design/utilities/) in dialtone-vue, those should be only used at the application level.

### How We Use Slots

Main content is the key visual content of a component.
For example the text and the icon of a button are two different content slots.
It is important that slots are used for this type of content as the consumer of the component can override the content with markup or vue components.
If the button text was only a prop, the consumer could not make changes to the styling of the text.

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
- **No custom directives:** Directives in Vue are installed globally and vary from project to project. Custom directives (such as `v-tooltip`) cannot be used in Dialtone Vue components.
- **No other custom global methods:** Some projects may implement custom global methods on the Vue object. Dialtone Vue components are limited to the built-in Vue methods.
- **No imports outside the dialtone-vue directory**
- **Vue 2 compatibility:** Dialtone Vue components should ideally support Vue 2 and 3, but a minimum of Vue 2 support is currently required.

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
You can see more details on writing tests in the following [documentation](https://vue.dialpad.design/?path=/story/docs-component-driven-development-unit-tests--page).

Before you start to write tests, please follow the [Contributing Guideline - Writing Tests for Design System Components](TEST_CONTRIBUTING/TEST_GUIDELINE.md).

### Dialtone Usage

Dialtone Vue components should utilize the global immutable CSS classes provided by Dialtone whenever possible.
It is a requirement of any project using Dialtone Vue to include Dialtone as a dependency.
If needed, you can also write custom CSS using [Dialtone Tokens CSS variables](https://dialpad.design/tokens/).

If you made a local style change, please ask in the [#dialtone](https://dialpad.slack.com/messages/dialtone/) Slack channel for a release as dialtone-vue styles are now
[included within dialtone](https://dialpad.design/about/whats-new/posts/2023-8-14.html).

Please **do not** use any mixins or utility classes in Dialtone Vue components.

### Breaking Changes

Dialtone Vue is a dependency of other projects, so you must always be aware of making a breaking change.
It is possible to make breaking changes to a component, however if you do so you will need to update / verify
all instances of usage of the component in ubervoice/uberconf before updating and communicate the breaking
change via a blog post on [dialpad.design](https://dialpad.design/about/whats-new/).

### Folder Structure

- **`.github`:** Contains GitHub documentation and GitHub actions workflows.
- **`.storybook`:** Build time configuration files for storybook. If you need to edit the storybook webpack config for example, you would do so here.
- **`components`:** Everything related to a specific component is stored here in a folder with the component name. This includes the component itself, tests, documentation and storybook files.
- **`css`:** We store any global less/css in here. Right now it is only used for Dialtone overrides.
- **`dist`:** The Dialtone Vue library is output here upon `npm run build`.
- **`docs`:** Any storybook documentation not directly related to a component.
- **`generator-dialtone-vue`:** - Yeoman generator config.
- **`recipes`:** Everything related to recipe components is stored here in a folder with the component name. This includes the component itself, tests, documentation and storybook files.
- **`scripts`:** - Contains shell scripts.
- **`tests`:** For utility/helper files to be used in multiple tests and test configuration. Actual tests are stored in the component folder.
- **`tools`:** - Any additional tooling related to Dialtone Vue. Right now contains files related to the migration from Dialtone 5 to Dialtone 6.

## Commit Message Convention

Dialtone Vue uses [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/)
to have commit messages that can be used as part of the [semantic release process](RELEASING.md).
For more information, see [COMMIT_CONVENTION.md](.github/COMMIT_CONVENTION.md).

Commit message conventions will be enforced on commit via git hook when pushing to branches (`production`, `staging`, `alpha` and `beta`).

When creating a PR from your own feature branch it is enforced via GitHub actions in the following conditions:

1. If you have only a single commit on your branch the commit message must follow the conventions.
2. If you have more than one commit on your branch the commit messages do not have to follow the conventions but the title of the PR does.

## Versioning

Dialtone Vue follows [SemVer](https://semver.org/) for versioning and the commit message convention used in the project
is aligned with SemVer by describing the features, fixes, and breaking changes made in commit messages.
All versioning on release will be done automatically based on the commit messages contained in it.

## Tooling

### Vite

We use [Vite](https://vitejs.dev/) to run our local server and bundle our build.

### Storybook

We use [Storybook](https://storybook.js.org/) for our Dialtone Vue component documentation.
Storybook allows you to render each component in isolation and change any available properties.
Our storybook is hosted at <https://vue.dialpad.design>, and can also be run locally via `npm start`.
For more detailed info on how to use storybook in Dialtone Vue, refer to our [storybook documentation](https://vue.dialpad.design/?path=/story/docs-storybook-getting-started--page).

Storybook has its own build process and dependencies separate from our project.
See the [storybook](../storybook) folder within our repo.

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
The configuration can be found in [.eslintrc.cjs](../eslintrc.cjs).
Any changes code changes you make will be automatically linted upon commit (configuration in [lint-staged.config.cjs](../lint-staged.config.cjs)).
You can manually run ESLint via `npm run lint`.

### Yeoman

We use Yeoman as our generator to scaffold new components.
This means if you are creating a new component you can simply just run `npx yo dialtone-vue` and enter the name of your component.
All files for your component (component, tests, storybook files) will be generated with starter templates and proper naming conventions.
For more details on how to use yeoman, see [the docs](https://vue.dialpad.design/?path=/story/docs-component-driven-development-yeoman-generator--page).

### GitHub Actions

[GitHub Actions](https://docs.github.com/en/actions) is what we use for our CI/CD solution.
All GHA workflows are in the `.github/workflows` directory.
Currently, we use GitHub Actions for the following:

- Deploying to production `.github/workflows/deploy.yml`, See [RELEASING](RELEASING.md) for instructions on how to do this.
- Linting our files on pull request `.github/workflows/lint-pr.yml`.
- Validating commit messages `.github/workflows/lint-commit-message.yml`, see [COMMIT_CONVENTION](COMMIT_CONVENTION.md) for our commit message conventions.
- Running unit tests on pull requests and pushes to staging `.github/workflows/unit_tests.yml`.
- Running visual tests after approved pull requests and pushes to staging `.github/workflows/visual_tests.yml`.
