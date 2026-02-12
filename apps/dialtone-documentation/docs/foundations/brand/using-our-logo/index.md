---
title: Using our Logo
description: Guidelines for using the Dialpad logo in different contexts and themes.
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=17330-1170
keywords: ["logo usage","logo guidelines","brand guidelines"]
---

## For Brand

<dt-stack gap="650" class="d-mt48">
  <div class="d-d-grid d-g48 d-g-cols1 md:d-g-cols2 d-ai-center">
    <div>
      <svg-loader name="logo--primary-color-light" class="d-bar16" />
      <p class="d-docsite--header-3 d-m0 d-mt16">Primary Color Light</p>
    </div>
    <div>
      <svg-loader name="logo--primary-color-dark" class="d-bar16" />
      <p class="d-docsite--header-3 d-m0 d-mt16">Primary Color Dark</p>
    </div>
  </div>

  <div class="d-d-grid d-g48 d-g-cols1 md:d-g-cols2 d-ai-center">
    <div>
      <svg-loader name="logo--secondary-color-light" class="d-bar16" />
      <p class="d-docsite--header-3 d-m0 d-mt16">Secondary Color Light</p>
    </div>
    <div>
      <svg-loader name="logo--secondary-color-dark" class="d-bar16" />
      <p class="d-docsite--header-3 d-m0 d-mt16">Secondary Color Dark</p>
    </div>
  </div>

  <div class="d-d-grid d-g48 d-g-cols1 md:d-g-cols3 d-ai-center">
    <div>
      <h2 class="d-docsite--header-3">How to use the logo</h2>
      <p class="d-docsite--paragraph">In almost all cases, the Primary Dialpad logo mark should be used. It consists of the Dialpad icon and word mark.</p>
      <p class="d-docsite--paragraph d-fc-critical">Never use the spark icon on it’s own, it should always be used with the Dialpad wordmark</p>
    </div>
    <div class="d-gc2">
      <svg-loader name="logo--how-to-use" class="d-bar16" />
    </div>
  </div>

  <div class="d-d-grid d-g48 d-g-cols1 md:d-g-cols3 d-ai-center">
    <div>
      <h2 class="d-docsite--header-3">Clear space</h2>
      <p class="d-docsite--paragraph">When using the Dialpad logo mark, always use the proper minimum clear space and sizing.</p>
      <h3 class="d-docsite--header-4">Digital Minimum Size </h3>
      <p class="d-docsite--paragraph">
        32 x 64px with clear space<br>
        16 x 48px without clear space
      </p>
    </div>
    <div class="d-gc2">
      <svg-loader name="logo--clear-space" class="d-bar16" />
    </div>
  </div>

  <div class="d-d-grid d-g48 d-g-cols1 md:d-g-cols3 d-ai-center">
    <div>
      <h2 class="d-docsite--header-3">Positioning</h2>
      <p class="d-docsite--paragraph">Maintain at least 2x the width of the "d" as clear space around the logo and ensure centering of the "dialpad" wordmark minus the Spark's width.</p>
    </div>
    <div class="d-gc2">
      <svg-loader name="logo--positioning" class="d-bar16" />
    </div>
  </div>

  <div class="d-d-grid d-g48 d-g-cols1 md:d-g-cols3 d-ai-center">
    <div>
      <h2 class="d-docsite--header-3">Alignment</h2>
    </div>
    <div class="d-gc2">
      <svg-loader name="logo--alignment" class="d-bar16" />
    </div>
  </div>
</dt-stack>

## In Product

Choose the proper logo variant based on its context and theme.

```html
<dt-illustration name='{variant}' />
```

<icons illustration kind="brand-logos" size="large"></icons>

### Color Options

Logos are available in a fixed set of color options to suit different backgrounds, contexts, and theme needs.

<div class="d-ba d-bar8 d-bc-subtle">
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th>Color</th>
        <th>Logo</th>
        <th>Name</th>
        <th>Usage</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="d-ws-nowrap">Color</td>
        <td>
          <dt-stack class="d-bgc-transparent d-p16 d-pr24 d-bar8">
            <dt-illustration name='dialpad-logo' />
          </dt-stack>
        </td>
        <td class="d-ws-nowrap">
          <code class="d-code--sm d-docsite-code">dialpad-logo</code>
        </td>
        <td>
          Suitable for most cases. Wordmark foreground color responds to Dialtone light and dark themes. For example, the wordmark will be dark in the default theme, and light in the dark theme.
        </td>
      </tr>
      <tr>
        <td class="d-ws-nowrap">Monochrome</td>
        <td>
          <dt-stack class="d-bgc-transparent d-p16 d-pr24 d-bar8">
            <dt-illustration name='dialpad-mono' />
          </dt-stack>
        </td>
        <td class="d-ws-nowrap">
          <code class="d-code--sm d-docsite-code">dialpad-mono</code>
        </td>
        <td>
          Single-color wordmark and logomark in Dialtone's primary foreground color. Responds to Dialtone light and dark themes.
        </td>
      </tr>
      <tr>
        <td class="d-ws-nowrap">Color</td>
        <td>
          <dt-stack  class="d-bgc-primary-inverted d-p16 d-pr24 d-bar8">
            <dt-illustration name='dialpad-logo-inverted' />
          </dt-stack>
        </td>
        <td class="d-ws-nowrap">
          <code class="d-code--sm d-docsite-code">dialpad-logo-inverted</code>
        </td>
        <td>
          Appropriate for use on a contrasting surface color. For example, in a light theme the wordmark will be light on a dark contrasting surface.
        </td>
      </tr>
      <tr>
        <td class="d-ws-nowrap">Monochrome</td>
        <td>
          <dt-stack class="d-bgc-primary-inverted d-p16 d-pr24 d-bar8">
            <dt-illustration name='dialpad-mono-inverted' />
          </dt-stack>
        </td>
        <td class="d-ws-nowrap">
          <code class="d-code--sm d-docsite-code">dialpad-mono-inverted</code>
        </td>
        <td>
          Appropriate for use on a contrasting surface color. For example, in a light theme it would be light on a dark contrasting surface.
        </td>
      </tr>
      <tr>
        <td class="d-ws-nowrap">Color</td>
        <td>
          <dt-stack  class="d-bgc-neutral-white d-p16 d-pr24 d-bar8">
            <dt-illustration name='dialpad-logo-black' />
          </dt-stack>
        </td>
        <td class="d-ws-nowrap">
          <code class="d-code--sm d-docsite-code">dialpad-logo-black</code>
        </td>
        <td>
          When the wordmark must remain black regardless of theme or context.
        </td>
      </tr>
      <tr>
        <td class="d-ws-nowrap">Monochrome</td>
        <td>
          <dt-stack class="d-bgc-neutral-white d-p16 d-pr24 d-bar8">
            <dt-illustration name='dialpad-mono-black' />
          </dt-stack>
        </td>
        <td class="d-ws-nowrap">
          <code class="d-code--sm d-docsite-code">dialpad-mono-black</code>
        </td>
        <td>
          When the entire logo must remain black regardless of theme.
        </td>
      </tr>
      <tr>
        <td class="d-ws-nowrap">Color</td>
        <td>
          <dt-stack  class="d-bgc-neutral-black d-p16 d-pr24 d-bar8">
            <dt-illustration name='dialpad-logo-white' />
          </dt-stack>
        </td>
        <td class="d-ws-nowrap">
          <code class="d-code--sm d-docsite-code">dialpad-logo-white</code>
        </td>
        <td>
          When the wordmark must remain white regardless of theme or context.
        </td>
      </tr>
      <tr>
        <td class="d-ws-nowrap">Monochrome</td>
        <td>
          <dt-stack class="d-bgc-neutral-black d-p16 d-pr24 d-bar8">
            <dt-illustration name='dialpad-mono-white' />
          </dt-stack>
        </td>
        <td class="d-ws-nowrap">
          <code class="d-code--sm d-docsite-code">dialpad-mono-white</code>
        </td>
        <td>
          When the entire logo must remain white regardless of theme.
        </td>
      </tr>
    </tbody>
  </table>
</div>
