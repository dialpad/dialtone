---
title: Spacing
status: In progress
description: The spacing scale defines the paddings, gaps, and margins around interface elements.
---

<aside class="d-notice d-notice--info d-mt24 d-wmx100p" role="status" aria-hidden="false">
  <div class="d-notice__content d-stack4">
    <p class="d-notice__message">
      <strong>Note:</strong> By the Feb 2024, we aim to integrate spacing and sizing into Figma Variables. This will simplify the process of setting these tokens on width, min-width, height, min-height, border radius, space-between, and paddings within your elements in your Figma files.
    </p>
  </div>
</aside>
&nbsp;

Our team utilizes a 4px-system modular scale for both spacing and [sizing](https://). This scale, inspired by the Fibonacci sequence, employs values like 8px, 16px, 24px, and so on. We opted for the 4px base due to its adaptability across various screen sizes and divisibility.

There are two ways where we're going to use the Spacing units, when [stacking elements](#stacking) and when adding [padding](#padding) or margin.

## Stacking

When adding space between elements, whether vertically or horizontally, we use `space-between` or `gap` to define the space that separetes each element, where the value it’s set as a variable on Figma and as a Token on code.

<div class="d-d-grid d-gg16 d-g-cols2 md:d-g-cols1">
 <dt-stack direction="column" gap="400">
  <iframe style="border: 0px solid rgba(0, 0, 0, 0.1); border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FKun0him7tdf4i7oR9wjnH9/Dialtone-Web?page-id=915%3A8033&type=design&node-id=915-8431&viewport=522%2C582%2C1.02&t=uBcZsecOJbI3n41L-8&scaling=min-zoom&starting-point-node-id=915%3A8431&hide-ui=1"></iframe>
<div><p class="d-fw-bold">Vertical stacking</p>
  <p class="d-body-base d-fc-tertiary">Space between (gap) groups vertically.</p></div>
  </dt-stack>
  <dt-stack direction="column" gap="400">
  <iframe style="border: 0px solid rgba(0, 0, 0, 0.1); border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FKun0him7tdf4i7oR9wjnH9/Dialtone-Web?page-id=915%3A8033&type=design&node-id=967-20985&viewport=506%2C417%2C0.64&t=JQtYzRgn0vnxMb00-8&scaling=min-zoom&starting-point-node-id=967%3A20985&hotspot-hints=0&hide-ui=1"></iframe>
  <div><p class="d-fw-bold">Horizontal stacking</p>
  <p class="d-body-base d-fc-tertiary">Space between (gap) groups horizontally.</p></div>
  </dt-stack>
</div>

## Padding

When adding space around an element, use `padding` to create some breathing room. Avoid using `margin`, which adds space outside the element and can affect the layout, in that case, follow the [stacking](#stacking) approach.

<dt-stack direction="column" gap="400">
<div class="d-bgc-black-100 d-w100p d-h100p d-hmn264">
WIP
</div>
<div><p class="d-fw-bold">Vertical stacking</p>
<p class="d-body-base d-fc-tertiary">Space between (gap) groups vertically.</p></div>
</dt-stack>

## Establish connections

<div class="d-d-grid d-gg16 d-g-cols2 md:d-g-cols1" >
  <div>
    <dt-stack direction="column" gap="400">
      <div>
        <p>Adjust the distance between elements to guide users' understanding of their relationships. Closer elements appear more connected, while larger gaps indicate less association.
      </p>
      </div>
      <div>
        <p class="d-body-base d-fc-tertiary">Consistent and intentional spacing decisions across pages create a predictable layout, reducing cognitive load and allowing users to focus on the content rather than the layout.</p>
      </div>
    </dt-stack>
  </div>
    <iframe style="border: 0px solid rgba(0, 0, 0, 0.1); border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FKun0him7tdf4i7oR9wjnH9/Dialtone-Web?page-id=65%3A23331&type=design&node-id=890-22355&viewport=-285%2C-1288%2C0.54&t=Cl3RtWMqP6pSyjct-8&scaling=min-zoom&starting-point-node-id=88%3A25302&hide-ui=1"></iframe>
</div>

## Emphasize importance

<div class="d-d-grid d-gg16 d-g-cols2 md:d-g-cols1" >
  <div >
    <dt-stack direction="column" gap="400">
      <div>
        <p>Control the amount of space around an element to affect its visual importance. Use larger spaces for more prominent elements and smaller for those of lower importance. Keep in mind the position of the elements will benefit the order of reading.
      </p>
      </div>
      <div>
        <p class="d-body-base d-fc-tertiary">The empty areas around elements provide visual breathing room, enhancing readability and contrast.</p>
      </div>
    </dt-stack>
  </div>
    <div class="d-bgc-black-100 d-w100p d-h100p d-hmn264">
    WIP
    </div>
</div>

## Tokens

Here are some frequently used tokens. For a complete list, visit the [Spacing Tokens](https://) section.

<table class="d-table dialtone-doc-table">
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">Token</th>
      <th scope="col">REM</th>
      <th scope="col">PX</th>
      <th scope="col">Usage</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>
        <div class="d-d-flex d-jc-space-between d-ai-center">
          <dt-stack direction="row" class="d-fl0 d-fs-300 d-fc-primary d-p6 d-fw-medium">
            <div style="height: var(--dt-size-625); width: var(--dt-size-500); background-color: var(--dt-color-black-200); display: flex; align-items: center; justify-content: center; font-size: var(--dt-font-size-100); color: var(--dt-color-black-500);">
              A
            </div>
            <div style="width: 0rem; height: var(--dt-size-625);
    background-color: var(--dt-color-brand-purple);"></div>
            <div style="height: var(--dt-size-625); width: var(--dt-size-500); background-color: var(--dt-color-black-200); display: flex; align-items: center; justify-content: center; font-size: var(--dt-font-size-100); color: var(--dt-color-black-500);">
              B
            </div>
          </dt-stack>
        </div>
      </th>
      <td class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">var(--dt-space-0)</td>
      <td class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">0rem</td>
      <td class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">0px</td>
      <td scope="row" class="d-lh-300">
        <div class="d-fw-normal d-fs-100">Default space between elements.</div>
      </td>
    </tr>
    <tr>
      <th>
        <div class="d-d-flex d-jc-space-between d-ai-center">
          <dt-stack direction="row" class="d-fl0 d-fs-300 d-fc-primary d-p6 d-fw-medium">
            <div style="height: var(--dt-size-625); width: var(--dt-size-500); background-color: var(--dt-color-black-200); display: flex; align-items: center; justify-content: center; font-size: var(--dt-font-size-100); color: var(--dt-color-black-500);">
              A
            </div>
            <div style="width: 0.2rem; height: var(--dt-size-625);
    background-color: var(--dt-color-brand-purple);"></div>
            <div style="height: var(--dt-size-625); width: var(--dt-size-500); background-color: var(--dt-color-black-200); display: flex; align-items: center; justify-content: center; font-size: var(--dt-font-size-100); color: var(--dt-color-black-500);">
              B
            </div>
          </dt-stack>
        </div>
      </th>
      <td class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">var(--dt-space-200)</td>
      <td class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">0.2rem</td>
      <td class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">4px</td>
      <td scope="row" class="d-lh-300">
        <div class="d-fw-normal d-fs-100">
          Horizontal stack Icon + Text, Vertical stack List group.
        </div>
      </td>
    </tr>
  </tbody>
</table>

WIP: Tokens table

**🌟 Design Tip:** Optimize your workflow in Figma by setting the nudge amount to 4px or 8px. It's a small change that can make a big difference in ease of use!

## Key Takeaways

- Use predefined tokens: They help maintain consistency and make it easier to update designs.
- Keep sizes and spacing consistent: This ensures a polished look across all devices.
- Maintain a balanced visual hierarchy by using the modular scale for font, sizes and spacing.
- Consider the overall composition and whitespace to create well-proportioned layouts.
- Ensure consistent spacing across various screen sizes and breakpoints.
