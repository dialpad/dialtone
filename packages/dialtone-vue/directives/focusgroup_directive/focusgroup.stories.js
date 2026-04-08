import { createTemplateFromVueFile } from '@/common/storybook_utils.js';
import FocusgroupDirectiveDefaultTemplate from './focusgroup_directive_default.story.vue';
import FocusgroupDirectiveTokensTemplate from './focusgroup_directive_tokens.story.vue';
import FocusgroupDirectiveEventsTemplate from './focusgroup_directive_events.story.vue';
import FocusgroupDirectiveAdvancedTemplate from './focusgroup_directive_advanced.story.vue';
import FocusgroupDirectiveRecipesTemplate from './focusgroup_directive_recipes.story.vue';

export const argsData = {};

export const argTypesData = {};

// Story Collection
export default {
  title: 'Directives/Focusgroup',
  component: FocusgroupDirectiveDefaultTemplate,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, FocusgroupDirectiveDefaultTemplate);

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
  render: DefaultTemplate,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
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
