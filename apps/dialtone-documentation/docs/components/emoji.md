---
title: Emoji
description: "Renders an emoji from a shortcode such as :smile: or unicode character such as 😄."
status: ready
thumb: true
image: assets/images/components/emoji.png
figma: planned
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-emoji--default
---

<code-well-header>
  <dt-emoji code=":smile:" />
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <span class="d-emoji d-icon d-icon--size-500" code=":smile:" size="500">
    <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-500" style="display: none;">
      <div 
        class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate" 
        style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;">
      </div>
    </div>
    <img 
      aria-label="grinning face with smiling eyes" 
      alt="😄" 
      title="grinning face with smiling eyes" 
      src="https://static.dialpadcdn.com/joypixels/svg/unicode/1f604.svg" 
      class="d-icon d-icon--size-500" 
    />
  </span>
</div>
'
vueCode='
<dt-emoji
  code="smile"
  size="500"
/>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="emoji" />
