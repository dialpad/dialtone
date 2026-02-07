# Type in Product

Clear, legible, and easy-to-read text.

- **Keywords**: font family, font weight, font size, line height, system font, san francisco, roboto, ui font

## Font Properties

### Font Family

Dialtone's product UI font stack defers to the user's default system font, ensuring a seamless native experience.

### Font Weight

Four weights for clear hierarchy and visual contrast among different elements.

### Font Size

Dictates the scale of text, enhancing readability and defining information hierarchy across content.

### Line Height

Adjusts vertical spacing between lines of text, optimizing legibility and text flow.

## Styles

Product UI text can be characterized as one of **Headline**, **Body**, **Label**, or **Code**.

### Vue Component

Use the [DtText](../components/text.md) component as the primary way to apply typography styles. The component provides a semantic, prop-driven API that's easier to maintain and ensures consistent usage across your application.

```html
<dt-text kind="headline|body|label|code" size="{size}" {{props}}>...</dt-text>
```

### CSS Utility

Text Style CSS utilities should be considered a last resort or as a fallback for non-Vue contexts.

```html
<el class="d-text-{category}--{size}">...</el>
```

### Headlines

Titles and headings to establish hierarchy and set the tone of contextual groupings.


| Class | Output |
| --- | --- |
| .d-text-headline--3xl | font: var(--dt-text-headline-3xl) |
| .d-text-headline--2xl | font: var(--dt-text-headline-2xl) |
| .d-text-headline--xl | font: var(--dt-text-headline-xl) |
| .d-text-headline--lg | font: var(--dt-text-headline-lg) |
| .d-text-headline--md | font: var(--dt-text-headline-md) |
| .d-text-headline--sm | font: var(--dt-text-headline-sm) |
| .d-text-headline--xs | font: var(--dt-text-headline-xs) |
### Body

Default text style for longer-form prose content, designed for comfort and clarity in reading varying lengths.


| Class | Output |
| --- | --- |
| .d-text-body--lg | font: var(--dt-text-body-lg) |
| .d-text-body--md | font: var(--dt-text-body-md) |
| .d-text-body--sm | font: var(--dt-text-body-sm) |
| .d-text-body--xs | font: var(--dt-text-body-xs) |
### Label

Shorter-length copy like form fields, buttons, and other UI-labeling elements, ensuring clear navigation and
interaction.


| Class | Output |
| --- | --- |
| .d-text-label--lg | font: var(--dt-text-label-lg) |
| .d-text-label--md | font: var(--dt-text-label-md) |
| .d-text-label--sm | font: var(--dt-text-label-sm) |
| .d-text-label--xs | font: var(--dt-text-label-xs) |
### Code

Code snippets, technical commands, or data values rendered as a monospaced font.


| Class | Output |
| --- | --- |
| .d-text-code--lg | font: var(--dt-text-code-lg) |
| .d-text-code--md | font: var(--dt-text-code-md) |
| .d-text-code--sm | font: var(--dt-text-code-sm) |
| .d-text-code--xs | font: var(--dt-text-code-xs) |
## Examples

### Profile Card

```vue
<dt-stack gap="500">
  <dt-stack gap="400" class="d-jc-space-between">
    <dt-stack>
      <dt-text as="h2" kind="headline" size="xl" strength="medium" density="200" class="d-fs-400">
        Katie Rodriguez
      </dt-text>
      <dt-stack direction="row" gap="350">
        <dt-text tone="success">
          Available
        </dt-text>
        <dt-text>&bull;</dt-text>
        <dt-text tone="tertiary">
          Working from coffee shop
        </dt-text>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="200">
      <dt-text kind="body" size="md" density="200" strength="semibold" tone="tertiary">
        Chief Customer Success Officer
      </dt-text>
      <dt-text kind="body" size="sm" density="200">
        <dt-text strength="semibold">
          6:19 am
        </dt-text> local time
      </dt-text>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="400" direction="row" class="d-jc-space-between">
    <dt-button class="d-fl1" kind="muted" importance="outlined">
      <template #icon="{ iconSize }">
        <dt-icon-phone :size="iconSize" />
      </template>
      Call
    </dt-button>
    <dt-button class="d-fl1" kind="muted" importance="outlined">
      <template #icon="{ iconSize }">
        <dt-icon-quick-reply :size="iconSize" />
      </template>
      Message
    </dt-button>
    <dt-button class="d-fl1" kind="muted" importance="outlined">
      <template #icon="{ iconSize }">
        <dt-icon-video :size="iconSize" />
      </template>
      Meet
    </dt-button>
  </dt-stack>
</dt-stack>
```

### Hero

```vue
<dt-stack gap="500">
  <dt-stack>
    <dt-text as="h2" kind="headline" size="2xl">AI that works for you</dt-text>
    <dt-text kind="body" size="lg">Support customers, drive sales, and collaborate with your team—all in one, beautiful AI-powered app.</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="500" align="start">
    <dt-stack>
      <dt-text as="h3" kind="headline" size="xl">AI Contact Center</dt-text>
      <dt-text as="p" kind="body" size="md">The world’s most advanced customer engagement platform</dt-text>
    </dt-stack>
    <dt-stack>
      <dt-text as="h3" kind="headline" size="xl">AI Voice</dt-text>
      <dt-text as="p" kind="body" size="md">Say hello to the world’s smartest business phone</dt-text>
    </dt-stack>
    <dt-stack>
      <dt-text as="h3" kind="headline" size="xl">AI Meetings</dt-text>
      <dt-text as="p" kind="body" size="md">AI-powered video meetings with built-in transcriptions</dt-text>
    </dt-stack>
  </dt-stack>
</dt-stack>
```

## API

Each typography style is expressed through a shorthand `font` property, and its value's design token contains all font styles, e.g. `font-size`, `line-height`, `font-family`, etc,
| Class | Output |
| --- | --- |
| .d-text-headline--3xl | font: var(--dt-text-headline-3xl) |
| .d-text-headline--2xl | font: var(--dt-text-headline-2xl) |
| .d-text-headline--xl | font: var(--dt-text-headline-xl) |
| .d-text-headline--lg | font: var(--dt-text-headline-lg) |
| .d-text-headline--md | font: var(--dt-text-headline-md) |
| .d-text-headline--sm | font: var(--dt-text-headline-sm) |
| .d-text-headline--xs | font: var(--dt-text-headline-xs) |
| .d-text-body--lg | font: var(--dt-text-body-lg) |
| .d-text-body--md | font: var(--dt-text-body-md) |
| .d-text-body--sm | font: var(--dt-text-body-sm) |
| .d-text-body--xs | font: var(--dt-text-body-xs) |
| .d-text-code--lg | font: var(--dt-text-code-lg) |
| .d-text-code--md | font: var(--dt-text-code-md) |
| .d-text-code--sm | font: var(--dt-text-code-sm) |
| .d-text-code--xs | font: var(--dt-text-code-xs) |
| .d-text-label--lg | font: var(--dt-text-label-lg) |
| .d-text-label--md | font: var(--dt-text-label-md) |
| .d-text-label--sm | font: var(--dt-text-label-sm) |
| .d-text-label--xs | font: var(--dt-text-label-xs) |

## Pages

- [Type in Marketing](typography/marketing.md)
