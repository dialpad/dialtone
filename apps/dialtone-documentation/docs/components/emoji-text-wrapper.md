---
title: Emoji text wrapper
description: "Wrapper to find and replace shortcodes like :smile: or unicode chars such as 😄 with our custom Emojis implementation."
status: ready
thumb: true
image: assets/images/components/emoji-text-wrapper.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-emoji-text-wrapper--default
---

<code-well-header>
  <dt-emoji-text-wrapper>
    Some text with :invalid-emoji: :smile: :cry: and 😄, and custom emojis :octocat: :shipit:
  </dt-emoji-text-wrapper>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-emoji-text-wrapper">
  <span> Some text with :invalid-emoji: </span>
  <span class="d-emoji d-icon d-icon--size-500">
    <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-500" style="display: none;">
      <div class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate" style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"></div>
    </div>
    <img class="d-icon d-icon--size-500" aria-label="grinning face with smiling eyes" alt="😄" title="grinning face with smiling eyes" src="https://cdn.jsdelivr.net/joypixels/assets/6.6/png/unicode/32/1f604.png" style="" />
  </span>
  <span> </span>
  <span class="d-emoji d-icon d-icon--size-500">
    <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-500" style="display: none;">
      <div class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate" style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"></div>
    </div>
    <img class="d-icon d-icon--size-500" aria-label="crying face" alt="😢" title="crying face" src="https://cdn.jsdelivr.net/joypixels/assets/6.6/png/unicode/32/1f622.png" style="" />
  </span>
  <span> and </span>
  <span class="d-emoji d-icon d-icon--size-500">
    <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-500" style="display: none;">
      <div class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate" style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"></div>
    </div>
    <img class="d-icon d-icon--size-500" aria-label="grinning face with smiling eyes" alt="😄" title="grinning face with smiling eyes" src="https://cdn.jsdelivr.net/joypixels/assets/6.6/png/unicode/32/1f604.png" style="" />
  </span>
  <span>, and custom emojis :octocat: :shipit: </span>
</div>
'
vueCode='
<dt-emoji-text-wrapper>
  Some text with :invalid-emoji: :smile: :cry: and 😄, and custom emojis :octocat: :shipit:
</dt-emoji-text-wrapper>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="emojitextwrapper" />
