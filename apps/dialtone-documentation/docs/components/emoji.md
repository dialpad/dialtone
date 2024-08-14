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

## Variants and examples

### With shortcode

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

### With unicode

<code-well-header>
  <dt-emoji code="😉" ref="exampleUnicode" />
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs['exampleUnicode']"
vueCode='
<dt-emoji code="😉" />
'
/>

### With skin tone

<code-well-header>
  <dt-emoji code=":raised_hand_tone4:" ref="exampleSkinTone" />
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.exampleSkinTone"
vueCode='
<dt-emoji code=":raised_hand_tone4:" />
'
/>

### Sizes

<code-well-header>
  <div class="d-d-inline-flex d-ai-center d-flow8" ref="exampleSizes">
    <dt-emoji v-for="size in sizes" :size="size" code=":smile:" />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.exampleSizes"
vueCode='
<dt-emoji size="100" code=":smile:" />
<dt-emoji size="200" code=":smile:" />
<dt-emoji size="300" code=":smile:" />
<dt-emoji size="400" code=":smile:" />
<dt-emoji size="500" code=":smile:" />
<dt-emoji size="600" code=":smile:" />
<dt-emoji size="700" code=":smile:" />
<dt-emoji size="800" code=":smile:" />
'
/>

## Vue API

<component-vue-api component-name="emoji" />

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

### Custom emoji

It's possible to provide a custom emoji JSON file [with this structure](#json-structure) in order to support emojis that aren't part of the Unicode standard. To do so, first specify where the assets are and set the raw JSON:

```javascript
import { setCustomEmojiUrl, setCustomEmojiJson } from '@dialpad/dialtone-vue'
// Your local custom emoji JSON file
import customEmojiJson from './data/custom-emoji.json'

// Custom Emojis
setCustomEmojiUrl('https://my.example.website.com/images/icons/emoji/');
setCustomEmojiJson(customEmojiJson);
```

<code-well-header>
  <dt-emoji code=":shipit:" ref="customExample" />
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.customExample"
vueCode='
<dt-emoji code=":shipit:" />
'
/>

In this example, the emoji with the :shipit: shortcode from the custom emoji provided will be rendered. Take into account that a custom emoji can only be referenced by the shortcode as no Unicode character is associated with it.

### JSON structure

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

### Modify data in native emojis

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

## Emoji metadata

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
* [emoji-toolkit](https://github.com/joypixels/emoji-toolkit) - Helper library we use to render joypixels
* [emojipedia](https://emojipedia.org/) - Good for looking up details about specific emojis.

<script setup>

const sizes = ['100', '200', '300', '400', '500', '600', '700', '800'];

</script>
