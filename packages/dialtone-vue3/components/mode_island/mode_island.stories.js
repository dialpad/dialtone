import DtModeIsland from './mode_island.vue';
import ModeIslandDefaultStory from './mode_island_default.story.vue';
import DtStack from '@/components/stack/stack.vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { DT_MODE_ISLAND_TYPES } from './mode_island_constants';

export const argsData = {
  mode: DT_MODE_ISLAND_TYPES.INVERTED,
  as: 'div',
};

export const argTypesData = {
  // Slots
  default: {
    control: { type: null },
    description: 'Slot for main content',
    table: {
      type: {
        summary: 'VNode',
        detail: `
Example:
<dt-mode-island>
  <p>Content that will use the specified mode</p>
</dt-mode-island>`,
      },
    },
  },

  // Props
  mode: {
    control: { type: 'select' },
    options: Object.values(DT_MODE_ISLAND_TYPES),
    description: 'The mode to apply to the island',
    table: {
      type: {
        summary: 'String',
        detail: `
- 'inverted': Opposite of parent or root mode
- 'light': Always light mode
- 'dark': Always dark mode`,
      },
      defaultValue: {
        summary: DT_MODE_ISLAND_TYPES.INVERTED,
      },
    },
  },

  as: {
    control: { type: 'text' },
    description: 'HTML element to render as',
    table: {
      type: {
        summary: 'String',
      },
      defaultValue: {
        summary: 'div',
      },
    },
  },
};

export default {
  title: 'Components/Mode Island',
  component: DtModeIsland,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, ModeIslandDefaultStory);

export const Default = {
  render: DefaultTemplate,
  args: {},
};

export const NestedIslands = {
  render: () => ({
    components: { DtModeIsland, DtStack },
    template: `
      <div>
        <h3 class="d-headline--md d-mb16">Nested Mode Islands</h3>
        <dt-stack gap="500" direction="row">
          <dt-mode-island class="d-fl1 d-p16 d-ba d-bc-subtle d-bar8">
            <p class="d-body--lg d-fw-semibold d-mb16">Inverted Mode Island (Parent)</p>
            <dt-mode-island class="d-p16 d-ba d-bc-subtle d-bar8">
              <p class="d-body--md d-fw-semibold d-mb8">Inverted Island (Child)</p>
              <dt-mode-island class="d-p16 d-ba d-bc-subtle d-bar8">
                <p class="d-body--sm">Inverted Island (Grandchild)</p>
              </dt-mode-island>
            </dt-mode-island>
            <dt-mode-island mode="light" class="d-mt16 d-p16 d-ba d-bc-subtle d-bar8">
              <p class="d-body--md">Explicit Light Island</p>
            </dt-mode-island>
          </dt-mode-island>
          <dt-mode-island mode="dark" class="d-fl1 d-p16 d-ba d-bc-subtle d-bar8">
            <p class="d-body--lg d-fw-semibold d-mb16">Dark Mode Island (Parent)</p>
            <dt-mode-island class="d-p16 d-ba d-bc-subtle d-bar8">
              <p class="d-body--md d-fw-semibold d-mb8">Inverted Island (Child - Light)</p>
              <dt-mode-island class="d-p16 d-ba d-bc-subtle d-bar8">
                <p class="d-body--sm">Inverted Island (Grandchild - Dark)</p>
              </dt-mode-island>
            </dt-mode-island>
            <dt-mode-island mode="light" class="d-mt16 d-p16 d-ba d-bc-subtle d-bar8">
              <p class="d-body--md">Explicit Light Island (Always Light)</p>
            </dt-mode-island>
          </dt-mode-island>
        </div>
        </dt-stack>
    `,
  }),
};

export const WithCustomElement = {
  render: () => ({
    components: { DtModeIsland, DtStack },
    template: `
      <div>
        <h3 class="d-headline--md d-mb16">
          Custom HTML Elements <span class="d-body--md">via <code class="d-fw-bold">as</code> prop</span>
        </h3>
        <dt-stack gap="400" direction="row">
          <dt-mode-island as="section" class="d-p16 d-ba d-bc-subtle d-bar8">
            <p class="d-body--md">This is a <code>&lt;section&gt;</code> element</p>
          </dt-mode-island>
          <dt-mode-island as="article" class="d-p16 d-ba d-bc-subtle d-bar8">
            <p class="d-body--md">This is an <code>&lt;article&gt;</code> element</p>
          </dt-mode-island>
          <dt-mode-island as="nav" class="d-p16 d-ba d-bc-subtle d-bar8">
            <p class="d-body--md">This is a <code>&lt;nav&gt;</code> element</p>
          </dt-mode-island>
        </dt-stack>
      </div>
    `,
  }),
};
