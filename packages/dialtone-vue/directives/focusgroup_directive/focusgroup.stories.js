import { createTemplateFromVueFile } from '@/common/storybook_utils.js';
import DtButton from '@/components/button/button.vue';
import DtLink from '@/components/link/link.vue';
import DtInput from '@/components/input/input.vue';
import DtSelectMenu from '@/components/select_menu/select_menu.vue';
import FocusgroupDirectiveEventsTemplate from './focusgroup_directive_events.story.vue';
import FocusgroupDirectiveRecipesTemplate from './focusgroup_directive_recipes.story.vue';

export const argsData = {};
export const argTypesData = {};

export default {
  title: 'Directives/Focusgroup',
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// ── Helper: inline story with single source of truth ────────
const inline = (components, template) => ({
  render: () => ({ components, template }),
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    docs: { source: { code: template, language: 'html' } },
  },
});

// ── Default: horizontal toolbar ─────────────────────────────
export const Default = inline({ DtButton }, `\
<dt-stack v-dt-focusgroup="'horizontal'" direction="row" gap="100" role="toolbar" aria-label="Text formatting">
  <dt-button kind="muted" importance="outlined">Bold</dt-button>
  <dt-button kind="muted" importance="outlined">Italic</dt-button>
  <dt-button kind="muted" importance="outlined">Underline</dt-button>
  <dt-button kind="muted" importance="outlined" aria-disabled="true" class="d-btn--disabled">
    Strikethrough (disabled)
  </dt-button>
  <dt-button kind="muted" importance="outlined">Code</dt-button>
</dt-stack>`);

// ── Object syntax ───────────────────────────────────────────
export const ObjectSyntax = inline({ DtButton }, `\
<dt-stack v-dt-focusgroup="{ axis: 'vertical', loop: false }" gap="100" role="listbox" aria-label="Fruits" class="d-w-400">
  <dt-button role="option" kind="muted" importance="outlined">Apple</dt-button>
  <dt-button role="option" kind="muted" importance="outlined">Banana</dt-button>
</dt-stack>`);

// ── Vertical toolbar ────────────────────────────────────────
export const Vertical = inline({ DtButton }, `\
<dt-stack v-dt-focusgroup="'vertical'" gap="100" role="toolbar" aria-orientation="vertical" aria-label="Formatting" class="d-w-400">
  <dt-button kind="muted" importance="outlined">Bold</dt-button>
  <dt-button kind="muted" importance="outlined">Italic</dt-button>
  <dt-button kind="muted" importance="outlined">Underline</dt-button>
</dt-stack>`);

// ── No value (defaults: both axes, loop, memory) ────────────
export const Defaults = inline({ DtButton }, `\
<dt-stack v-dt-focusgroup direction="row" gap="100" role="radiogroup" aria-label="Options">
  <dt-button role="radio" kind="muted" importance="outlined">A</dt-button>
  <dt-button role="radio" kind="muted" importance="outlined">B</dt-button>
  <dt-button role="radio" kind="muted" importance="outlined">C</dt-button>
</dt-stack>`);

// ── Noloop ──────────────────────────────────────────────────
export const Noloop = inline({ DtButton }, `\
<dt-stack v-dt-focusgroup="'horizontal noloop'" direction="row" gap="100" role="toolbar" aria-label="Pagination">
  <dt-button kind="muted" importance="outlined">First</dt-button>
  <dt-button kind="muted" importance="outlined">Previous</dt-button>
  <dt-button kind="muted" importance="outlined">Next</dt-button>
  <dt-button kind="muted" importance="outlined">Last</dt-button>
</dt-stack>`);

// ── Nomemory ────────────────────────────────────────────────
export const Nomemory = inline({ DtButton }, `\
<dt-stack v-dt-focusgroup="'horizontal nomemory'" direction="row" gap="100" role="toolbar" aria-label="Actions">
  <dt-button kind="muted" importance="outlined">Cut</dt-button>
  <dt-button kind="muted" importance="outlined">Copy</dt-button>
  <dt-button kind="muted" importance="outlined">Paste</dt-button>
</dt-stack>`);

// ── Disabled items ──────────────────────────────────────────
export const DisabledSkipped = inline({ DtButton }, `\
<dt-stack v-dt-focusgroup="'horizontal'" direction="row" gap="100" role="toolbar" aria-label="Tools">
  <dt-button kind="muted" importance="outlined">Pen</dt-button>
  <dt-button kind="muted" importance="outlined" aria-disabled="true" disabled>Eraser (disabled)</dt-button>
  <dt-button kind="muted" importance="outlined">Highlighter</dt-button>
</dt-stack>`);

export const DisabledFocusable = inline({ DtButton }, `\
<dt-stack v-dt-focusgroup="'horizontal nomemory'" direction="row" gap="100" role="tablist" aria-label="Platforms">
  <dt-button role="tab" kind="muted" importance="outlined">Mac</dt-button>
  <dt-button role="tab" kind="muted" importance="outlined" aria-disabled="true" class="d-btn--disabled">Windows (disabled)</dt-button>
  <dt-button role="tab" kind="muted" importance="outlined">Linux</dt-button>
</dt-stack>`);

// ── Item opt-out ────────────────────────────────────────────
export const OptOut = inline({ DtButton, DtInput, DtLink }, `\
<dt-stack v-dt-focusgroup="'horizontal'" direction="row" gap="100" role="toolbar" aria-label="Formatting with opt-out">
  <dt-button kind="muted" importance="outlined">Bold</dt-button>
  <dt-input data-dt-focusgroup-skip placeholder="This will be skipped" />
  <dt-button kind="muted" importance="outlined">Code</dt-button>
  <dt-link data-dt-focusgroup-skip>Skipped Text link</dt-link>
  <dt-button kind="muted" importance="outlined">Code</dt-button>
</dt-stack>`);

// ── Mixed focusable elements ────────────────────────────────
export const Mixed = inline({ DtButton, DtLink, DtSelectMenu }, `\
<dt-stack v-dt-focusgroup="'horizontal'" direction="row" gap="100" role="toolbar" aria-label="Mixed elements">
  <dt-button kind="muted" importance="outlined">Button</dt-button>
  <dt-link>Link</dt-link>
  <dt-select-menu
    :options="[
      { value: '', label: 'Please select one' },
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
    ]"
    label="Default"
    :show-label="false"
  />
</dt-stack>`);

// ── Nesting depth ───────────────────────────────────────────
export const Nesting = inline({ DtButton, DtLink }, `\
<dt-stack v-dt-focusgroup="'horizontal'" direction="row" gap="100" role="toolbar" aria-label="Nested groups">
  <dt-stack direction="row" gap="100" class="d-bgc-moderate-opaque d-p-100">
    <dt-button kind="muted" importance="outlined">btn</dt-button>
    <dt-button kind="muted" importance="outlined">btn</dt-button>
    <dt-button kind="muted" importance="outlined">btn</dt-button>
  </dt-stack>
  <dt-stack direction="row" gap="100" class="d-bgc-moderate-opaque d-p-100">
    <dt-button kind="muted" importance="outlined">btn</dt-button>
    <dt-button kind="muted" importance="outlined">btn</dt-button>
  </dt-stack>
  <dt-stack direction="row" gap="100" class="d-bgc-moderate-opaque d-p-100">
    <dt-link>text link a</dt-link>
    <dt-link>text link b</dt-link>
  </dt-stack>
</dt-stack>`);

// ── Events (complex — .story.vue with data/methods) ─────────
const EventsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, FocusgroupDirectiveEventsTemplate);

export const Events = {
  render: EventsTemplate,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};

// ── Recipes (complex — .story.vue with data/methods) ────────
const RecipesTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, FocusgroupDirectiveRecipesTemplate);

export const Recipes = {
  render: RecipesTemplate,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
