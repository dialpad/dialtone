---
title: Word wrap
description: Utilities for controlling the way words wrap within an element. Generally used for handling overflow of long strings that are actually supposed to be a single unbroken word, like URLs or file paths.
---

## Normal

Use `d-ww-normal` to break words only at allowed break points.

<code-well-header>
  <div class="d-bgc-moderate d-py8 d-px16 d-bar8 lg:d-w216 d-w332">
    <p class="d-ww-normal">Here's an example sentence to show how word-wrap works. Thisisasignlewordtodenotethedifferencebetweenthedifferentwaytowrapaword. Vivamus ullamcorperatduiaultrices eu lobortis nulla, sed vulputate orci. 这是一个中文例句，以举例说明断字的工作方式。単語分割の動作の例を示す日本語のサンプル文は次のとおりです。다음은 단어 분리 작동 방식의 예를 제공하는 한국어 샘플 문장입니다.</p>
  </div>
</code-well-header>

```html
<p class="d-ww-normal">...</p>
```

## Break word

Use `d-ww-break-word` to allow unbreakable words to be broken. Is a more conservative approach than [`d-wb-break-all`](./word-break.md#break-all) and will only break long words that do not fit the container.

<code-well-header>
  <div class="d-bgc-moderate d-py8 d-px16 d-bar8 lg:d-w216 d-w332">
    <p class="d-ww-break-word">Here's an example sentence to show how word-wrap works. Thisisasignlewordtodenotethedifferencebetweenthedifferentwaytowrapaword. Vivamus ullamcorperatduiaultrices eu lobortis nulla, sed vulputate orci. 这是一个中文例句，以举例说明断字的工作方式。単語分割の動作の例を示す日本語のサンプル文は次のとおりです。다음은 단어 분리 작동 방식의 예를 제공하는 한국어 샘플 문장입니다.</p>
  </div>
</code-well-header>

```html
<p class="d-ww-break-word">...</p>
```

## Anywhere

Use `d-ww-anywhere` to break words at any point in the string (not just at allowed break points) to prevent long strings from overflowing their container.

<code-well-header>
  <div class="d-bgc-moderate d-py8 d-px16 d-bar8 lg:d-w216 d-w332">
    <p class="d-ww-break-word">Here's an example sentence to show how word-wrap works. Thisisasignlewordtodenotethedifferencebetweenthedifferentwaytowrapaword. Vivamus ullamcorperatduiaultrices eu lobortis nulla, sed vulputate orci. 这是一个中文例句，以举例说明断字的工作方式。単語分割の動作の例を示す日本語のサンプル文は次のとおりです。다음은 단어 분리 작동 방식의 예를 제공하는 한국어 샘플 문장입니다.</p>
  </div>
</code-well-header>

```html
<p class="d-ww-anywhere">...</p>
```

## Initial

Use `d-ww-initial`to set this property to its default value.

<code-well-header>
  <div class="d-bgc-moderate d-py8 d-px16 d-bar8 lg:d-w216 d-w332">
    <p class="d-ww-initial">Here's an example sentence to show how word-wrap works. Thisisasignlewordtodenotethedifferencebetweenthedifferentwaytowrapaword. Vivamus ullamcorperatduiaultrices eu lobortis nulla, sed vulputate orci. 这是一个中文例句，以举例说明断字的工作方式。単語分割の動作の例を示す日本語のサンプル文は次のとおりです。다음은 단어 분리 작동 방식의 예를 제공하는 한국어 샘플 문장입니다.</p>
  </div>
</code-well-header>

```html
<p class="d-ww-initial">...</p>
```

## Inherit

Use `d-ww-inherit` to inherit this property from its parent element.

<code-well-header>
  <div class="d-bgc-moderate d-py8 d-px16 d-bar8 lg:d-w216 d-w332">
    <p class="d-ww-inherit">Here's an example sentence to show how word-wrap works. Thisisasignlewordtodenotethedifferencebetweenthedifferentwaytowrapaword. Vivamus ullamcorperatduiaultrices eu lobortis nulla, sed vulputate orci. 这是一个中文例句，以举例说明断字的工作方式。単語分割の動作の例を示す日本語のサンプル文は次のとおりです。다음은 단어 분리 작동 방식의 예를 제공하는 한국어 샘플 문장입니다.</p>
  </div>
</code-well-header>

```html
<p class="d-ww-inherit">...</p>
```

## Classes

<new-utility-class-table :classes="wordWrap"></new-utility-class-table>

<script setup>
  import { inject } from 'vue';
  import { extractUtilityClasses } from '@utilities';

  const utilityClassDocs = inject('utilityClassDocs');
  const wordWrap = extractUtilityClasses(utilityClassDocs, 'd-ww-');
</script>
