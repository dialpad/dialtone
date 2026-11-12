import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StandIn } from '../../.storybook/StandIn';
import { DtStack, type DtStackProps } from './Stack';
import {
  DT_STACK_DIRECTION,
  DT_STACK_GAP,
  DT_STACK_RESPONSIVE_BREAKPOINTS,
  DT_STACK_ALIGN,
  DT_STACK_JUSTIFY,
} from './StackConstants';

type StackStoryArgs = DtStackProps;

export const argsData = {
  direction: { default: 'column' },
  as: 'div',
  wrap: false,
  gap: { default: '400' },
  // align is optional, no default value
  justify: { default: 'start' },
} satisfies Partial<StackStoryArgs>;

// `type: object` (not in Vue's argTypes) is set on the props react-docgen reports as a union (a value or an object of
// breakpoints): Storybook drops a URL value for a union arg, and its object type passes both shapes through.
const responsiveType = { name: 'object', value: {} } as const;

export const argTypesData = {
  // Slots
  children: {
    control: false,
    description: 'Slot for main content',
    table: {
      type: {
        summary: 'ReactNode',
        detail: `
        Example:
<DtStack>
  <DtCard />
  <DtCard />
  <DtCard />
</DtStack>`,
      },
    },
  },

  // Props
  direction: {
    control: 'object',
    type: responsiveType,
    table: {
      type: {
        summary: 'string | object',
        detail: `
        Directions: "${Object.keys(DT_STACK_DIRECTION)}"
Breakpoints: "${DT_STACK_RESPONSIVE_BREAKPOINTS}"
String: "column"
Object: { "default": "row", "sm": "column", "lg": "column-reverse" }`,
      },
    },
  },
  as: {
    control: 'text',
    type: 'string',
  },
  wrap: {
    control: 'boolean',
  },
  gap: {
    control: 'object',
    type: responsiveType,
    table: {
      type: {
        summary: 'string | object',
        detail: `
        Gaps: "${DT_STACK_GAP}"
Breakpoints: "${DT_STACK_RESPONSIVE_BREAKPOINTS}"
String: "400"
Object: { "default": "400", "sm": "200", "lg": "450" }`,
      },
    },
  },
  align: {
    control: 'object',
    type: responsiveType,
    table: {
      type: {
        summary: 'string | object',
        detail: `
        Align Values: "${DT_STACK_ALIGN}"
Breakpoints: "${DT_STACK_RESPONSIVE_BREAKPOINTS}"
String: "center"
Object: { "default": "start", "sm": "center", "lg": "end" }
Note: If not specified, alignment uses CSS implicit behavior (stretch for column, center for row).`,
      },
    },
  },
  justify: {
    control: 'object',
    type: responsiveType,
    table: {
      type: {
        summary: 'string | object',
        detail: `
        Justify Values: "${DT_STACK_JUSTIFY}"
Breakpoints: "${DT_STACK_RESPONSIVE_BREAKPOINTS}"
String: "space-between"
Object: { "default": "start", "sm": "center", "lg": "space-between" }`,
      },
    },
  },
} satisfies Meta<StackStoryArgs>['argTypes'];

const meta = {
  title: 'Components/Stack',
  component: DtStack,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<StackStoryArgs>;

export default meta;
type Story = StoryObj<StackStoryArgs>;

// StackDefault.story.vue
function StackDefault (args: StackStoryArgs) {
  return (
    <div className="d-ba d-bc-default">
      <DtStack
        direction={args.direction}
        as={args.as || 'div'}
        wrap={args.wrap}
        gap={args.gap}
        align={args.align}
        justify={args.justify}
      >
        <div className="d-bgc-moderate-opaque">
          Stack item 1
        </div>
        <div className="d-bgc-moderate-opaque">
          Stack item 2a<br />
          Stack item 2b
        </div>
        <div className="d-bgc-moderate-opaque">
          Stack item 3
        </div>
      </DtStack>
    </div>
  );
}

// StackWrapping.story.vue
function StackWrapping (args: StackStoryArgs) {
  return (
    <StandIn for="box">
      <div data-qa="dt-box" className="d-box d-box--is-500 d-box--max-is-100p">
        <DtStack
          direction={args.direction}
          as={args.as}
          gap={args.gap}
          align={args.align}
          justify={args.justify}
          wrap={args.wrap}
        >
          {[1, 2, 3].map(item => (
            <StandIn for="box" key={item}>
              <div data-qa="dt-box" className="d-box d-box--p-100 d-box--surface-moderate-opaque d-box--br-300 d-box--is-200">
                Stack item {item}
              </div>
            </StandIn>
          ))}
        </DtStack>
      </div>
    </StandIn>
  );
}

// StackVariants.story.vue
function VariantItems () {
  return (
    <>
      <DtStack className="d-bgc-moderate-opaque d-bar-400 d-p-100">
        Stack item 1
      </DtStack>
      <DtStack className="d-bgc-moderate-opaque d-bar-400 d-p-100">
        <div>Stack item 2a</div>
        <div>Stack item 2b</div>
      </DtStack>
      <DtStack className="d-bgc-moderate-opaque d-bar-400 d-p-100">
        Stack item 3
      </DtStack>
    </>
  );
}

function VariantExample ({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="d-headline--lg d-mbe-100">
        {title}
      </h4>
      <div className="d-ba d-bc-default d-p-200 d-bar-400">
        {children}
      </div>
    </div>
  );
}

function StackVariants () {
  return (
    <div>
      <DtStack gap="800" className="d-p-400">
        {/* Direction Examples */}
        <section>
          <h3 className="d-headline--xl d-mbe-100">
            Direction Examples
          </h3>
          <DtStack gap="200">
            <VariantExample title="Column (default)">
              <DtStack direction="column" gap="100"><VariantItems /></DtStack>
            </VariantExample>
            <VariantExample title="Row">
              <DtStack direction="row" gap="100"><VariantItems /></DtStack>
            </VariantExample>
            <VariantExample title="Column Reverse">
              <DtStack direction="column-reverse" gap="100"><VariantItems /></DtStack>
            </VariantExample>
            <VariantExample title="Row Reverse">
              <DtStack direction="row-reverse" gap="100"><VariantItems /></DtStack>
            </VariantExample>
          </DtStack>
        </section>

        {/* Gap Examples */}
        <section>
          <h3 className="d-headline--xl d-mbe-100">
            Gap Examples
          </h3>
          <DtStack gap="200">
            <VariantExample title="Gap: 0">
              <DtStack gap="0"><VariantItems /></DtStack>
            </VariantExample>
            {/* Titles and gaps as in Vue's story, where they disagree. */}
            <VariantExample title="Gap: 200">
              <DtStack gap="25"><VariantItems /></DtStack>
            </VariantExample>
            <VariantExample title="Gap: 400">
              <DtStack gap="100"><VariantItems /></DtStack>
            </VariantExample>
            <VariantExample title="Gap: 600">
              <DtStack gap="400"><VariantItems /></DtStack>
            </VariantExample>
          </DtStack>
        </section>

        {/* Align Examples */}
        <section>
          <h3 className="d-headline--xl d-mbe-100">
            Align Examples (Row Direction)
          </h3>
          <DtStack gap="200">
            <VariantExample title="Default (no align specified - uses CSS implicit: center for row)">
              <DtStack direction="row" gap="100"><VariantItems /></DtStack>
            </VariantExample>
            <VariantExample title="Start">
              <DtStack direction="row" gap="100" align="start"><VariantItems /></DtStack>
            </VariantExample>
            <VariantExample title="Center">
              <DtStack direction="row" gap="100" align="center"><VariantItems /></DtStack>
            </VariantExample>
            <VariantExample title="End">
              <DtStack direction="row" gap="100" align="end"><VariantItems /></DtStack>
            </VariantExample>
            <VariantExample title="Stretch">
              <DtStack direction="row" gap="100" align="stretch"><VariantItems /></DtStack>
            </VariantExample>
            <VariantExample title="Baseline">
              <DtStack direction="row" gap="100" align="baseline"><VariantItems /></DtStack>
            </VariantExample>
          </DtStack>
        </section>

        {/* Justify Examples */}
        <section>
          <h3 className="d-headline--xl d-mbe-100">
            Justify Examples (Row Direction)
          </h3>
          <DtStack gap="200">
            <VariantExample title="Start (default)">
              <DtStack direction="row" gap="100" justify="start"><VariantItems /></DtStack>
            </VariantExample>
            <VariantExample title="Center">
              <DtStack direction="row" gap="100" justify="center"><VariantItems /></DtStack>
            </VariantExample>
            <VariantExample title="End">
              <DtStack direction="row" gap="100" justify="end"><VariantItems /></DtStack>
            </VariantExample>
            <VariantExample title="space-around">
              <DtStack direction="row" gap="100" justify="space-around"><VariantItems /></DtStack>
            </VariantExample>
            <VariantExample title="space-between">
              <DtStack direction="row" gap="100" justify="space-between"><VariantItems /></DtStack>
            </VariantExample>
            <VariantExample title="space-evenly">
              <DtStack direction="row" gap="100" justify="space-evenly"><VariantItems /></DtStack>
            </VariantExample>
          </DtStack>
        </section>

        {/* Responsive Examples */}
        <section>
          <h3 className="d-headline--xl d-mbe-100">
            Responsive Examples
          </h3>
          <p className="d-body--md d-fc-secondary d-mbe-100">
            Resize your browser to see these examples change at different breakpoints
          </p>
          <DtStack gap="200">
            <VariantExample title="Responsive Direction (column → row @md)">
              <DtStack direction={{ default: 'column', md: 'row' }} gap="100"><VariantItems /></DtStack>
            </VariantExample>
            <VariantExample title="Responsive Gap (200 → 400 @md → 600 @lg)">
              <DtStack direction="row" gap={{ default: '200', md: '400', lg: '600' }}><VariantItems /></DtStack>
            </VariantExample>
            <VariantExample title="Responsive Align (start → center @md → end @lg)">
              <DtStack direction="row" gap="100" align={{ default: 'start', md: 'center', lg: 'end' }}>
                <VariantItems />
              </DtStack>
            </VariantExample>
            <VariantExample title="Responsive Justify (start → center @md → space-between @lg)">
              <DtStack direction="row" gap="100" justify={{ default: 'start', md: 'center', lg: 'space-between' }}>
                <VariantItems />
              </DtStack>
            </VariantExample>
            <VariantExample title="Combined Responsive (direction + gap + align)">
              <DtStack
                direction={{ default: 'column', md: 'row' }}
                gap={{ default: '200', md: '400' }}
                align={{ default: 'start', md: 'center' }}
              >
                <VariantItems />
              </DtStack>
            </VariantExample>
          </DtStack>
        </section>
      </DtStack>
    </div>
  );
}

export const Default: Story = {
  render: args => <StackDefault {...args} />,
  args: {},
};

export const Wrapping: Story = {
  render: args => <StackWrapping {...args} />,
  args: {
    direction: 'row',
    gap: '200',
    wrap: true,
  },
};

export const Variants: Story = {
  render: () => <StackVariants />,
  args: {},
  parameters: {
    controls: { disable: true },
  },
};
