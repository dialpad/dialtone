---
title: Crafting an Icon
description: Guidelines for designing and exporting icons in the Dialtone icon system.
figma_url: https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT-Core%3A-Icons-7?node-id=1473%3A3757&viewport=-168%2C479%2C1&t=OhX4ilCDvb7Tqkx4-11
keywords: ["create icon","design icon","icon design"]
---

Our icons are designed for easy recognition and understanding. They are a visual support, helping people navigate the experience more effectively.

## On Figma

Go to the [Icon Builder page](https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT8-Icon-Library?type=design&node-id=12057-3505&mode=design&t=CNADHg9I1bsKDPiB-4) in Figma and follow the instructions. Remember to work on a branch and send a review when the icons are ready.

<iframe style="border: 0px; border-radius: var(--dt-size-radius-400)" width="100%" height="306" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=44-1450&viewport=-3223%2C-6%2C0.78&t=ma5fyi8Din3K3CgW-8&scaling=min-zoom&starting-point-node-id=44%3A1450&hotspot-hints=0&hide-ui=1" allowfullscreen></iframe>

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
