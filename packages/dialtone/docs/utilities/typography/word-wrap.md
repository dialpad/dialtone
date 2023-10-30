---
title: Word wrap
description: Utilities for controlling the way words wrap within an element. Generally used for handling overflow of long strings that are actually supposed to be a single unbroken word, like URLs or file paths.
---

## Normal

Use `d-ww-normal` to break words only at allowed break points.

<code-well-header class="d-fl-center d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-bgc-purple-200 d-py8 d-px16 d-bar8 lg:d-w216 d-w332">
    <p class="d-fs-200 d-ww-normal">Here's an example sentence to show how word-wrap works. Thisisasignlewordtodenotethedifferencebetweenthedifferentwaytowrapaword. Vivamus ullamcorperatduiaultrices eu lobortis nulla, sed vulputate orci. 这是一个中文例句，以举例说明断字的工作方式。単語分割の動作の例を示す日本語のサンプル文は次のとおりです。다음은 단어 분리 작동 방식의 예를 제공하는 한국어 샘플 문장입니다.</p>
  </div>
</code-well-header>

```html
<p class="d-ww-normal">...</p>
```

## Break word

Use `d-ww-break-word` to allow unbreakable words to be broken. Is a more conservative approach than [`d.wb-break-all`](./word-break.md#break-all) and will only break long words that do not fit the container.

<code-well-header class="d-fl-center d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-bgc-green-100 d-py8 d-px16 d-bar8 lg:d-w216 d-w332">
    <p class="d-fs-200 d-ww-break-word">Here's an example sentence to show how word-wrap works. Thisisasignlewordtodenotethedifferencebetweenthedifferentwaytowrapaword. Vivamus ullamcorperatduiaultrices eu lobortis nulla, sed vulputate orci. 这是一个中文例句，以举例说明断字的工作方式。単語分割の動作の例を示す日本語のサンプル文は次のとおりです。다음은 단어 분리 작동 방식의 예를 제공하는 한국어 샘플 문장입니다.</p>
  </div>
</code-well-header>

```html
<p class="d-ww-break-word">...</p>
```

## Initial

Use `d-ww-initial`to set this property to its default value.

<code-well-header class="d-fl-center d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-bgc-magenta-100 d-py8 d-px16 d-bar8 lg:d-w216 d-w332">
    <p class="d-fs-200 d-ww-initial">Here's an example sentence to show how word-wrap works. Thisisasignlewordtodenotethedifferencebetweenthedifferentwaytowrapaword. Vivamus ullamcorperatduiaultrices eu lobortis nulla, sed vulputate orci. 这是一个中文例句，以举例说明断字的工作方式。単語分割の動作の例を示す日本語のサンプル文は次のとおりです。다음은 단어 분리 작동 방식의 예를 제공하는 한국어 샘플 문장입니다.</p>
  </div>
</code-well-header>

```html
<p class="d-ww-initial">...</p>
```

## Inherit

Use `d-ww-inherit` to inherit this property from its parent element.

<code-well-header class="d-fl-center d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-bgc-magenta-100 d-py8 d-px16 d-bar8 lg:d-w216 d-w332">
    <p class="d-fs-200 d-ww-inherit">Here's an example sentence to show how word-wrap works. Thisisasignlewordtodenotethedifferencebetweenthedifferentwaytowrapaword. Vivamus ullamcorperatduiaultrices eu lobortis nulla, sed vulputate orci. 这是一个中文例句，以举例说明断字的工作方式。単語分割の動作の例を示す日本語のサンプル文は次のとおりです。다음은 단어 분리 작동 방식의 예를 제공하는 한국어 샘플 문장입니다.</p>
  </div>
</code-well-header>

```html
<p class="d-ww-inherit">...</p>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in ['normal', 'break-word', 'initial', 'inherit']">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-ww-{{ i }}</th>
        <td class="d-ff-mono d-fs-100">word-wrap: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
