import { createTemplateFromVueFile } from '@/common/storybook_utils.js';
import DtButton from '@/components/button/button.vue';
import FocusgroupDirectiveTokensTemplate from './focusgroup_directive_tokens.story.vue';
import FocusgroupDirectiveEventsTemplate from './focusgroup_directive_events.story.vue';
import FocusgroupDirectiveAdvancedTemplate from './focusgroup_directive_advanced.story.vue';
import FocusgroupDirectiveRecipesTemplate from './focusgroup_directive_recipes.story.vue';

export const argsData = {};

export const argTypesData = {};

// Story Collection
export default {
  title: 'Directives/Focusgroup',
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Inline template — single source of truth for both render and docs source
const defaultTemplate = `\
<dt-stack
  v-dt-focusgroup="'horizontal'"
  direction="row"
  gap="100"
  role="toolbar"
  aria-label="Text formatting"
>
  <dt-button kind="muted" importance="outlined">Bold</dt-button>
  <dt-button kind="muted" importance="outlined">Italic</dt-button>
  <dt-button kind="muted" importance="outlined">Underline</dt-button>
  <dt-button kind="muted" importance="outlined" aria-disabled="true" class="d-btn--disabled">
    Strikethrough (disabled)
  </dt-button>
  <dt-button kind="muted" importance="outlined">Code</dt-button>
</dt-stack>`;

// Templates
const TokensTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, FocusgroupDirectiveTokensTemplate);

const EventsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, FocusgroupDirectiveEventsTemplate);

const AdvancedTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, FocusgroupDirectiveAdvancedTemplate);

const RecipesTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, FocusgroupDirectiveRecipesTemplate);

// Stories
export const Default = {
  render: () => ({
    components: { DtButton },
    template: defaultTemplate,
  }),
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    docs: {
      source: {
        code: defaultTemplate,
        language: 'html',
      },
    },
  },
};

export const Tokens = {
  render: TokensTemplate,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};

export const Events = {
  render: EventsTemplate,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};

export const Advanced = {
  render: AdvancedTemplate,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};

export const Recipes = {
  render: RecipesTemplate,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
