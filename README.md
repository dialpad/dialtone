# Dialtone Vue 📞

Dialtone Vue is a library of Vue components for [Dialtone][dt]. The goal is to simplify and standardize the use of common UI patterns and behaviour across all Dialpad projects.

**[Component Documentation Site ↗️][handbook]**

[dt]: https://dialpad.design

### Project Status

Dialtone Vue is a new project, and as such it is under constant development as we add new components and refine existing ones. Please refer to the [project board][project] to see the status of Dialtone Vue components and request new components that should be in the Dialtone Vue library.

[project]: https://github.com/orgs/dialpad/projects/1

### Timeline

Our goal is to have a stable 1.0 release in Q3 2021. At this point, we will split Dialtone Vue into a separate repository and follow semantic versioning.

## Usage

Dialtone Vue components can be imported directly from the package. Some components also export named constants, which can be imported as well:

```js
import { DtInput, VALIDATION_MESSAGE_TYPES } from '@dialpad/dialtone-vue';
```

## Storybook Component Documentation

Dialtone Vue uses [Storybook][storybook] for documentation of components, as well as an environment for local development. Please see the [Storybook Documentation Site][handbook] for specific usage information and interactive documentation for each Dialtone Vue component.

All components in Dialtone Vue should have stories written for them in Storybook. For more information on how to write stories, see the [documentation][stories].

[storybook]: https://storybook.js.org
[handbook]: https://dialtone-vue.netlify.app
[stories]: https://dialtone-vue.netlify.app/?path=/story/docs-storybook-getting-started--page

### Running Storybook Locally

Storybook provides a sandbox to develop and experiment with components locally, in isolation from the rest of the app. With Storybook you get live reloading of component templates and styles, just like you would in the app. You can also test different props and slots and see the effects in real time, test accessibility issues, and more.

To run Storybook locally, first install the dependencies:

```
npm run install:storybook
```

Then you can run the dev server:

```
npm run storybook
```

## Developing Dialtone Vue Components

Building components for Dialtone Vue is similar to components for Dialpad or UberConference, but there are some differences. Remember that Dialtone Vue is a shared library so more care has to be taken to avoid breaking changes.

Remember that Dialtone Vue is a separate project, so be sure to run the lint and unit tests for Dialtone Vue separately whenever making changes to the library.

See [CONTRIBUTING](./CONTRIBUTING.md).

### Project Setup

#### NPM_AUTH_TOKEN

Ensure that `NPM_AUTH_TOKEN` is set in your path. You will need to set the token to an NPM authentication token which has read level access to the `@dialpad` organization.

#### Install Dependencies

```bash
npm install
```

### CSS & Dialtone

Dialtone components should utilize the global immutable CSS classes provided by Dialtone whenever possible. It is a requirement of any project using Dialtone Vue to include these classes.

If needed, you can also write custom CSS using the Dialtone LESS variables or mixins by importing `../css/dialtone.less`.

Please **do not** use any scoped CSS in Dialtone Vue components.

### Unit Tests

Each component should have a corresponding unit test in the `tests/specs` directory. There is no special test setup as Dialtone Vue components do not have access to the Vuex store or custom methods/directives.

### Exports

When adding a new component, please add its exports to `index.js`, including any named exports, so they're available for import to users of Dialtone Vue:

```js
export {
  default as DtInput,
  INPUT_SIZES,
} from './components/input.vue';
```

### External Dependencies

Dialtone Vue components are designed to be used in a variety of different projects. As such, Dialtone Vue components should be pure Vue components with no dependencies on global Vue plugins or stores, except when noted below. This in particular means:

- **No access to the Vuex store.** Different projects will have different store structures, and so Dialtone Vue components cannot access the Vuex store. Dialtone Vue components should take data as props only.
- **No I18n.** Each project will have its own i18n implementation. Any text needed in a Dialtone Vue component should be passed as props or slots.
- **No custom directives.** Directives in Vue are installed globally and vary from project to project. Custom directives (such as `v-tooltip`) cannot be used in Dialtone Vue components.
- **No other custom global methods.** Some projects may implement custom global methods on the Vue object. Dialtone Vue components are limited to the built-in Vue methods.
- **No imports outside of the dialtone-vue directory.**
- **Vue 2 compatibility.** Dialtone Vue components should ideally support Vue 2 and 3, but a minimum of Vue 2 support is currently required.

## Using Dialtone Vue in your Project

Project using Dialtone Vue should be aware of the requirements:

- Dialtone classes must be made available globally (to avoid duplication, Dialtone Vue does not do this for you).
- A tool like Webpack must be used to package the SFC components from Dialtone Vue.
- LESS preprocessor support for Vue SFC `<style>` blocks.
- Dialtone Vue components are built for Vue 2, with Vue 3 support coming soon.

These requirements are enforced via peerdependencies of Dialtone Vue when possible.
