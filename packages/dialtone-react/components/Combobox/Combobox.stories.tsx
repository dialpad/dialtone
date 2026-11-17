import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { StandIn } from '../../.storybook/StandIn';
import { DtInput } from '../Input';
import { DtListItem } from '../ListItem';
import { DtCombobox, type DtComboboxProps } from './Combobox';
import { COMBOBOX_LABEL_SIZES } from './ComboboxConstants';

interface ComboboxItem {
  name: string;
  id: number;
}

// The slots are string args, as in Vue: `emptyListItem` renders through `v-html`. `items` is the story's own,
// and `onItemClick` is called when an item is clicked.
type ComboboxStoryArgs = Omit<DtComboboxProps, 'input' | 'list' | 'emptyListItem'> & {
  input?: string;
  list?: string;
  emptyListItem?: string;
  items?: ComboboxItem[];
  onItemClick?: (index: number) => void;
};

// Default Prop Values
export const argsData = {
  label: 'Label Text',
  showLabel: true,
  showList: true,
  size: COMBOBOX_LABEL_SIZES.DEFAULT,
  emptyList: false,
  loading: false,
  clickOnSelect: false,
  onEscape: action('escape'),
  onHighlight: action('highlight'),
  onSelect: action('select'),
  onOpened: action('opened'),
  onItemClick: action('click'),
} satisfies Partial<ComboboxStoryArgs>;

export const argTypesData = {
  // Slots
  input: {
    description: 'Slot for the input component',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'ReactNode | ({ inputProps }) => ReactNode',
      },
    },
  },
  list: {
    description: 'Slot for the list component',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'ReactNode | ({ listProps, opened, clearHighlightIndex }) => ReactNode',
      },
    },
  },
  emptyListItem: {
    description:
      'Slot for the empty list item. Defaults to emptyStateMessage prop. It\'s shown when `emptyList=true`',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'ReactNode',
      },
    },
  },

  // Props
  label: {
    control: {
      type: 'text',
    },
  },
  size: {
    options: Object.values(COMBOBOX_LABEL_SIZES),
    control: {
      type: 'select',
    },
    table: {
      defaultValue: {
        summary: COMBOBOX_LABEL_SIZES.DEFAULT,
      },
    },
  },
  description: {
    control: {
      type: 'text',
    },
  },
  listId: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  showLabel: {
    control: { type: 'boolean' },
  },
  showList: {
    control: { type: 'boolean' },
  },
  listRenderedOutside: {
    control: { type: 'boolean' },
  },
  loading: {
    control: { type: 'boolean' },
  },
  emptyList: {
    control: { type: 'boolean' },
  },
  emptyStateMessage: {
    control: { type: 'text' },
  },
  emptyStateClass: {
    description: 'Additional class name for the empty list element.',
  },
  clickOnSelect: {
    control: { type: 'boolean' },
  },
  onBeginningOfList: {
    table: {
      category: 'props',
      type: {
        summary: 'function',
      },
      defaultValue: {
        summary: 'null',
      },
    },
  },
  onEndOfList: {
    table: {
      category: 'props',
      type: {
        summary: 'function',
      },
      defaultValue: {
        summary: 'null',
      },
    },
  },

  // Action Event Handlers
  onEscape: {
    description: 'Event fired when pressing escape',
    table: {
      type: { summary: 'event' },
    },
  },
  onHighlight: {
    description: 'Event fired when the highlight changes',
    table: {
      type: { summary: 'event' },
    },
  },
  onSelect: {
    description: 'Select item event',
    table: {
      type: { summary: 'event' },
    },
  },
  onOpened: {
    description: 'Event fired when list is shown or hidden.',
    table: {
      type: {
        summary: 'event',
      },
    },
  },
  onItemClick: {
    table: {
      disable: true,
    },
  },

  // Hide items because its used for storybook only
  // not a real component prop.
  items: {
    table: {
      disable: true,
    },
  },
} satisfies Meta<ComboboxStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Combobox',
  component: DtCombobox,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<ComboboxStoryArgs>;

export default meta;
type Story = StoryObj<ComboboxStoryArgs>;

// Avatar isn't ported: Vue's <dt-avatar :full-name :seed>, as it renders with initials.
function StoryAvatar ({ initials }: { initials: string }) {
  return (
    <StandIn for="avatar">
      <div className="d-avatar d-avatar--size-300" data-qa="dt-avatar">
        <div className="d-avatar__canvas">
          <div className="d-avatar__canvas-inner">
            <span className="d-avatar__initials">{initials}</span>
          </div>
        </div>
      </div>
    </StandIn>
  );
}

// ComboboxDefault.story.vue
function ComboboxDefault ({
  input: _input,
  list: _list,
  emptyListItem,
  items = [],
  showList,
  onSelect,
  onItemClick,
  onEscape,
  ...args
}: ComboboxStoryArgs) {
  const [value, setValue] = useState('example');

  const onComboboxSelect = (i: number) => {
    setValue(items[i].name);
    onSelect?.(i);
  };

  const onListItemSelect = (i: number) => {
    setValue(items[i].name);
    onItemClick?.(i);
  };

  const onComboboxEscape = () => {
    setValue('');
    onEscape?.();
  };

  return (
    <DtCombobox
      {...args}
      label={args.label ?? ''}
      showList={!!value && showList}
      onEscape={onComboboxEscape}
      onSelect={onComboboxSelect}
      input={({ inputProps }) => (
        <DtInput
          {...inputProps}
          size={inputProps.size ?? undefined}
          value={value}
          onValueChange={next => setValue(String(next))}
          placeholder="Type to show the items"
        />
      )}
      list={({ listProps }) => (
        <ol {...listProps} className={`${listProps.className} d-p-0 d-mbs-100 d-hmx-500 d-of-y-auto`}>
          {items.map((item, i) => (
            <DtListItem
              key={item.id}
              role="option"
              navigationType="arrow-keys"
              onClick={() => onListItemSelect(i)}
              start={<StoryAvatar initials={(i + 1).toString()} />}
            >
              {item.name}
            </DtListItem>
          ))}
        </ol>
      )}
      emptyListItem={emptyListItem ? <span dangerouslySetInnerHTML={{ __html: emptyListItem }} /> : undefined}
    />
  );
}

// Stories
export const Default: Story = {
  render: args => <ComboboxDefault {...args} />,

  args: {
    items: [
      { name: 'combobox item 1', id: 1 },
      { name: 'combobox item 2', id: 2 },
      { name: 'combobox item 3', id: 3 },
      { name: 'combobox item 4', id: 4 },
      { name: 'combobox item 5', id: 5 },
      { name: 'combobox item 6', id: 6 },
      { name: 'combobox item 7', id: 7 },
      { name: 'combobox item 8', id: 8 },
      { name: 'combobox item 9', id: 9 },
      { name: 'combobox item 10', id: 10 },
      { name: 'combobox item 11', id: 11 },
      { name: 'combobox item 12', id: 12 },
    ],
  },
};

export const Empty: Story = {
  render: args => <ComboboxDefault {...args} />,

  args: {
    items: [],
    emptyStateMessage: 'No matches found.',
    emptyList: true,
  },
};
