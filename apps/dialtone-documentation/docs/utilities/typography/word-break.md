---
title: Word Break
description: Utilities for controlling the way words break within an element. Useful when you want to ensure that text will absolutely not overflow its container, regardless readability risk.
---

## Normal

Use `d-wb-normal` to reset an element's line break rule.

<code-well-header>
  <div class="d-bgc-moderate d-py8 d-px16 d-bar8 lg:d-w216 d-w332">
    <p class="d-wb-normal">Here's an example sentence to show how word-break works. Vivamus ullamcorperatduiaultrices eu lobortis nulla, sed vulputate orci. 这是一个中文例句，以举例说明断字的工作方式。単語分割の動作の例を示す日本語のサンプル文は次のとおりです。다음은 단어 분리 작동 방식의 예를 제공하는 한국어 샘플 문장입니다.</p>
  </div>
</code-well-header>

```html
<p class="d-wb-normal">...</p>
```

## Break All

Use `d-wb-break-all` on an element to insert word breaks between any two characters (excluding Chinese, Japanese, or
Korean text) to prevent text from overflowing. The break between any two characters can lead to awkward line breaks in
the middle of short words, for a more conservative way to handle it see [`d-ww-break-word`](./word-wrap.md#break-word).

<code-well-header>
  <div class="d-bgc-moderate d-py8 d-px16 d-bar8 lg:d-w216 d-w332">
    <p class="d-wb-break-all">Here's an example sentence to show how word-break works. Vivamus ullamcorperatduiaultrices eu lobortis nulla, sed vulputate orci. 这是一个中文例句，以举例说明断字的工作方式。単語分割の動作の例を示す日本語のサンプル文は次のとおりです。다음은 단어 분리 작동 방식의 예를 제공하는 한국어 샘플 문장입니다.</p>
  </div>
</code-well-header>

```html
<p class="d-wb-break-all">...</p>
```

## Break Word

Use `d-wb-break-word` on an element to insert word breaks between any two characters (including Chinese, Japanese, or
Korean text) to prevent text from overflowing. The break between any two characters can lead to awkward line breaks in
the middle of short words, for a more conservative way to handle it see [`d-ww-break-word`](./word-wrap.md#break-word).

<code-well-header>
  <div class="d-bgc-moderate d-py8 d-px16 d-bar8 lg:d-w216 d-w332">
    qwqqd<p class="d-wb-break-all">Here's an example sentence to show how word-break works. Vivamus ullamcorperatduiaultrices eu lobortis nulla, sed vulputate orci. 这是一个中文例句，以举例说明断字的工作方式。単語分割の動作の例を示す日本語のサンプル文は次のとおりです。다음은 단어 분리 작동 방식의 예를 제공하는 한국어 샘플 문장입니다.</p>
  </div>
</code-well-header>

```html
<p class="d-wb-break-word">...</p>
```

## Keep All

Use `d-wb-keep-all` on an element to not use word breaks for Chinese, Japanese, or Korean (CJK) text. Non-CJK text
behavior is set to normal.

<code-well-header>
  <div class="d-bgc-moderate d-py8 d-px16 d-bar8 lg:d-w216 d-w332">
    <p class="d-wb-keep-all">Here's an example sentence to show how word-break works. Vivamus ullamcorperatduiaultrices eu lobortis nulla, sed vulputate orci. 这是一个中文例句，以举例说明断字的工作方式。単語分割の動作の例を示す日本語のサンプル文は次のとおりです。다음은 단어 분리 작동 방식의 예를 제공하는 한국어 샘플 문장입니다.</p>
  </div>
</code-well-header>

```html
<p class="d-wb-keep-all">...</p>
```

## Classes

<new-utility-class-table :classes="wordBreak"></new-utility-class-table>

<script setup>
  import { inject } from 'vue';
  import { extractUtilityClasses } from '@utilities';

  const utilityClassDocs = inject('utilityClassDocs');
  const wordBreak = extractUtilityClasses(utilityClassDocs, 'd-wb-');
</script>
