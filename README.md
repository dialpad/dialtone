# Dialtone Vue 📞

Dialtone Vue is a library of Vue components for [Dialtone][dt]. The goal is to simplify and standardize the use of common UI patterns and behaviour across all Dialpad projects.

Dialtone Vue is available in Vue 2 as well as Vue 3:

- **[Component Documentation Site (Vue 2) ↗️][dialtone-vue]**
- **[Component Documentation Site (Vue 3) ↗️][dialtone-vue3]**

[dt]: https://dialpad.design
[dialtone-vue]: https://vue.dialpad.design
[dialtone-vue3]: https://vue.dialpad.design/vue3

## Project Status

Dialtone Vue is a new project, and as such it is under constant development as we add new components and refine existing ones. Please refer to the [jira board][jira] to see the status of Dialtone Vue components and request new components that should be in the Dialtone Vue library.

[jira]: https://switchcomm.atlassian.net/secure/RapidBoard.jspa?rapidView=246

## Installation

You can install the Dialtone Vue library into your project via the following commands:

- Vue 2: `npm install @dialpad/dialtone-vue`
- Vue 3: `npm install @dialpad/dialtone-vue@vue3`

## Usage

Dialtone Vue components can be imported directly from the package. Some components also export named constants, which can be imported as well:

```js
import { DtInput, VALIDATION_MESSAGE_TYPES } from '@dialpad/dialtone-vue';
```

Projects using Dialtone Vue should be aware of the requirements:

- Dialtone classes must be made available globally (to avoid duplication, Dialtone Vue does not do this for you).
- A tool like Webpack must be used to package the SFC components from Dialtone Vue.
- LESS preprocessor support for Vue SFC `<style>` blocks.

These requirements are enforced via peerdependencies of Dialtone Vue when possible.

## Contributing

If you would like to contribute to Dialtone Vue the first step is to get the project running locally. Follow the below quickstart to do so.

1. Clone the repo `git clone https://github.com/dialpad/dialtone-vue.git`
2. Install storybook dependencies `npm run storybook:install`
3. Install dialtone-vue dependencies `npm install`
4. Run local dev server `npm start`
5. Visit local dev server at http://localhost:9011/

Next read the more detailed contributor documentation in [CONTRIBUTING.md](.github/CONTRIBUTING.md).
