---
title: Stack
description: Foundational layout primitive for grouping elements along a single axis with consistent spacing and alignment.
thumb: true
image: assets/images/components/stack.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-stack--default
---

<code-well-header>
  <dt-stack gap="600" align="center">
    <dt-stack
      gap="500"
      class="d-bgc-moderate-opaque d-bar8"
    >
      <div class="d-bgc-moderate-opaque d-p16 d-bar8">
        Stack item 1
      </div>
      <div class="d-bgc-moderate-opaque d-p16 d-bar8">
        Stack item 2
      </div>
      <div class="d-bgc-moderate-opaque d-p16 d-bar8">
        Stack item 3
      </div>
    </dt-stack>
    <dt-stack
      gap="500"
      direction="row"
      class="d-bgc-moderate-opaque d-bar8"
    >
      <div class="d-bgc-moderate-opaque d-p16 d-bar8">
        Stack item 1
      </div>
      <div class="d-bgc-moderate-opaque d-p16 d-bar8">
        Stack item 2
      </div>
      <div class="d-bgc-moderate-opaque d-p16 d-bar8">
        Stack item 3
      </div>
    </dt-stack>
  </dt-stack>
</code-well-header>

## Direction

### Column: Flow Vertically

`column` is the default direction and doesn't need to be explictily set.

<code-well-header>
  <dt-stack
    gap="500"
    class="d-bgc-moderate-opaque d-bar8"
    ref="columnExample"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Stack item 1
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Stack item 2
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Stack item 3
    </div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.columnExample"
vueCode='
<dt-stack
  gap="500"
>
  <div> Stack item 1 </div>
  <div> Stack item 2 </div>
  <div> Stack item 3 </div>
</dt-stack>
'
/>

### Row: Flow Horizontally

<code-well-header>
  <dt-stack
    gap="500"
    direction="row"
    class="d-bgc-moderate-opaque d-bar8"
    ref="rowExample"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Stack item 1
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Stack item 2
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Stack item 3
    </div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.rowExample"
vueCode='
<dt-stack
  gap="500"
  direction="row"
>
  <div> Stack item 1 </div>
  <div> Stack item 2 </div>
  <div> Stack item 3 </div>
</dt-stack>
'
showHtmlWarning />

### Row Reverse

<code-well-header>
  <dt-stack
    gap="500"
    direction="row-reverse"
    class="d-bgc-moderate-opaque d-bar8"
    ref="rowReverseExample"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Stack item 1
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Stack item 2
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Stack item 3
    </div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.rowReverseExample"
vueCode='
<dt-stack
  gap="500"
  direction="row-reverse"
>
  <div> Stack item 1 </div>
  <div> Stack item 2 </div>
  <div> Stack item 3 </div>
</dt-stack>'
/>

### Column Reverse

<code-well-header>
  <dt-stack
    gap="500"
    direction="column-reverse"
    class="d-bgc-moderate-opaque d-bar8"
    ref="columnReverseExample"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Stack item 1
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Stack item 2
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Stack item 3
    </div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.columnReverseExample"
vueCode='
<dt-stack
  gap="500"
  direction="column-reverse"
>
  <div> Stack item 1 </div>
  <div> Stack item 2 </div>
  <div> Stack item 3 </div>
</dt-stack>
'
/>

## As

The `as` prop controls which HTML element the Stack component renders as. Defaults to `<div>`, but can be declared as any valid HTML element to ensure semantic and accessible markup.

Declaring as an appropriate HTML element improves accessibility by helping screen readers better understand document structure, and maintainability with clear code intent.

**Common `as` values:** `span`, `ul`, `ol`, `li`, `section`, `nav`, `article`, `main`, `aside`, `header`, `footer`.

### Example: section

Use `as="section"` to create a thematic grouping of content.

<code-well-header>
  <dt-stack
    as="section"
    gap="400"
    class="d-bgc-moderate-opaque d-bar8"
    ref="asSectionExample"
  >
    <div class="d-bgc-moderate-opaque d-bar8 d-p16">Stack item 1</div>
    <div class="d-bgc-moderate-opaque d-bar8 d-p16">Stack item 2</div>
    <div class="d-bgc-moderate-opaque d-bar8 d-p16">Stack item 3</div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.asSectionExample"
vueCode='
<dt-stack
  as="section"
  gap="400"
>
  <div>Stack item 1</div>
  <div>Stack item 2</div>
  <div>Stack item 3</div>
</dt-stack>
'
showHtmlWarning />

### Example: span

Use `as="span"` when you need an inline container.

<code-well-header>
  <dt-stack
    as="span"
    direction="row"
    gap="300"
    class="d-bgc-moderate-opaque d-bar8"
    ref="asSpanExample"
  >
    <span class="d-bgc-moderate-opaque d-bar8 d-p16">Inline item 1</span>
    <span class="d-bgc-moderate-opaque d-bar8 d-p16">Inline item 2</span>
    <span class="d-bgc-moderate-opaque d-bar8 d-p16">Inline item 3</span>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.asSpanExample"
vueCode='
<dt-stack
  as="span"
  direction="row"
  gap="300"
>
  <span>Inline item 1</span>
  <span>Inline item 2</span>
  <span>Inline item 3</span>
</dt-stack>
'
showHtmlWarning />

## Gap

<code-well-header>
  <dt-stack gap="500" class="d-w100p">
    <dt-stack gap="200">
      <h3 class="d-label">Select a gap option</h3>
      <dt-stack
        :direction="{ 'default': 'column', 'md': 'row' }"
        gap="200"
        class="d-ba d-bc-subtle d-p2 d-bar8"
      >
        <dt-button
          v-for="gap in gaps"
          size="xs"
          kind="muted"
          importance="clear"
          class="d-fl1 d-bar6"
          :key="gap"
          :class="{ 'd-btn--active': gap === selectedGap }"
          @click="setGap(gap)"
        >
          {{ gap }}
        </dt-button>
      </dt-stack>
    </dt-stack>
    <dt-stack
      :direction="{ 'default': 'column', 'md': 'row' }"
      gap="500"
      class="d-w100p"
      align="start"
    >
      <dt-stack class="d-w100p md:d-w50p" gap="300">
        <h3 class="d-headline--md">Column</h3>
        <dt-stack
          :gap="selectedGap"
          ref="gapExample"
          class="d-bgc-moderate-opaque d-t d-td300 d-bar8 d-ttf-quint"
        >
          <div class="d-bgc-moderate-opaque d-bar8 d-p16">Stack item 1</div>
          <div class="d-bgc-moderate-opaque d-bar8 d-p16">Stack item 2</div>
          <div class="d-bgc-moderate-opaque d-bar8 d-p16">Stack item 3</div>
        </dt-stack>
      </dt-stack>
      <dt-stack class="d-w100p md:d-w50p" gap="300">
        <h3 class="d-headline--md">Row</h3>
        <dt-stack
          direction="row"
          :gap="selectedGap"
          ref="gapExample"
          class="d-bgc-moderate-opaque d-t d-td300 d-bar8 d-ttf-quint"
        >
          <div class="d-bgc-moderate-opaque d-bar8 d-p16 d-fl1">Stack item 1</div>
          <div class="d-bgc-moderate-opaque d-bar8 d-p16 d-fl1">Stack item 2</div>
          <div class="d-bgc-moderate-opaque d-bar8 d-p16 d-fl1">Stack item 3</div>
        </dt-stack>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.gapExample"
vueCode='
<dt-stack
  gap="400"
>
  <div> Stack item 1 </div>
  <div> Stack item 2 </div>
  <div> Stack item 3 </div>
</dt-stack>
'
/>

### Available gaps

<clamped-table-wrapper>
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
        <tr>
          <th scope="col" class="d-p0 d-bbw0">
            <div class="d-p16 d-bb d-bc-default d-bbw1">Size</div>
          </th>
          <th scope="col" class="d-p0 d-bbw0">
            <div class="d-p16 d-bb d-bc-default d-bbw1">Design Token</div>
          </th>
          <th scope="col" class="d-ta-right d-p0 d-bbw0">
            <div class="d-p16 d-bb d-bc-default d-bbw1">REM</div>
          </th>
          <th scope="col" class="d-ta-right d-p0 d-bbw0">
            <div class="d-p16 d-bb d-bc-default d-bbw1">PX</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
              0
          </th>
          <td>
            <strong>var(--dt-space-0)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            0.0rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
             0px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
             50
          </th>
          <td>
            <strong>var(--dt-space-50)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            0.05rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            .5px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            100
          </th>
          <td>
            <strong>var(--dt-space-100)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            0.1rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
             1px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            200
          </th>
          <td>
            <strong>var(--dt-space-200)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            0.2rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
             2px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            300
          </th>
          <td>
            <strong>var(--dt-space-300)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            0.4rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
             4px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            350
          </th>
          <td>
            <strong>var(--dt-space-350)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            0.6rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
             6px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            400
          </th>
          <td>
            <strong>var(--dt-space-400)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            0.8rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
             8px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            450
          </th>
          <td>
            <strong>var(--dt-space-450)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            1.2rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            12px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            500
          </th>
          <td>
            <strong>var(--dt-space-500)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            1.6rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            16px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            525
          </th>
          <td>
            <strong>var(--dt-space-525)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            2.0rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            20px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            550
          </th>
          <td>
            <strong>var(--dt-space-550)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            2.4rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            24px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            600
          </th>
          <td>
            <strong>var(--dt-space-600)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            3.2rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            32px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            625
          </th>
          <td>
            <strong>var(--dt-space-625)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            4.2rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            42px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            650
          </th>
          <td>
            <strong>var(--dt-space-650)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            4.8rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            48px
          </td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">
            700
          </th>
          <td>
            <strong>var(--dt-space-700)</strong>
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            6.4rem
          </td>
          <td class="d-code--sm d-docsite-code d-ta-right">
            64px
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>

## Align

The `align` prop controls how items are aligned along the cross-axis (perpendicular to the stack direction). For row stacks, this controls vertical alignment. For column stacks, this controls horizontal alignment.

Available `align` values: `normal` (default), `start`, `center`, `end`, `stretch`, `baseline`.

### Normal

Browser default alignment behavior (default).

<code-well-header>
  <dt-stack
    direction="row"
    gap="400"
    align="normal"
    class="d-bgc-moderate-opaque d-bar8"
    ref="alignNormalExample"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Short
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Taller item<br>
      with more content
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Short
    </div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.alignNormalExample"
vueCode='
<dt-stack
  direction="row"
  gap="400"
  align="normal"
>
  <div>Short</div>
  <div>
    Taller item<br>
    with more content
  </div>
  <div>Short</div>
</dt-stack>
'
showHtmlWarning />

### Start

Align items to the start of the cross-axis.

<code-well-header>
  <dt-stack
    direction="row"
    gap="400"
    align="start"
    class="d-bgc-moderate-opaque d-bar8"
    ref="alignStartExample"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Short
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Taller item<br>
      with more content
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Short
    </div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.alignStartExample"
vueCode='
<dt-stack
  direction="row"
  gap="400"
  align="start"
>
  <div>Short</div>
  <div>
    Taller item<br>
    with more content
  </div>
  <div>Short</div>
</dt-stack>
'
showHtmlWarning />

### Center

Center items along the cross-axis.

<code-well-header>
  <dt-stack
    direction="row"
    gap="400"
    align="center"
    class="d-bgc-moderate-opaque d-bar8"
    ref="alignCenterExample"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Short
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Taller item<br>
      with more content
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Short
    </div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.alignCenterExample"
vueCode='
<dt-stack
  direction="row"
  gap="400"
  align="center"
>
  <div>Short</div>
  <div>
    Taller item<br>
    with more content
  </div>
  <div>Short</div>
</dt-stack>
'
showHtmlWarning />

### End

Align items to the end of the cross-axis.

<code-well-header>
  <dt-stack
    direction="row"
    gap="400"
    align="end"
    class="d-bgc-moderate-opaque d-bar8"
    ref="alignEndExample"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Short
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Taller item<br>
      with more content
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Short
    </div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.alignEndExample"
vueCode='
<dt-stack
  direction="row"
  gap="400"
  align="end"
>
  <div>Short</div>
  <div>
    Taller item<br>
    with more content
  </div>
  <div>Short</div>
</dt-stack>
'
showHtmlWarning />

### Stretch

Stretch items to fill the container height.

<code-well-header>
  <dt-stack
    direction="row"
    gap="400"
    align="stretch"
    class="d-bgc-moderate-opaque d-bar8"
    ref="alignStretchExample"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Short
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Taller item<br>
      with more content
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Short
    </div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.alignStretchExample"
vueCode='
<dt-stack
  direction="row"
  gap="400"
  align="stretch"
>
  <div>Short</div>
  <div>
    Taller item<br>
    with more content
  </div>
  <div>Short</div>
</dt-stack>
'
showHtmlWarning />

### Baseline

Align items along their text baselines.

<code-well-header>
  <dt-stack
    direction="row"
    gap="400"
    align="baseline"
    class="d-bgc-moderate-opaque d-bar8"
    ref="alignBaselineExample"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8 d-body--sm">
      Small body
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8 d-body--md">
      Medium body
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8 d-headline--xxl">
      Large headline
    </div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.alignBaselineExample"
vueCode='
<dt-stack
  direction="row"
  gap="400"
  align="baseline"
>
  <div class="d-body--sm">Small text</div>
  <div class="d-body--md">Medium text</div>
  <div class="d-headline--md">Large text</div>
</dt-stack>
'
showHtmlWarning />

## Justify

The `justify` prop controls how items are distributed along the main axis (the direction of the stack). For row stacks, this controls horizontal distribution. For column stacks, this controls vertical distribution.

Available `justify` values: `start` (default), `center`, `end`, `around`, `between`, `evenly`.

### Start

Align items to the start of the main axis (default).

<code-well-header>
  <dt-stack
    direction="row"
    gap="0"
    justify="start"
    class="d-w100p d-bgc-moderate-opaque d-bar8"
    ref="justifyStartExample"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 1</div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 2</div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 3</div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.justifyStartExample"
vueCode='
<dt-stack
  direction="row"
  justify="start"
  class="d-w100p"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</dt-stack>
'
showHtmlWarning />

### Center

Center items along the main axis.

<code-well-header>
  <dt-stack
    direction="row"
    gap="0"
    justify="center"
    class="d-w100p d-bgc-moderate-opaque d-bar8"
    ref="justifyCenterExample"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 1</div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 2</div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 3</div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.justifyCenterExample"
vueCode='
<dt-stack
  direction="row"
  justify="center"
  class="d-w100p"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</dt-stack>
'
showHtmlWarning />

### End

Align items to the end of the main axis.

<code-well-header>
  <dt-stack
    direction="row"
    gap="0"
    justify="end"
    class="d-w100p d-bgc-moderate-opaque d-bar8"
    ref="justifyEndExample"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 1</div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 2</div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 3</div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.justifyEndExample"
vueCode='
<dt-stack
  direction="row"
  justify="end"
  class="d-w100p"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</dt-stack>
'
showHtmlWarning />

### Around

Distribute items with equal space around each item.

<code-well-header>
  <dt-stack
    direction="row"
    gap="0"
    justify="around"
    class="d-w100p d-bgc-moderate-opaque d-bar8"
    ref="justifyAroundExample"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 1</div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 2</div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 3</div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.justifyAroundExample"
vueCode='
<dt-stack
  direction="row"
  justify="around"
  class="d-w100p"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</dt-stack>
'
showHtmlWarning />

### Between

Distribute items with space between them, edges flush to container.

<code-well-header>
  <dt-stack
    direction="row"
    gap="0"
    justify="between"
    class="d-w100p d-bgc-moderate-opaque d-bar8"
    ref="justifyBetweenExample"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 1</div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 2</div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 3</div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.justifyBetweenExample"
vueCode='
<dt-stack
  direction="row"
  justify="between"
  class="d-w100p"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</dt-stack>
'
showHtmlWarning />

### Evenly

Distribute items with equal space between all items, including edges.

<code-well-header>
  <dt-stack
    direction="row"
    gap="0"
    justify="evenly"
    class="d-w100p d-bgc-moderate-opaque d-bar8"
    ref="justifyEvenlyExample"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 1</div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 2</div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 3</div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.justifyEvenlyExample"
vueCode='
<dt-stack
  direction="row"
  justify="evenly"
  class="d-w100p"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</dt-stack>
'
showHtmlWarning />

## Responsive

### Example

Stacks column at small screen size and column reverse at large screen

<code-well-header>
  <dt-stack
    :direction="{ default: `row`, sm: `column`, lg: `column-reverse` }"
    gap="500"
    class="d-bgc-moderate-opaque"
    ref="responsiveDirectionExample"
  >
    <div class="d-bgc-moderate-opaque d-bar8 d-p16">
      Stack item 1
    </div>
    <div class="d-bgc-moderate-opaque d-bar8 d-p16">
      Stack item 2
    </div>
    <div class="d-bgc-moderate-opaque d-bar8 d-p16">
      Stack item 3
    </div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.responsiveDirectionExample"
vueCode='
<dt-stack
  :direction="{ `default`: `row`, `sm`: `column`, `lg`: `column-reverse` }"
>
  <div>
    Stack item 1
  </div>
  <div>
    Stack item 2
  </div>
  <div>
    Stack item 3
  </div>
</dt-stack>
'
showHtmlWarning />

Set `200` as the default gap, `300` for small and larger, `400` for medium, `500` for large, and `600` for extra large. Learn more about how our breakpoints work in the [Responsive Breakpoints documentation](/utilities/responsive/breakpoints.md).

<code-well-header>
  <dt-stack
    :gap="{ default: '200', xl: '600', lg: '500', md: '400', sm: '300' }"
    class="d-bgc-moderate-opaque"
    ref="responsiveGapExample"
  >
    <div class="d-bgc-moderate-opaque d-bar8 d-p16">
      Stack item 1
    </div>
    <div class="d-bgc-moderate-opaque d-bar8 d-p16">
      Stack item 2
    </div>
    <div class="d-bgc-moderate-opaque d-bar8 d-p16">
      Stack item 3
    </div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.responsiveGapExample"
vueCode='
<dt-stack :gap="{ default: `300`, xl: `600`, lg: `500`, md: `400`, sm: `300` }">
  <div> Stack item 1 </div>
  <div> Stack item 2 </div>
  <div> Stack item 3 </div>
</dt-stack>
'
/>

### Nested Example

Stacks row with gap 500 and stacks in row reverse the nested stack with gap 500.

<code-well-header>
  <dt-stack
    direction="row"
    as="section"
    gap="500"
    ref="nestedStackExample"
    class="d-bgc-moderate-opaque d-bar8"
  >
    <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p16">
      Stack item 1
    </dt-stack>
    <dt-stack gap="500" class="d-bgc-moderate-opaque">
      <div class="d-bgc-moderate-opaque d-bar8 d-p16">Stack item 2</div>
      <dt-stack
        direction="row-reverse"
        gap="500"
      >
        <div class="d-bgc-moderate-opaque d-bar8 d-p16">Stack item 3<br>with multiple lines</div>
        <div class="d-bgc-moderate-opaque d-bar8 d-p16">Stack item 4</div>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.nestedStackExample"
vueCode='
<dt-stack
  direction="row"
  as="section"
  gap="500"
>
  <dt-stack>
    Stack item 1
  </dt-stack>
  <dt-stack gap="500">
    <div>Stack item 2</div>
    <dt-stack
      direction="row-reverse"
      gap="500"
    >
      <div>Stack item 3<br>with multiple lines</div>
      <div>Stack item 4</div>
    </dt-stack>
  </dt-stack>
</dt-stack>
'
showHtmlWarning />

### Example: Align and Justify

Like `direction` and `gap`, the `align` and `justify` props support responsive object syntax to change alignment at different breakpoints.

<code-well-header>
  <dt-stack
    direction="row"
    gap="400"
    :align="{ default: 'start', md: 'center', lg: 'end' }"
    class="d-bgc-moderate-opaque d-bar8"
    ref="responsiveAlignExample"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Short
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Taller<br>
      item
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Short
    </div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.responsiveAlignExample"
vueCode='
<dt-stack
  direction="row"
  gap="400"
  :align="{ default: `start`, md: `center`, lg: `end` }"
>
  <div>Short</div>
  <div>
    Taller<br>
    item
  </div>
  <div>Short</div>
</dt-stack>
'
/>

Resize your browser to see the alignment change at different breakpoints.

<code-well-header>
  <dt-stack
    direction="row"
    gap="0"
    :justify="{ default: 'start', md: 'center', lg: 'between' }"
    class="d-w100p d-bgc-moderate-opaque d-bar8"
    ref="responsiveJustifyExample"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 1</div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 2</div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">Item 3</div>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.responsiveJustifyExample"
vueCode='
<dt-stack
  direction="row"
  :justify="{ default: `start`, md: `center`, lg: `between` }"
  class="d-w100p"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</dt-stack>
'
/>

Resize your browser to see the justification change at different breakpoints.

## Vue API

<component-vue-api component-name="stack" />

## Classes

<component-class-table component-name="stack"></component-class-table>

<script setup>
  import { ref } from 'vue';
  import {
    DtIconMessage,
    DtIconLock,
  } from '@dialpad/dialtone-icons/vue3';
  import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';

  const selectedGap = ref('400');

  const setGap = (gap) => {
    selectedGap.value = gap;
  };

  const gaps = window.DIALTONE_CONSTANTS.DT_STACK_GAP;
</script>
