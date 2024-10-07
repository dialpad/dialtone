---
title: Rich text editor
description: A rich text editor is a component that allows users to format text with a variety of styles. It enables also mixing text with custom components built as extensions, such as links and user mentions.
status: ready
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-rich-text-editor--default
---

<code-well-header>
  <example-rich-text-editor :modelValue="defaultValue" />
</code-well-header>

## Base Style

The editor itself is without any styling and the intention is to wrap it with another component, such as Message Input, that provides the UI.

<code-well-header>
  <example-rich-text-editor :modelValue="defaultValue" />
</code-well-header>

<code-example-tabs
vueCode='
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
'
/>

## With links

<code-well-header>
  <example-rich-text-editor
    modelValue="<p>The editor can autolink URLs: <a target='_blank' rel='noopener noreferrer nofollow' class='d-link d-wb-break-all' href='http://dialpad.com'>dialpad.com</a>, <a target='_blank' rel='noopener noreferrer nofollow' class='d-link d-wb-break-all' href='https://www.dialpad.com/about-us/'>https://www.dialpad.com/about-us/</a>, email addresses: <a target='_blank' rel='noopener noreferrer nofollow' class='d-link d-wb-break-all' href='mailto:noreply@dialpad.com'>noreply@dialpad.com</a></p>"
  />
</code-well-header>

## Output format

There are 3 defined output formats currently for the input text.

### Text

Provide prop `outputFormat: 'text'`

Plain text format as output without taking into consideration any marks (italics, bold) / html tags/ codeblocks
that may be included in the input text user provides.

### Json

Provide prop `outputFormat: 'json'`

the input will be formated as a json document that can then be consumed by product.
The type of the each node in the input will be present for example: `codeblock`, `image`
along with other meta data pertaining to the text node.

### HTML

Provide prop `outputFormat: 'html'`

the input will be formated as native html that can then be consumed by product.

## Tiptap Plugins Used

### [HardBreak](https://tiptap.dev/api/nodes/hard-break)

HardBreak plugin is used to add support for `<br>` tags in the rich text editor.

### [CodeBlocks](https://tiptap.dev/api/nodes/code-block)

Codeblock plugin is used to enaable the support for code and also specify the language. Type ``` followed by space
or ~~~ with space to enable a codeblock in the rich text editor.

### [Placeholder](https://tiptap.dev/api/extensions/placeholder)

Provides support to enable placeholder support

### [Mention](https://tiptap.dev/api/nodes/mention)

The tiptap Mention plugin is apt for our use case of mentioning users or channels within the editor.
It also creates the respective nodes with ability for user to customize the trigger character.

#### How to use the Mention plugin:

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

<code-well-header>
  <example-rich-text-editor
    modelValue="<p>The editor can also suggest mentions: <mention-component name='Test Person' avatarsrc='' id='test.person'></mention-component>, <mention-component name='Test Person 2' avatarsrc='' id='test.person2'></mention-component>! The suggestions dropdown will wait 1000ms to simulate an API call.</p>"
    :mentionSuggestion="{ items }"
  />
</code-well-header>

<code-example-tabs
vueCode='
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
'
/>

## Vue API

<component-vue-api component-name="richtexteditor" />

<script setup>
import ExampleRichTextEditor from '@exampleComponents/ExampleRichTextEditor.vue';

const defaultValue = `<p>I am not a standalone component, please use Message Input instead <emoji-component code=":v_tone3:">
      </emoji-component><emoji-component code=":robot:"></emoji-component>!</p>`;

const CONTACT_LIST = [
  {
    id: 'test.person',
    name: 'Test Person',
    avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
  },
  {
    id: 'test.person2',
    name: 'Test Person 2',
    avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
  },
  {
    id: 'test.person3',
    name: 'Test Person 3',
    avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
  },
  {
    id: 'brad.paugh',
    name: 'Brad Paugh',
    avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
  },
  {
    id: 'bradley.hawkins',
    name: 'Bradley Hawkins',
    avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
  },
  {
    id: 'julio.ortega',
    name: 'Tico Ortega',
    avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
  },
  {
    id: 'ignacio.Ropolo',
    name: 'Ignacio Ropolo',
    avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
  },
  {
    id: 'nina.repetto',
    name: 'Nina Repetto',
    avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
  },
  {
    id: 'long.name',
    name: 'LongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongnameLongname',
    avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
  },
  {
    id: 'long.name.with.spaces',
    name: 'Long Name Long Name Long Name Long NameLong Name Long Name Long Name Long NameLong Name Long Name Long Name Long NameLong Name Long Name Long Name Long NameLong Name Long Name Long Name Long Name ',
    avatarSrc: 'https://avatars.githubusercontent.com/u/13851061?s=460&u=1f1b5b0b5b2b2b2b2b2b2b2b2b2b2b2b2b2b2b&v=4',
  },
];

async function items ({ query }) {
  // simulate an API call by waiting 1000 seconds.
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (query.length === 0) return CONTACT_LIST;
  return CONTACT_LIST.filter((contact) => { return contact.name.toLowerCase().startsWith(query.toLowerCase()); });
};

</script>
