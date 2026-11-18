import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtIconCheck, DtIconClose } from '../../icons';
import { DtStack } from '../Stack';
import { DtText } from '../Text';
import { DtTextList, type DtTextListProps } from './TextList';
import { DtTextListItem } from './TextListItem';
import {
  DT_TEXT_LIST_GAP,
  DT_TEXT_LIST_MARKER_TONES,
  DT_TEXT_LIST_MARKERS,
  DT_TEXT_LIST_TYPES,
} from './TextListConstants';

type TextListStoryArgs = DtTextListProps & {
  items?: string[];
  itemValues?: number[];
};

const markerOptions = [undefined, ...DT_TEXT_LIST_MARKERS];
const markerToneOptions = [undefined, ...DT_TEXT_LIST_MARKER_TONES];
const gapOptions = [undefined, ...DT_TEXT_LIST_GAP];

export const argsData = {
  type: 'unordered',
  marker: undefined,
  markerTone: undefined,
  gap: undefined,
  start: undefined,
  reversed: false,
  items: [
    'Collaborative inboxes',
    'AI-powered call summaries',
    'Unified customer history',
  ],
  itemValues: [],
} satisfies TextListStoryArgs;

export const argTypesData = {
  type: {
    options: DT_TEXT_LIST_TYPES,
    control: { type: 'radio' },
  },
  marker: {
    options: markerOptions,
    control: { type: 'select' },
  },
  markerTone: {
    options: markerToneOptions,
    control: { type: 'select' },
  },
  gap: {
    options: gapOptions,
    control: { type: 'select' },
  },
  start: {
    control: { type: 'number', min: 1 },
  },
  reversed: {
    control: 'boolean',
  },
  items: {
    control: 'object',
    table: {
      type: { summary: 'string[]' },
    },
  },
  itemValues: {
    control: 'object',
    table: {
      type: { summary: 'number[]' },
    },
  },
} satisfies Meta<TextListStoryArgs>['argTypes'];

const meta = {
  title: 'Components/Text List',
  component: DtTextList,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<TextListStoryArgs>;

export default meta;
type Story = StoryObj<TextListStoryArgs>;

// TextListDefault.story.vue
function TextListDefault (args: TextListStoryArgs) {
  // A control can hold any JSON, so anything but an array of strings renders an empty list.
  const items = Array.isArray(args.items) && args.items.every(item => typeof item === 'string') ? args.items : [];
  const itemValues = Array.isArray(args.itemValues) ? args.itemValues : [];

  return (
    <DtTextList
      type={args.type}
      marker={args.marker}
      markerTone={args.markerTone}
      gap={args.gap}
      start={args.start}
      reversed={args.reversed}
    >
      {items.map((item, index) => (
        <DtTextListItem key={index} value={itemValues[index]}>
          {item}
        </DtTextListItem>
      ))}
    </DtTextList>
  );
}

// TextListVariants.story.vue
function TextListVariants () {
  return (
    <DtStack gap="600">
      <section>
        <DtText as="h3" variant="label-md" className="d-mbe-200">
          Unordered
        </DtText>
        <DtTextList>
          <DtTextListItem>Connect voice, meetings, and messaging in one workspace.</DtTextListItem>
          <DtTextListItem>Search across conversations without switching tools.</DtTextListItem>
          <DtTextListItem>Summarize follow-ups for every customer touchpoint.</DtTextListItem>
        </DtTextList>
      </section>

      <section>
        <DtText as="h3" variant="label-md" className="d-mbe-200">
          Ordered
        </DtText>
        <DtTextList type="ordered" marker="decimal" start={3}>
          <DtTextListItem>Invite the implementation team.</DtTextListItem>
          <DtTextListItem value={7}>
            Map shared inboxes to current queues.
          </DtTextListItem>
          <DtTextListItem>Review routing changes before launch.</DtTextListItem>
        </DtTextList>
      </section>

      <section>
        <DtText as="h3" variant="label-md" className="d-mbe-200">
          Custom Markers
        </DtText>
        <DtTextList markerTone="positive">
          <DtTextListItem marker={<DtIconCheck size="200" />}>
            Included in every plan.
          </DtTextListItem>
          <DtTextListItem markerTone="critical" marker={<DtIconClose size="200" />}>
            Requires admin approval.
          </DtTextListItem>
          <DtTextListItem marker={<span aria-hidden="true">+</span>}>
            Custom marker slot.
          </DtTextListItem>
        </DtTextList>
      </section>

      <section>
        <DtText as="h3" variant="label-md" className="d-mbe-200">
          Nested
        </DtText>
        <DtTextList>
          <DtTextListItem>
            Prepare the launch workspace.
            <DtTextList type="ordered" gap="50">
              <DtTextListItem>Confirm owners.</DtTextListItem>
              <DtTextListItem>Publish onboarding notes.</DtTextListItem>
            </DtTextList>
          </DtTextListItem>
          <DtTextListItem>
            Track unresolved tasks.
            <DtTextList gap="50">
              <DtTextListItem>Permissions</DtTextListItem>
              <DtTextListItem>Billing handoff</DtTextListItem>
            </DtTextList>
          </DtTextListItem>
        </DtTextList>
      </section>
    </DtStack>
  );
}

export const Default: Story = {
  render: (args: TextListStoryArgs) => <TextListDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: () => <TextListVariants />,
  args: {},
  parameters: {
    controls: { disable: true },
    options: { showPanel: false },
  },
};
