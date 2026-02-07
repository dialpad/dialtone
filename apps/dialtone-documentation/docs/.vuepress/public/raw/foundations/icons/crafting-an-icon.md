# Crafting an Icon

Guidelines for designing and exporting icons in the Dialtone icon system.

- **Keywords**: create icon,design icon,icon design

Our icons are designed for easy recognition and understanding. They are a visual support, helping people navigate the experience more effectively.

## On Figma

Go to the [Icon Builder page](https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT8-Icon-Library?type=design&node-id=12057-3505&mode=design&t=CNADHg9I1bsKDPiB-4) in Figma and follow the instructions. Remember to work on a branch and send a review when the icons are ready.

- Use simple lines and shapes. Avoid creating overly literal, complex icons.
- Utilize the icon grid while maintaining the style of each icon.
- The icon's content should remain within the 2px padding (on size 500/24px); no part of the icon should extend beyond this area.
- Both exterior and interior corners should be 2px (on size 500/24px).
- The stroke style should be `solid`, end points `round`, and join `round`.

## Exporting

1. [Create a new branch](https://github.com/dialpad/dialtone/tree/staging/packages/dialtone-css/.github/CONTRIBUTING.md#making-a-pull-request) in [dialtone](https://github.com/dialpad/dialtone/tree/staging) repo starting with "dlt-xxxx-" in the name.
2. Place the exported SVG file(s) in the appropriate folder category inside `./src/svg/`, files names should be in kebab-case.
3. Run `nx run dialtone-icons:build`
4. Add keywords related to the icon(s) in the `packages/dialtone-icons/src/keywords-icons.json` file.
5. [Commit](https://github.com/dialpad/dialtone/tree/staging/.github/COMMIT_CONVENTION.md) and push your branch to [dialtone](https://github.com/dialpad/dialtone/tree/staging).
6. Open a pull request, once approved it can be merged into main and will go out in the next [dialtone](https://github.com/dialpad/dialtone/tree/staging) release.
