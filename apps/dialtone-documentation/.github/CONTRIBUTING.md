# Dialtone Documentation Site Contributing

## VuePress

[VuePress](https://v2.vuepress.vuejs.org/) Vue-powered static site generator, is used as a static site generator for our documentation site.
VuePress's root folder is within the folder `docs` in the Dialtone repository.
Here are some short descriptions of the folders within `docs` and what they are responsible for:

- `docs/.vuepress`: This is where all VuePress-specific files are placed.
  - `baseComponents`: These are components that might be reused across the documentation site.
  - `exampleComponents`: These are example components to be used in the `docs/components` section.
  - `public`: Contains public assets like images.
  - `styles`: Contains VuePress specific styling files.
    - `palette.scss`: This file should be used to override VuePress specific values like breakpoints and to unset undesired margins, paddings, etc... It has higher priority than any other styling file.
  - `theme`: Contains customized dialtone vuepress theme configurations, layouts and components.
    - `components`:  Contains Theme specific components like Navbar, Sidebar, etc.
    - `layouts`: Contains Theme specific [Layouts](https://vuepress.github.io/reference/theme-api.html#layouts).
  - `views`: Contains complex views that couldn't be created with Markdown only.
  - `client.js`: Contains VuePress [client configuration](https://vuepress.github.io/advanced/cookbook/usage-of-client-config.html).
  - `config.ts`: Contains VuePress [global configuration](https://vuepress.github.io/reference/config.html).
- `docs/_data`: Contains json files with data to populate tables, examples and the sidebar items.
- `doc/about`: Contains templates for the "About" section of the website. (About dialtone, Contributing).
- `docs/assets`: Contains doc site specific LESS/CSS and Fonts **Note:** the css and fonts folders within `docs/assets` are output by the Dialtone build and any manual changes will be overwritten.
  - `less/overrides.less`: This file should be used to override styling on documentation site, if you need to unset specific value, please add it to `docs/.vuepress/styles/palette.scss`.
  - `less/hljs-dialpad.less`: Contains code blocks styling rules.
- `docs/components`: Contains templates for the "Components" section of the website. (Form inputs, Avatar, Banner etc).
- `docs/design`: Contains templates for the "Design" section of the website. (Colors, Icons, etc).
- `docs/getting-started`: Contains templates for the "Getting started" section of the website. (Installation, Usage).
- `docs/utilities`: Contains templates for the "Utilities" section of the website. (Utility classes).

We use markdown frontmatter to add metadata to the pages, and we have several functions to extract such data and manipulate it.
Here's an overview of important properties and the values they need/can have:

- title `(required)`: Used as the page title, and also as the component name for [Components overview page].
- shortTitle `(optional)`: This property is used to fix linking issues on [Components overview page] when the title is different from the component name.
- description `(optional)`: Used as the page subtitle and in the page metadata.
- status `(optional)`: CSS Component status, used to display a badge on [Components overview page] and
also to define the component status on [Components status page],
  - Status options available: `['wip', 'planned', 'new', 'ready', null]`
  if status is not defined, the component will have a "N/A" CSS status on [Components status page].
- thumb `(optional)`: Boolean to define if the component in [Components overview page] will have a thumbnail
  - ***Note:*** The thumbnail must exist on `/docs/.vuepress/public/assets/images/components` and the name should be the `component title` in kebab-case in `png` format. e.g. `Button Group` component -> button-group.png
- storybook `(optional)`: It can be a storybook URL or a status.
  - Status options available: `['wip', 'planned', null]`
  if storybook is not defined, the component will have a "N/A" Vue status on [Components status page].
- figma `(optional)`: It can be a figma URL or a status.
  - Status options available: `['wip', 'planned', null]`
  if figma is not defined, the component will have a "N/A" Figma status on [Components status page].
- no_preview `(optional)`: If defined, the page will have no preview section at the top.

[Components overview page]: https://dialtone.dialpad.com/components/
[Components status page]: https://dialtone.dialpad.com/components/status/
