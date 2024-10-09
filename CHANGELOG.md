## [9.79.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.79.0...dialtone/v9.79.1) (2024-10-09)


### Bug Fixes

* DLT-2036 conflicting peer dependencies ([#526](https://github.com/dialpad/dialtone/issues/526)) ([e6b5105](https://github.com/dialpad/dialtone/commit/e6b5105b0ddf7d58f254daa62c146db3dbbf6693))
* **Rich Text Editor:** DLT-2120 toggle editable prop removes input class styles ([#527](https://github.com/dialpad/dialtone/issues/527)) ([3f31e7a](https://github.com/dialpad/dialtone/commit/3f31e7a8403c901b66089da95e0a841821a3dc28))


### Documentation

* DLT-1797 move SB to docs - Popover to Root Layout ([#521](https://github.com/dialpad/dialtone/issues/521)) ([511b135](https://github.com/dialpad/dialtone/commit/511b1357580f2d8ed0116e58aaea8cf99459233d))
* DLT-2002 fix remaining modal scrollbar issues ([#519](https://github.com/dialpad/dialtone/issues/519)) ([cd0b1a5](https://github.com/dialpad/dialtone/commit/cd0b1a58c39053821b854dcd6f4d92702f104111))

# [9.79.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.78.0...dialtone/v9.79.0) (2024-10-07)


### Bug Fixes

* **Rich Text Editor:** DP-113072 support dialtone emojis by setting value prop ([#524](https://github.com/dialpad/dialtone/issues/524)) ([40b90be](https://github.com/dialpad/dialtone/commit/40b90be35dd3e3168dc63ac77ba2e95a46dfafda))


### Features

* **Rich Text Editor:** DLT-2116 enable emoji searching by name and keyword ([#525](https://github.com/dialpad/dialtone/issues/525)) ([14e4569](https://github.com/dialpad/dialtone/commit/14e45694391156fbbaf6180a5db555b5352cd705))

# [9.78.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.77.0...dialtone/v9.78.0) (2024-10-07)


### Bug Fixes

* **Emoji Picker:** NO-JIRA refactor fix ref reactivity in vue2 ([#523](https://github.com/dialpad/dialtone/issues/523)) ([f164cad](https://github.com/dialpad/dialtone/commit/f164cad8cfa08f5d5e0262d6bf1b2f5531771e1f))
* **Tokens:** NO-JIRA incorrect hsl for reference tokens ([#516](https://github.com/dialpad/dialtone/issues/516)) ([eb4e10e](https://github.com/dialpad/dialtone/commit/eb4e10e4371c3a9d53a3e7e08e759429c272723a))


### Features

* DLT-1915 add stylelint warning when using px or rem instead of tokens ([#509](https://github.com/dialpad/dialtone/issues/509)) ([77212aa](https://github.com/dialpad/dialtone/commit/77212aaf17e8bdf5a31192d5421bd1ab1d1fac30))

# [9.77.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.76.3...dialtone/v9.77.0) (2024-10-01)


### Code Refactoring

* **Badge, Emoji Tabset, Empty State:** remove DtIcon ([#481](https://github.com/dialpad/dialtone/issues/481)) ([0fa1280](https://github.com/dialpad/dialtone/commit/0fa12804511cf588245a2ad59b3c5d01f4eccc84))


### Features

* **Avatar:** DLT-1916 remove dt-icon ([#466](https://github.com/dialpad/dialtone/issues/466)) ([6ef90db](https://github.com/dialpad/dialtone/commit/6ef90db28f3c5164c4c9c9657b039a74a9b6daf5))
* **Avatar:** DLT-1916 remove dt-icon from Avatar vue 2 ([#474](https://github.com/dialpad/dialtone/issues/474)) ([e8600c3](https://github.com/dialpad/dialtone/commit/e8600c39dc4cafe56e13643b293e606fab4a3107))
* **Feed Item Pill:** DLT-1916 remove dt-icon from Feed Item Pill ([#489](https://github.com/dialpad/dialtone/issues/489)) ([bde73c8](https://github.com/dialpad/dialtone/commit/bde73c85a53249ce58b603f44e0115e82cb96bb1))
* **Keyboard Shortcut To Unread Pill:** DLT-1916 remove dt-icon ([#482](https://github.com/dialpad/dialtone/issues/482)) ([277ae13](https://github.com/dialpad/dialtone/commit/277ae138fbc2ed7aad0c5428ce3b8f3ba3de667a))
* **Message Input:** DLT-1916 remove dt-icon from message input ([#490](https://github.com/dialpad/dialtone/issues/490)) ([3215116](https://github.com/dialpad/dialtone/commit/3215116e49f1e91a264de4db99f3db60fff9029c))

## [9.76.3](https://github.com/dialpad/dialtone/compare/dialtone/v9.76.2...dialtone/v9.76.3) (2024-09-27)


### Bug Fixes

* **Emoji Picker:** NO-JIRA fix ref reactivity in vue2 ([#512](https://github.com/dialpad/dialtone/issues/512)) ([c4255c1](https://github.com/dialpad/dialtone/commit/c4255c141c8d19f3391f2f8895c03237e6cfbee8))
* **Input:** DLT-2083 fix clear button margin ([#507](https://github.com/dialpad/dialtone/issues/507)) ([57bd549](https://github.com/dialpad/dialtone/commit/57bd5492dea05d02e94c693e9e29fc8c329ccf03))
* **Rich Text Editor:** DLT-2029 double line breaks on paste ([#511](https://github.com/dialpad/dialtone/issues/511)) ([d7b771a](https://github.com/dialpad/dialtone/commit/d7b771a38e21a86167f4e43cf309d7b01b3c1958))

## [9.76.2](https://github.com/dialpad/dialtone/compare/dialtone/v9.76.1...dialtone/v9.76.2) (2024-09-26)


### Bug Fixes

* **Emoji Picker:** NO-JIRA multiple fixs ([#506](https://github.com/dialpad/dialtone/issues/506)) ([c14a6da](https://github.com/dialpad/dialtone/commit/c14a6dacf57c6338baf5f0f25a0e9ed659bc5e8d))
* **Tokens:** DLT-2054 support shadow dom ([#508](https://github.com/dialpad/dialtone/issues/508)) ([edd639f](https://github.com/dialpad/dialtone/commit/edd639f213795662c20c0114c0c1a2178af24736))

## [9.76.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.76.0...dialtone/v9.76.1) (2024-09-24)


### Bug Fixes

* **Tokens:** DLT-2053 android tokens color value ([#504](https://github.com/dialpad/dialtone/issues/504)) ([368c9db](https://github.com/dialpad/dialtone/commit/368c9db93fc6045ce08bc7e2ee010590ec83ff5f))

# [9.76.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.75.0...dialtone/v9.76.0) (2024-09-20)


### Documentation

* **Hovercard, Empty State:** DLT-1934 update docs ([#501](https://github.com/dialpad/dialtone/issues/501)) ([e3ea5c6](https://github.com/dialpad/dialtone/commit/e3ea5c69cfb76eb3a90aa451b137466ff079996d))


### Features

* **Combobox Multi Select:** DLT-2066 chip truncation ([#503](https://github.com/dialpad/dialtone/issues/503)) ([0a94cfc](https://github.com/dialpad/dialtone/commit/0a94cfca38886c310d1f035982e7c0a3ea4d2a36))

# [9.75.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.74.3...dialtone/v9.75.0) (2024-09-19)


### Features

* **Modal:** DLT-1983 add custom scrollbar ([#497](https://github.com/dialpad/dialtone/issues/497)) ([c71a6c1](https://github.com/dialpad/dialtone/commit/c71a6c18ec7d6051fa81f6841a1aac260a8f9ab3))
* **Modal:** DLT-1983 revert add custom scrollbar ([#497](https://github.com/dialpad/dialtone/issues/497)) ([ea622ec](https://github.com/dialpad/dialtone/commit/ea622ec7e87712cb49a2780465296b34af6a5316))

## [9.74.3](https://github.com/dialpad/dialtone/compare/dialtone/v9.74.2...dialtone/v9.74.3) (2024-09-18)


### Bug Fixes

* **Tokens:** DLT-2058 fix uncalced focus ring token ([#502](https://github.com/dialpad/dialtone/issues/502)) ([9733452](https://github.com/dialpad/dialtone/commit/9733452f935a524a88dfd3bfb0ee8844e0444113))

## [9.74.2](https://github.com/dialpad/dialtone/compare/dialtone/v9.74.1...dialtone/v9.74.2) (2024-09-17)


### Bug Fixes

* **Tooltip:** NO-JIRA null protection on unmount ([7cc5748](https://github.com/dialpad/dialtone/commit/7cc57485eceb3f7fecce189665cc90c7c5b4d5fa))

## [9.74.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.74.0...dialtone/v9.74.1) (2024-09-16)


### Bug Fixes

* **Tooltip:** DLT-2039 flush promises when external anchor ([#499](https://github.com/dialpad/dialtone/issues/499)) ([fa21401](https://github.com/dialpad/dialtone/commit/fa21401bbf12cbcc9ecdb4be4323f42a282dce70))


### Reverts

* Revert "fix(tooltip): DLT-2039 flush promises when external anchor (#499)" ([012a31f](https://github.com/dialpad/dialtone/commit/012a31f4d992e5640a48dc1b1911f68fde3f2689)), closes [#499](https://github.com/dialpad/dialtone/issues/499)

# [9.74.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.73.0...dialtone/v9.74.0) (2024-09-16)


### Bug Fixes

* **Tooltip:** DLT-2039 flush promises when external anchor ([#499](https://github.com/dialpad/dialtone/issues/499)) ([4966920](https://github.com/dialpad/dialtone/commit/4966920eb22e4faa706df1a6d7b31fd355eaee79))


### Features

* **Icon:** DLT-1991 add full color dialpad-sparkle ([#495](https://github.com/dialpad/dialtone/issues/495)) ([d20de6d](https://github.com/dialpad/dialtone/commit/d20de6d26f215e86caf197bb32a8586ac20a86ec))

# [9.73.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.72.3...dialtone/v9.73.0) (2024-09-13)


### Bug Fixes

* **Combobox Multiselect:** DLT-2015  add reservedRightSpace prop ([#496](https://github.com/dialpad/dialtone/issues/496)) ([7049a6f](https://github.com/dialpad/dialtone/commit/7049a6f77d5f556928b435225c0781cf74b7a242))


### Documentation

* NO-JIRA wrong dialtone-css import on local ([da5f7d6](https://github.com/dialpad/dialtone/commit/da5f7d6cd393bff8d93e5929836cec7f79f69c26))


### Features

* **Utilities:** DLT-1763 add gap utility class ([#492](https://github.com/dialpad/dialtone/issues/492)) ([835d06f](https://github.com/dialpad/dialtone/commit/835d06fbeead4919dbe7683081b8b92d51031fc1))

## [9.72.3](https://github.com/dialpad/dialtone/compare/dialtone/v9.72.2...dialtone/v9.72.3) (2024-09-11)


### Bug Fixes

* **Lint:** NO-JIRA fix linter rule for text styles ([#494](https://github.com/dialpad/dialtone/issues/494)) ([c6b5f3f](https://github.com/dialpad/dialtone/commit/c6b5f3f6fb3d79f2863bbfb6d303389da702cc5a))
* **Scrollbar Directive:** NO-JIRA overlayscrollbars missing styles ([#493](https://github.com/dialpad/dialtone/issues/493)) ([d1a88e1](https://github.com/dialpad/dialtone/commit/d1a88e1889bb232adaeb263075b5641c7cd28c67))
* **Tokens:** NO-JIRA keep references in css output ([#487](https://github.com/dialpad/dialtone/issues/487)) ([b019ff6](https://github.com/dialpad/dialtone/commit/b019ff67bbc2da4f33ad8dadf2da81150bbb1fc6))


### Documentation

* **Icon:** DLT-1916 update documentation to show tree shaking examples   ([#491](https://github.com/dialpad/dialtone/issues/491)) ([5b9d969](https://github.com/dialpad/dialtone/commit/5b9d969ebced275163d10929ef08b4a34ae4976b))

## [9.72.2](https://github.com/dialpad/dialtone/compare/dialtone/v9.72.1...dialtone/v9.72.2) (2024-09-09)


### Bug Fixes

* **Rich Text Editor:** DLT-2017 emojis positioning ([#486](https://github.com/dialpad/dialtone/issues/486)) ([b857386](https://github.com/dialpad/dialtone/commit/b857386ab32425a1ee3ec58287265bc3c511b39f))

## [9.72.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.72.0...dialtone/v9.72.1) (2024-09-04)


### Bug Fixes

* **Dialtone Icons:** NO-JIRA add data-qa to individual icon and illustration ([#483](https://github.com/dialpad/dialtone/issues/483)) ([28521d0](https://github.com/dialpad/dialtone/commit/28521d0fa2a420ee4239ac8bf862cc343239b92f))
* **Docs:** NO-JIRA broken links in new content guidelines ([#485](https://github.com/dialpad/dialtone/issues/485)) ([c65e878](https://github.com/dialpad/dialtone/commit/c65e8782617d5965cbdd9596ba74c6bcdbb8d2e2))

# [9.72.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.71.0...dialtone/v9.72.0) (2024-09-03)


### Features

* **Design Tokens:** DLT-2004 typography and radius design tokens for button, input, select, tabs ([#467](https://github.com/dialpad/dialtone/issues/467)) ([a0c10a2](https://github.com/dialpad/dialtone/commit/a0c10a2390c68e8185d2d78edfefa02d4e889a12))

# [9.71.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.70.1...dialtone/v9.71.0) (2024-08-29)


### Bug Fixes

* NO-JIRA tree-shaking ([#480](https://github.com/dialpad/dialtone/issues/480)) ([f24eb29](https://github.com/dialpad/dialtone/commit/f24eb29397918238cf12f5882e12f30745947a3c))


### Features

* **Tokens:** DLT-2014 add postcss plugin to transform rem to px ([#479](https://github.com/dialpad/dialtone/issues/479)) ([e496076](https://github.com/dialpad/dialtone/commit/e496076c30fbc4a0ff1f785d22e2541b66903c9f))

## [9.70.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.70.0...dialtone/v9.70.1) (2024-08-27)


### Bug Fixes

* **Tokens:** DLT-1951 corrected muted outlined border color ([#477](https://github.com/dialpad/dialtone/issues/477)) ([0ab6b6c](https://github.com/dialpad/dialtone/commit/0ab6b6c9c953fb310729aa43a23ef4521648c152))

# [9.70.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.69.1...dialtone/v9.70.0) (2024-08-26)


### Bug Fixes

* NO-JIRA eslint documentation links ([#472](https://github.com/dialpad/dialtone/issues/472)) ([32f606b](https://github.com/dialpad/dialtone/commit/32f606bd821ed23f10f3345370ea68dcc221ff2d))
* **Tokens:** NO-JIRA move themes to tokens package ([#476](https://github.com/dialpad/dialtone/issues/476)) ([ea8d977](https://github.com/dialpad/dialtone/commit/ea8d9771edab34db8ef68ab5e8743bb4ba713f7e))


### Features

* **Contact Row:** NO-JIRA add `avatarColor` prop to contact row recipe ([#469](https://github.com/dialpad/dialtone/issues/469)) ([f0be39d](https://github.com/dialpad/dialtone/commit/f0be39d0735a36fb561233bc274cdd513c90cd22))
* DP-108555 change prop type in contact centers recipe component ([#471](https://github.com/dialpad/dialtone/issues/471)) ([f45f302](https://github.com/dialpad/dialtone/commit/f45f3025b2f362b1b24f16022a32ef2fd5c8cb8c))


### Reverts

* Revert "chore(release): NO-JIRA eslint-plugin-dialtone/v1.1.0" ([22736cb](https://github.com/dialpad/dialtone/commit/22736cb896d365a1d712736e6c445e7f2509004a))

## [9.69.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.69.0...dialtone/v9.69.1) (2024-08-22)


### Bug Fixes

* **Dt Icon:** NO-JIRA change icon import json to js ([#468](https://github.com/dialpad/dialtone/issues/468)) ([356e836](https://github.com/dialpad/dialtone/commit/356e8364189e431c224b783349e78d2e6215a6f9))

# [9.69.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.68.0...dialtone/v9.69.0) (2024-08-21)


### Features

* NO-JIRA add types to themes ([#462](https://github.com/dialpad/dialtone/issues/462)) ([92e4acf](https://github.com/dialpad/dialtone/commit/92e4acf7a28960e0407cde91f6c4564a68d513aa))

# [9.68.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.67.1...dialtone/v9.68.0) (2024-08-21)


### Bug Fixes

* **Docs:** NO-JIRA popover with dt-scrollbar ([#461](https://github.com/dialpad/dialtone/issues/461)) ([806078f](https://github.com/dialpad/dialtone/commit/806078f74bc8ce3bc23ffec91c86147fc0d60dae))
* **Icon:** DLT-1784 flatten icons with multiple paths into single path ([#442](https://github.com/dialpad/dialtone/issues/442)) ([f654120](https://github.com/dialpad/dialtone/commit/f65412010b385227d33731e166de184802036ed0))
* **Icon:** NO-JIRA correct tmo logomark placement within canvas ([#464](https://github.com/dialpad/dialtone/issues/464)) ([94e9dd5](https://github.com/dialpad/dialtone/commit/94e9dd5cd715772034987242118db9dc90b8473e))
* **Multi Select:** DLT-2001 avoid overlap between input text and pills ([#465](https://github.com/dialpad/dialtone/issues/465)) ([1f774f5](https://github.com/dialpad/dialtone/commit/1f774f5fd6d2fdfd8a84189db044bca7f0e88ca1))


### Features

* **Badge:** DLT-1907 remove ai logomark for type ai ([#463](https://github.com/dialpad/dialtone/issues/463)) ([803877c](https://github.com/dialpad/dialtone/commit/803877c5c251385a5007b9d83e313f55a546f67e))
* DLT-1844 create linter warning for usage of text utilities ([#459](https://github.com/dialpad/dialtone/issues/459)) ([59730e1](https://github.com/dialpad/dialtone/commit/59730e1fe9193af94b7db2de93bb9c7b38e744c9))
* DLT-1999 create stylelint warning for usage of text utilities ([#460](https://github.com/dialpad/dialtone/issues/460)) ([42dd3ee](https://github.com/dialpad/dialtone/commit/42dd3ee7aa7d412cd8a357d518b19a8bb6238bcf))

## [9.67.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.67.0...dialtone/v9.67.1) (2024-08-19)


### Bug Fixes

* **Message Input:** DLT-1996 fix line breaks when initializing input value ([#457](https://github.com/dialpad/dialtone/issues/457)) ([1ec4cf0](https://github.com/dialpad/dialtone/commit/1ec4cf03ccadfc0bf07174dc0e599cab35c0e676))


### Documentation

* **Split Button:** DLT-1821 split button usage ([#458](https://github.com/dialpad/dialtone/issues/458)) ([317679a](https://github.com/dialpad/dialtone/commit/317679a52b11faa617ef5332d0201d5ff50ecec4))

# [9.67.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.66.0...dialtone/v9.67.0) (2024-08-16)


### Bug Fixes

* **Docs:** DLT-1994 use dialtone scrollbar in docsite ([#456](https://github.com/dialpad/dialtone/issues/456)) ([7db2c8c](https://github.com/dialpad/dialtone/commit/7db2c8cacfee31b9d73b906df82c37829ffd8488))


### Documentation

* **Common Commands:** NO-JIRA add documentation about using local package ([#449](https://github.com/dialpad/dialtone/issues/449)) ([e9b8be1](https://github.com/dialpad/dialtone/commit/e9b8be120c1e7f4ba0128d9e4d9ab06cb2a97225))
* DLT-1796 move storybook to doc site - Link to Pagination ([#441](https://github.com/dialpad/dialtone/issues/441)) ([bc2d57d](https://github.com/dialpad/dialtone/commit/bc2d57d232d6aeb32e62497767c8ee9bb29ccc72))


### Features

* **Contact Info:** NO-JIRA add `avatarColor` prop to contact info recipe ([#448](https://github.com/dialpad/dialtone/issues/448)) ([77ea808](https://github.com/dialpad/dialtone/commit/77ea80843fa228bd89b66003dbe268d7334734a3))
* **Input:** DLT-1945 add clear slot prop to rightIcon ([#455](https://github.com/dialpad/dialtone/issues/455)) ([0f90dd4](https://github.com/dialpad/dialtone/commit/0f90dd46885c92469e3f02baff716eb8cbb6694f))


### Reverts

* NO-JIRA use require for json imports ([#454](https://github.com/dialpad/dialtone/issues/454)) ([606cfb3](https://github.com/dialpad/dialtone/commit/606cfb31e2a1271203b9cee7415ac08a9d5787aa))

# [9.66.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.65.1...dialtone/v9.66.0) (2024-08-16)


### Bug Fixes

* NO-JIRA use require for json imports ([#454](https://github.com/dialpad/dialtone/issues/454)) ([64aeb6b](https://github.com/dialpad/dialtone/commit/64aeb6b9ec8b0c59fee2812b37528f330b606a1d))


### Features

* NO-JIRA introduce appendTo prop to image viewer ([#452](https://github.com/dialpad/dialtone/issues/452)) ([a5bcde8](https://github.com/dialpad/dialtone/commit/a5bcde8e404d1f5186cc04b1ba15d22401bed90c))

## [9.65.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.65.0...dialtone/v9.65.1) (2024-08-15)


### Bug Fixes

* **Emoji:** DLT-1913 alignment issue ([#453](https://github.com/dialpad/dialtone/issues/453)) ([edef45d](https://github.com/dialpad/dialtone/commit/edef45d210dcb4a4e301c9452b7bdbb9c8f17a3b))
* **Message Input:** DLT-1937 set input focus area correctly ([#446](https://github.com/dialpad/dialtone/issues/446)) ([36c5bbe](https://github.com/dialpad/dialtone/commit/36c5bbedf54fead53222210218b71c842688b9b0))
* **Message Input:** DP-107570 fix long names on mentions ([#451](https://github.com/dialpad/dialtone/issues/451)) ([5e5dea3](https://github.com/dialpad/dialtone/commit/5e5dea3a97454cb71d6f796a4262a79986d29231))
* **Tokens:** DLT-1961 make typography tokens rem instead of px ([#450](https://github.com/dialpad/dialtone/issues/450)) ([385aa0a](https://github.com/dialpad/dialtone/commit/385aa0a7d49a4626b2077c87c6acce01d730db18))

# [9.65.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.64.1...dialtone/v9.65.0) (2024-08-14)


### Bug Fixes

* NO-JIRA size and space pages in doc site ([#447](https://github.com/dialpad/dialtone/issues/447)) ([75be846](https://github.com/dialpad/dialtone/commit/75be846107be0f78d6098b265f97de8a612cf1e5))


### Features

* DP-107407 add new prop to hide the actions in leftbar contact centers recipe ([#445](https://github.com/dialpad/dialtone/issues/445)) ([27b80f0](https://github.com/dialpad/dialtone/commit/27b80f03c3bf56d5826d64befdc928e982b0e47d))
* **Stack:** DLT-1805 add responsive gap prop ([#435](https://github.com/dialpad/dialtone/issues/435)) ([7827570](https://github.com/dialpad/dialtone/commit/782757039954a1b05c9ff1673aaf51eb58027535))

## [9.64.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.64.0...dialtone/v9.64.1) (2024-08-13)


### Bug Fixes

* NO-JIRA es6 errors with json imports ([#444](https://github.com/dialpad/dialtone/issues/444)) ([7394e27](https://github.com/dialpad/dialtone/commit/7394e276c16433ec5b4a93154871a152230e14a0))

# [9.64.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.63.0...dialtone/v9.64.0) (2024-08-13)


### Features

* **Split Button:** DLT-1817 new component ([#373](https://github.com/dialpad/dialtone/issues/373)) ([1c768fe](https://github.com/dialpad/dialtone/commit/1c768fe7db44ba94b4de2a1693ef320741e1c3ad))
* **Theme:** DLT-1838 split unread design tokens ([#439](https://github.com/dialpad/dialtone/issues/439)) ([c13777c](https://github.com/dialpad/dialtone/commit/c13777cd0bce117fd7f94b8098647542dfc7103b))

# [9.63.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.62.0...dialtone/v9.63.0) (2024-08-10)


### Bug Fixes

* **Docs:** set initial theme ([9fe4567](https://github.com/dialpad/dialtone/commit/9fe45673ffd6c02a86c3c5ed89a8b61a001319ea))
* **Docs:** set initial theme vue3 ([443ab19](https://github.com/dialpad/dialtone/commit/443ab1954272c307d726003aaa245844661c80b7))
* **General Row:** DLT-1919 use theme colors for badge ([#437](https://github.com/dialpad/dialtone/issues/437)) ([e263188](https://github.com/dialpad/dialtone/commit/e263188bb4a7cfc2d22a2cf2d006d74eb23702d4))
* NO-JIRA dark mode in storybook ([#433](https://github.com/dialpad/dialtone/issues/433)) ([afae296](https://github.com/dialpad/dialtone/commit/afae296da78f30124a103001f5fa4ea00634d5a1))
* **Rich Text Editor:** DLT-1822 fix hard break default configuration for rich text editor ([#436](https://github.com/dialpad/dialtone/issues/436)) ([2e311c4](https://github.com/dialpad/dialtone/commit/2e311c4f3d183a4bd0b84e2e903041ee0dc98823))


### Documentation

* DLT-1795 move storybook to doc site - Icon to Input Group ([#429](https://github.com/dialpad/dialtone/issues/429)) ([972fa47](https://github.com/dialpad/dialtone/commit/972fa470008c97396169ca33ae97af547e685020))
* DLT-1933 move storybook to doc site - Item layout to Lazy show ([#432](https://github.com/dialpad/dialtone/issues/432)) ([90dea53](https://github.com/dialpad/dialtone/commit/90dea538a6bee176ecf56005d71ceb82f0d31b45))


### Features

* **Message Input:** DLT-1947 add slot for sms count badge ([#434](https://github.com/dialpad/dialtone/issues/434)) ([b24d49f](https://github.com/dialpad/dialtone/commit/b24d49fcec840276158ea9a68df75b9cb57b6313))

# [9.62.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.61.0...dialtone/v9.62.0) (2024-08-06)


### Bug Fixes

* **Avatar:** NO-JIRA make color 000 available ([#431](https://github.com/dialpad/dialtone/issues/431)) ([f86bad3](https://github.com/dialpad/dialtone/commit/f86bad322cd7747efaad6b701c3a62bc415e5b45))


### Features

* **Badge:** DLT-1930 spacing refinement ([#428](https://github.com/dialpad/dialtone/issues/428)) ([eb7ae1f](https://github.com/dialpad/dialtone/commit/eb7ae1f0a3dcf29304e047d002c0208994a19f9a))
* **Icon:** DLT-1842 new filled icons ([#430](https://github.com/dialpad/dialtone/issues/430)) ([a759c45](https://github.com/dialpad/dialtone/commit/a759c4594df7915e4c4fa086926a204a49480a16))
* **Multiselect:** DP-106266 add maxListWidth prop and highlight event ([#427](https://github.com/dialpad/dialtone/issues/427)) ([18fc8a3](https://github.com/dialpad/dialtone/commit/18fc8a3fe650c103446f33ce6f7935feda1d1432))

# [9.61.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.60.0...dialtone/v9.61.0) (2024-08-01)


### Features

* **Tokens:** DLT-1696 theme and brand tokens ([#416](https://github.com/dialpad/dialtone/issues/416)) ([11085dc](https://github.com/dialpad/dialtone/commit/11085dc9aeb0698f8f9f277c9b66b9f5869bec71))

# [9.60.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.59.0...dialtone/v9.60.0) (2024-07-31)


### Bug Fixes

* **Ivr Node Assign:** DP-95641 fix constant export ([#426](https://github.com/dialpad/dialtone/issues/426)) ([5e72815](https://github.com/dialpad/dialtone/commit/5e7281586872f2cb39b7a4add42d11e16d8c738d))
* **Tooltip:** DLT-1921 enabled prop not working - vue 3 ([#425](https://github.com/dialpad/dialtone/issues/425)) ([b5552e7](https://github.com/dialpad/dialtone/commit/b5552e7aec38cf5cca4eef95288cd564354b7c7b))


### Features

* **Leftbar:** DLT-1929 add scheduled icon ([#423](https://github.com/dialpad/dialtone/issues/423)) ([65c6e02](https://github.com/dialpad/dialtone/commit/65c6e02275c99d816b1dbaa7ed34d97ce5669c2a))

# [9.59.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.58.0...dialtone/v9.59.0) (2024-07-31)


### Bug Fixes

* **Tooltip:** DLT-1921 enabled prop not working ([#424](https://github.com/dialpad/dialtone/issues/424)) ([bc16e6d](https://github.com/dialpad/dialtone/commit/bc16e6db8e27d264531b35e362745f595f8298f1))


### Documentation

* DLT-1918 update do / don't usage well styles ([#421](https://github.com/dialpad/dialtone/issues/421)) ([77bae3d](https://github.com/dialpad/dialtone/commit/77bae3d88f5148977242d288cec64307c2ae0393))


### Features

* **Ivr Node Assign:** DP-95641 add assign step type ([#422](https://github.com/dialpad/dialtone/issues/422)) ([3da6278](https://github.com/dialpad/dialtone/commit/3da62787bf7b9861a9a1786462ef62bab1e65c85))

# [9.58.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.57.0...dialtone/v9.58.0) (2024-07-30)


### Documentation

* DLT-1897 move storybook to doc site - Emoji to Emoji Text Wrapper ([#412](https://github.com/dialpad/dialtone/issues/412)) ([dedb229](https://github.com/dialpad/dialtone/commit/dedb229c6e5ebbea8638c0537a8a31c37bf7ef3c))


### Features

* **Message Input:** DLT-1912 add slot for split button ([#419](https://github.com/dialpad/dialtone/issues/419)) ([e50139e](https://github.com/dialpad/dialtone/commit/e50139e659988b70aa349bf492213d81947e5538))

# [9.57.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.56.2...dialtone/v9.57.0) (2024-07-25)


### Features

* **Icons:** DLT-1697 add types ([#415](https://github.com/dialpad/dialtone/issues/415)) ([9adcd81](https://github.com/dialpad/dialtone/commit/9adcd8164de8e25c6b986e7850983088bf584f87))

## [9.56.2](https://github.com/dialpad/dialtone/compare/dialtone/v9.56.1...dialtone/v9.56.2) (2024-07-24)


### Bug Fixes

* DLT-1899 page TOC persisting from page to page ([#414](https://github.com/dialpad/dialtone/issues/414)) ([86759dc](https://github.com/dialpad/dialtone/commit/86759dca3727d52b723edf62d6d6c0f22bd432a2))
* **Emoji Text Wrapper:** DLT-1699 emoji alignment ([#407](https://github.com/dialpad/dialtone/issues/407)) ([bac9692](https://github.com/dialpad/dialtone/commit/bac9692091f32763c3b4227a46d3c94c0b9091a9))
* **Multi Select:** NO-JIRA update input padding when resizing ([#413](https://github.com/dialpad/dialtone/issues/413)) ([06bc49d](https://github.com/dialpad/dialtone/commit/06bc49dd78d8f8c168b5b0af024da0ecb3bd5c51))


### Documentation

* **Writing Guidelines:** DDT-554 ux content writing guidelines v2 ([#352](https://github.com/dialpad/dialtone/issues/352)) ([d9819a0](https://github.com/dialpad/dialtone/commit/d9819a0c75f4ca1c936bb4dfc5bf845000631412))

## [9.56.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.56.0...dialtone/v9.56.1) (2024-07-23)


### Bug Fixes

* **Multi Select:** NO-JIRA update input padding when focus out ([#410](https://github.com/dialpad/dialtone/issues/410)) ([2dd6dce](https://github.com/dialpad/dialtone/commit/2dd6dce1a9b16f3164b8c576639724e799cafc82))
* **Scrollbar:** NO-JIRA fix horizontal scrollbar on hover ([73acc8f](https://github.com/dialpad/dialtone/commit/73acc8ff376f78121084a75b1d87b0ff696cffcc))


### Documentation

* DLT-1794 move storybook to doc site Datepicker to Dropdown ([#411](https://github.com/dialpad/dialtone/issues/411)) ([9f71cd2](https://github.com/dialpad/dialtone/commit/9f71cd2f7e15732ec407cda695218a0d1e886a9b))

# [9.56.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.55.1...dialtone/v9.56.0) (2024-07-16)


### Features

* **Combobox Multiselect:** NO-JIRA add collapse on focus out ([#399](https://github.com/dialpad/dialtone/issues/399)) ([e4595c9](https://github.com/dialpad/dialtone/commit/e4595c9598cdde1c1ce8fd6cf2fef2e766470f57))

## [9.55.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.55.0...dialtone/v9.55.1) (2024-07-15)


### Bug Fixes

* **Scrollbar:** NO-JIRA fix to explicitly set the viewport ([#409](https://github.com/dialpad/dialtone/issues/409)) ([42b98a4](https://github.com/dialpad/dialtone/commit/42b98a4d736ceddc972ed7ee8add00bee5d69bdf))

# [9.55.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.54.2...dialtone/v9.55.0) (2024-07-12)


### Bug Fixes

* NO-JIRA corrupted pnpm-lock file ([4f732c8](https://github.com/dialpad/dialtone/commit/4f732c89c2c1874baeb4ef4877c73c3efa01e6f4))
* **Rich Text Editor:** NO-JIRA multiple improvements ([#402](https://github.com/dialpad/dialtone/issues/402)) ([c30b3a7](https://github.com/dialpad/dialtone/commit/c30b3a7049245fb39fcaf382420c74bf25e11146))


### Documentation

* DLT-1787 implement custom TOC ([#397](https://github.com/dialpad/dialtone/issues/397)) ([bf82624](https://github.com/dialpad/dialtone/commit/bf82624a63dece3b5a7d0aea7d8863f12145773b))
* **Logo:** DLT-1866 modify dialtone documentation logo ([#403](https://github.com/dialpad/dialtone/issues/403)) ([8047550](https://github.com/dialpad/dialtone/commit/8047550923830efe31522f3be0b601e3a75a24f2))


### Features

* **Design Tokens:** DLT-1870 additional expressive typography tokens ([#404](https://github.com/dialpad/dialtone/issues/404)) ([2bdc3a5](https://github.com/dialpad/dialtone/commit/2bdc3a5c6cbf0aa6cfc78b77842eff7071642247))
* **Design Tokens:** DLT-1871 added gold brand color ([#405](https://github.com/dialpad/dialtone/issues/405)) ([ab0d032](https://github.com/dialpad/dialtone/commit/ab0d0321cac9a02b955a0da73924d947467a7f28))
* **Multi Select:** DLT-1845 allow duplicated names on multiselect ([#394](https://github.com/dialpad/dialtone/issues/394)) ([ff8be5f](https://github.com/dialpad/dialtone/commit/ff8be5f1c40277ca4384ee58740430b9c346771a))
* **Scrollbar:** DLT-1473 add scrollbar directive ([#391](https://github.com/dialpad/dialtone/issues/391)) ([05af2ff](https://github.com/dialpad/dialtone/commit/05af2ff7fc11759935b2623212b31b716b26d774))

## [9.54.2](https://github.com/dialpad/dialtone/compare/dialtone/v9.54.1...dialtone/v9.54.2) (2024-07-09)


### Bug Fixes

* **Emoji Picker:** DLT-1864 tabs not focusing properly ([#400](https://github.com/dialpad/dialtone/issues/400)) ([fa92c89](https://github.com/dialpad/dialtone/commit/fa92c89768d4162b71b3454afe370f80f7542943))
* **General Row:** NO-JIRA lint fix leftbar_row.less ([72af60f](https://github.com/dialpad/dialtone/commit/72af60fb73ee3a8963c42ef6b17d8a5ce21674ae))
* **Input:** NO-JIRA add identifier classes ([#401](https://github.com/dialpad/dialtone/issues/401)) ([670a1ba](https://github.com/dialpad/dialtone/commit/670a1bada1a06b2a300dc64e521ef3cb133ff44d))

## [9.54.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.54.0...dialtone/v9.54.1) (2024-07-08)


### Bug Fixes

* **Emoji Picker:** NO-JIRA fix keyboard proposal ([#393](https://github.com/dialpad/dialtone/issues/393)) ([e5e7dfa](https://github.com/dialpad/dialtone/commit/e5e7dfa798b46bc84ca458b0dcff7d0c17e35e80))
* **Input:** NO-JIRA content not displaying on right slot ([168af7c](https://github.com/dialpad/dialtone/commit/168af7c1fab9d2a19b7b5aa6fc09ea0830c34fb0))
* **Tooltip:** DLT-1846 inverted not working properly ([#398](https://github.com/dialpad/dialtone/issues/398)) ([af57943](https://github.com/dialpad/dialtone/commit/af57943cdd3abe23a0e8fe67e663f5d54d1cff62))

# [9.54.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.53.0...dialtone/v9.54.0) (2024-07-04)


### Bug Fixes

* NO-JIRA add tiptap extension history to root package.json ([d23f8bb](https://github.com/dialpad/dialtone/commit/d23f8bbab5a470d47bc8a2dec789e66366b44880))


### Features

* **Input:** DLT-1808 icon scoped slot ([#392](https://github.com/dialpad/dialtone/issues/392)) ([de7b0f1](https://github.com/dialpad/dialtone/commit/de7b0f1aea9b307ceba80caaea49484498348749))

# [9.53.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.52.0...dialtone/v9.53.0) (2024-07-03)


### Bug Fixes

* **Input:** NO-JIRA autocomplete attr override ([#395](https://github.com/dialpad/dialtone/issues/395)) ([2af258d](https://github.com/dialpad/dialtone/commit/2af258d9445d4ebcab26de4f796c0c569bed1f4d))
* NO-JIRA keywords ([eb8527d](https://github.com/dialpad/dialtone/commit/eb8527d12255707d93425e0719595b029c2fa2f5))


### Features

* **Rich Text Editor:** DLT-1835 add undo behaviour ([#390](https://github.com/dialpad/dialtone/issues/390)) ([2d65590](https://github.com/dialpad/dialtone/commit/2d65590147c0a3f24e6294e23e17aff5beab6b27))

# [9.52.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.51.0...dialtone/v9.52.0) (2024-07-02)


### Features

* **Icon:** DLT-1804 add t-mobile ([#387](https://github.com/dialpad/dialtone/issues/387)) ([4ce82b2](https://github.com/dialpad/dialtone/commit/4ce82b21b2466b2056d802a6b6cf6f936dd09091))

# [9.51.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.50.0...dialtone/v9.51.0) (2024-07-01)


### Bug Fixes

* **Badge:** DP-102533 mention only color ([#386](https://github.com/dialpad/dialtone/issues/386)) ([b6dc77d](https://github.com/dialpad/dialtone/commit/b6dc77d1b450803c004eaaeddf00c92ea04225c2))
* **Emoji Picker:** DP-102475 fix keyboard navigation ([#389](https://github.com/dialpad/dialtone/issues/389)) ([6ca1d16](https://github.com/dialpad/dialtone/commit/6ca1d16b934f377414c652d102429c57fb76182b))
* **Expressive Theme:** NO-JIRA corrected figma and tokens studio connection ([#384](https://github.com/dialpad/dialtone/issues/384)) ([255936f](https://github.com/dialpad/dialtone/commit/255936f7956473167358a06631187b4384a0dc2d))
* **Logo:** DLT-1833 corrected antialiased edging  ([#381](https://github.com/dialpad/dialtone/issues/381)) ([67322e6](https://github.com/dialpad/dialtone/commit/67322e69bab916a403387159187cb2a01b15f0ae))


### Documentation

* DLT-1765 update favicon to Ai logomark ([#378](https://github.com/dialpad/dialtone/issues/378)) ([59ff0a4](https://github.com/dialpad/dialtone/commit/59ff0a4b75b820d5a81209c6073fbbef2b0da78f))
* DLT-1791 move storybook to doc site -  Avatar to ButtonGroup ([#380](https://github.com/dialpad/dialtone/issues/380)) ([b754575](https://github.com/dialpad/dialtone/commit/b75457589a1f9dabcae0df582a77bdea114507a5))
* DLT-1792 move storybook to doc site - Card to Combobox ([#383](https://github.com/dialpad/dialtone/issues/383)) ([56fbb43](https://github.com/dialpad/dialtone/commit/56fbb4386d6035286149cbb64fd0dd11c85ff2d6))
* **Prototypes:** DLT-1740 left bar prototype - vue 2 ([#385](https://github.com/dialpad/dialtone/issues/385)) ([689af1b](https://github.com/dialpad/dialtone/commit/689af1be7bf4bff0a1016651697dc8b9998f2046))
* **Prototypes:** DLT-1740 left bar prototype ([#368](https://github.com/dialpad/dialtone/issues/368)) ([b0e3c9a](https://github.com/dialpad/dialtone/commit/b0e3c9a7f734a4bb863b2fdd39088c563bcef080))


### Features

* **Icon:** DLT-1712 add token icon  ([#388](https://github.com/dialpad/dialtone/issues/388)) ([66d2474](https://github.com/dialpad/dialtone/commit/66d2474afab14373d9f75235454995fba929f52f))
* **Popover:** DLT-1826 appendTo root ([#379](https://github.com/dialpad/dialtone/issues/379)) ([4d2c54d](https://github.com/dialpad/dialtone/commit/4d2c54d83108bee15380f32f592e9a757287f855))
* **Popover:** DLT-1826 appendTo root ([#382](https://github.com/dialpad/dialtone/issues/382)) ([35480c5](https://github.com/dialpad/dialtone/commit/35480c5c96bfdee85d97510c6282b78bf4c75554))

# [9.50.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.49.2...dialtone/v9.50.0) (2024-06-25)


### Documentation

* DLT-1764 update to new Dialpad logo in doc site header ([#377](https://github.com/dialpad/dialtone/issues/377)) ([6536125](https://github.com/dialpad/dialtone/commit/6536125f9a0071a0b4f06ba76b6e5433756f8fc1))
* **Input:** DLT-1782 add search input example ([#376](https://github.com/dialpad/dialtone/issues/376)) ([a6b6416](https://github.com/dialpad/dialtone/commit/a6b64165cb6ccefbd4c3dd7c07b5989492a6f71a))
* **Tokens:** DLT-1655 update tokens page for mobile ([#370](https://github.com/dialpad/dialtone/issues/370)) ([4bb8e4f](https://github.com/dialpad/dialtone/commit/4bb8e4f6363a4e3fa41646406fc0c09a3594492e))


### Features

* **Icon:** DLT-1806 accessibility-mac ([#365](https://github.com/dialpad/dialtone/issues/365)) ([8735843](https://github.com/dialpad/dialtone/commit/8735843735d5fd2b8c39084a7d2c553329428f73))

## [9.49.2](https://github.com/dialpad/dialtone/compare/dialtone/v9.49.1...dialtone/v9.49.2) (2024-06-18)


### Bug Fixes

* **Icons:** NO-JIRA add webex.svg ([14ede84](https://github.com/dialpad/dialtone/commit/14ede84a4111c8e0d832992c6c389791c12a5ee6))
* **Icons:** NO-JIRA delete webex.svg ([94162dc](https://github.com/dialpad/dialtone/commit/94162dcf5995b828de394ab6277370d400eb134c))

## [9.49.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.49.0...dialtone/v9.49.1) (2024-06-18)


### Bug Fixes

* **Icons:** NO-JIRA webex icon ([aecc85b](https://github.com/dialpad/dialtone/commit/aecc85b10a0a1e5743e29ef19f43dc61b5b57d5e))

# [9.49.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.48.0...dialtone/v9.49.0) (2024-06-18)


### Bug Fixes

* **Message Input:** NO-JIRA preventTyping not working with pills ([#375](https://github.com/dialpad/dialtone/issues/375)) ([1091d61](https://github.com/dialpad/dialtone/commit/1091d61111a31a9ce8d9ffb655baab3c1dd9be7f))
* **Rich Text Editor:** DLT-1822 inputs with line breaks are not working for editor ([#374](https://github.com/dialpad/dialtone/issues/374)) ([d0d16de](https://github.com/dialpad/dialtone/commit/d0d16de6981f1a10d904ac52d0023757a7bcb279))


### Features

* **Icon:** DLT-1804 add webex ([#367](https://github.com/dialpad/dialtone/issues/367)) ([72cab26](https://github.com/dialpad/dialtone/commit/72cab26d6ff379cd5ca2b6610ace5465b6d7190b))

# [9.48.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.47.1...dialtone/v9.48.0) (2024-06-18)


### Features

* **Logo:** NO-JIRA gradient update ([#372](https://github.com/dialpad/dialtone/issues/372)) ([559a517](https://github.com/dialpad/dialtone/commit/559a5178131f799065cbdcc5610238cac9d9556e))

## [9.47.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.47.0...dialtone/v9.47.1) (2024-06-14)


### Bug Fixes

* **Message Input:** NO-JIRA small issues with slash commands ([#371](https://github.com/dialpad/dialtone/issues/371)) ([d7c18fa](https://github.com/dialpad/dialtone/commit/d7c18fa53ba1239281e6e6aed73b91ab1bb8f69b))
* **Rich Text Editor:** NO-JIRA output emojis in text as unicode rather than shortname ([#366](https://github.com/dialpad/dialtone/issues/366)) ([549bd47](https://github.com/dialpad/dialtone/commit/549bd47df95f956d543647d21a3a425ed98eea51))


### Documentation

* **Hovercard:** DLT-1510 add Hovercard component to doc site ([#361](https://github.com/dialpad/dialtone/issues/361)) ([97a39f0](https://github.com/dialpad/dialtone/commit/97a39f01e0f5969b4f742a98124025961a3ffe9a))

# [9.47.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.46.0...dialtone/v9.47.0) (2024-06-13)


### Bug Fixes

* **Input:** NO-JIRA set autocomplete="off" on input ([#360](https://github.com/dialpad/dialtone/issues/360)) ([bc47341](https://github.com/dialpad/dialtone/commit/bc473418b7ac0066739cc77a88d5e8155f035022))


### Code Refactoring

* **Message Input:** NO-JIRA remove util classes and clean up ([#364](https://github.com/dialpad/dialtone/issues/364)) ([3b82ed6](https://github.com/dialpad/dialtone/commit/3b82ed627c8c5cac09c7396def230d2f6a5ad0a7))


### Features

* **Logo:** DLT-1802 color options ([#359](https://github.com/dialpad/dialtone/issues/359)) ([14958c8](https://github.com/dialpad/dialtone/commit/14958c8629b2d0697abacf3e9bcfe00b6452442c))
* **Message Input:** DLT-1753 add support for dpm meeting pill ([#363](https://github.com/dialpad/dialtone/issues/363)) ([9843166](https://github.com/dialpad/dialtone/commit/98431666571520c6f96504aec243af33b62dd24c))

# [9.46.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.45.0...dialtone/v9.46.0) (2024-06-11)


### Features

* **Callbar Button With Popover:** NO-JIRA add offset as passthrough prop ([#362](https://github.com/dialpad/dialtone/issues/362)) ([fc9b285](https://github.com/dialpad/dialtone/commit/fc9b28536f251f8a54e68e3d539acda5ea1dfc4f))

# [9.45.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.44.0...dialtone/v9.45.0) (2024-06-11)


### Bug Fixes

* **Utility:** NO-JIRA border color opacity utility ([#356](https://github.com/dialpad/dialtone/issues/356)) ([a0e4d08](https://github.com/dialpad/dialtone/commit/a0e4d0872e2e081921f46ebe1d4db1a05fe55ec6))


### Features

* **Badge:** DLT-1788 design tokens for subtle and outline variants ([#358](https://github.com/dialpad/dialtone/issues/358)) ([4e008b7](https://github.com/dialpad/dialtone/commit/4e008b768b33758b64a20418c217db245902f384))
* **Chip:** NO-JIRA update chip bg colors ([#355](https://github.com/dialpad/dialtone/issues/355)) ([52a5043](https://github.com/dialpad/dialtone/commit/52a50437220734de749da7cfcc57b424853bbdec))
* **Tooltip:** DLT-1793 new prop to set tippy theme ([#357](https://github.com/dialpad/dialtone/issues/357)) ([0bd6f3a](https://github.com/dialpad/dialtone/commit/0bd6f3a8ea5aef20c464ca748b961e3309be3119))

# [9.44.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.43.0...dialtone/v9.44.0) (2024-06-07)


### Bug Fixes

* **Icon:** DLT-1785 dialpad-ai-color-reversed 1px too big ([#349](https://github.com/dialpad/dialtone/issues/349)) ([55a1ca2](https://github.com/dialpad/dialtone/commit/55a1ca28f28b0efc130a3471423a6a8f03d3f9d4))
* NO-JIRA change mention count badge color ([#354](https://github.com/dialpad/dialtone/issues/354)) ([7295cef](https://github.com/dialpad/dialtone/commit/7295cef90f2171cc05d5d8ee588541192f1ef16c))


### Documentation

* DLT-1695 add share filter functionality to tokens ([#337](https://github.com/dialpad/dialtone/issues/337)) ([098d322](https://github.com/dialpad/dialtone/commit/098d322a6cb53f2ab0d2d18984c801606746fa98))
* **Tokens:** NO-JIRA add border example for border-ai ([#350](https://github.com/dialpad/dialtone/issues/350)) ([a9d90df](https://github.com/dialpad/dialtone/commit/a9d90dfd80e5623b19240ba0b5a22417c35973be))


### Features

* **Css Utility:** DLT-619 add font-variant-numeric utility ([#351](https://github.com/dialpad/dialtone/issues/351)) ([d02a6ae](https://github.com/dialpad/dialtone/commit/d02a6aeffb3839f5045c5c8d24ed2300194030a4))

# [9.43.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.42.0...dialtone/v9.43.0) (2024-06-04)


### Bug Fixes

* NO-JIRA empty state update ([#348](https://github.com/dialpad/dialtone/issues/348)) ([bd41d50](https://github.com/dialpad/dialtone/commit/bd41d50508f9e2a0f7799c25c05a0d72d2ebd0a6))


### Documentation

* DLT-1399 add empty state section ([#282](https://github.com/dialpad/dialtone/issues/282)) ([053bd2b](https://github.com/dialpad/dialtone/commit/053bd2b6ef9b0f4a06b93eab9b8ac297aeb60171))
* **Empty State:** NO-JIRA restructure and content refinement ([#347](https://github.com/dialpad/dialtone/issues/347)) ([7c087e7](https://github.com/dialpad/dialtone/commit/7c087e76e73a42db0551e3a07e7a62be1c0ac49f))


### Features

* DLT-1762 dialpad logo updated ([#328](https://github.com/dialpad/dialtone/issues/328)) ([492ba32](https://github.com/dialpad/dialtone/commit/492ba32863b29bc872701e9bc3ce7def6fa61362))

# [9.42.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.41.0...dialtone/v9.42.0) (2024-05-31)


### Bug Fixes

* NO-JIRA remove double classes from dialtone output ([#340](https://github.com/dialpad/dialtone/issues/340)) ([0fcea93](https://github.com/dialpad/dialtone/commit/0fcea93dd6bc6acff01ffb8882b5ddaf7e0a59d2))
* **Tooltip:** NO-JIRA do not display when empty, general cleanup ([#344](https://github.com/dialpad/dialtone/issues/344)) ([a83d619](https://github.com/dialpad/dialtone/commit/a83d619c4d7053a4ed63edfee2c933c86a44ccf5))


### Features

* **Button:** DLT-1779 add link-inverted prop ([#343](https://github.com/dialpad/dialtone/issues/343)) ([6819394](https://github.com/dialpad/dialtone/commit/681939413c72c358b6a8df80a7e2096a8d7bdcb2))
* **Emoji Picker:** DLT-1781 allow hiding of search and setting searchQuery via prop ([#345](https://github.com/dialpad/dialtone/issues/345)) ([d5e5373](https://github.com/dialpad/dialtone/commit/d5e5373d81169afb3845fe815bf212c2d1ab7384))

# [9.41.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.40.0...dialtone/v9.41.0) (2024-05-30)


### Features

* **Badge:** DLT-1777 subtle and outlined variants ([#338](https://github.com/dialpad/dialtone/issues/338)) ([1da1fe9](https://github.com/dialpad/dialtone/commit/1da1fe9eaccbc54724d3c580eb906b697b97bcaf))

# [9.40.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.39.0...dialtone/v9.40.0) (2024-05-30)


### Bug Fixes

* DLT-1731 skin tone emojis ([#329](https://github.com/dialpad/dialtone/issues/329)) ([08d0cb3](https://github.com/dialpad/dialtone/commit/08d0cb3f10bf3712085b722f5193cd284575ae1d))
* **Rich Text Editor:** DLT-1752 remove custom parsing ([#331](https://github.com/dialpad/dialtone/issues/331)) ([3f0c6c1](https://github.com/dialpad/dialtone/commit/3f0c6c114c0c07e282b37dcfca55bbfcd6333a12))
* **Tooltip:** DLT-1776 shown event trigger ([#335](https://github.com/dialpad/dialtone/issues/335)) ([404bda4](https://github.com/dialpad/dialtone/commit/404bda4efa59fa33dba2e0dabda07ef8c61e7063))


### Documentation

* **Button:** NO-JIRA add disabled class docs back into examples ([#333](https://github.com/dialpad/dialtone/issues/333)) ([8ea5249](https://github.com/dialpad/dialtone/commit/8ea5249c39e1b6ca82496876b67976e66561450f))
* dlt-1579 use CodeExampleTabs from Tabs to Validation messages ([#332](https://github.com/dialpad/dialtone/issues/332)) ([947c35f](https://github.com/dialpad/dialtone/commit/947c35f203449e9e598fd3f8ecf11996756dfd20))
* NO-JIRA update badges ([#334](https://github.com/dialpad/dialtone/issues/334)) ([1f6e61e](https://github.com/dialpad/dialtone/commit/1f6e61ec0a51aa1126036e9b3baedc89d2b7f562))
* **Tokens:** DLT-1635 add tokens examples for each category ([#324](https://github.com/dialpad/dialtone/issues/324)) ([5128728](https://github.com/dialpad/dialtone/commit/51287285cf6a1354f256de9b20cddee052515c64))


### Features

* NO-JIRA add launchpad icon ([#336](https://github.com/dialpad/dialtone/issues/336)) ([30b3e66](https://github.com/dialpad/dialtone/commit/30b3e6675e7ab16ce2a6f35a35cb836a723b4e2f))

# [9.39.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.38.2...dialtone/v9.39.0) (2024-05-23)


### Bug Fixes

* **Tooltip:** DLT-1758 add legacy styles back ([#326](https://github.com/dialpad/dialtone/issues/326)) ([79d087b](https://github.com/dialpad/dialtone/commit/79d087be14681d435e93837bae9a05b17b93507e))


### Documentation

* **Homepage:** NO-JIRA homepage svg loader and stack ([#325](https://github.com/dialpad/dialtone/issues/325)) ([e66ed5c](https://github.com/dialpad/dialtone/commit/e66ed5cd0f2811f4099e15bac898d36c4f71a61c))


### Features

* dlt-1397 init empty state ([#315](https://github.com/dialpad/dialtone/issues/315)) ([38d3103](https://github.com/dialpad/dialtone/commit/38d31039c592d0b99312b27de8096bd229ca7bc2))
* **Link:** DLT-1631 add inverted utility classes ([#321](https://github.com/dialpad/dialtone/issues/321)) ([0aa8259](https://github.com/dialpad/dialtone/commit/0aa8259fa3577de6b5ec7a1b30a1e203771fa7e8))
* **Message Input:** DLT-1767 add ability to disallow codeblock ([#327](https://github.com/dialpad/dialtone/issues/327)) ([c47ab66](https://github.com/dialpad/dialtone/commit/c47ab66e962c2b2d48c037dae6f0fd100ac0c4da))

## [9.38.2](https://github.com/dialpad/dialtone/compare/dialtone/v9.38.1...dialtone/v9.38.2) (2024-05-22)


### Bug Fixes

* NO-JIRA newline in keywords file ([98bd576](https://github.com/dialpad/dialtone/commit/98bd576b9d9bdb3a1a26a6a9c7d55f794f6ed49e))

## [9.38.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.38.0...dialtone/v9.38.1) (2024-05-22)


### Bug Fixes

* DLT-1668 message input bullet lists ([#323](https://github.com/dialpad/dialtone/issues/323)) ([29979a5](https://github.com/dialpad/dialtone/commit/29979a57eef73bd5309513bf0e5d12a98aac1fff))

# [9.38.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.37.0...dialtone/v9.38.0) (2024-05-22)


### Bug Fixes

* **Rich Text Editor:** DLT-1719 separate link and custom link ([#318](https://github.com/dialpad/dialtone/issues/318)) ([cf38451](https://github.com/dialpad/dialtone/commit/cf38451e57d6d5180622ac30e050a8900184a9f7))
* **Tooltip:** DP-99352 correct offsets, trim empty check ([#322](https://github.com/dialpad/dialtone/issues/322)) ([558059d](https://github.com/dialpad/dialtone/commit/558059d565d99a75b48fe377956ac5ccc4d34e67))


### Features

* **Icon:** DLT-1759 fixed attestation alignment ([#319](https://github.com/dialpad/dialtone/issues/319)) ([3c0882a](https://github.com/dialpad/dialtone/commit/3c0882a0c2a521c9a8623469379756c093fbceec))
* **Icon:** DLT-1760 add rocket icon ([#320](https://github.com/dialpad/dialtone/issues/320)) ([8563d2b](https://github.com/dialpad/dialtone/commit/8563d2b363b82f47b4d24fc4d9f3b67ad4dc263c))

# [9.37.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.36.1...dialtone/v9.37.0) (2024-05-21)


### Features

* **Feed Item Row:** DLT-1725 add noInitials to feed item row ([#317](https://github.com/dialpad/dialtone/issues/317)) ([62ac0a6](https://github.com/dialpad/dialtone/commit/62ac0a6cd323e0643350fc19cce22520407d2ded))

## [9.36.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.36.0...dialtone/v9.36.1) (2024-05-17)


### Bug Fixes

* **Tooltip:** NO-JIRA svg size fix ([02e9f87](https://github.com/dialpad/dialtone/commit/02e9f87c45fa071e55671bbf3685cfefe920dd41))

# [9.36.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.35.0...dialtone/v9.36.0) (2024-05-16)


### Bug Fixes

* **Tooltip:** DLT-1757 round button alignment ([#314](https://github.com/dialpad/dialtone/issues/314)) ([eabd110](https://github.com/dialpad/dialtone/commit/eabd1102e139801ee113a38c9e6f9765eb6c2c9e))


### Features

* DLT-1756 add unread mention count ([#312](https://github.com/dialpad/dialtone/issues/312)) ([ff21d01](https://github.com/dialpad/dialtone/commit/ff21d0115775fa8ec62a01e365d2a09bac3fd2c3))

# [9.35.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.34.6...dialtone/v9.35.0) (2024-05-16)


### Features

* DP-91907 add leftbar contact centers recipe ([#291](https://github.com/dialpad/dialtone/issues/291)) ([73faf83](https://github.com/dialpad/dialtone/commit/73faf83a43cbf1e600581272e0233bfc565ee5cd))

## [9.34.6](https://github.com/dialpad/dialtone/compare/dialtone/v9.34.5...dialtone/v9.34.6) (2024-05-15)


### Bug Fixes

* **Datepicker:** DP-89398 change tooltip fallback positions ([#311](https://github.com/dialpad/dialtone/issues/311)) ([10470e8](https://github.com/dialpad/dialtone/commit/10470e8e711f5497a8a5ae4504b587867179e221))

## [9.34.5](https://github.com/dialpad/dialtone/compare/dialtone/v9.34.4...dialtone/v9.34.5) (2024-05-15)


### Bug Fixes

* DLT-1710 unexpected emoji on links ([#308](https://github.com/dialpad/dialtone/issues/308)) ([d14931a](https://github.com/dialpad/dialtone/commit/d14931a3fa762d226197c3afb9d1660fbf557e91))

## [9.34.4](https://github.com/dialpad/dialtone/compare/dialtone/v9.34.3...dialtone/v9.34.4) (2024-05-14)


### Bug Fixes

* NO-JIRA remove dry-run ([7f96350](https://github.com/dialpad/dialtone/commit/7f96350689b7a9168fea813cde8e2b7c590fae95))


### Documentation

* DLT-1538 illustrations workflow ([#283](https://github.com/dialpad/dialtone/issues/283)) ([59d83c6](https://github.com/dialpad/dialtone/commit/59d83c6236cd888dbcf4fe9737c18a7e603c7527))
* DLT-1577 use CodeExampleTabs from Popover to Root layout ([#301](https://github.com/dialpad/dialtone/issues/301)) ([8367a8b](https://github.com/dialpad/dialtone/commit/8367a8b3227d485de45ee141ff0fbb44b632d047))
* DLT-1578 use CodeExampleTabs from Scroller to Table ([#303](https://github.com/dialpad/dialtone/issues/303)) ([464990e](https://github.com/dialpad/dialtone/commit/464990ed9c46bc4031e008de3548d3b2ce6db409))

## [9.34.3](https://github.com/dialpad/dialtone/compare/dialtone/v9.34.2...dialtone/v9.34.3) (2024-05-09)


### Bug Fixes

* NO-JIRA define "Segoe UI Adjusted" font ([#306](https://github.com/dialpad/dialtone/issues/306)) ([f860dba](https://github.com/dialpad/dialtone/commit/f860dba7437350e4950e12754c70d6d2d60ff40a))


### Documentation

* NO-JIRA github doc update ([#298](https://github.com/dialpad/dialtone/issues/298)) ([99d24b3](https://github.com/dialpad/dialtone/commit/99d24b3bf8d6802afd418dfaba3290b164be6c03))

## [9.34.2](https://github.com/dialpad/dialtone/compare/dialtone/v9.34.1...dialtone/v9.34.2) (2024-05-07)


### Bug Fixes

* **Rich Text Editor:** DLT-1717 fix link overflow ([#302](https://github.com/dialpad/dialtone/issues/302)) ([999ab18](https://github.com/dialpad/dialtone/commit/999ab183005dc04258024dfc17068982e132b971))

# [9.35.0-beta.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.34.1...dialtone/v9.35.0-beta.1) (2024-05-06)


### Bug Fixes

* missing dollar sign ([b4b5fd1](https://github.com/dialpad/dialtone/commit/b4b5fd1cda3eda27449ea899efb408e57ee42c5d))
* NO-JIRA test sanitized release notes ([ee6412f](https://github.com/dialpad/dialtone/commit/ee6412f311dd65d35da99cf967c6fb4fafd7c7ee))
* remove parentheses ([0f6807b](https://github.com/dialpad/dialtone/commit/0f6807b0528d23072ceabe2db2a04e397e185836))
* remove test change ([d7a45c2](https://github.com/dialpad/dialtone/commit/d7a45c2b70c39048f8e391cd38f859d200ee4c9f))
* spacing ([3bf9f6c](https://github.com/dialpad/dialtone/commit/3bf9f6cc982fac664f69b13e004e68db28502eec))
* test change ([ffb5420](https://github.com/dialpad/dialtone/commit/ffb5420290db00190fb829486a071f5a99c69be1))
* test HTML ([61e2579](https://github.com/dialpad/dialtone/commit/61e2579441aeb5ea396a0a302e319cfa59f36643))
* try with code block ([302b802](https://github.com/dialpad/dialtone/commit/302b8021b28d561a688cb1990d976de0fa5be4da))


### Code Refactoring

* add quotes ([4125189](https://github.com/dialpad/dialtone/commit/4125189ae1ca313cc597b6353b1c38586ba46c7f))
* change release message ([f128619](https://github.com/dialpad/dialtone/commit/f128619fa3e9940d804f5ef89938eccf734a0055))
* fix indentation ([f6734d3](https://github.com/dialpad/dialtone/commit/f6734d3b3747f1b915d46d059ff7e3b06499c52e))
* fix release action ([eb733b5](https://github.com/dialpad/dialtone/commit/eb733b5f43cb46fbedaea28cb5e045d451fd8f7d))
* linter changes ([df290fe](https://github.com/dialpad/dialtone/commit/df290feaf001c8732ed17f8939348174dbe63f7b))
* scape quotes ([786f3cd](https://github.com/dialpad/dialtone/commit/786f3cd1829b75be83210fe2ce1bc61d2e2d9f5f))
* test release ([971bd9b](https://github.com/dialpad/dialtone/commit/971bd9bc40cc05e39b3c4ef14213cbef647e8992))


### Features

* test release ([7a07314](https://github.com/dialpad/dialtone/commit/7a07314ec402a18b0cbc603f516c9245d0753112))

## [9.34.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.34.0...dialtone/v9.34.1) (2024-05-06)


### Bug Fixes

* **Message Input:** DLT-1711 focus message input on emoji select ([#297](https://github.com/dialpad/dialtone/issues/297)) ([724acd5](https://github.com/dialpad/dialtone/commit/724acd51e8b7e35eaf60f1ec493c4111dcb94e78))
* **Tooltip:** DLT-1747 tooltip staying open over overlay ([#299](https://github.com/dialpad/dialtone/issues/299)) ([3233c11](https://github.com/dialpad/dialtone/commit/3233c11a000b6088fc62095354d46f49c778aef9))

# [9.34.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.33.0...dialtone/v9.34.0) (2024-05-02)


### Documentation

* **Lists:** NO-JIRA clarify list css utilities ([#293](https://github.com/dialpad/dialtone/issues/293)) ([0f09daf](https://github.com/dialpad/dialtone/commit/0f09daf2be403408648045b03ab24daea12a9097))


### Features

* DLT-1682 add channel-api icon ([#279](https://github.com/dialpad/dialtone/issues/279)) ([d909531](https://github.com/dialpad/dialtone/commit/d9095311e878dc03b19f5f02375790b6bd038743))

# [9.33.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.32.0...dialtone/v9.33.0) (2024-04-30)


### Bug Fixes

* DLT-1738 phone number regex lookahead ([#292](https://github.com/dialpad/dialtone/issues/292)) ([3100dfe](https://github.com/dialpad/dialtone/commit/3100dfeb9d306d3d32822f0c773663179bd9afc3))


### Features

* DLT-1651 message input parse suggestion ([#287](https://github.com/dialpad/dialtone/issues/287)) ([9c674c6](https://github.com/dialpad/dialtone/commit/9c674c63e7b7aa6367c5008883497fc4ef2e79c4))
* **Rich Text Editor:** DLT-1598 add slash commands suggestions ([#284](https://github.com/dialpad/dialtone/issues/284)) ([3e39932](https://github.com/dialpad/dialtone/commit/3e399328238cd37822adc47a374d67028826cde8))

# [9.32.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.31.1...dialtone/v9.32.0) (2024-04-26)


### Bug Fixes

* NO-JIRA icons build process ([#288](https://github.com/dialpad/dialtone/issues/288)) ([5761af1](https://github.com/dialpad/dialtone/commit/5761af1a665699d4e96a1328e36c265fca1fb6f6))
* NO-JIRA move peer dependencies to dependencies. ([#289](https://github.com/dialpad/dialtone/issues/289)) ([daf8436](https://github.com/dialpad/dialtone/commit/daf84369bb8ee39f6220d2ccaac6676fe1d433e6))


### Features

* DLT-1732 add scan-file icon ([#285](https://github.com/dialpad/dialtone/issues/285)) ([a32bb03](https://github.com/dialpad/dialtone/commit/a32bb03a6d76c43f145caf137db02e9587d615d0))
* **Dt Notice:** DLT-1671 add support for truncating text ([#281](https://github.com/dialpad/dialtone/issues/281)) ([a0ab1be](https://github.com/dialpad/dialtone/commit/a0ab1be9b28d829f20bd2a2c7ef6b6f35756e1c4))

## [9.31.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.31.0...dialtone/v9.31.1) (2024-04-22)


### Bug Fixes

* NO-JIRA keywords ([5200cef](https://github.com/dialpad/dialtone/commit/5200cef7d49b14469eb5994f23aa12d158f7187a))

# [9.31.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.30.1...dialtone/v9.31.0) (2024-04-22)


### Bug Fixes

* **Message Input:** DLT-1714 limit file type on image picker ([#274](https://github.com/dialpad/dialtone/issues/274)) ([63e82c6](https://github.com/dialpad/dialtone/commit/63e82c68a2fd3d8294db293285dce2b11a821b8d))
* **Popover:** DP-96422 fix undefined on queryselector popover ([#275](https://github.com/dialpad/dialtone/issues/275)) ([2de9f95](https://github.com/dialpad/dialtone/commit/2de9f955000eb435bf4d5dbd3faf2f3a5c79dde4))


### Documentation

* DLT-1502 add token categorization ([#257](https://github.com/dialpad/dialtone/issues/257)) ([94631ff](https://github.com/dialpad/dialtone/commit/94631ff2da49edd79ae49b04095f03ce37ae7737))
* DLT-1698 add tokens page sidebar ([#269](https://github.com/dialpad/dialtone/issues/269)) ([56459d4](https://github.com/dialpad/dialtone/commit/56459d4d700908c97518fd498cc45a26247ab3a8))
* **Tokens:** DLT-1634 add description below ([#273](https://github.com/dialpad/dialtone/issues/273)) ([b51a97b](https://github.com/dialpad/dialtone/commit/b51a97b980d6829bf9c72e2d62f638514d480eca))
* **Tokens:** DLT-1637 add copy button on hover ([#271](https://github.com/dialpad/dialtone/issues/271)) ([ae60e1e](https://github.com/dialpad/dialtone/commit/ae60e1e625383f1261b66773ca23bf093c037e69))


### Features

* DLT-1700 add an emojiGiphyPicker slot ([#277](https://github.com/dialpad/dialtone/issues/277)) ([b607311](https://github.com/dialpad/dialtone/commit/b60731132b82820fd288663b75f0205260eed339))
* DLT-1718 add pdf-file icon ([#276](https://github.com/dialpad/dialtone/issues/276)) ([0e36bdf](https://github.com/dialpad/dialtone/commit/0e36bdf0b2ab6a1b557e10dcab9ede87645801f1))
* DLT-1721 add icon whastapp-outline ([#280](https://github.com/dialpad/dialtone/issues/280)) ([c3ba8dd](https://github.com/dialpad/dialtone/commit/c3ba8dd0d7911aa5a74348d2f7211d0d9b937cb9))
* **Rich Text Editor:** DLT-1601 add channel suggestions ([#270](https://github.com/dialpad/dialtone/issues/270)) ([d3cad61](https://github.com/dialpad/dialtone/commit/d3cad613f94b31549d3ebbdcf47fe4980a99fd16))

## [9.30.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.30.0...dialtone/v9.30.1) (2024-04-12)


### Bug Fixes

* **Combobox:** NO-JIRA remove bad validation ([#267](https://github.com/dialpad/dialtone/issues/267)) ([15900ec](https://github.com/dialpad/dialtone/commit/15900ece27fe565296b1e9c756fc1c1eb4c6608d))
* **Emoji:** NO-JIRA alignment in vue 3 ([#268](https://github.com/dialpad/dialtone/issues/268)) ([99a5c34](https://github.com/dialpad/dialtone/commit/99a5c3433b3e4961d41bef379f1bb61bfbef81e7))

# [9.30.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.29.1...dialtone/v9.30.0) (2024-04-12)


### Bug Fixes

* NO-JIRA add index.js to dialtone-emojis exports ([#265](https://github.com/dialpad/dialtone/issues/265)) ([df69ee5](https://github.com/dialpad/dialtone/commit/df69ee5b151a92ee567086e19356be00b9dcc93d))
* NO-JIRA update exports and peerDependencies ([#266](https://github.com/dialpad/dialtone/issues/266)) ([9a43203](https://github.com/dialpad/dialtone/commit/9a43203eb2b4a457543797c822a16d98daf334a4))


### Documentation

* DLT-1576 use CodeExampleTabs from Link to Pagination ([#261](https://github.com/dialpad/dialtone/issues/261)) ([21b1ef4](https://github.com/dialpad/dialtone/commit/21b1ef4262244210d1e9a1d10b0a0aecf338d09a))


### Features

* DLT-1627 adding new tokens for expressive mode ([#214](https://github.com/dialpad/dialtone/issues/214)) ([90f304f](https://github.com/dialpad/dialtone/commit/90f304feb933d23535cb7c891839c18646d63836))

## [9.29.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.29.0...dialtone/v9.29.1) (2024-04-11)


### Bug Fixes

* NO-JIRA add cjs support for dialtone-emojis ([#264](https://github.com/dialpad/dialtone/issues/264)) ([100cf5c](https://github.com/dialpad/dialtone/commit/100cf5cfc58b6416c86bbe4d8c19a157052b046a))
* NO-JIRA add types to vue3/* export ([2e770d1](https://github.com/dialpad/dialtone/commit/2e770d17e6e43b5fcc08fe896505a9f07b051c5e))

# [9.29.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.28.0...dialtone/v9.29.0) (2024-04-11)


### Bug Fixes

* NO-JIRA library not working ([#262](https://github.com/dialpad/dialtone/issues/262)) ([745ce50](https://github.com/dialpad/dialtone/commit/745ce5081d79f8d5a2fa448594604ce6b8d52fc2))
* NO-JIRA remove circle button class when its not an icon ([#258](https://github.com/dialpad/dialtone/issues/258)) ([c24b46b](https://github.com/dialpad/dialtone/commit/c24b46b7cdc3b996f024797485d2bfd0a503a62a))


### Documentation

* NO-JIRA fix unresolved directives ([#260](https://github.com/dialpad/dialtone/issues/260)) ([7a98138](https://github.com/dialpad/dialtone/commit/7a98138f94db531f4ff348854d75a1ce6c791a08))


### Features

* DLT-1680 add ability to enable/disable extensions ([#256](https://github.com/dialpad/dialtone/issues/256)) ([75d167a](https://github.com/dialpad/dialtone/commit/75d167ae38958608b32e6c7bcc77834eff2fa962))

# [9.28.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.27.1...dialtone/v9.28.0) (2024-04-09)


### Bug Fixes

* NO-JIRA add @tiptap/vue-3 as optional ([#254](https://github.com/dialpad/dialtone/issues/254)) ([ea4ee43](https://github.com/dialpad/dialtone/commit/ea4ee43419080b0a2a5283c0e152290418f51942))


### Features

* DLT-1205 update joypixels to 8.0 ([#251](https://github.com/dialpad/dialtone/issues/251)) ([59a96a4](https://github.com/dialpad/dialtone/commit/59a96a4b5683566d499661efdeee03c7d865aff1))
* DLT-1678 build all themes ([#253](https://github.com/dialpad/dialtone/issues/253)) ([fe9c373](https://github.com/dialpad/dialtone/commit/fe9c373212f74a56afac3c7e9efe0d15bdeb7a7b))
* NO-JIRA add tokens and remove eslint/stylelint plugins ([#255](https://github.com/dialpad/dialtone/issues/255)) ([58dfe4d](https://github.com/dialpad/dialtone/commit/58dfe4d75acdc1b206f8a74a3f7d5a43a7a755d2))

## [9.27.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.27.0...dialtone/v9.27.1) (2024-04-07)


### Bug Fixes

* NO-JIRA optional peer dependencies ([7b2e051](https://github.com/dialpad/dialtone/commit/7b2e0511421b1c9dd92e54e4543ebe623513a6ef))

# [9.27.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.26.0...dialtone/v9.27.0) (2024-04-07)


### Bug Fixes

* **Contact Row:** DP-95121 remove attrs from emoji wrapper ([#249](https://github.com/dialpad/dialtone/issues/249)) ([99069ba](https://github.com/dialpad/dialtone/commit/99069babfc3f9a744d4c74084d2dd911905b62ec))
* **Emoji Row:** NO-JIRA set reaction-number line-height to 1 ([#247](https://github.com/dialpad/dialtone/issues/247)) ([abce280](https://github.com/dialpad/dialtone/commit/abce28024494994b78f50092e75de1841c317a08))
* **Input:** DLT-1646 scrollbar overlapping border ([#250](https://github.com/dialpad/dialtone/issues/250)) ([0cfe5b3](https://github.com/dialpad/dialtone/commit/0cfe5b3ef41a4d70e36572c123dbd0aeaa9e567e))
* NO-JIRA dialtone-vue peer dependencies ([#243](https://github.com/dialpad/dialtone/issues/243)) ([1ff3d1f](https://github.com/dialpad/dialtone/commit/1ff3d1f38ecb4bf4f74ce9ee5884bb3168a5aba5))
* **Suggestion List:** DP-85976 change suggestion list placement ([#246](https://github.com/dialpad/dialtone/issues/246)) ([45cffa5](https://github.com/dialpad/dialtone/commit/45cffa55b755e2abc7ac2c30638c36cfb8865937))


### Features

* **Focus Ring:** NO-JIRA reduce focus ring size ([#244](https://github.com/dialpad/dialtone/issues/244)) ([e24d0aa](https://github.com/dialpad/dialtone/commit/e24d0aabdbc87f8ff0e4e41bb42ef7f4b4d33a78))

# [9.26.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.25.0...dialtone/v9.26.0) (2024-03-28)


### Bug Fixes

* **Editor:** DLT-1593 add quick replies icon to editor ([#225](https://github.com/dialpad/dialtone/issues/225)) ([f4a495f](https://github.com/dialpad/dialtone/commit/f4a495fe1c7f79baa34def6a515e09145e98eacf))
* **Emoji Row:** DLT-1677 correct emoji reaction size ([#241](https://github.com/dialpad/dialtone/issues/241)) ([4f8a539](https://github.com/dialpad/dialtone/commit/4f8a539e2c4eb2ba5c40610b409c77ff358d3a10))
* **Typography:** DLT-1676 add font-smoothing ([#240](https://github.com/dialpad/dialtone/issues/240)) ([366c974](https://github.com/dialpad/dialtone/commit/366c9741db7291ca333243636a06e694de6d52b2))


### Documentation

* DLT-1500 dynamic theme setting ([#237](https://github.com/dialpad/dialtone/issues/237)) ([de13626](https://github.com/dialpad/dialtone/commit/de136268bb38f91e5d64c8c65882bf342ba7617a))
* DLT-1574 use CodeExampleTabs from Datepicker to Emoji text wrapper ([#231](https://github.com/dialpad/dialtone/issues/231)) ([fd0d6d8](https://github.com/dialpad/dialtone/commit/fd0d6d8bb2399b23ff910341037a9d61f4e4b195))


### Features

* NO-JIRA output / use sourcemaps in our packages / apps ([#242](https://github.com/dialpad/dialtone/issues/242)) ([eacdc17](https://github.com/dialpad/dialtone/commit/eacdc1713d985fe33ef71559a6d3ddc4b9c277a0))
* **Suggestions:** DLT-1673 select suggestion with Tab ([#239](https://github.com/dialpad/dialtone/issues/239)) ([ac00c23](https://github.com/dialpad/dialtone/commit/ac00c235f9cfc5fb266d758c795887b6975e7493))

# [9.25.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.24.0...dialtone/v9.25.0) (2024-03-26)


### Bug Fixes

* **Message Input:** DLT-1672 allow spaces in mention suggestions ([#236](https://github.com/dialpad/dialtone/issues/236)) ([ca796d9](https://github.com/dialpad/dialtone/commit/ca796d960738b5cc837879edeb08ff35174ccf58))
* **Message Input:** send complete files on add media ([#230](https://github.com/dialpad/dialtone/issues/230)) ([15c609f](https://github.com/dialpad/dialtone/commit/15c609fe5b66bc6ed71d42514feaf517f467b0bb))
* **Message Input:** update mention suggestions rendering ([#229](https://github.com/dialpad/dialtone/issues/229)) ([5535e1f](https://github.com/dialpad/dialtone/commit/5535e1fac39f9b20398b03442645986760e36ac2))
* NO-JIRA release not working with new commit convention ([#235](https://github.com/dialpad/dialtone/issues/235)) ([28ff27c](https://github.com/dialpad/dialtone/commit/28ff27cffac5e751eaf8496b7c716710a0153a61))
* rich text editor warning/error cleanup ([#227](https://github.com/dialpad/dialtone/issues/227)) ([a60badb](https://github.com/dialpad/dialtone/commit/a60badba71b6ca93a8d9721875e0f3e6576f3479))


### Documentation

* DLT-1575 use CodeExampleTabs from Icon to Lazy show ([#232](https://github.com/dialpad/dialtone/issues/232)) ([57f0b98](https://github.com/dialpad/dialtone/commit/57f0b98224cf2b578004b13cd02cadab1680c1f2))
* NO-JIRA fix example in blog post ([#234](https://github.com/dialpad/dialtone/issues/234)) ([bb7b28d](https://github.com/dialpad/dialtone/commit/bb7b28d23f2b392d87325a7f88ef7198ec45474b))


### Features

* **Message Input:** DLT-1665 add paste event ([#233](https://github.com/dialpad/dialtone/issues/233)) ([d35bf6e](https://github.com/dialpad/dialtone/commit/d35bf6e84dd46c7bd0f56195d5fad448be1912ba))

# [9.24.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.23.0...dialtone/v9.24.0) (2024-03-22)


### Bug Fixes

* **Emoji:** dlt-1650 pad emoji unicode string with 0's ([#219](https://github.com/dialpad/dialtone/issues/219)) ([1eb4906](https://github.com/dialpad/dialtone/commit/1eb4906894537ed7ace2d9cad2de0513ff15a7cb))
* warn console error cleanup ([#221](https://github.com/dialpad/dialtone/issues/221)) ([65bb319](https://github.com/dialpad/dialtone/commit/65bb31983f74feed2e6d4d03581be58e3631b458))


### Documentation

* add tokens keywords ([#220](https://github.com/dialpad/dialtone/issues/220)) ([20125f4](https://github.com/dialpad/dialtone/commit/20125f421352fe2ccef2f092bb16c4a279d76b31))
* fix search for tokens ([#218](https://github.com/dialpad/dialtone/issues/218)) ([ff46724](https://github.com/dialpad/dialtone/commit/ff46724983c3b720fc6f48e71cbda88795e048f5))


### Features

* added new headset icon and update listed icons ([#224](https://github.com/dialpad/dialtone/issues/224)) ([c1373ec](https://github.com/dialpad/dialtone/commit/c1373ecb15492c7d20f7c2453b3def39457408e2))
* adding new blog for Types update ([#222](https://github.com/dialpad/dialtone/issues/222)) ([73b40f3](https://github.com/dialpad/dialtone/commit/73b40f30a4c2fd3ed26b213ebdcfce7d37ee2e62))

# [9.23.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.22.1...dialtone/v9.23.0) (2024-03-20)


### Bug Fixes

* **Emoji Picker:** set correct search icon size ([#217](https://github.com/dialpad/dialtone/issues/217)) ([8d81675](https://github.com/dialpad/dialtone/commit/8d816752e1011b571c8912be4391de17382a9deb))
* use mixin property to detect mixin ([#215](https://github.com/dialpad/dialtone/issues/215)) ([493f58e](https://github.com/dialpad/dialtone/commit/493f58ef37ea14392bfee0fabc7c0cf8fa524d2a))


### Features

* **General Row:** add home icon ([#213](https://github.com/dialpad/dialtone/issues/213)) ([fba9ccd](https://github.com/dialpad/dialtone/commit/fba9ccdf96b42efc9515baa9639377ed24b523c5))

## [9.22.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.22.0...dialtone/v9.22.1) (2024-03-18)


### Bug Fixes

* **Tokens:** fix android tokens package name ([538a09d](https://github.com/dialpad/dialtone/commit/538a09de08883f7707086e6c541a1cd3672e18ca))
* **Typography:** added uppercase to eyebrow headline style ([#212](https://github.com/dialpad/dialtone/issues/212)) ([7b741b2](https://github.com/dialpad/dialtone/commit/7b741b25501d1277d18965878cc95bfc072724a0))

# [9.22.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.21.1...dialtone/v9.22.0) (2024-03-15)


### Bug Fixes

* **Feed Item Row:** make image / video class ([#210](https://github.com/dialpad/dialtone/issues/210)) ([d660ef4](https://github.com/dialpad/dialtone/commit/d660ef4abc672cd79f6e2ce1428dfa568b3d57ec))
* **Message Input:** remove condition for disabled send ([#207](https://github.com/dialpad/dialtone/issues/207)) ([432fc85](https://github.com/dialpad/dialtone/commit/432fc85b4abc0651506337e5dfe1523984201838))
* tooltip directive on vue3 ([#209](https://github.com/dialpad/dialtone/issues/209)) ([65b665d](https://github.com/dialpad/dialtone/commit/65b665df8e0886b7fcb469418801558531ecbc31))


### Documentation

* add composition tokens tooltips ([#205](https://github.com/dialpad/dialtone/issues/205)) ([744452c](https://github.com/dialpad/dialtone/commit/744452cb6516adf3d3b9c2f50ac61b8c049b4d00))


### Features

* **Icons:** update icon to use design token ([#211](https://github.com/dialpad/dialtone/issues/211)) ([fb6688d](https://github.com/dialpad/dialtone/commit/fb6688d96fdc8b24362ef78faed6656ffd807983))

## [9.21.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.21.0...dialtone/v9.21.1) (2024-03-14)


### Bug Fixes

* add box-sizing, padding, margin to reset ([#206](https://github.com/dialpad/dialtone/issues/206)) ([5641b56](https://github.com/dialpad/dialtone/commit/5641b5691d9be82f256eaf5ba9a04fac1e9252c3))
* fix styling of d-link--mention ([#208](https://github.com/dialpad/dialtone/issues/208)) ([f99b37e](https://github.com/dialpad/dialtone/commit/f99b37edc952b3fb98686be86086b03641346f82))

# [9.21.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.20.0...dialtone/v9.21.0) (2024-03-14)


### Bug Fixes

* **Tooltip:** appendTo initialization ([#204](https://github.com/dialpad/dialtone/issues/204)) ([3f9d2ed](https://github.com/dialpad/dialtone/commit/3f9d2ed558fffc1fdb6d76b2827531b2dfdd5c4a))
* update missing props ([#199](https://github.com/dialpad/dialtone/issues/199)) ([64af482](https://github.com/dialpad/dialtone/commit/64af482fd8928b67fb924c446c75dbbf66547921))


### Documentation

* add search to tokens page ([#188](https://github.com/dialpad/dialtone/issues/188)) ([db63a8e](https://github.com/dialpad/dialtone/commit/db63a8efdf20e200b7f9fae3c1812086ff4cdabf))


### Features

* **Typography:** refactor text styles ([#198](https://github.com/dialpad/dialtone/issues/198)) ([622c0f6](https://github.com/dialpad/dialtone/commit/622c0f65611010215b94624ccff6e82f62b32056))

# [9.20.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.19.0...dialtone/v9.20.0) (2024-03-13)


### Bug Fixes

* avatar validation ([#203](https://github.com/dialpad/dialtone/issues/203)) ([37925ab](https://github.com/dialpad/dialtone/commit/37925ab1c483b12748f8c9dde0e22840365c4a6f))
* message input select media ([#201](https://github.com/dialpad/dialtone/issues/201)) ([dbb3d61](https://github.com/dialpad/dialtone/commit/dbb3d61d216dd3d82a74bec45847ca3ff8b9899c))


### Documentation

* use CodeExampleTabs from card to combobox ([#192](https://github.com/dialpad/dialtone/issues/192)) ([10e1e50](https://github.com/dialpad/dialtone/commit/10e1e509f80fa2568406ae2bd3d34bd99bd76a2b))


### Features

* **Feed Item Row:** add attachment slot ([#202](https://github.com/dialpad/dialtone/issues/202)) ([417c305](https://github.com/dialpad/dialtone/commit/417c30554977917f5d1329f5e06e40c8f55baf37))

# [9.19.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.18.0...dialtone/v9.19.0) (2024-03-09)


### Bug Fixes

* **List Item:** add menuitem as valid role ([#197](https://github.com/dialpad/dialtone/issues/197)) ([826ea78](https://github.com/dialpad/dialtone/commit/826ea786b3edf2a6b52cf589e4bd8280816080e5))


### Features

* add description from figma tokens ([#194](https://github.com/dialpad/dialtone/issues/194)) ([1fe992e](https://github.com/dialpad/dialtone/commit/1fe992e24b2557a1c450cd4fe535d5e7bf11a49e))
* **Tooltip:** add appendTo prop ([#195](https://github.com/dialpad/dialtone/issues/195)) ([76f2b11](https://github.com/dialpad/dialtone/commit/76f2b11b056782c694ea592c5344019abeda4159))

# [9.18.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.17.0...dialtone/v9.18.0) (2024-03-07)


### Bug Fixes

* message input issues ([#190](https://github.com/dialpad/dialtone/issues/190)) ([caa07b6](https://github.com/dialpad/dialtone/commit/caa07b6e9e167094a5e91f5cd8499201194823f0))
* remove markRaw ([#191](https://github.com/dialpad/dialtone/issues/191)) ([74884e2](https://github.com/dialpad/dialtone/commit/74884e2284bdeeb0e824a58b44377e6248d27fdc))


### Documentation

* use CodeExampleTabs from badge to button-group ([#185](https://github.com/dialpad/dialtone/issues/185)) ([808015b](https://github.com/dialpad/dialtone/commit/808015b5662379695f7c8b1ea9f787357d8c4c22))


### Features

* **Editor:** add quick replies icon to editor ([#193](https://github.com/dialpad/dialtone/issues/193)) ([7a6829f](https://github.com/dialpad/dialtone/commit/7a6829faab0d29498d2184b486c49efc03e7d8bb))

# [9.17.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.16.0...dialtone/v9.17.0) (2024-03-07)


### Features

* dialtone stylelint plugin - no mixins rule ([#186](https://github.com/dialpad/dialtone/issues/186)) ([8fe0ffb](https://github.com/dialpad/dialtone/commit/8fe0ffb7f4dd81cbf19e6cbbe37b16ca609973cd))

# [9.16.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.15.2...dialtone/v9.16.0) (2024-03-06)


### Bug Fixes

* lower aggression of feed-item-row deep selector ([#189](https://github.com/dialpad/dialtone/issues/189)) ([de20342](https://github.com/dialpad/dialtone/commit/de20342dc0e831f64c704d84786e293423fbb02d))


### Features

* **Emoji Row, Time Pill:** feed time pill and emoji style updates ([#187](https://github.com/dialpad/dialtone/issues/187)) ([cd39cbb](https://github.com/dialpad/dialtone/commit/cd39cbb26db054810ee2b8ed42b610157ba90ca1))

## [9.15.2](https://github.com/dialpad/dialtone/compare/dialtone/v9.15.1...dialtone/v9.15.2) (2024-03-05)


### Bug Fixes

* avatar image alt repeated ([#181](https://github.com/dialpad/dialtone/issues/181)) ([d0177be](https://github.com/dialpad/dialtone/commit/d0177be3366a8258a9890f71e090a4021fe3f98c))
* **Feed Item Row:** accessibility error ([#183](https://github.com/dialpad/dialtone/issues/183)) ([036176c](https://github.com/dialpad/dialtone/commit/036176cd7de3cc65cf3ff4ed7ab8cbd768148db6))
* long dt chip ([#179](https://github.com/dialpad/dialtone/issues/179)) ([08c68aa](https://github.com/dialpad/dialtone/commit/08c68aae1f5f68f47cdad7239e748a06ee4e6ad9))
* **Message Input:** color contrast on cancel button ([#182](https://github.com/dialpad/dialtone/issues/182)) ([535733d](https://github.com/dialpad/dialtone/commit/535733d1504e545406d71efdc85e9550e3ccea5a))
* **Root Layout:** focus ring on scrollable regions ([#180](https://github.com/dialpad/dialtone/issues/180)) ([52b8e27](https://github.com/dialpad/dialtone/commit/52b8e2739859ad8f45bc9bead436718d840c0a5d))


### Documentation

* add all token categories in a single page ([#176](https://github.com/dialpad/dialtone/issues/176)) ([b225e03](https://github.com/dialpad/dialtone/commit/b225e0366660e0ec722ecca77b676e3a70f46cc8))
* remove leftover from code-example-tabs component ([#184](https://github.com/dialpad/dialtone/issues/184)) ([7f91483](https://github.com/dialpad/dialtone/commit/7f91483885a29fa8a799ab99ceff09640a775386))

## [9.15.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.15.0...dialtone/v9.15.1) (2024-02-28)


### Bug Fixes

* popover error ([#178](https://github.com/dialpad/dialtone/issues/178)) ([daebcb6](https://github.com/dialpad/dialtone/commit/daebcb675f1cb7d1b878d7950a492d6ca8be616a))


### Documentation

* fix typo in link ([b695463](https://github.com/dialpad/dialtone/commit/b695463258d3ca1f4cf66822552317a126d28ed9))
* use CodeExampleTabs component for avatar page ([#170](https://github.com/dialpad/dialtone/issues/170)) ([b4e0ad9](https://github.com/dialpad/dialtone/commit/b4e0ad9bc105eceff518052848072e4004f84029))

# [9.15.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.14.3...dialtone/v9.15.0) (2024-02-27)


### Bug Fixes

* **Contact Info:** use item layout instead of list item ([#168](https://github.com/dialpad/dialtone/issues/168)) ([d66cd07](https://github.com/dialpad/dialtone/commit/d66cd07c45a50c1f04b281e50132c57e866cf3aa))
* **Popover:** remove data-popper-escaped ([#172](https://github.com/dialpad/dialtone/issues/172)) ([ca142bc](https://github.com/dialpad/dialtone/commit/ca142bc56bb893282a8974793e9045d378848c9d))
* **Tooltip:** remove validators from directive ([#169](https://github.com/dialpad/dialtone/issues/169)) ([7984139](https://github.com/dialpad/dialtone/commit/7984139493b2c440ee51435aef49abbdbbc01017))


### Documentation

* aside overflow behavior ([#167](https://github.com/dialpad/dialtone/issues/167)) ([c580bf2](https://github.com/dialpad/dialtone/commit/c580bf2c2260392ca929be34960bbc4416bb7902))
* fixed links on design section ([#173](https://github.com/dialpad/dialtone/issues/173)) ([d028498](https://github.com/dialpad/dialtone/commit/d02849887e29c7afe993cecca3f29239ddb2d5fc))


### Features

* added new dialpad ai reversed icons ([#171](https://github.com/dialpad/dialtone/issues/171)) ([9a800bd](https://github.com/dialpad/dialtone/commit/9a800bde880508ee4d48fadbd2af4d6ed25b0139))
* **Item Layout:** add unstyled prop ([#160](https://github.com/dialpad/dialtone/issues/160)) ([907b7ae](https://github.com/dialpad/dialtone/commit/907b7ae40b0480dadff2ec170d5c29577a7d3791))
* **Message Input:** add mentions to message input ([#174](https://github.com/dialpad/dialtone/issues/174)) ([682dc42](https://github.com/dialpad/dialtone/commit/682dc42feef687a370cae3cb250ec95b3f0f781e))
* transform Figma variables to sd format ([#154](https://github.com/dialpad/dialtone/issues/154)) ([3cb3581](https://github.com/dialpad/dialtone/commit/3cb3581dcbd87ada48e76032094c38faf07a663a))

## [9.14.3](https://github.com/dialpad/dialtone/compare/dialtone/v9.14.2...dialtone/v9.14.3) (2024-02-22)


### Bug Fixes

* **Feed Item Row:** left line height ([#166](https://github.com/dialpad/dialtone/issues/166)) ([2e3b569](https://github.com/dialpad/dialtone/commit/2e3b569de8d79d2b8f27b8e9e2b0d1bf7a3cbe8c))

## [9.14.2](https://github.com/dialpad/dialtone/compare/dialtone/v9.14.1...dialtone/v9.14.2) (2024-02-21)


### Bug Fixes

* **Popover:** reading from undefined ref ([#165](https://github.com/dialpad/dialtone/issues/165)) ([2772e04](https://github.com/dialpad/dialtone/commit/2772e04c9b7a07025bb37d8c4a17596d59abdf88))
* tooltip directive reactive ([#164](https://github.com/dialpad/dialtone/issues/164)) ([3caf8b1](https://github.com/dialpad/dialtone/commit/3caf8b1db0c7ea757b70cf48af4426bc9a4f9ef5))
* tooltip misplaced ([#162](https://github.com/dialpad/dialtone/issues/162)) ([da3a2d1](https://github.com/dialpad/dialtone/commit/da3a2d15fa9e7837a0b0eec8721a92270beb16d3))

## [9.14.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.14.0...dialtone/v9.14.1) (2024-02-19)


### Bug Fixes

* add dependsOn to publish ([34ba916](https://github.com/dialpad/dialtone/commit/34ba916123c45f638742f8b8341a58b7f9123182))

# [9.14.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.13.4...dialtone/v9.14.0) (2024-02-16)


### Bug Fixes

* dist exports ([#159](https://github.com/dialpad/dialtone/issues/159)) ([dbdc525](https://github.com/dialpad/dialtone/commit/dbdc525b7778d29e764b6d250ccd34e9d2aa2026))


### Features

* **Icons:** thumbs up and down filled icons ([#157](https://github.com/dialpad/dialtone/issues/157)) ([da4a006](https://github.com/dialpad/dialtone/commit/da4a006539f37f147d15623758d50ee79843d940))
* universal dialtone-icons ([#145](https://github.com/dialpad/dialtone/issues/145)) ([b5dcaef](https://github.com/dialpad/dialtone/commit/b5dcaefafd32f448803a91161527642806b21d3e))

## [9.13.4](https://github.com/dialpad/dialtone/compare/dialtone/v9.13.3...dialtone/v9.13.4) (2024-02-14)


### Bug Fixes

* **Emoji Row:** tooltip position when content changes ([#156](https://github.com/dialpad/dialtone/issues/156)) ([ce6c452](https://github.com/dialpad/dialtone/commit/ce6c4528b7b60a894695d4087d044222069db291))

## [9.13.3](https://github.com/dialpad/dialtone/compare/dialtone/v9.13.2...dialtone/v9.13.3) (2024-02-14)


### Bug Fixes

* font path issue ([59aad42](https://github.com/dialpad/dialtone/commit/59aad427b6b220244a6fef5560f757fbd9335577))

## [9.13.2](https://github.com/dialpad/dialtone/compare/dialtone/v9.13.1...dialtone/v9.13.2) (2024-02-13)


### Bug Fixes

* android repository ref ([dc47df4](https://github.com/dialpad/dialtone/commit/dc47df4e7d44e4fa4f8d2a18bca6ff457d1dbe02))


### Documentation

* **Typography:** remove deprecated d-headline classes ([#155](https://github.com/dialpad/dialtone/issues/155)) ([e2ae9c2](https://github.com/dialpad/dialtone/commit/e2ae9c206e6d215346d319aec567cf21b50a67f1))

## [9.13.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.13.0...dialtone/v9.13.1) (2024-02-13)


### Bug Fixes

* attempt fix of android release ([dab49e9](https://github.com/dialpad/dialtone/commit/dab49e943a9fd115242cdade41f93982b1a74937))

# [9.13.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.12.0...dialtone/v9.13.0) (2024-02-13)


### Bug Fixes

* **Emoji:** skeleton display issue ([#150](https://github.com/dialpad/dialtone/issues/150)) ([5ccf8ca](https://github.com/dialpad/dialtone/commit/5ccf8cacb4d409a92bba700f4f42b68256a6e6c5))
* extra quotes on font tokens ([#151](https://github.com/dialpad/dialtone/issues/151)) ([ec96822](https://github.com/dialpad/dialtone/commit/ec96822c633dd52b2b544d500de77cc3097f6edb))
* **Feed Item Row:** change typography to compact ([#149](https://github.com/dialpad/dialtone/issues/149)) ([47f4a45](https://github.com/dialpad/dialtone/commit/47f4a45300d41bf29e3032311d7ea4a20062ea35))
* load archivo font ([#152](https://github.com/dialpad/dialtone/issues/152)) ([3147749](https://github.com/dialpad/dialtone/commit/3147749fdd9f21387942ed4d00f5856230bd18f1))
* rich editor improvements ([#142](https://github.com/dialpad/dialtone/issues/142)) ([a776d47](https://github.com/dialpad/dialtone/commit/a776d477b7b8c5e8b7b668427d640f6a7f3c0b6d))


### Documentation

* **Typography:** design language ([#75](https://github.com/dialpad/dialtone/issues/75)) ([6d6ecd5](https://github.com/dialpad/dialtone/commit/6d6ecd500bd42527239ae29721c57104f230632f))


### Features

* new icon user speak ([#147](https://github.com/dialpad/dialtone/issues/147)) ([b8a9ac9](https://github.com/dialpad/dialtone/commit/b8a9ac9477bbdb3c3e76e0bf5648c6abac37e151))
* text decoration scopes ([#148](https://github.com/dialpad/dialtone/issues/148)) ([5e58ef1](https://github.com/dialpad/dialtone/commit/5e58ef156ad3f350f6c53fca01dae8a1f2eca350))

# [9.12.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.11.7...dialtone/v9.12.0) (2024-02-08)


### Bug Fixes

* **Tooltip:** revert initialization issue ([#146](https://github.com/dialpad/dialtone/issues/146)) ([002f152](https://github.com/dialpad/dialtone/commit/002f152d535bcb4d7ae9715d149a9260cd2504e1))


### Code Refactoring

* lint pr check update ([#144](https://github.com/dialpad/dialtone/issues/144)) ([fb647be](https://github.com/dialpad/dialtone/commit/fb647be29316dd0be62f38a27c909ffefa91c707))


### Features

* **Tooltip:** revert add appendTo prop to tooltip ([#132](https://github.com/dialpad/dialtone/issues/132)) ([c6cb0ec](https://github.com/dialpad/dialtone/commit/c6cb0ecf9c2787e197bb4d136022c9d92da4bf61))

## [9.11.7](https://github.com/dialpad/dialtone/compare/dialtone/v9.11.6...dialtone/v9.11.7) (2024-02-07)


### Bug Fixes

* **Tooltip:** initialization issue ([#146](https://github.com/dialpad/dialtone/issues/146)) ([d032ecd](https://github.com/dialpad/dialtone/commit/d032ecd3859ead4cd1d7b9462d60b20adfed9cb2))

## [9.11.6](https://github.com/dialpad/dialtone/compare/dialtone/v9.11.5...dialtone/v9.11.6) (2024-02-07)


### Bug Fixes

* **Tooltip:** stop showing tootip for touch based devices ([#131](https://github.com/dialpad/dialtone/issues/131)) ([0c1be19](https://github.com/dialpad/dialtone/commit/0c1be19bbc7700a917358430f7721fe65552b6c2))

## [9.11.5](https://github.com/dialpad/dialtone/compare/dialtone/v9.11.4...dialtone/v9.11.5) (2024-02-07)


### Bug Fixes

* **Emoji Row:** update emoji-row to use more semantic colors ([#143](https://github.com/dialpad/dialtone/issues/143)) ([0f7d112](https://github.com/dialpad/dialtone/commit/0f7d112a336e03a98e060ef5531da5352db69496))

## [9.11.4](https://github.com/dialpad/dialtone/compare/dialtone/v9.11.3...dialtone/v9.11.4) (2024-02-06)


### Bug Fixes

* **Emoji Text Wrapper:** emoji line-height fix ([effe163](https://github.com/dialpad/dialtone/commit/effe16387d1f6853e437b935b2d1147b1749e75e))

## [9.11.3](https://github.com/dialpad/dialtone/compare/dialtone/v9.11.2...dialtone/v9.11.3) (2024-02-06)


### Bug Fixes

* **Emoji Text Wrapper:** revert line-height issue ([3d02819](https://github.com/dialpad/dialtone/commit/3d02819ff8afa7783336ead3f137fbdb30ee1d7f))

## [9.11.2](https://github.com/dialpad/dialtone/compare/dialtone/v9.11.1...dialtone/v9.11.2) (2024-02-06)


### Bug Fixes

* **Emoji Text Wrapper:** line-height issue ([5ed7606](https://github.com/dialpad/dialtone/commit/5ed76068f76a723e688c7a926f2c118dded50a55))

## [9.11.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.11.0...dialtone/v9.11.1) (2024-02-05)


### Bug Fixes

* push new keywords.json ([f3cc041](https://github.com/dialpad/dialtone/commit/f3cc0418b7fc9a000954148cec38e521f24dcd50))

# [9.11.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.10.1...dialtone/v9.11.0) (2024-02-05)


### Bug Fixes

* **Emoji Text Wrapper:** center align emojis within text ([#136](https://github.com/dialpad/dialtone/issues/136)) ([60dca67](https://github.com/dialpad/dialtone/commit/60dca6758f39865bab2e49d474f1eb84273a558c))
* **Style:** align text decoration treatments ([#141](https://github.com/dialpad/dialtone/issues/141)) ([6baf8b2](https://github.com/dialpad/dialtone/commit/6baf8b2faecb25c162c5b67280b610da50d50054))


### Features

* add codeblock icon ([#140](https://github.com/dialpad/dialtone/issues/140)) ([371191b](https://github.com/dialpad/dialtone/commit/371191bbd4a60b9550836b305afe96ee9c2f9165))
* **Tooltip:** add appendTo prop to tooltip ([#132](https://github.com/dialpad/dialtone/issues/132)) ([47e1dc5](https://github.com/dialpad/dialtone/commit/47e1dc584eafb06cf99e9118ac68cece22473ca1))

## [9.10.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.10.0...dialtone/v9.10.1) (2024-02-01)


### Bug Fixes

* commit autogenerated keywords ([ceb4e07](https://github.com/dialpad/dialtone/commit/ceb4e07bade144c918e71efef7bc9e77a9c74b99))

# [9.10.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.9.0...dialtone/v9.10.0) (2024-02-01)


### Bug Fixes

* change padding on right slot of call pill stories ([#138](https://github.com/dialpad/dialtone/issues/138)) ([9a23a42](https://github.com/dialpad/dialtone/commit/9a23a423f3a6e2f01e2a86d5f765a3912e12fd08))
* **Feed Item Row, Emoji Row:** spacing / color fixes - Vue 3 ([#134](https://github.com/dialpad/dialtone/issues/134)) ([21f3e21](https://github.com/dialpad/dialtone/commit/21f3e213714ca322aa96dde4b4fa3aed3bd9cc62))
* **Feed Item Row:** set inset focus ring on feed item ([#139](https://github.com/dialpad/dialtone/issues/139)) ([e4e935a](https://github.com/dialpad/dialtone/commit/e4e935a35f1fab8582def30ade82d06bcab393f0))
* name of the office365-calendar icon ([#137](https://github.com/dialpad/dialtone/issues/137)) ([7c86bb0](https://github.com/dialpad/dialtone/commit/7c86bb04a21a9b3a9a7880519efbd429affa41e6))


### Features

* **Wysiwyg Editor, Rich Text Editor:** add wysiwyg component ([#113](https://github.com/dialpad/dialtone/issues/113)) ([367d3e2](https://github.com/dialpad/dialtone/commit/367d3e2aa5344d734fd725c1f7419c44107fb116))
* **Wysiwyg Editor, Rich Text Editor:** add wysiwyg component for vue3 ([#117](https://github.com/dialpad/dialtone/issues/117)) ([bc93fb8](https://github.com/dialpad/dialtone/commit/bc93fb8b4ebf2aa03ea5079dba0760d550194f69))

# [9.9.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.8.0...dialtone/v9.9.0) (2024-01-26)


### Bug Fixes

* missing exports ([#128](https://github.com/dialpad/dialtone/issues/128)) ([d44a3bb](https://github.com/dialpad/dialtone/commit/d44a3bbbf569372034cfddba0ebb8347b27dfc11))


### Documentation

* fix of the site nav in tokens ([#129](https://github.com/dialpad/dialtone/issues/129)) ([094c1e9](https://github.com/dialpad/dialtone/commit/094c1e95ee117070f50236858025bc4a97869892))


### Features

* new icon bullet ([#127](https://github.com/dialpad/dialtone/issues/127)) ([e96e6c3](https://github.com/dialpad/dialtone/commit/e96e6c303f842fa3110d0e55246d830c7d1adbc0))

# [9.8.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.7.0...dialtone/v9.8.0) (2024-01-26)


### Bug Fixes

* datepicker keyboard navigation fix vue2 only ([#124](https://github.com/dialpad/dialtone/issues/124)) ([4763a98](https://github.com/dialpad/dialtone/commit/4763a98a2d9bc244a25f0634d09725a3ba7afdba))
* **Feed Item Row, Emoji Row:** spacing / color fixes ([#126](https://github.com/dialpad/dialtone/issues/126)) ([e8b9116](https://github.com/dialpad/dialtone/commit/e8b9116370b6bd3a5d94cfd08a2b809c277c58b8))
* **Feed Item Row:** spacing and transition improvements - Vue 3 ([#111](https://github.com/dialpad/dialtone/issues/111)) ([bf18be2](https://github.com/dialpad/dialtone/commit/bf18be2ba92801ceb8d775ea5fede602e5303d6c))
* **General Row:** map digital type to laptop-2 ([#114](https://github.com/dialpad/dialtone/issues/114)) ([ee3abfa](https://github.com/dialpad/dialtone/commit/ee3abfad17e9aefb55b934e311fdbe5d5cdac2b3))
* icon 'ai-write' name update ([#125](https://github.com/dialpad/dialtone/issues/125)) ([8b47655](https://github.com/dialpad/dialtone/commit/8b47655e525389ce74d0fd06325fee7ef70ad76c))


### Documentation

* update release notes for monorepo ([#121](https://github.com/dialpad/dialtone/issues/121)) ([c810cf3](https://github.com/dialpad/dialtone/commit/c810cf320b89a9139898f562ab9aece44353aa6f))


### Features

* add summary icon ([#119](https://github.com/dialpad/dialtone/issues/119)) ([43c5b78](https://github.com/dialpad/dialtone/commit/43c5b7857812ecc541fbac2b6c4d6b731e02701c))
* added new docs for spacing in design language ([#38](https://github.com/dialpad/dialtone/issues/38)) ([bba2b60](https://github.com/dialpad/dialtone/commit/bba2b6078ada31147e90549a14504323c0d15078))
* **Badge:** updated horizontal padding ([#122](https://github.com/dialpad/dialtone/issues/122)) ([9b55973](https://github.com/dialpad/dialtone/commit/9b559736fe514647feebe6ecd04ed32dbc5c6754))
* **Icons:** added new alignment icons ([#123](https://github.com/dialpad/dialtone/issues/123)) ([23aa073](https://github.com/dialpad/dialtone/commit/23aa0730625e8b8e094f92d9be34709256e42e8f))

# [9.7.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.6.1...dialtone/v9.7.0) (2024-01-19)


### Bug Fixes

* icon dt-ai alignment adjust ([#116](https://github.com/dialpad/dialtone/issues/116)) ([5467c5c](https://github.com/dialpad/dialtone/commit/5467c5c9ceb5099dd2d03cc61b118ee192538961))
* input focus within ([#106](https://github.com/dialpad/dialtone/issues/106)) ([98aab0a](https://github.com/dialpad/dialtone/commit/98aab0ab0cf9584a9dffe72d62d3f4eb3dfeb0e2))


### Features

* datepicker full language support ([#118](https://github.com/dialpad/dialtone/issues/118)) ([988b727](https://github.com/dialpad/dialtone/commit/988b727103cfa34b0cf7cb2a26317f58d5cb5350))

## [9.6.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.6.0...dialtone/v9.6.1) (2024-01-18)


### Bug Fixes

* **Feed Item Row:** spacing and transition improvements - Vue 2 ([#109](https://github.com/dialpad/dialtone/issues/109)) ([b33a82c](https://github.com/dialpad/dialtone/commit/b33a82c68f27d0db8760e4332667fa19eacd5b24))
* Icons Update ([#110](https://github.com/dialpad/dialtone/issues/110)) ([4804d83](https://github.com/dialpad/dialtone/commit/4804d83f29cd52960fc2c9ab67f2ae37635951e0))
* **Popover:** set text color within popover dialog ([#108](https://github.com/dialpad/dialtone/issues/108)) ([9ea0fe7](https://github.com/dialpad/dialtone/commit/9ea0fe715cff346ba1bf4b35ba1772a6c998a397))


### Documentation

* added icons section in design language ([#50](https://github.com/dialpad/dialtone/issues/50)) ([fe7a0ac](https://github.com/dialpad/dialtone/commit/fe7a0ac949f57de8b755c52e99a1b92096b727fd))
* added update url with search value ([#100](https://github.com/dialpad/dialtone/issues/100)) ([174b3fc](https://github.com/dialpad/dialtone/commit/174b3fc52c2351855e5e6ac5a5bddae58d55094e))
* adjusted background on utilities examples ([#97](https://github.com/dialpad/dialtone/issues/97)) ([43cb609](https://github.com/dialpad/dialtone/commit/43cb609803588055cfdfd81fbfd9a4a5ddaf4e35))

# [9.6.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.5.0...dialtone/v9.6.0) (2024-01-16)


### Bug Fixes

* **Hovercard:** timer for vue 2 ([#103](https://github.com/dialpad/dialtone/issues/103)) ([d29c2f6](https://github.com/dialpad/dialtone/commit/d29c2f6804a72119a0da5bada45acfe34ea1784e))
* nx affected dependencies ([#104](https://github.com/dialpad/dialtone/issues/104)) ([09ea0bb](https://github.com/dialpad/dialtone/commit/09ea0bb8c9756dea12e0a03b454df7b942a6e340))


### Features

* **Datepicker:** vue2 style and keyboard navigation enhancement ([#95](https://github.com/dialpad/dialtone/issues/95)) ([2850eae](https://github.com/dialpad/dialtone/commit/2850eae8b1a54b6886fcc8c7cd0bee1f4f2c79be))

# [9.5.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.4.1...dialtone/v9.5.0) (2024-01-15)


### Bug Fixes

* **Emoji Picker:** box-sizing ([#102](https://github.com/dialpad/dialtone/issues/102)) ([98f7eb6](https://github.com/dialpad/dialtone/commit/98f7eb68e7c76db295376820d05a32d5950eb817))


### Features

* **Hovercard:** add hovercard implementation ([#72](https://github.com/dialpad/dialtone/issues/72)) ([32cc1a8](https://github.com/dialpad/dialtone/commit/32cc1a837043f5fdbf562992ad9bc83f1d2b9252))

## [9.4.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.4.0...dialtone/v9.4.1) (2024-01-13)


### Bug Fixes

* icon name validation ([b9cfcff](https://github.com/dialpad/dialtone/commit/b9cfcff6eb23e9a54bb8ee0cde36cc348dd2b606))
* inset shadow generation ([#94](https://github.com/dialpad/dialtone/issues/94)) ([32cd6b4](https://github.com/dialpad/dialtone/commit/32cd6b4bf64b44da43121c5173f41672c5254813))
* token table ([#92](https://github.com/dialpad/dialtone/issues/92)) ([2b0b58e](https://github.com/dialpad/dialtone/commit/2b0b58e4969421c0b6f58ecbfeba14d5b5d00f92))
* video-off icon issue ([#99](https://github.com/dialpad/dialtone/issues/99)) ([4ecb3c0](https://github.com/dialpad/dialtone/commit/4ecb3c0576b69f0fb31911700c1a8dfe6d3a6497))


### Documentation

* fix links starting with / ([#91](https://github.com/dialpad/dialtone/issues/91)) ([b694973](https://github.com/dialpad/dialtone/commit/b6949730abe4732b7fa614991b98f7e4911a5504))
* move contributing guide to "guides" ([#96](https://github.com/dialpad/dialtone/issues/96)) ([10f867c](https://github.com/dialpad/dialtone/commit/10f867cb0dae023c88d83bf21f15b3b445d720fd))

# [9.4.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.3.0...dialtone/v9.4.0) (2024-01-09)


### Documentation

* fix datepicker table dark mode ([#90](https://github.com/dialpad/dialtone/issues/90)) ([9ef39a9](https://github.com/dialpad/dialtone/commit/9ef39a9b5356931132af83086c24e855ecf5f1a7))


### Features

* port message input recipe ([#81](https://github.com/dialpad/dialtone/issues/81)) ([efb5732](https://github.com/dialpad/dialtone/commit/efb573246395e96c596cef548111b822dc5b032a))

# [9.3.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.2.0...dialtone/v9.3.0) (2024-01-08)


### Bug Fixes

* error in stories when component.props is undefined ([#89](https://github.com/dialpad/dialtone/issues/89)) ([1694544](https://github.com/dialpad/dialtone/commit/169454471870a62e0ebb22617c9c3b13cfbb9257))


### Documentation

* fix old dialpad.design links ([#88](https://github.com/dialpad/dialtone/issues/88)) ([2ec0a6a](https://github.com/dialpad/dialtone/commit/2ec0a6a5150cf51505ba902234061f1c31d2604c))
* fix storybook reactivity ([#85](https://github.com/dialpad/dialtone/issues/85)) ([0206c8c](https://github.com/dialpad/dialtone/commit/0206c8c2ff8b9a534cd92c7a46420bc038bff867))


### Features

* added unread and rematch icons ([bb6830a](https://github.com/dialpad/dialtone/commit/bb6830adeb18ab6bbc3726d701c191c2a91fcadf))
* port attachment carousel ([#86](https://github.com/dialpad/dialtone/issues/86)) ([a67aae2](https://github.com/dialpad/dialtone/commit/a67aae2946d4088b54d7de871a236c7baa351424))

# [9.2.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.1.1...dialtone/v9.2.0) (2024-01-04)


### Bug Fixes

* update on the Video icon to have a better  visual balance ([#80](https://github.com/dialpad/dialtone/issues/80)) ([00d448f](https://github.com/dialpad/dialtone/commit/00d448f8e049adbcc83d2a8e76199f034e2c1c79))


### Documentation

* fix broken link in blog post ([2c6b2ca](https://github.com/dialpad/dialtone/commit/2c6b2cac0c40cbed8edbbf169b26cd53370ad272))
* hide old illustrations ([#83](https://github.com/dialpad/dialtone/issues/83)) ([8cf9ddd](https://github.com/dialpad/dialtone/commit/8cf9dddd1d7430de2141927aa091902670da04f1))
* update PR template for monorepo ([#82](https://github.com/dialpad/dialtone/issues/82)) ([a940afa](https://github.com/dialpad/dialtone/commit/a940afa4caea7286709067365cb25984e283e3e5))


### Features

* port contact suggestion ([#78](https://github.com/dialpad/dialtone/issues/78)) ([c1b9e3b](https://github.com/dialpad/dialtone/commit/c1b9e3bef5088a3ad8a78e9fbd524fba15d25f46))
* port emoji suggestions ([#77](https://github.com/dialpad/dialtone/issues/77)) ([6000d7d](https://github.com/dialpad/dialtone/commit/6000d7d871b216b86c729f5512a4ab36c6657259))


### Reverts

* fix prompt-for-label if condition not running ([#84](https://github.com/dialpad/dialtone/issues/84)) ([59f186f](https://github.com/dialpad/dialtone/commit/59f186fabf13336d7a0128c0ff3e5139c936e064))
* move if condition to step ([7dd1c19](https://github.com/dialpad/dialtone/commit/7dd1c19fafa195c5668de027d587404db2cb5bea))

## [9.1.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.1.0...dialtone/v9.1.1) (2024-01-03)


### Bug Fixes

* vue2 storybook components and recipe ([#71](https://github.com/dialpad/dialtone/issues/71)) ([b66ad61](https://github.com/dialpad/dialtone/commit/b66ad612cfa0768712ce6427b806d432ad27b394))


### Documentation

* update mono-package documentation ([#73](https://github.com/dialpad/dialtone/issues/73)) ([e037c86](https://github.com/dialpad/dialtone/commit/e037c8622c414922ae6d5715b95cd4b9136dcaa1))

# [9.1.0](https://github.com/dialpad/dialtone/compare/dialtone/v9.0.3...dialtone/v9.1.0) (2023-12-21)


### Bug Fixes

* change dialtone-icons to peer ([#67](https://github.com/dialpad/dialtone/issues/67)) ([a63a606](https://github.com/dialpad/dialtone/commit/a63a60676ee744313ff40792a767f36346899917))


### Documentation

* fix multiple issues ([#70](https://github.com/dialpad/dialtone/issues/70)) ([3478dd4](https://github.com/dialpad/dialtone/commit/3478dd43d10e3b1a42a16be308306faecf5cbd9b))


### Features

* add icon sticker gif and brand giphy ([#66](https://github.com/dialpad/dialtone/issues/66)) ([6e9e4d5](https://github.com/dialpad/dialtone/commit/6e9e4d5922d8c3e187024ba0e60495f9c7d80f31))

## [9.0.3](https://github.com/dialpad/dialtone/compare/dialtone/v9.0.2...dialtone/v9.0.3) (2023-12-20)


### Bug Fixes

* missing icons ([95cfe08](https://github.com/dialpad/dialtone/commit/95cfe08f62a40ef3e202a8600ce0e631df961b64))


### Documentation

* add codespaces documentation ([#65](https://github.com/dialpad/dialtone/issues/65)) ([2b5fe65](https://github.com/dialpad/dialtone/commit/2b5fe658932aa6db1d0a1de0d5e28fb7f6af7484))

## [9.0.2](https://github.com/dialpad/dialtone/compare/dialtone/v9.0.1...dialtone/v9.0.2) (2023-12-20)


### Bug Fixes

* mono-package release ([367db43](https://github.com/dialpad/dialtone/commit/367db43ea7c7e240c2a43972d8aea951ad57f12f))

## [9.0.1](https://github.com/dialpad/dialtone/compare/dialtone/v9.0.0...dialtone/v9.0.1) (2023-12-20)


### Bug Fixes

* release script ([864075c](https://github.com/dialpad/dialtone/commit/864075c97c5e2453fb58b9ff4e33d4a652d37ce1))


### Documentation

* **Illustrations:** add popover to spot illustrations ([#54](https://github.com/dialpad/dialtone/issues/54)) ([10e08aa](https://github.com/dialpad/dialtone/commit/10e08aa9d573ef21716c7f8fd41e233dbeb71076))
