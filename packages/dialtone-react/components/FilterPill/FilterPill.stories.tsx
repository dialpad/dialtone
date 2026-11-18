import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { CONTENT_MODE_TYPES } from '../../common/mode_constants';
import { DtIconBoxSelect, DtIconFilter } from '../../icons';
import { BUTTON_SIZE_MODIFIERS, type ButtonSize } from '../Button';
import { DtListItem } from '../ListItem';
import { POPOVER_DIRECTIONS, POPOVER_PADDING_CLASSES } from '../Popover';
import { DtRadio } from '../Radio';
import { DtRadioGroup } from '../RadioGroup';
import { DtStack } from '../Stack';
import { DtText } from '../Text';
import { DtFilterPill, type DtFilterPillFilter, type DtFilterPillProps } from './FilterPill';

// Slots are args named as in Vue: `content` (and the default slot) are HTML strings, as FilterPillDefault.story.vue
// renders them with v-html.
type FilterPillStoryArgs = Omit<DtFilterPillProps, 'content' | 'children'> & {
  content?: string;
  defaultSlot?: string;
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

// Set default values at the story level here.
export const argsData: Partial<FilterPillStoryArgs> = {
  label: 'Fruit',
  useDropdown: false,
  deferSelection: false,
  readOnly: false,
  onOpen: action('open'),
  onClear: action('clear'),
  onApply: action('apply'),
  onValueChange: action('update:modelValue'),
  value: [
    { name: 'Orange', active: true },
    { name: 'Apple' },
    { name: 'Avocado' },
    { name: 'Grapefruit' },
    { name: 'Strawberry' },
  ],
};

export const argTypesData = {
  // Slots
  content: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  contentMode: CONTENT_MODE_ARG_TYPE,
  size: {
    control: 'select',
    options: Object.keys(BUTTON_SIZE_MODIFIERS),
    // Not in Vue's argTypes: see contentMode.
    type: 'string',
  },
  popoverPadding: {
    table: {
      defaultValue: { summary: 'large' },
    },
    options: Object.keys(POPOVER_PADDING_CLASSES),
    control: {
      type: 'select',
    },
  },
  popoverPlacement: {
    options: POPOVER_DIRECTIONS,
    control: {
      type: 'select',
    },
  },

  popoverContentClass: {
    control: 'text',
  },
  popoverHeaderClass: {
    control: 'text',
  },
  popoverFooterClass: {
    control: 'text',
  },
  popoverDialogClass: {
    control: 'text',
  },
  dropdownListClass: {
    control: 'text',
  },

  startTooltipText: {
    control: 'text',
  },
  endTooltipText: {
    control: 'text',
  },

  // Events: Exclude this from the table as event names will automatically be added from the component itself.
  onClear: {
    action: 'clear',
    table: {
      disable: true,
    },
  },

  onOpen: {
    action: 'open',
    table: {
      disable: true,
    },
  },

  onApply: {
    action: 'apply',
    table: {
      disable: true,
    },
  },

  onValueChange: {
    table: {
      disable: true,
    },
  },
};

// Story Collection
const meta = {
  title: 'Components/Filter Pill',
  component: DtFilterPill,
  args: argsData,
  // Vue's argTypes as they are, though Storybook's types have no `type: 'select'`.
  argTypes: argTypesData as unknown as Meta<FilterPillStoryArgs>['argTypes'],
  excludeStories: /.*Data$/,
} satisfies Meta<FilterPillStoryArgs>;

export default meta;
type Story = StoryObj<FilterPillStoryArgs>;

const Html = ({ html }: { html: string }) => <span dangerouslySetInnerHTML={{ __html: html }} />;

// FilterPillDefault.story.vue
function FilterPillDefault ({ value, onValueChange, content, defaultSlot, ...rest }: FilterPillStoryArgs) {
  // v-model, starting from the `value` arg and following it.
  const [filters, setFilters] = useState(value);
  useEffect(() => {
    setFilters(value);
  }, [value]);

  return (
    <DtFilterPill
      {...rest}
      value={filters}
      onValueChange={(next) => {
        setFilters(next);
        onValueChange?.(next);
      }}
      content={content ? <Html html={content} /> : undefined}
    >
      {defaultSlot ? <Html html={defaultSlot} /> : undefined}
    </DtFilterPill>
  );
}

const SIZE_NAMES: Record<string, string> = {
  xs: 'Extra small',
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra Large',
};

const ALL_CONVERSATIONS = 'All Conversations';

// FilterPillVariants.story.vue
function FilterPillVariants () {
  const [channels, setChannels] = useState<DtFilterPillFilter[]>([
    { name: 'Email' },
    { name: 'Phone' },
    { name: 'Chat' },
    { name: 'Social' },
    { name: 'SMS' },
  ]);
  const [contactCenters, setContactCenters] = useState<DtFilterPillFilter[]>([
    { name: 'Headquarters', active: true },
    { name: 'Westside' },
    { name: 'Downtown' },
    { name: 'Riverside' },
    { name: 'Northgate' },
  ]);
  const [contactCenters2, setContactCenters2] = useState<DtFilterPillFilter[]>([
    { name: 'Headquarters', active: true },
    { name: 'Westside' },
    { name: 'Downtown' },
    { name: 'Riverside' },
    { name: 'Northgate' },
  ]);
  const [contactCentersBadge, setContactCentersBadge] = useState<DtFilterPillFilter[]>([
    { name: 'Headquarters', active: true },
    { name: 'Westside' },
    { name: 'Downtown', active: true },
    { name: 'Riverside' },
    { name: 'Northgate' },
  ]);
  const [merchandise, setMerchandise] = useState<DtFilterPillFilter[]>([
    { name: 'Trousers' },
    { name: 'Shirt', active: true },
    { name: 'Jacket' },
    { name: 'Shoes' },
    { name: 'Accessories' },
  ]);
  const [conversationTypes, setConversationTypes] = useState<DtFilterPillFilter[]>([
    { name: ALL_CONVERSATIONS },
    { name: 'Only Calls' },
    { name: 'Only Meetings' },
    { name: 'Only Digital' },
  ]);
  const [internalExternal, setInternalExternal] = useState<DtFilterPillFilter[]>([
    { name: 'Internal and external', active: true },
    { name: 'Internal only' },
    { name: 'External only' },
  ]);
  const [channelsCustom, setChannelsCustom] = useState<DtFilterPillFilter[]>([
    { name: 'Email', active: true },
    { name: 'Phone', active: true },
    { name: 'Chat', active: true },
    { name: 'Social' },
    { name: 'SMS' },
  ]);
  const [readOnlySelections, setReadOnlySelections] = useState<DtFilterPillFilter[]>([
    { name: 'Headquarters', active: true },
    { name: 'Westside', active: true },
    { name: 'Downtown' },
  ]);
  const [deferredFilters, setDeferredFilters] = useState<DtFilterPillFilter[]>([
    { name: 'Email' },
    { name: 'Phone' },
    { name: 'Chat' },
    { name: 'Social' },
    { name: 'SMS' },
  ]);
  const [dropdownConversationTypes, setDropdownConversationTypes] = useState<DtFilterPillFilter[]>([
    { name: ALL_CONVERSATIONS },
    { name: 'Only Calls' },
    { name: 'Only Meetings' },
    { name: 'Only Digital' },
  ]);
  const sizes = Object.keys(BUTTON_SIZE_MODIFIERS) as ButtonSize[];

  const selectedConversationType = conversationTypes.find(f => f.active)?.name || ALL_CONVERSATIONS;
  const setSelectedConversationType = (newValue: unknown) => {
    setConversationTypes(conversationTypes.map(f => ({
      ...f,
      active: f.name === newValue && newValue !== ALL_CONVERSATIONS,
    })));
  };

  const selectedIEFilter = internalExternal.find(f => f.active)?.name;
  const setSelectedIEFilter = (newValue: unknown) => {
    setInternalExternal(internalExternal.map(f => ({ ...f, active: f.name === newValue })));
  };

  const selectedDropdownType = dropdownConversationTypes.find(f => f.active)?.name || ALL_CONVERSATIONS;
  const selectDropdownType = (name: string, close: () => void) => {
    setDropdownConversationTypes(dropdownConversationTypes.map(f => ({
      ...f,
      active: name !== ALL_CONVERSATIONS && f.name === name,
    })));
    close();
  };
  const resetDropdownType = () => {
    setDropdownConversationTypes(dropdownConversationTypes.map(f => ({ ...f, active: false })));
  };

  return (
    <DtStack gap="200">
      {/* No selection */}
      <DtStack gap="50">
        <span className="d-label--sm">No selection</span>
        <DtFilterPill
          value={channels}
          onValueChange={setChannels}
          label="Channel"
          startIcon={({ iconSize }) => <DtIconFilter size={iconSize} />}
        />
      </DtStack>
      {/* With start icon */}
      <DtStack gap="50">
        <span className="d-label--sm">With start icon</span>
        <DtFilterPill
          value={contactCenters}
          onValueChange={setContactCenters}
          label="Contact centers"
          endTooltipText="Remove"
          startIcon={({ iconSize }) => <DtIconBoxSelect size={iconSize} />}
        />
      </DtStack>
      {/* Selected, show label/count, has clear */}
      <DtStack gap="50">
        <span className="d-label--sm">Selected, show label/count, has clear</span>
        <DtFilterPill
          value={contactCenters2}
          onValueChange={setContactCenters2}
          label="Contact centers"
          endTooltipText="Remove"
        />
      </DtStack>
      {/* Selected, overflow, label tooltip, has clear */}
      <DtStack gap="50">
        <span className="d-label--sm">Selected, overflow, label tooltip, has clear</span>
        <DtFilterPill
          value={merchandise}
          onValueChange={setMerchandise}
          startTooltipText="Merchandise"
          label="Merchandise"
          endTooltipText="Remove"
        />
      </DtStack>
      {/* Custom label slot: conversation type */}
      <DtStack gap="50">
        <span className="d-label--sm">Custom label slot: conversation type</span>
        <DtFilterPill
          value={conversationTypes}
          onValueChange={setConversationTypes}
          startTooltipText={selectedConversationType !== ALL_CONVERSATIONS ? 'Conversation type' : ''}
          endTooltipText="Remove"
          onClear={() => setSelectedConversationType(ALL_CONVERSATIONS)}
          content={(
            <DtRadioGroup
              value={selectedConversationType}
              onValueChange={setSelectedConversationType}
              name="conversation-type-filter"
            >
              {conversationTypes.map(filter => (
                <DtRadio
                  key={filter.name}
                  label={filter.name}
                  value={filter.name}
                />
              ))}
            </DtRadioGroup>
          )}
        >
          {selectedConversationType === ALL_CONVERSATIONS ? 'Conversation type' : selectedConversationType}
        </DtFilterPill>
      </DtStack>
      {/* Custom label */}
      <DtStack gap="50">
        <span className="d-label--sm">Custom label slot</span>
        <DtFilterPill
          value={contactCentersBadge}
          onValueChange={setContactCentersBadge}
          label="Contact centers"
          endTooltipText="Remove"
        >
          {({ label, filters, activeFilters }) => (
            <>
              {label}:
              {activeFilters.length > 0 && (
                <DtText
                  as="strong"
                  numeric
                >
                  {activeFilters.length === filters.length ? 'All' : activeFilters.length}
                </DtText>
              )}
            </>
          )}
        </DtFilterPill>
      </DtStack>
      {/* Radio selection: always active */}
      <DtStack gap="50">
        <span className="d-label--sm">Radio selection (always active)</span>
        <DtFilterPill
          value={internalExternal}
          onValueChange={setInternalExternal}
          showClear={false}
          content={(
            <DtRadioGroup
              value={selectedIEFilter}
              onValueChange={setSelectedIEFilter}
              name="internal-external-filter"
            >
              {internalExternal.map(filter => (
                <DtRadio
                  key={filter.name}
                  label={filter.name}
                  value={filter.name}
                />
              ))}
            </DtRadioGroup>
          )}
        >
          {selectedIEFilter || 'Internal and external'}
        </DtFilterPill>
      </DtStack>
      {/* All/selected list */}
      <DtStack gap="50">
        <span className="d-label--sm">All/selected list</span>
        <DtFilterPill
          value={channelsCustom}
          onValueChange={setChannelsCustom}
          label="Channel"
          endTooltipText="Remove"
        >
          {({ label, filters, activeFilters, activeFilterList }) => (
            <>
              {label}:
              {activeFilters.length > 0 && (
                <DtText
                  as="strong"
                  numeric
                >
                  {activeFilters.length === filters.length ? 'All' : activeFilterList}
                </DtText>
              )}
            </>
          )}
        </DtFilterPill>
      </DtStack>
      {/* Dropdown: single-select with list items */}
      <DtStack gap="50">
        <span className="d-label--sm">Dropdown: conversation type</span>
        <DtFilterPill
          value={dropdownConversationTypes}
          onValueChange={setDropdownConversationTypes}
          startTooltipText={selectedDropdownType !== ALL_CONVERSATIONS ? 'Conversation type' : ''}
          endTooltipText="Remove"
          useDropdown
          onClear={resetDropdownType}
          content={({ close }) => dropdownConversationTypes.map(filter => (
            <DtListItem
              key={filter.name}
              role="menuitem"
              navigationType="arrow-keys"
              selected={filter.name === selectedDropdownType}
              onClick={() => selectDropdownType(filter.name, close)}
            >
              {filter.name}
            </DtListItem>
          ))}
        >
          {selectedDropdownType === ALL_CONVERSATIONS ? 'Conversation type' : selectedDropdownType}
        </DtFilterPill>
      </DtStack>
      {/* Deferred selection */}
      <DtStack gap="50">
        <span className="d-label--sm">Deferred selection (Apply/Cancel)</span>
        <DtFilterPill
          value={deferredFilters}
          onValueChange={setDeferredFilters}
          label="Deferred"
          endTooltipText="Remove"
          deferSelection
        />
      </DtStack>
      {/* Read only */}
      <DtStack gap="50">
        <span className="d-label--sm">Read only</span>
        <DtFilterPill
          readOnly
          label="Conversation type"
        />
      </DtStack>
      <DtStack gap="50">
        <span className="d-label--sm">Read only with selections</span>
        <DtFilterPill
          value={readOnlySelections}
          onValueChange={setReadOnlySelections}
          readOnly
          label="Contact centers"
        />
      </DtStack>
      {/* Disabled */}
      <DtStack gap="50">
        <span className="d-label--sm">Disabled</span>
        <DtFilterPill
          disabled
          label="Conversation type"
        />
      </DtStack>
      <DtStack gap="50">
        <span className="d-label--sm">Disabled with selections</span>
        <DtFilterPill
          value={contactCenters}
          onValueChange={setContactCenters}
          disabled
          label="Contact centers"
          endTooltipText="Remove"
        />
      </DtStack>
      {/* Sizes */}
      <DtStack gap="200">
        <h3>Sizes</h3>
        {sizes.map(size => (
          <DtFilterPill
            key={size}
            label={SIZE_NAMES[size]}
            size={size}
            content="Popover content"
          />
        ))}
      </DtStack>
    </DtStack>
  );
}

// Stories
export const Default: Story = {
  render: args => <FilterPillDefault {...args} />,
  decorators: [
    StoryComponent => <div><StoryComponent /></div>,
  ],
};

export const Variants: Story = {
  render: () => <FilterPillVariants />,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
