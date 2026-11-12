import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtPresence, type DtPresenceProps } from './Presence';
import { PRESENCE_STATES_LIST } from './PresenceConstants';

export const argTypesData = {
  presence: {
    table: {
      type: {
        summary: 'string',
      },
    },
    options: [...PRESENCE_STATES_LIST],
    control: 'select',
  },
  srText: {
    description: 'Screen reader text read out whenver the presence changes',
    control: 'text',
  },
  showIcon: {
    description: 'Renders a state-specific glyph inside the colored circle.',
    control: 'boolean',
  },
} satisfies Meta<DtPresenceProps>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Presence',
  component: DtPresence,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<DtPresenceProps>;

export default meta;
type Story = StoryObj<DtPresenceProps>;

// PresenceDefault.story.vue
function PresenceDefault (args: DtPresenceProps) {
  return (
    <DtPresence
      presence={args.presence}
      srText={args.srText}
      showIcon={args.showIcon}
    />
  );
}

// PresenceVariants.story.vue
function PresenceVariants () {
  const sections = [
    { title: 'Active', presence: 'active' },
    { title: 'Away', presence: 'away' },
    { title: 'Busy', presence: 'busy' },
    { title: 'Offline', presence: 'offline' },
    { title: 'Do not Disturb', presence: 'dnd' },
  ] as const;

  return (
    <div>
      {sections.map(({ title, presence }) => (
        <div key={presence}>
          <h2>
            {title}
          </h2>
          <div>
            <h3>
              With icon
            </h3>
            <DtPresence presence={presence} />
          </div>
          <div>
            <h3>
              Without icon
            </h3>
            <DtPresence presence={presence} showIcon={false} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Stories
export const Default: Story = {
  render: args => <PresenceDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: () => <PresenceVariants />,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
