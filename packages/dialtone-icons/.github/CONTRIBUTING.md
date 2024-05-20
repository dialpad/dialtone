# Contributing

Thanks for your interest in contributing to Dialtone Icons! Please take a moment to review this document before submitting a pull request.

## Overview

### What is Dialtone Icons?

Dialtone Icons is an icon repository which serves to store, pre-process and ship icons
to use either on [Dialtone-vue icon]
or standalone as SVG files.

[Check the Icon catalog.](https://dialtone.dialpad.com/design/icons/)

## Adding an icon

- In the [Icons Figma file] select and export each icon as SVG.
- Place the exported SVG file(s) in the appropriate folder category inside `./src/svg/`
- Add the name and keywords in the `keywords-icons.json` file. Add the keywords array as the value. e.g:

```js
{
   "arrows": {
     "arrow-left": ["arrow", "left", "direction"],
   //   ...
   }
   // ...
}
```

- Run `nx build dialtone-icons`
- Add, commit and push your changes.
- Open a pull request.
- Once approved it can be merged into staging and will go out in the next release.

[Learn more on How to craft an icon.](https://dialtone.dialpad.com/design/icons/#crafting-an-icon)

## Icon build process

Because our SVG's come from Figma, it's possible to have duplicated identifiers if we exported the icons as is.
So we're converting our icons into Vue components and using a common function called `getUniqueString()` from [dialtone common utils](../../../common/utils.js)
to prefix the identifiers of every icon with `dt-icon`, that way even if we have multiple instances of the same icon, they'll have different identifiers.

Generated Vue icons are output to the `src/icons/` folder when you do `nx build dialtone-icons`

## Important Folders and Files

- `src/icons/svg`: All the source SVG icon files.
- `src/illustrations/svg`: All the source SVG icon files.
- `keywords-icons.json`: Contains the categories on which icons are going to be included and the keywords to make the icons more discoverable while searching on [Dialtone icons documentation](https://dialpad.design/components/icon.html).
- `keywords-illustrations.json`: Contains the categories on which illustrations are going to be included and the keywords to make the illustrations more discoverable.
- `icons.json`: This file is auto generated and used to list all the icons in Storybook.
- `illustrations.json`: This file is auto generated and used to list all the illustrations in Storybook.

[Dialtone-vue icon]: https://vue.dialpad.design/?path=/story/components-icon--default
[Icons Figma file]: https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT9-Icon-Library?type=design&node-id=10023-2864&mode=design&t=MvRnRubYryeiG1az-0
