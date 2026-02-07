# Emoji Text Wrapper

Wrapper to find and replace shortcodes like :smile: or unicode chars such as 😄 with our custom Emojis implementation.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-emoji-text-wrapper--default
- **Keywords**: emoji support,emoticon wrapper,d-emoji-text-wrapper,DtEmojiTextWrapper,dt-emoji-text-wrapper

## Variants and Examples

### Text Only

```vue
<dt-text kind="body" size="md">
  <dt-emoji-text-wrapper>
    Some text with :invalid-emoji: :smile: :cry: and 😄, and custom emojis :octocat: :shipit:
  </dt-emoji-text-wrapper>
</dt-text
```

### Variants

```vue
<dt-stack gap="500" ref="variantsExample">
  <dt-emoji-text-wrapper>
    <button class="d-btn d-btn--primary d-btn--danger">
      Button with shortcode :cry: emoji
    </button>
  </dt-emoji-text-wrapper>
  <dt-text kind="body" size="md">
    <dt-emoji-text-wrapper>
      Text only with unicode 😃 emoji
    </dt-emoji-text-wrapper>
  </dt-text>
  <dt-emoji-text-wrapper>
    <button class="d-btn d-btn--primary">
      Button wrapper :smile:
    </button>
  </dt-emoji-text-wrapper>
  <dt-text kind="body" size="md">
    <dt-emoji-text-wrapper size="800">
      Bigger emoji size :smile:
    </dt-emoji-text-wrapper>
  </dt-text>
  <dt-text kind="body" size="md">
    <dt-emoji-text-wrapper size="300">
      Smaller emoji size :smile:
    </dt-emoji-text-wrapper>
  </dt-text>
</dt-stack>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `elementType` | Element type (tag name) to use for the wrapper. | `string` | `'div'` |
| `size` | The icon size to render the emojis at: 100 to 800 | `string` | `'500'` |

### Slots

| Name | Description |
| --- | --- |
| `default` |  |

## Usage

### Import

```javascript
import { DtEmojiTextWrapper } from '@dialpad/dialtone-vue';
```

### Limitations

Currently, this wrapper component **can't handle Vue components**, make sure to wrap only native HTML elements and text.

### Custom Emojis

It supports custom emojis, you can use the shortcode to display them. For example, `:octocat:` will render the octocat emoji.
To do this, you need to [set up custom emojis](./emoji.md#custom-emoji) in your application.
