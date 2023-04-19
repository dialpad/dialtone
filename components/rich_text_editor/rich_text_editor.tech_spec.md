# Dialtone Rich Text Editor

**Originally published:** 16-03-2023

**Original author:** Mika Paulasaari

# Overview

We have identified a need for a rich text editor component. After investigating
our options we [decided](docs/decisions/0004-rich-text-editor.md) to move
forward with TipTap, which is a 3rd party rich text editor. This document
outlines the high level plan for how we can componentize the TipTap editor into
a Dialtone component and how we can create custom extensions for it using other
Dialtone components.

## Scope

Initially we're aiming for feature parity with Dialpad 1.0 message input and the
existing feed item rich media structure, so we wont implement most of the rich
text features, but only the following:

- User Mentions
- Channel Hashtags
- Emojis
- Codeblocks
- Links (linkify URLs typed in the editor)

### Out of Scope

- Toolbars and other accessorial UI
- Other rich text features like custom links, bold, italic etc.
- Attachments and other messaging features not directly related to the text
  editor part

# Functional Specification

As a user, I want to:

- Type and edit plain text with line breaks
- Type `@` to see a list to choose an user mention from
- Type `#` to see a list to choose a channel hashtag from
- Add Dialtone Emojis into the input
- Add codeblocks by wrapping text between triple-backticks ` ``` `
- Show typed URLs as links

## UX/UI Designs

The editor itself which we'll build initially wont really have other styling
except for the typography. It can then be used in the context of larger
components, like a message input, that will provide the expected UI around it.
This means that the Rich Text Editor shouldn't be used as a standalone component
at all, but the expectation is to build a Dialtone component around it, like the
Message Input component that we will initially build.

We don't have finalized designs for a rich text editor/input at the time of
writing this, but from
[Dialpad 2.0](https://www.figma.com/file/GJiRmWORmDi0zxLJfwn8yp/DP-2.0-Conversation-View?node-id=0-1&t=xQgjlBGGTCKTAC33-0)
designs we can get an idea of what such might look like in the future. The main
difference to what we're implementing initially is the toolbar at the top.

## Dependencies

The following packages are needed for the core functionality:

- `@tiptap/pm`
  - The core TipTap package
- `@tiptap/vue-2`
  - Vue 2 specific components. Only for the Vue 2 version of Dialtone
- `@tiptap/vue-3`
  - Vue 3 specific components. Only for the Vue 3 version of Dialtone

TipTap has separated each extension into its own package so you can only install
the ones you actually need. These can be added when new features are being
worked on, but initially we need just the following:

- `@tiptap/extension-document`
- `@tiptap/extension-paragraph`
- `@tiptap/extension-text`
  - All three of these are needed for just plain text
- `@tiptap/extension-code-block`
  - For codeblocks
- `@tiptap/extension-mention`
- `@tiptap/suggestion`
  - Can be extended to work for both user mentions and channel hashtags

The TipTap core package is 1.8MB unpacked so because of the large size we don't
want to include it in the core Dialtone-vue build. Furthermore, the editor
component will not be offered as a standalone component at all and it can only
be consumed by other Dialtone components. Therefore to keep the TipTap package
from being bundled into Dialtone core the components that use the editor should
be built into their separate build targets.

At the moment we only know about the Message Input component using the Rich Text
Editor, so we'll build that in a separate `messageinput` build target, similar
to what we're doing with the emoji module. This would keep the core bundle size
smaller for the cases where the Message Input functionality isn't needed. How to
actually then import the component in product:

```js
import { DtMessageInput } from '@dialpad/dialtone-vue/messageinput
```

## Accessibility

For the textarea element TipTap uses a `div` with `contenteditable=true`
attribute and this by standard will make the element keyboard focusable. We
can't change the element type, but we should either define or accept as a prop
and pass through the following attributes:

- `aria-multiline=true`
- `role="textbox"`
- `aria-label="Something descriptive"`
  - Comes from the `inputAriaLabel` prop
- `read-only=true`
  - Only when `editable` prop is set to true

## Configurability

TipTap is a wrapper around ProseMirror, which has a very well defined API with a
lot of ways to configure the editor to different needs. We should be very
selective which APIs we want to expose so that we can keep most of the control
within Dialtone. I'll go into bit more detail in the Technical Architecture
section.

# Technical Architecture

## DtRichTextEditor

This is the Dialtone component that wraps the EditorContent TipTap component and
exposes some of the internal configurations.

`DtRichTextEditor.vue`

```js
import { Editor, EditorContent } from '@tiptap/vue-2';
import { ExtensionName } from './extensions';
```

The template of this component just renders the `EditorContent` component:

```js
<editor-content :editor="editor" />
```

All the configuration is added to the `Editor` instance:

```js
mounted () {
  this.editor = new Editor({
    content: "...",
    editorProps: { ... },
    extensions: [ ... ],
    ...
  });
},
```

The editor requires certain extensions just to enable plain text formatting.
These will be provided by default and are not opt-out:

- Document
- Paragraph
- Text

### Props

#### Extensions

Each extensions will be exposed as a separate prop with a propType
`(Boolean|Object)`. Most of the extensions don't need any configuration, so
it'll be very simple to add them, for example:

```js
<dt-rich-text-editor bold italic />
```

Or if an extension needs options, the object format can be used, for example:

```js
<dt-rich-text-editor :codeblock="{ exitOnArrowDown: false }" />
```

These are the extensions that have been planned out to be supported so far:

- `emoji` (Boolean|Object)
  - Default: `false`
- `mention` (Boolean|Object)
  - Default: `false`
- `hashtag` (Boolean|Object)
  - Default: `false`
- `link` (Boolean|Object)
  - Default: `false`
- `codeblock` (Boolean|Object)
  - Default: `false`

#### Editor settings

These are the settings of the `Editor` that we'll expose. Out of the
[full list](https://tiptap.dev/api/editor#settings) I think these are essential
for the initial implementation:

- `initialValue` (JSON|String)
  - The initial content for the editor, accepts `JSON`, plain `text` or `HTML`
    as a string. The used input format does not necessarily have to match the
    selected output format. Examples of all formats are provided below.
- `editable` (Boolean)
  - Default: `true`
- `autoFocus` (String|Number|Boolean)
  - Disabled by default
  - `"start"` sets the focus to the beginning of the input
  - `"end"` sets the focus to the end of the input
  - `"all"` selects the whole contents of the input
  - `true` defaults to `"start"`
  - `false` disables autofocus
  - `Number` sets the focus to a specific position in the document
- `inputClass` (Array|String)
  - Additional CSS classes to be attached to the editor element
- `inputAriaLabel` (Array|String)
  - Aria-label to be attached to the editor element
- `outputFormat` (String)

  - Either `"text"` which is the default for plain text, `"json"`, or `"html"`.
    For example if the current content of the editor is "I’m running Tiptap in a
    **Dialtone**", where the word "Dialtone" is bolded, then the `text` output
    would be:

    ```txt
    "I’m running Tiptap in Dialtone"
    ```

    and the equivalent `JSON` output would look like:

    ```json
    {
      "type": "doc",
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "I’m running Tiptap in "
            },
            {
              "type": "text",
              "marks": [
                {
                  "type": "bold"
                }
              ],
              "text": "Dialtone"
            }
          ]
        }
      ]
    }
    ```

    and for `HTML`:

    ```txt
    "<p>I’m running Tiptap in <strong>Dialtone</strong></p>"
    ```

### Emits

- `input`
- `update:value/modelValue`
  - payload: current value in the chosen format
- `blur`
  - payload: event
- `focus`
  - payload: event

## Extensions

The extensions should be built in Dialtone using Dialtone components as much as
possible. They should be structured as separate stories for the main Rich Text
Editor component. In code an extension usually consists of two main parts:

1. The extension code that defines how it works. This can create or extend a
   TipTap Node (or a Mark depending on the use case)
2. The node component that wraps the component with the NodeViewWrapper
   component from TipTap

### User Mentions and Channel Hashtags

We can customize the [extension-mention](https://tiptap.dev/api/nodes/mention)
package from TipTap to work for both these cases. We'll build the actual node
components as a separate Dialtone components so that they can be used in the
feed items also. The mentions/channels list dropdowns can probably be purpose
built as TipTap components as I don't envision them being used elsewhere and
they're basically just DT dropdowns with DT list items.

### Emojis

We'll build a custom extension for this that uses DtEmoji as the node component.
The extension should handle inputting or "typing" an emoji and pasting one from
clipboard. To add functionality for searching emojis by typing `:` and some text
can be a stretch goal, but it depends on getting the emoji picker into Dialtone
first.

### Codeblocks

We can customize the
[extension-code-block](https://tiptap.dev/api/nodes/code-block) package from
TipTap. Similar to above, the actual node component is a separate Dialtone
component that we'll have to pass to the extension.

### Links

We'll build a custom extension that recognizes URLs typed/pasted into the editor
and makes them into actual HTML links. Does not allow linkifying non-URL text or
adjusting any attributes on the `<a>` tag itself, but the purpose is more to be
a visual cue to show that an URL was typed.

## Error Handling

The only error handling that comes to mind relates to the content inputted or
typed into the editor. TipTap, or more specifically ProseMirror, will parse any
content pasted into the editor and in the process it strips out any unsupported
content, like unrecognized HTML content, so we get that for free.

## Testing

We need tests for the API we build around the component and for the custom
extensions we create. Unit tests should be enough to accomplish this. For the
editor, we should test that all the props are validated and passed down to the
`Editor` as expected. Similarly, we should check that all the expected events
are emitted.

# Open Questions

- Do we want to build the mention/hashtag pickers as separate components/recipes
  after all?
- The editor element grows in height automatically. Do we want a `max-height`
  prop or should we just support controlling this by passing DT utils classes
  via `editorClass` or more likely by controlling the max-height of the parent
  element?
- Do packages added to Dialtone go through the same OneTrust process?
