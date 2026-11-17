import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { DtStack } from '../Stack';
import { DtTab } from './Tab';
import { DtTabGroup, type DtTabGroupChangeEvent, type DtTabGroupProps } from './TabGroup';
import { DtTabPanel } from './TabPanel';
import { TAB_LIST_SIZES, TAB_SPREADS } from './TabsConstants';

// Slots are args named as in Vue: `default` (the panels' content) and `tabs` (the tabs' content). Vue's template
// renders them through v-html, so they are HTML strings.
type TabsStoryArgs = Omit<DtTabGroupProps, 'children' | 'tabs'> & {
  default?: string;
  tabs?: string;
};

// Default Prop Values
export const argsData = {
  size: 300,
  spread: 'none',
  onChange: action('change'),
} satisfies Partial<TabsStoryArgs>;

export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },
  tabs: {
    control: 'text',
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },

  // Props
  size: {
    options: TAB_LIST_SIZES,
    control: {
      type: 'select',
    },
  },
  spread: {
    options: TAB_SPREADS,
    control: {
      type: 'select',
    },
  },

  // Action Event Handlers
  onChange: {
    description:
      'Change tab event with the arguments: `selected` id of the current tab and `disabled` value',
    table: {
      disable: true,
    },
  },
} satisfies Meta<TabsStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Tabs',
  component: DtTabGroup,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<TabsStoryArgs>;

export default meta;
type Story = StoryObj<TabsStoryArgs>;

// Renders an HTML string as Vue's v-html does, on the <p> Vue binds it to.
const htmlParagraph = (value: string | undefined, fallback: string): ReactNode => (value
  ? <p dangerouslySetInnerHTML={{ __html: value }} />
  : <p>{fallback}</p>);

function validateChange (event: DtTabGroupChangeEvent) {
  if (!confirm('You might lose changes, change tab?')) {
    event.preventDefault();
  }
}

// TabsDefault.story.vue
function TabsDefault ({ default: defaultSlot, tabs, ...args }: TabsStoryArgs) {
  return (
    <div>
      <DtTabGroup
        size={args.size}
        spread={args.spread}
        borderless={args.borderless}
        disabled={args.disabled}
        tabListClass={args.tabListClass}
        tabListChildProps={args.tabListChildProps}
        onBeforeChange={validateChange}
        onChange={args.onChange}
        tabs={(
          <>
            <DtTab
              id="1"
              panelId="2"
              selected
            >
              {htmlParagraph(tabs, 'First')}
            </DtTab>
            <DtTab
              id="3"
              panelId="4"
            >
              {htmlParagraph(tabs, 'Second')}
            </DtTab>
            <DtTab
              id="5"
              panelId="6"
              label="Third Label"
            >
              {htmlParagraph(tabs, 'Third')}
            </DtTab>
          </>
        )}
      >
        <div>
          <DtTabPanel
            id="2"
            tabId="1"
          >
            {htmlParagraph(defaultSlot, 'First Panel')}
          </DtTabPanel>
          <DtTabPanel
            id="4"
            tabId="3"
          >
            {htmlParagraph(defaultSlot, 'Second Panel')}
          </DtTabPanel>
          <DtTabPanel
            id="6"
            tabId="5"
          >
            {htmlParagraph(defaultSlot, 'Third Panel')}
          </DtTabPanel>
        </div>
      </DtTabGroup>
    </div>
  );
}

const variantsTabs: { description: string; propsToBind: Partial<DtTabGroupProps> }[] = [
  {
    description: 'Default tabs',
    propsToBind: {},
  },
  {
    description: 'Small size tabs',
    propsToBind: {
      size: 'sm',
    },
  },
  {
    description: 'Borderless tabs',
    propsToBind: {
      borderless: true,
    },
  },
  {
    description: 'Disabled tabs',
    propsToBind: {
      disabled: true,
    },
  },
  {
    description: 'Spread grow tabs',
    propsToBind: {
      spread: 'grow',
    },
  },
  {
    description: 'Spread equal tabs',
    propsToBind: {
      spread: 'equal',
    },
  },
];

// TabsVariants.story.vue
function TabsVariants () {
  return (
    <DtStack gap="100">
      {variantsTabs.map((variant, i) => (
        <div key={i}>
          <p className="d-fw-bold d-mbe-100">
            {variant.description}
          </p>
          <DtTabGroup
            {...variant.propsToBind}
            className="d-mbe-100"
            tabs={(
              <>
                <DtTab
                  id={`${i}1`}
                  panelId={`${i}2`}
                  selected
                >
                  First
                </DtTab>
                <DtTab
                  id={`${i}3`}
                  panelId={`${i}4`}
                >
                  Second
                </DtTab>
                <DtTab
                  id={`${i}5`}
                  panelId={`${i}6`}
                  label="Third Label"
                >
                  Third
                </DtTab>
              </>
            )}
          >
            <div>
              <DtTabPanel
                id={`${i}2`}
                tabId={`${i}1`}
              >
                <p>First Panel</p>
              </DtTabPanel>
              <DtTabPanel
                id={`${i}4`}
                tabId={`${i}3`}
              >
                <p>Second Panel</p>
              </DtTabPanel>
              <DtTabPanel
                id={`${i}6`}
                tabId={`${i}5`}
              >
                <p>Third Panel</p>
              </DtTabPanel>
            </div>
          </DtTabGroup>
        </div>
      ))}
    </DtStack>
  );
}

export const Default: Story = {
  render: args => <TabsDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: () => <TabsVariants />,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
