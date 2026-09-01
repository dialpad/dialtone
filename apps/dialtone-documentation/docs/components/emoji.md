---
title: Emoji
description: Renderer for emoji shortcodes and Unicode characters.
status: ready
thumb: true
figma: planned
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-emoji--default
keywords: ["emoticon","smiley","d-emoji","DtEmoji","dt-emoji"]
combinator: DtEmoji
---

## Variants and Examples

### With Shortcode

```vue demo
<dt-emoji code=":smile:" size="500" />
```

### With Unicode

```vue demo
<dt-emoji code="😉" />
```

### With Skin Tone

```vue demo
<dt-emoji code=":raised_hand_tone4:" />
```

### Sizes

```vue demo
<dt-stack direction="row" gap="100" align="center">
  <dt-emoji v-for="size in sizes" :size="size" code=":smile:" />
</dt-stack>
<!-- @code -->
<dt-emoji size="100|200|300|400|500|600|700|800" code=":smile:" />
```

## Assets

Dialtone Vue uses [JoyPixels 8.0](https://joypixels.com/) to render emojis. When using this component, Dialtone Vue will use the free joypixels assets hosted on jsdelivr CDN by default. You may wish to use self hosted joypixels assets such as the SVGs only available to premium license holders. The examples shown here use the free 32px PNGs for emojis 16px and under, and the premium SVGs for emoji's larger than 16px. You may set a custom URL for small emojis and large emojis with the following functions during initialization of your app:

```javascript
import { setEmojiAssetUrlSmall, setEmojiAssetUrlLarge } from '@dialpad/dialtone-vue'

// 16px and smaller
setEmojiAssetUrlSmall('https://my.example.website.com/joypixels/svg/unicode/32/', '.png')
// larger than 16px
setEmojiAssetUrlLarge('https://my.example.website.com/joypixels/svg/unicode/', '.svg')
```

Please be aware of JoyPixels [licensing requirements](https://joypixels.com/licenses). You may not use JoyPixels assets for business use without a license.

### Custom Emoji

It's possible to provide a custom emoji JSON file [with this structure](#json-structure) in order to support emojis that aren't part of the Unicode standard. To do so, first specify where the assets are and set the raw JSON:

```javascript
import { setCustomEmojiUrl, setCustomEmojiJson } from '@dialpad/dialtone-vue'
// Your local custom emoji JSON file
import customEmojiJson from './data/custom-emoji.json'

// Custom Emojis
setCustomEmojiUrl('https://my.example.website.com/images/icons/emoji/');
setCustomEmojiJson(customEmojiJson);
```

```vue demo
<dt-emoji code=":shipit:" />
```

In this example, the emoji with the :shipit: shortcode from the custom emoji provided will be rendered. Take into account that a custom emoji can only be referenced by the shortcode as no Unicode character is associated with it.

### JSON Structure

It follows a similar structure to the [standard emoji json file](https://raw.githubusercontent.com/joypixels/emoji-toolkit/master/emoji_strategy.json), though there are some specific properties used in the custom emoji json.

```json
{
  "shipit": {
    "name": "shipit",
    "category": "",
    "shortname": ":shipit:",
    "shortname_alternates": [],
    "keywords": [
      "ship",
      "it",
      "github"
    ],
    "extension": ".png", // .png or .svg
    "custom": true // Boolean
  }
}
```

The required properties are `name`, `category`, `shortname`, `extension`, `custom`.

### Modify Data in Native Emojis

It's possible to modify or add data to a native emoji using the codepoint as the key of the object.

In the following example, as the `keywords` property is an array, this will extend the keywords in the native emoji.

```json
{
  "1f615": {
    "keywords": ["thinking", "not sure", "unknown"],
  },
}
```

In case the property is a string, it will overwrite the property of the native emoji.

```json
{
  "1f913": {
    "shortname": ":nerdface:",
  },
}
```

## Emoji Metadata

You may access the full list of supported native emojis and all emoji metadata by importing the following function and executing it:

```javascript
import { getEmojiData } from 'dialtone-vue'
const emojiData = getEmojiData();
```

You may retrieve the data for an emoji by using the unicode string as an object key:

```javascript
emojiData['1f600'].name // returns "grinning face"

// when skintone, the unicode strings for the emoji and skin tone are separated by a -
emojiData['1f482-1f3fb'].shortname // returns ":guard_tone1:"
```

If you have setup a custom emoji json, you can get the resulting json (from the native and custom emojis) with:

```javascript
import { getEmojiData } from 'dialtone-vue'
const emojiData = getEmojiData();
```

## Accessibility

By default the emoji will be rendered with an aria-label attribute describing the emoji so it can be read by Assistive Technology. This component does not do any translation, so if you need it to be i18n compatible you must pass in your own text via the ariaLabel prop. You can access the descriptions using the `getEmojiData` function as mentioned above.

## References

* [JoyPixels](https://joypixels.com/) - Our emoji assets
* [emojipedia](https://emojipedia.org/) - Good for looking up details about specific emojis.

<script setup>

const sizes = ['100', '200', '300', '400', '500', '600', '700', '800'];

</script>

## Vue API

<component-vue-api component-name="emoji" />
