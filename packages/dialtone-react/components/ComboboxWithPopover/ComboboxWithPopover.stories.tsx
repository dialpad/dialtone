import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { CONTENT_MODE_TYPES } from '../../common/mode_constants';
import { DtCheckbox } from '../Checkbox';
import { COMBOBOX_LABEL_SIZES } from '../Combobox';
import { DtInput } from '../Input';
import { DtListItem } from '../ListItem';
import { POPOVER_CONTENT_WIDTHS } from '../Popover';
import { DtStack } from '../Stack';
import { DROPDOWN_PADDING_CLASSES } from '../Dropdown/DropdownConstants';
import { DtComboboxWithPopover, type DtComboboxWithPopoverProps } from './ComboboxWithPopover';

interface ComboboxWithPopoverItem {
  id: string;
  number: string;
  type: string;
}

// The slots are string args, as in Vue: `header` and `footer` render through `v-html`. `items` is the story's own.
type ComboboxWithPopoverStoryArgs = Omit<DtComboboxWithPopoverProps, 'input' | 'list' | 'header' | 'footer'> & {
  input?: string;
  list?: string;
  header?: string;
  footer?: string;
  items?: ComboboxWithPopoverItem[];
};

// dialtone-vue's CONTENT_MODE_ARG_TYPE (common/mode_constants.js), which the React port of mode_constants doesn't have,
// plus `type: 'string'`: react-docgen reports contentMode as a union, and Storybook drops a URL value for a union arg.
const CONTENT_MODE_ARG_TYPE = {
  options: [null, ...Object.values(CONTENT_MODE_TYPES)],
  type: 'string',
  control: {
    type: 'select',
    labels: { null: '(none)' },
  },
  table: {
    category: 'props',
    defaultValue: { summary: 'null' },
  },
};

// Default Prop Values
export const argsData = {
  label: 'Label Text',
  showLabel: true,
  size: COMBOBOX_LABEL_SIZES.DEFAULT,
  contentWidth: 'anchor',
  appendTo: 'body',
  padding: 'small',
  maxHeight: '300px',
  emptyList: false,
  loading: false,
  onEscape: action('escape'),
  onHighlight: action('highlight'),
  onSelect: action('select'),
  onOpened: action('opened'),
} satisfies Partial<ComboboxWithPopoverStoryArgs>;

export const argTypesData = {
  // Slots
  input: {
    description: 'Slot for the input component',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'ReactNode | ({ inputProps, onInput }) => ReactNode',
      },
    },
  },
  list: {
    description: 'Slot for the list',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'ReactNode | ({ listProps }) => ReactNode',
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
  contentMode: CONTENT_MODE_ARG_TYPE,
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
  showList: {
    control: { type: 'boolean' },
    table: {
      defaultValue: {
        summary: 'null',
      },
    },
  },
  listId: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  contentWidth: {
    options: POPOVER_CONTENT_WIDTHS,
    control: {
      type: 'select',
    },
    table: {
      defaultValue: {
        summary: 'null',
      },
    },
  },
  appendTo: {
    table: {
      defaultValue: {
        summary: 'body',
      },
    },
  },
  padding: {
    options: Object.keys(DROPDOWN_PADDING_CLASSES),
    control: {
      type: 'select',
    },
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

  dialogClass: {
    description: 'Additional class for the popover dialog element.',
    control: {
      type: 'text',
    },
  },

  // Action Event Handlers: Vue's `escape`, `highlight`, `select` and `opened` event entries are these props.
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

  // Hide items because it's used for storybook only
  // not a real component prop.
  items: {
    table: {
      disable: true,
    },
  },
};

// Story Collection
const meta = {
  title: 'Components/Combobox With Popover',
  component: DtComboboxWithPopover,
  args: argsData,
  argTypes: argTypesData as unknown as Meta<ComboboxWithPopoverStoryArgs>['argTypes'],
  excludeStories: /.*Data$/,
} satisfies Meta<ComboboxWithPopoverStoryArgs>;

export default meta;
type Story = StoryObj<ComboboxWithPopoverStoryArgs>;

// ComboboxWithPopoverDefault.story.vue
function ComboboxWithPopoverDefault ({
  input: _input,
  list: _list,
  header,
  footer,
  items = [],
  onSelect,
  ...args
}: ComboboxWithPopoverStoryArgs) {
  const [value, setValue] = useState('');

  const onComboboxSelect = (i: number) => {
    onSelect?.(i);
    setValue(items[i].number);
  };

  // Vue's template tests `!emptyList`, which isn't defined in it (the arg is `$attrs.emptyList`): the default footer
  // always shows, in the Empty story too.
  const footerContent = footer
    ? <span dangerouslySetInnerHTML={{ __html: footer }} />
    : (
      <DtStack direction="row" align="center" className="d-px-150">
        <DtCheckbox label="Apply primary number to assigned Contact Centers" />
      </DtStack>
    );

  return (
    <DtComboboxWithPopover
      {...args}
      label={args.label ?? ''}
      onSelect={onComboboxSelect}
      header={header ? <span dangerouslySetInnerHTML={{ __html: header }} /> : undefined}
      input={({ inputProps, onInput }) => (
        <DtInput
          value={value}
          onValueChange={(next) => {
            setValue(String(next));
            onInput(next);
          }}
          placeholder="Select one or start typing"
          {...inputProps}
          size={inputProps.size ?? undefined}
        />
      )}
      list={({ listProps }) => (
        <ul {...listProps} className={`${listProps.className} d-p-50`}>
          {items.map((item, i) => (
            <DtListItem
              key={item.id}
              role="option"
              navigationType="arrow-keys"
              onClick={() => onComboboxSelect(i)}
              end={item.type}
            >
              {item.number}
            </DtListItem>
          ))}
        </ul>
      )}
      footer={footerContent}
    />
  );
}

// Templates
const DefaultTemplate = (args: ComboboxWithPopoverStoryArgs) => <ComboboxWithPopoverDefault {...args} />;

export const Default: Story = {
  render: DefaultTemplate,

  args: {
    items: [
      { id: 'item1', number: '(732) 338-2720', type: 'MAINLINE' },
      { id: 'item2', number: '(732) 338-2722', type: 'MAINLINE' },
      { id: 'item3', number: '(732) 338-2725', type: 'MAINLINE' },
      { id: 'item4', number: '(732) 338-2764', type: 'MAINLINE' },
      { id: 'item5', number: '(732) 338-2784', type: 'MAINLINE' },
      { id: 'item6', number: '(732) 338-2743', type: 'MAINLINE' },
      { id: 'item7', number: '(732) 338-2728', type: 'MAINLINE' },
      { id: 'item8', number: '(732) 338-2769', type: 'Other' },
      { id: 'item9', number: '(732) 338-2723', type: 'MAINLINE' },
      { id: 'item10', number: '(732) 338-2729', type: 'MAINLINE' },
      { id: 'item11', number: '(732) 338-2489', type: 'MAINLINE' },
      { id: 'item12', number: '(732) 338-2756', type: 'Other' },
    ],
  },

  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-valid-attr-value',
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

export const Empty: Story = {
  render: DefaultTemplate,

  args: {
    items: [],
    emptyStateMessage: 'No matches found.',
    emptyList: true,
  },

  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-valid-attr-value',
            enabled: false,
          },
        ],
      },
    },
  },
};
