import DtModeIsland from './mode_island.vue';
import ModeIslandDefaultStory from './mode_island_default.story.vue';
import DtButton from '@/components/button/button.vue';
import DtBadge from '@/components/badge/badge.vue';
import DtChip from '@/components/chip/chip.vue';
import DtInput from '@/components/input/input.vue';
import DtNotice from '@/components/notice/notice.vue';
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

export const Interactive = {
  render: (args) => ({
    components: { DtModeIsland, DtButton, DtBadge, DtChip, DtStack },
    setup () {
      return { args };
    },
    template: `
      <div>
        <div class="d-mb24">
          <p class="d-body--md d-fc-tertiary">
            Try changing the mode prop and toggling your browser's dark mode to see how the mode island behaves.
          </p>
        </div>
        <dt-mode-island v-bind="args" class="d-p24 d-ba d-bc-subtle d-bar8 d-bgc-secondary">
          <h3 class="d-headline--md d-mb8">Mode Island Content</h3>
          <p class="d-body--md d-mb16">
            This content is inside a mode island with mode: {{ args.mode }}
          </p>
          <dt-stack gap="400" direction="row">
            <span>
              <dt-button>Button</dt-button>
            </span>
            <span>
              <dt-badge text="Badge" />
            </span>
            <span>
              <dt-chip>Chip</dt-chip>
            </span>
          </dt-stack>
        </dt-mode-island>
      </div>
    `,
  }),
};

export const NestedIslands = {
  render: () => ({
    components: { DtModeIsland },
    template: `
      <div>
        <h3 class="d-headline--md d-mb16">Nested Mode Islands</h3>
        <dt-mode-island mode="dark" class="d-p16 d-ba d-bc-subtle d-bar8 d-bgc-primary">
          <p class="d-body--lg d-fw-semibold d-mb16">Dark Mode Island (Parent)</p>

          <dt-mode-island class="d-p16 d-ba d-bc-subtle d-bar8 d-bgc-primary">
            <p class="d-body--md d-fw-semibold d-mb8">Inverted Island (Child - Light)</p>

            <dt-mode-island class="d-p16 d-ba d-bc-subtle d-bar8 d-bgc-primary">
              <p class="d-body--sm">Inverted Island (Grandchild - Dark)</p>
            </dt-mode-island>
          </dt-mode-island>

          <dt-mode-island mode="light" class="d-mt16 d-p16 d-ba d-bc-subtle d-bar8 d-bgc-primary">
            <p class="d-body--md">Explicit Light Island (Always Light)</p>
          </dt-mode-island>
        </dt-mode-island>
      </div>
    `,
  }),
};

export const SideBySide = {
  render: () => ({
    components: { DtModeIsland, DtButton, DtInput, DtNotice, DtBadge, DtStack },
    template: `
      <div>
        <h3 class="d-headline--md d-mb16">Side-by-Side Comparison</h3>
        <div class="d-d-flex d-gg16">
          <dt-mode-island class="d-fl1 d-p16 d-ba d-bc-subtle d-bar8 d-bgc-primary">
            <h4 class="d-headline--sm d-mb12">Inverted Mode</h4>
            <dt-stack gap="400">
              <span>
                <dt-button>Primary Button</dt-button>
              </span>
              <dt-input label="Input Field" placeholder="Enter text..." />
              <dt-notice kind="info">
                This is an info notice is inverted mode
              </dt-notice>
              <dt-stack direction="row" gap="400">
                <span>
                  <dt-badge text="Badge" />
                </span>
                <span>
                  <dt-badge text="Info" type="info" />
                </span>
                <span>
                  <dt-badge text="Success" type="success" />
                </span>
              </dt-stack>
            </dt-stack>
          </dt-mode-island>
        </div>
      </div>
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
          <dt-mode-island as="section" class="d-p16 d-ba d-bc-subtle d-bar8 d-bgc-secondary">
            <p class="d-body--md">This is a <code>&lt;section&gt;</code> element</p>
          </dt-mode-island>
          <dt-mode-island as="article" class="d-p16 d-ba d-bc-subtle d-bar8 d-bgc-secondary">
            <p class="d-body--md">This is an <code>&lt;article&gt;</code> element</p>
          </dt-mode-island>
          <dt-mode-island as="nav" class="d-p16 d-ba d-bc-subtle d-bar8 d-bgc-secondary">
            <p class="d-body--md">This is a <code>&lt;nav&gt;</code> element</p>
          </dt-mode-island>
        </dt-stack>
      </div>
    `,
  }),
};
