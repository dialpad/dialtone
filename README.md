# Dialtone Vue 📞

Dialtone Vue is a library of Vue components for [Dialtone][dt]. The goal is to simplify and standardize the use of common UI patterns and behaviour across all Dialpad projects.

Dialtone Vue is available in Vue 2 as well as Vue 3:

- **[Component Documentation Site (Vue 2) ↗️][dialtone-vue]**
- **[Component Documentation Site (Vue 3) ↗️][dialtone-vue3]**

[dt]: https://dialpad.design
[dialtone-vue]: https://vue.dialpad.design
[dialtone-vue3]: https://vue.dialpad.design/vue3

## Installation

You can install the Dialtone Vue library into your project via the following commands:

- Vue 2: `npm install @dialpad/dialtone-vue`
- Vue 3: `npm install @dialpad/dialtone-vue@vue3`

## Usage

First you must globally import the css:

```js
import '@dialpad/dialtone-vue/css';
```

or

```css
@import 'node_modules/@dialpad/dialtone-vue/dist/style.css';
```

Dialtone Vue components can be imported directly from the package. Some components also export named constants, which can be imported as well:

```js
import { DtInput, VALIDATION_MESSAGE_TYPES } from '@dialpad/dialtone-vue';
```

Projects using Dialtone Vue should be aware of the requirements:

- Dialtone classes must be made available globally (to avoid duplication, Dialtone Vue does not do this for you).
- A tool like Webpack must be used to package the SFC components from Dialtone Vue.
- LESS preprocessor support for Vue SFC `<style>` blocks.

These requirements are enforced via peerdependencies of Dialtone Vue when possible.

## Emojis

Dialtone Vue uses [JoyPixels](https://www.joypixels.com/) to render emojis. If you are using the emoji components, Dialtone Vue will use the free joypixels assets hosted on jsdelivr CDN by default. You may wish to use self hosted joypixels assets such as the SVGs only available to premium license holders. In order to do this, set your custom asset URL with the following functions for small and large emojis during initialization of your app:

```js
import { setEmojiAssetUrlSmall, setEmojiAssetUrlLarge } from '@dialpad/dialtone-vue/emoji'

// 16px and smaller
setEmojiAssetUrlSmall('https://my.example.website.com/joypixels/svg/unicode/32/', '.png')
// larger than 16px
setEmojiAssetUrlLarge('https://my.example.website.com/joypixels/svg/unicode/', '.svg')
```

You may access the emoji.json data for all emojis Dialtone Vue supports via executing the following function

```js
import { getEmojiData } from '@dialpad/dialtone-vue/emoji'
const emojiData = getEmojiData();
```

## Contributing

If you would like to contribute to Dialtone Vue the first step is to get the project running locally. Follow the below quickstart to do so.

1. Clone the repo `git clone https://github.com/dialpad/dialtone-vue.git`
2. Install dependencies `npm run install:all`
3. Run local dev server `npm start`
4. Visit local dev server at http://localhost:9011/

Next read the more detailed contributor documentation in [CONTRIBUTING.md](.github/CONTRIBUTING.md).

## Project Status

Dialtone Vue is a new project, and as such it is under constant development as we add new components and refine existing ones. Please refer to the [jira board][jira] to see what we are currently working on and what we have planned for the future.

[jira]: https://dialpad.atlassian.net/browse/DT
[request]: https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=10901&pid=12428
[report]: https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=10878&pid=12428

## Requesting features / reporting bugs

Requesting a feature or reporting a bug? Please do so at the below links:

- [Request Feature](https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=10901&pid=12428)
- [Report Bug](https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=10878&pid=12428)

Please also feel free to contact us via the [#dialtone slack channel](https://dialpad.slack.com/messages/dialtone/) with any questions
