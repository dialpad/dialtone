import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { DtListItem } from '../ListItem';
import { DtComboboxMultiSelect, type DtComboboxMultiSelectProps } from './ComboboxMultiSelect';
import { CHIP_SIZES } from './ComboboxMultiSelectConstants';
import { ITEMS_LIST_DATA } from './ComboboxMultiSelectStoryConstants';

// The slots are string args, as in Vue: `header` and `footer` render through `v-html`.
type ComboboxMultiSelectStoryArgs = Omit<DtComboboxMultiSelectProps, 'header' | 'list' | 'footer'> & {
  header?: string;
  list?: string;
  footer?: string;
};

const NUMERIC_SIZE_OPTIONS = Object.keys(CHIP_SIZES)
  .filter(size => !Number.isNaN(Number(size)))
  .map(Number);

// Default Prop Values
export const argsData = {
  label: 'Label Text',
  showLabel: true,
  listMaxHeight: '300px',
  loading: false,
  loadingMessage: 'loading...',
  selectedItems: [],
  maxSelected: 0,
  maxSelectedMessage: [],
  hasSuggestionList: true,
  appendTo: 'body',
  showList: null,
  disabled: false,
  onInput: action('input'),
  onSelect: action('select'),
  onRemove: action('remove'),
  onMaxSelected: action('maxSelected'),
  onComboboxHighlight: action('comboboxHighlight'),
  onFocus: action('focus'),
  onKeyDown: action('keydown'),
  onChipKeyDown: action('chip-keydown'),
  onEscape: action('escape'),
  onEnter: action('enter'),
} satisfies Partial<ComboboxMultiSelectStoryArgs>;

export const argTypesData = {
  // Slots
  list: {
    description: 'Slot for the list',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'ReactNode',
      },
    },
  },
  header: {
    description: 'Slot for popover header content',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'ReactNode',
      },
    },
  },
  footer: {
    description: 'Slot for popover footer content',
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
  description: {
    control: {
      type: 'text',
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  // `type: 'string'`: react-docgen reports appendTo as a union, and Storybook drops a URL value for a union arg.
  appendTo: {
    type: 'string',
    control: 'text',
    table: {
      defaultValue: {
        summary: 'body',
      },
    },
  },
  size: {
    control: {
      type: 'select',
    },
    options: NUMERIC_SIZE_OPTIONS,
  },

  showLabel: {
    control: { type: 'boolean' },
  },
  // `type: 'boolean'`: showList is `boolean | null`, a union to react-docgen.
  showList: {
    type: 'boolean',
    control: { type: 'boolean' },
  },
  listMaxHeight: {
    control: { type: 'text' },
  },
  loading: {
    control: { type: 'boolean' },
  },
  loadingMessage: {
    control: { type: 'text' },
  },
  selectedItems: {
    control: 'object',
  },
  maxSelected: {
    control: { type: 'number' },
  },
  maxSelectedMessage: {
    control: 'object',
  },
  hasSuggestionList: {
    control: { type: 'boolean' },
  },
  collapseOnFocusOut: {
    control: { type: 'boolean' },
  },
  inputWrapperClass: {
    description: 'Additional class name for the input wrapper element.',
  },

  // Action Event Handlers
  onEscape: {
    table: {
      disable: true,
    },
  },
  onEnter: {
    table: {
      disable: true,
    },
  },
  onKeyDown: {
    table: {
      disable: true,
    },
  },
  onChipKeyDown: {
    table: {
      disable: true,
    },
  },
  onHighlight: {
    table: {
      disable: true,
    },
  },
  onInput: {
    table: {
      disable: true,
    },
  },
  onSelect: {
    table: {
      disable: true,
    },
  },
  onMaxSelected: {
    table: {
      disable: true,
    },
  },

  onRemove: {
    table: {
      disable: true,
    },
  },

  select: {
    description: 'Select item event',
    table: {
      type: { summary: 'event' },
    },
  },

  onComboboxHighlight: {
    table: {
      disable: true,
    },
  },
  dialogClass: {
    description: 'Additional class for the popover dialog element.',
    control: {
      type: 'text',
    },
  },
};

// Story Collection
const meta = {
  title: 'Components/Combobox Multi-Select',
  component: DtComboboxMultiSelect,
  args: argsData,
  argTypes: argTypesData as unknown as Meta<ComboboxMultiSelectStoryArgs>['argTypes'],
  excludeStories: /.*Data$/,
} satisfies Meta<ComboboxMultiSelectStoryArgs>;

export default meta;
type Story = StoryObj<ComboboxMultiSelectStoryArgs>;

// ComboboxMultiSelectDefault.story.vue
function ComboboxMultiSelectDefault ({
  header,
  list: _list,
  footer,
  selectedItems: selectedItemsArg = [],
  onSelect,
  onRemove,
  ...args
}: ComboboxMultiSelectStoryArgs) {
  const [items, setItems] = useState(ITEMS_LIST_DATA);
  const [query, setQuery] = useState('');
  // Vue's template pushes to and splices the selectedItems arg itself; here it's state, reset when the arg changes.
  const [selectedItems, setSelectedItems] = useState(selectedItemsArg);
  const [previousArg, setPreviousArg] = useState(selectedItemsArg);
  if (previousArg !== selectedItemsArg) {
    setPreviousArg(selectedItemsArg);
    setSelectedItems(selectedItemsArg);
  }

  // The `onInput` arg goes on to the input, so its action gets the input event, as Vue's gets from `update:modelValue`.
  const onComboboxInput = (value: string) => {
    // Filter list
    setQuery(value);
    setItems(ITEMS_LIST_DATA.filter(item => item.value.includes(value)));
  };

  const onComboboxSelect = (i: number) => {
    if (items[i]) {
      onSelect?.(i);

      const item = items[i].value;
      if (selectedItems.includes(item)) {
        return;
      }
      setSelectedItems([...selectedItems, item]);

      // Unfilter the list. Vue's story also clears the input through `$refs.comboboxMultiSelect.$data.value`, which
      // React can't reach: the input clears itself on a keyboard select, but not on a click.
      setQuery('');
      setItems(ITEMS_LIST_DATA);
    } else if (query) {
      setSelectedItems([...selectedItems, query]);
    }
  };

  const onComboboxRemove = (item: string) => {
    onRemove?.(item);
    const index = selectedItems.indexOf(item);
    if (index < 0) {
      return;
    }
    setSelectedItems(selectedItems.filter((_, j) => j !== index));
  };

  return (
    <DtComboboxMultiSelect
      {...args}
      label={args.label ?? ''}
      selectedItems={selectedItems}
      onValueChange={onComboboxInput}
      onSelect={onComboboxSelect}
      onRemove={onComboboxRemove}
      header={header ? <span dangerouslySetInnerHTML={{ __html: header }} /> : undefined}
      list={(
        <ul className="d-ps-relative d-stack2 d-m-50 d-px-0">
          {items.map((item, i) => (
            <DtListItem
              key={item.id}
              role="option"
              navigationType="arrow-keys"
              onClick={() => onComboboxSelect(i)}
              end={<span className="d-fc-secondary">{item.type}</span>}
            >
              {item.value}
            </DtListItem>
          ))}
        </ul>
      )}
      footer={footer ? <span dangerouslySetInnerHTML={{ __html: footer }} /> : undefined}
    />
  );
}

// Templates
const Template = (args: ComboboxMultiSelectStoryArgs) => <ComboboxMultiSelectDefault {...args} />;

export const Default: Story = {
  render: Template,
};

export const WithMaxSelectValidation: Story = {
  render: Template,

  args: {
    description: 'Select up to 2 options.',
    maxSelected: 2,
    selectedItems: ['item12', 'item13', 'item14'],
    maxSelectedMessage: [{ message: 'More than 2 selected', type: 'critical' }],
  },

  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false,
          },
          {
            id: 'label',
            enabled: false,
          },
        ],
      },
    },
    percy: {
      args: {
        showList: true,
      },
    },
  },
};

export const DuplicatedNames: Story = {
  render: Template,

  args: {
    selectedItems: ['item12', 'item12', 'item12'],
  },
};

export const WithCollapseOnFocusOut: Story = {
  render: Template,

  args: {
    selectedItems: ITEMS_LIST_DATA.map(item => item.value),
    collapseOnFocusOut: true,
  },
};

export const WithStyledInput: Story = {
  render: Template,

  args: {
    selectedItems: ['item12', 'item13', 'item14'],
    inputWrapperClass: ['d-ba-none', 'd-bgc-primary'],
  },
};
