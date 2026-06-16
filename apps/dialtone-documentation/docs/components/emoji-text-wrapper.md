---
title: Emoji Text Wrapper
description: "Wrapper to find and replace shortcodes like :smile: or unicode chars such as 😄 with our custom Emojis implementation."
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-emoji-text-wrapper--default
keywords: ["emoji support","emoticon wrapper","d-emoji-text-wrapper","DtEmojiTextWrapper","dt-emoji-text-wrapper"]
---

## Variants and Examples

### Text Only

```vue demo
<dt-text kind="body" :size="300">
  <dt-emoji-text-wrapper>
    Some text with :invalid-emoji: :smile: :cry: and 😄, and custom emojis :octocat: :shipit:
  </dt-emoji-text-wrapper>
</dt-text>
```

### Variants

```vue demo
<!-- @wrapper -->
<dt-stack gap="200">
  <dt-button>
    <dt-emoji-text-wrapper>
      Button with shortcode :cry: emoji
    </dt-emoji-text-wrapper>
  </dt-button>
  <dt-text kind="body" :size="300">
    <dt-emoji-text-wrapper>
      Text only with unicode 😃 emoji
    </dt-emoji-text-wrapper>
  </dt-text>
  <dt-button>
    <dt-emoji-text-wrapper>
      Button wrapper :smile:
    </dt-emoji-text-wrapper>
  </dt-button>
  <dt-text kind="body" :size="300">
    <dt-emoji-text-wrapper size="800">
      Bigger emoji size :smile:
    </dt-emoji-text-wrapper>
  </dt-text>
  <dt-text kind="body" :size="300">
    <dt-emoji-text-wrapper size="300">
      Smaller emoji size :smile:
    </dt-emoji-text-wrapper>
  </dt-text>
</dt-stack>
```

## Usage

### Import

```javascript
import { DtEmojiTextWrapper } from '@dialpad/dialtone-vue';
```

### Limitations

Currently, this wrapper component **can't handle Vue components**, make sure to wrap only native HTML elements and text.

### Custom Emojis

It supports custom emojis, you can use the shortcode to display them. For example, `:octocat:` will render the octocat emoji.
To do this, you need to [set up custom emojis](/components/emoji.md#custom-emoji) in your application.

## Vue API

<component-vue-api component-name="emojitextwrapper" />
