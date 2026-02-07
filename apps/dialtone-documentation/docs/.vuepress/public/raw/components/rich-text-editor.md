# Rich Text Editor

A rich text editor is a component that allows users to format text with a variety of styles. It enables also mixing text with custom components built as extensions, such as links and user mentions.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-rich-text-editor--default
- **Keywords**: rte, wysiwyg, markdown, d-rte, DtRichTextEditor, dt-rich-text-editor, content editor, rich editor

## Base Style

The editor itself is without any styling and the intention is to wrap it with another component, such as Message Input, that provides the UI.

```vue
<dt-rich-text-editor
  v-model="value"
  :editable="true"
  input-aria-label="this is a descriptive label"
  :input-class="$attrs.inputClass"
  :output-format="$attrs.outputFormat"
  :auto-focus="false"
  placeholder="Type here..."
  :link="true"
/>
```

## With Links

## Output Format

There are 3 defined output formats currently for the input text.

### Text

Provide prop `outputFormat: 'text'`

Plain text format as output without taking into consideration any marks (italics, bold) / html tags/ codeblocks
that may be included in the input text user provides.

### Json

Provide prop `outputFormat: 'json'`

the input will be formatted as a json document that can then be consumed by product.
The type of the each node in the input will be present for example: `codeblock`, `image`
along with other meta data pertaining to the text node.

### HTML

Provide prop `outputFormat: 'html'`

the input will be formatted as native html that can then be consumed by product.

## Tiptap Plugins Used

### [HardBreak](https://tiptap.dev/api/nodes/hard-break)

HardBreak plugin is used to add support for `<br>` tags in the rich text editor.

### [CodeBlocks](https://tiptap.dev/api/nodes/code-block)

Codeblock plugin is used to enable the support for code and also specify the language. Type ``` followed by space
or ~~~ with space to enable a codeblock in the rich text editor.

### [Placeholder](https://tiptap.dev/api/extensions/placeholder)

Provides support to enable placeholder support

### [Mention](https://tiptap.dev/api/nodes/mention)

The tiptap Mention plugin is apt for our use case of mentioning users or channels within the editor.
It also creates the respective nodes with ability for user to customize the trigger character.

#### How to Use the Mention Plugin:

When using the Rich Text editor, the developer would have to pass in the suggestion object prop
which MUST contain an items function that takes in a query and returns a list of object with the properties:

```json
{
  id: String,
  name: String,
  avatarSrc: String
}
```

There can be additional properties that override the mention plugin and
more details can be seen here: [Suggestion Tiptap utility](https://tiptap.dev/api/utilities/suggestion).
If this mentionSuggestion Object prop is not supplied, the mention plugin is disabled by default.

To see it in action type char '@' into rich editor With channel mentions.

```vue
<dt-rich-text-editor
  v-model="value"
  :editable="true"
  input-aria-label="this is a descriptive label"
  :input-class="$attrs.inputClass"
  :output-format="$attrs.outputFormat"
  :auto-focus="false"
  placeholder="Type here..."
  :link="true"
  :mentionSuggestion="{ items }"
/>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `modelValue` | Value of the input. The object format should match TipTap's JSON document structure: https://tiptap.dev/guide/output#option-1-json | `object\|string` | `''` |
| `editable` | Whether the input is editable | `boolean` | `true` |
| `preventTyping` | Prevents the user from typing any further. Deleting text will still work. | `boolean` | `false` |
| `pasteRichText` | When this option is false the editor will only ever paste plain text, no rich text formatting will be applied, and any HTML will be rendered as text. | `boolean` | `true` |
| `allowLineBreaks` | Whether the input allows for line breaks to be introduced in the text by pressing enter. If this is disabled, line breaks can still be entered by pressing shift+enter. | `boolean` | `false` |
| `inputAriaLabel` | Descriptive label for the input element | `string` | `''` |
| `inputClass` | Additional class name for the input element. Only accepts a String value because this is passed to the editor via options. For multiple classes, join them into one string, e.g. "d-p8 d-hmx96" | `string` | `''` |
| `autoFocus` | Whether the input should receive focus after the component has been mounted. Either one of `start`, `end`, `all` or a Boolean or a Number. - `start` Sets the focus to the beginning of the input - `end` Sets the focus to the end of the input - `all` Selects the whole contents of the input - `Number` Sets the focus to a specific position in the input - `true` Defaults to `start` - `false` Disables autofocus | `boolean\|string\|number` | `false` |
| `outputFormat` | The output format that the editor uses when emitting the "@input" event. One of `text`, `json`, `html`, `markdown`. See https://tiptap.dev/guide/output for examples. | `string` | `'html'` |
| `placeholder` | Placeholder text | `string` | `''` |
| `link` | Enables the TipTap Link extension and optionally passes configurations to it It is not recommended to use this and the custom link extension at the same time. | `boolean\|object` | `false` |
| `customLink` | Enables the Custom Link extension and optionally passes configurations to it It is not recommended to use this and the built in TipTap link extension at the same time. The custom link does some additional things on top of the built in TipTap link extension such as styling phone numbers and IP adresses as links, and allows you to linkify text without having to type a space after the link. Currently it is missing some functionality such as editing links and will likely require more work to be fully usable, so it is recommended to use the built in TipTap link for now. | `boolean\|object` | `false` |
| `mentionSuggestion` | suggestion object containing the items query function. The valid keys passed into this object can be found here: https://tiptap.dev/api/utilities/suggestion The only required key is the items function which is used to query the contacts for suggestion. items({ query }) => { return [ContactObject]; } ContactObject format: { name: string, avatarSrc: string, id: string } When null, it does not add the plugin. | `object` | `null` |
| `channelSuggestion` | suggestion object containing the items query function. The valid keys passed into this object can be found here: https://tiptap.dev/api/utilities/suggestion The only required key is the items function which is used to query the channels for suggestion. items({ query }) => { return [ChannelObject]; } ChannelObject format: { name: string, id: string, locked: boolean, channelKey?: string } When null, it does not add the plugin. Setting locked to true will display a lock rather than hash. | `object` | `null` |
| `slashCommandSuggestion` | suggestion object containing the items query function. The valid keys passed into this object can be found here: https://tiptap.dev/api/utilities/suggestion The only required key is the items function which is used to query the slash commands for suggestion. items({ query }) => { return [SlashCommandObject]; } SlashCommandObject format: { command: string, description: string, parametersExample?: string } The "parametersExample" parameter is optional, and describes an example of the parameters that command can take. When null, it does not add the plugin. Note that slash commands only work when they are the first word in the input. | `object` | `null` |
| `allowBlockquote` | Whether the input allows for block quote. | `boolean` | `true` |
| `allowBold` | Whether the input allows for bold to be introduced in the text. | `boolean` | `true` |
| `allowBulletList` | Whether the input allows for bullet list to be introduced in the text. | `boolean` | `true` |
| `allowItalic` | Whether the input allows for italic to be introduced in the text. | `boolean` | `true` |
| `allowStrike` | Whether the input allows for strike to be introduced in the text. | `boolean` | `true` |
| `allowUnderline` | Whether the input allows for underline to be introduced in the text. | `boolean` | `true` |
| `allowCode` | Whether the input allows inline code (wrapped in backticks). | `boolean` | `true` |
| `allowCodeblock` | Whether the input allows codeblock to be introduced in the text. | `boolean` | `true` |
| `allowInlineImages` | Whether the input allows inline images to be rendered. | `boolean` | `false` |
| `allowFontColor` | Whether the input allows color to be introduced in the text. | `boolean` | `false` |
| `allowFontFamily` | Whether the input allows different font-families to be introduced in the text. | `boolean` | `false` |
| `additionalExtensions` | Additional TipTap extensions to be added to the editor. | `array` | `[]` |
| `hideLinkBubbleMenu` | Manually hide the link bubble menu. The link bubble menu is shown when a link is selected via the cursor. There are some cases when you may want the link to remain selected but hide the bubble menu such as when You are showing a custom link editor popup. | `boolean` | `false` |
| `useDivTags` | Show text in HTML div tags instead of paragraph tags | `boolean` | `false` |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `input` | Editor input event | `union` |
| `json-input` | Input event always in JSON format. | `JSON` |
| `html-input` | Input event always in HTML format. | `HTML` |
| `text-input` | Input event always in text format. | `String` |
| `markdown-input` | Input event always in markdown format. | `String` |
| `update:modelValue` | Event to sync the value with the parent | `union` |
| `blur` | Editor blur event | `FocusEvent` |
| `focus` | Editor focus event | `FocusEvent` |
| `enter` | Enter was pressed. Note that shift enter must be pressed to line break the input. | `String` |
| `edit-link` | "Edit link" button was clicked. Fires an event for the consuming component to handle the editing of the link. event contains the link object with two properties href and text. | `Object` |
| `selected` | "Selected" event is fired when the user selects text in the editor. returns the currently selected text. If the selected text is partially a link, the full link text is returned. | `String` |
| `selected-command` | Event fired when a slash command is selected | `String` |
| `mention-click` | Event fired when a mention is clicked | `Object` |
| `channel-click` | Event fired when a channel is clicked | `Object` |
