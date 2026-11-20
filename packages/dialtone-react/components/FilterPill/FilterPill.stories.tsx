import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { CONTENT_MODE_TYPES } from '../../common/mode_constants';
import { DtIconBoxSelect, DtIconFilter } from '../../icons';
import { DtBadge } from '../Badge';
import { BUTTON_SIZE_MODIFIERS, DtButton, type ButtonSize } from '../Button';
import { DtListItem } from '../ListItem';
import { POPOVER_DIRECTIONS, POPOVER_PADDING_CLASSES } from '../Popover';
import { DtRadio } from '../Radio';
import { DtRadioGroup } from '../RadioGroup';
import { DtStack } from '../Stack';
import { DtText } from '../Text';
import {
  DtFilterPill,
  type DtFilterPillControlledAnchorScope,
  type DtFilterPillFilter,
  type DtFilterPillLabelScope,
  type DtFilterPillProps,
  type DtFilterPillSelectionAction,
} from './FilterPill';
import { FILTER_PILL_OVERLAY_MIN_INLINE_SIZE_VALUES } from './FilterPillConstants';
import type { DtFilterPillOption, DtFilterPillSelected } from './FilterPillSelection';

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
  overlayMinInlineSize: {
    control: 'select',
    options: FILTER_PILL_OVERLAY_MIN_INLINE_SIZE_VALUES,
    table: {
      defaultValue: { summary: 'anchor' },
    },
    // Not in Vue's argTypes: see contentMode.
    type: 'string',
  },
  popoverPadding: {
    table: {
      defaultValue: { summary: 'compact (block 100 / inline 150)' },
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

// The label slot's scope of a pill with legacy `value` filters.
const legacyLabel = (render: (scope: DtFilterPillLabelScope) => ReactNode) =>
  (scope: DtFilterPillLabelScope | DtFilterPillControlledAnchorScope) => render(scope as DtFilterPillLabelScope);

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
  100: 'Extra small',
  200: 'Small',
  300: 'Medium',
  400: 'Large',
  500: 'Extra Large',
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
          label="Conversation type"
          startTooltipText={selectedConversationType !== ALL_CONVERSATIONS ? 'Conversation type' : ''}
          endTooltipText="Remove"
          onClear={() => setSelectedConversationType(ALL_CONVERSATIONS)}
          content={(
            <DtRadioGroup
              value={selectedConversationType}
              onValueChange={setSelectedConversationType}
              aria-label="Conversation type"
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
          {({ label }) => (
            <>
              {selectedConversationType !== ALL_CONVERSATIONS && <span className="d-vi-visible-sr">{label}: </span>}
              {selectedConversationType === ALL_CONVERSATIONS ? label : selectedConversationType}
            </>
          )}
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
          {legacyLabel(({ label, filters, activeFilters }) => (
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
          ))}
        </DtFilterPill>
      </DtStack>
      {/* Radio selection: always active */}
      <DtStack gap="50">
        <span className="d-label--sm">Radio selection (always active)</span>
        <DtFilterPill
          value={internalExternal}
          onValueChange={setInternalExternal}
          label="Conversation scope"
          showClear={false}
          content={(
            <DtRadioGroup
              value={selectedIEFilter}
              onValueChange={setSelectedIEFilter}
              aria-label="Conversation scope"
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
          {({ label }) => (
            <>
              <span className="d-vi-visible-sr">{label}: </span>
              {selectedIEFilter || 'Internal and external'}
            </>
          )}
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
          {legacyLabel(({ label, filters, activeFilters, activeFilterList }) => (
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
          ))}
        </DtFilterPill>
      </DtStack>
      {/* Dropdown: single-select with list items */}
      <DtStack gap="50">
        <span className="d-label--sm">Dropdown: conversation type</span>
        <DtFilterPill
          value={dropdownConversationTypes}
          onValueChange={setDropdownConversationTypes}
          label="Conversation type"
          startTooltipText={selectedDropdownType !== ALL_CONVERSATIONS ? 'Conversation type' : ''}
          endTooltipText="Remove"
          useDropdown
          onClear={resetDropdownType}
          content={({ close }) => dropdownConversationTypes.map(filter => (
            // Vue's story also passes a `#selected` slot that keeps a hidden check in unselected rows; DtListItem has
            // no such slot, so an unselected row shows no check at all.
            <DtListItem
              key={filter.name}
              role="menuitemradio"
              navigationType="arrow-keys"
              selected={filter.name === selectedDropdownType}
              onClick={() => selectDropdownType(filter.name, close)}
            >
              {filter.name}
            </DtListItem>
          ))}
        >
          {({ label }) => (
            <>
              {selectedDropdownType !== ALL_CONVERSATIONS && <span className="d-vi-visible-sr">{label}: </span>}
              {selectedDropdownType === ALL_CONVERSATIONS ? label : selectedDropdownType}
            </>
          )}
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

const makeStatusOptions = (): DtFilterPillOption[] => [
  { value: 'all', label: 'All Messages', shortLabel: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'starred', label: 'Starred' },
  { value: 'mentions', label: 'Mentions & Reactions', shortLabel: 'Mentions' },
];

const TYPE_OPTIONS: DtFilterPillOption[] = [
  { value: 'all', label: 'All Types', shortLabel: 'All' },
  { value: 'calls', label: 'Calls Only', shortLabel: 'Calls' },
  { value: 'messages', label: 'Messages Only', shortLabel: 'Messages' },
  { value: 'voicemails', label: 'Voicemails' },
  { value: 'threads', label: 'Threads Only', shortLabel: 'Threads' },
];

const OUTCOME_OPTIONS: DtFilterPillOption[] = [
  { value: '', label: 'All outcomes' },
  { value: 'resolved', label: 'Resolved' },
];

const TEAM_OPTIONS: DtFilterPillOption[] = [
  { value: 'sales', label: 'Sales' },
  { value: 'support', label: 'Support' },
  { value: 'engineering', label: 'Engineering' },
];

// FilterPillCustomContent.story.vue
function FilterPillCustomContent () {
  return (
    <DtStack
      direction="row"
      gap="400"
    >
      <DtFilterPill
        label="Custom popover"
        content={({ close }) => (
          <DtStack gap="200">
            <span>Use custom content without a filter array.</span>
            <DtButton onClick={close}>
              Close custom popover
            </DtButton>
          </DtStack>
        )}
      />
      <DtFilterPill
        label="Custom dropdown"
        useDropdown
        content={({ close }) => (
          <DtListItem
            role="menuitem"
            navigationType="arrow-keys"
            onClick={close}
          >
            Close custom dropdown
          </DtListItem>
        )}
      />
    </DtStack>
  );
}

// Selection summaries, as the Vue story's inline template renders them.
function FilterPillSelectionSummaries () {
  return (
    <DtStack
      direction="row"
      gap="400"
    >
      <DtFilterPill
        label="All teams"
        value={[{ name: 'Support', active: true }, { name: 'Sales', active: true }]}
      />
      <DtFilterPill
        label="Two teams"
        value={[{ name: 'Support', active: true }, { name: 'Sales', active: true }, { name: 'Engineering' }]}
      />
      <DtFilterPill
        label="Three teams"
        value={[
          { name: 'Support', active: true },
          { name: 'Sales', active: true },
          { name: 'Engineering', active: true },
          { name: 'Marketing' },
        ]}
      />
    </DtStack>
  );
}

const unreadBadge = (count: number) => (
  <>
    <DtBadge
      type="bulletin"
      kind="count"
      aria-hidden="true"
    >
      {count > 99 ? '99+' : String(count)}
    </DtBadge>
    <span className="d-vi-visible-sr">, {count} unread messages</span>
  </>
);

type ControlledAction = DtFilterPillSelectionAction & { dimension: string };

// FilterPillControlled.story.vue
function FilterPillControlled ({ initialMenuOpen = false }: { initialMenuOpen?: boolean }) {
  const [current, setCurrent] = useState<DtFilterPillSelected>(initialMenuOpen ? 'unread' : 'all');
  const [statusOpen, setStatusOpen] = useState(initialMenuOpen);
  const [statusOptions, setStatusOptions] = useState(makeStatusOptions);
  const [unreadCount, setUnreadCount] = useState(12);
  const [type, setType] = useState<DtFilterPillSelected>('all');
  const [outcome, setOutcome] = useState<DtFilterPillSelected>('');
  const [teams, setTeams] = useState<DtFilterPillSelected>(Object.freeze(['sales']));
  const [deferredTeams, setDeferredTeams] = useState<DtFilterPillSelected>(['sales']);
  const [acceptTeams, setAcceptTeams] = useState(false);
  const latestTeams = useRef<string[] | null>(null);
  const [commits, setCommits] = useState<ControlledAction[]>([]);
  const record = (dimension: string, action: DtFilterPillSelectionAction) =>
    setCommits(previous => [...previous, { dimension, ...action }]);

  const reset = () => {
    setCurrent('all');
    setStatusOptions(makeStatusOptions());
    setUnreadCount(12);
    setType('all');
    setOutcome('');
    setTeams(Object.freeze(['sales']));
    setDeferredTeams(['sales']);
    latestTeams.current = null;
    setAcceptTeams(false);
    setCommits([]);
  };

  return (
    <DtStack
      as="section"
      aria-label={initialMenuOpen
        ? 'Initially open controlled FilterPill selection'
        : 'Controlled FilterPill selection'}
      gap="500"
    >
      <DtStack
        direction="row"
        gap="400"
        className="d-fl-wrap"
      >
        <DtFilterPill
          open={statusOpen}
          onOpenChange={setStatusOpen}
          popoverAppendTo="parent"
          label="Filter by"
          useDropdown
          options={statusOptions}
          selected={current}
          neutralValue="all"
          startTooltipText={current === 'all' ? '' : 'Filter by'}
          endTooltipText="Clear"
          onSelectionChange={(action) => {
            setCurrent(action.value);
            record('status', action);
          }}
          headerContent="Filter by"
          anchorEnd={({ selected }) => (selected === 'unread' && unreadCount > 0 ? unreadBadge(unreadCount) : null)}
          optionEnd={({ option }) => (option.value === 'unread' && unreadCount > 0 ? unreadBadge(unreadCount) : null)}
        />
        <DtFilterPill
          selected={type}
          onSelectedChange={setType}
          popoverAppendTo="parent"
          label="Type"
          useDropdown
          neutralValue="all"
          options={TYPE_OPTIONS}
          headerContent="Type"
        />
        <DtFilterPill
          selected={outcome}
          onSelectedChange={setOutcome}
          popoverAppendTo="parent"
          label="Outcome"
          useDropdown
          neutralValue=""
          options={OUTCOME_OPTIONS}
          headerContent="Outcome"
        />
      </DtStack>
      <DtStack
        direction="row"
        gap="400"
        className="d-fl-wrap"
      >
        <DtButton
          kind="muted"
          importance="outlined"
          size="200"
          onClick={() => setCurrent('mentions')}
        >
          External Mentions
        </DtButton>
        <DtButton
          kind="muted"
          importance="outlined"
          size="200"
          onClick={() => setStatusOptions(statusOptions.map(option => ({ ...option, label: `${option.label} updated` })))}
        >
          Replace labels
        </DtButton>
        <DtButton
          kind="muted"
          importance="outlined"
          size="200"
          onClick={() => setUnreadCount(unreadCount === 12 ? 100 : unreadCount === 100 ? 0 : 12)}
        >
          Refresh count
        </DtButton>
        <DtButton
          kind="muted"
          importance="outlined"
          size="200"
          onClick={() => setStatusOptions([])}
        >
          Empty options
        </DtButton>
        <DtButton
          kind="muted"
          importance="outlined"
          size="200"
          onClick={() => setStatusOptions(makeStatusOptions())}
        >
          Restore options
        </DtButton>
        <DtButton
          kind="muted"
          importance="outlined"
          size="200"
          onClick={() => setStatusOpen(!statusOpen)}
        >
          Toggle status visibility
        </DtButton>
      </DtStack>
      <DtStack
        direction="row"
        gap="400"
        className="d-fl-wrap"
      >
        <DtFilterPill
          popoverAppendTo="parent"
          label="Immediate teams"
          options={TEAM_OPTIONS}
          selected={teams}
          onSelectionChange={(action) => {
            latestTeams.current = [...(action.value as string[])];
            if (acceptTeams) setTeams(Object.freeze([...(action.value as string[])]));
            record('immediate teams', action);
          }}
        />
        <DtFilterPill
          selected={deferredTeams}
          onSelectedChange={setDeferredTeams}
          popoverAppendTo="parent"
          label="Deferred teams"
          deferSelection
          options={TEAM_OPTIONS}
          onSelectionChange={action => record('deferred teams', action)}
        />
      </DtStack>
      <DtStack
        direction="row"
        gap="400"
        className="d-fl-wrap"
      >
        <DtButton
          kind="muted"
          importance="outlined"
          size="200"
          onClick={() => setAcceptTeams(!acceptTeams)}
        >
          {acceptTeams ? 'Decline immediate proposals' : 'Accept immediate proposals'}
        </DtButton>
        <DtButton
          kind="muted"
          importance="outlined"
          size="200"
          onClick={() => {
            if (latestTeams.current) setTeams(Object.freeze([...latestTeams.current]));
          }}
        >
          Accept latest proposal later
        </DtButton>
        <DtButton
          kind="muted"
          importance="outlined"
          size="200"
          onClick={() => setDeferredTeams(['engineering'])}
        >
          External deferred Engineering
        </DtButton>
        <DtButton
          kind="muted"
          importance="outlined"
          size="200"
          onClick={reset}
        >
          Reset
        </DtButton>
      </DtStack>
      <p>
        Committed: status={String(current)}, type={String(type)}, outcome={outcome || '(empty neutral)'},
        teams={String(teams)}, deferred={String(deferredTeams)}
      </p>
      <p>
        Immediate proposals are {acceptTeams ? 'accepted synchronously' : 'declined'}.
        Persist accepted UI state asynchronously in the application.
      </p>
      <pre data-qa="controlled-action-trace">{JSON.stringify(commits, null, 2)}</pre>
    </DtStack>
  );
}

// FilterPillUnavailableChoices.story.vue
function FilterPillUnavailableChoices () {
  const [status, setStatus] = useState<DtFilterPillSelected>('unread');
  const [type, setType] = useState<DtFilterPillSelected>('all');
  const statusOptions: DtFilterPillOption[] = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
  ];
  // The application decides availability: archived items need Status set to All.
  const archivedUnavailable = status !== 'all';
  const typeOptions: DtFilterPillOption[] = [
    { value: 'all', label: 'All types' },
    { value: 'calls', label: 'Calls' },
    { value: 'messages', label: 'Messages', description: 'Includes texts and chats' },
    {
      value: 'archived',
      label: 'Archived',
      group: 'Other views',
      disabled: archivedUnavailable,
      description: archivedUnavailable ? 'Choose All under Status to view archived items' : null,
    },
    { value: 'spam', label: 'Spam', group: 'Other views' },
  ];

  return (
    <DtStack
      as="section"
      aria-label="FilterPill with unavailable choices"
      direction="row"
      gap="400"
      className="d-fl-wrap"
    >
      <DtFilterPill
        selected={status}
        onSelectedChange={setStatus}
        popoverAppendTo="parent"
        label="Status"
        useDropdown
        neutralValue="all"
        endTooltipText="Clear"
        options={statusOptions}
        headerContent="Status"
      />
      <DtFilterPill
        selected={type}
        onSelectedChange={setType}
        popoverAppendTo="parent"
        label="Type"
        useDropdown
        neutralValue="all"
        endTooltipText="Clear"
        options={typeOptions}
        headerContent="Type"
      />
    </DtStack>
  );
}

// FilterPillCloseBeforeRemoval.story.vue
function FilterPillCloseBeforeRemoval ({ useDropdown = false }: { useDropdown?: boolean }) {
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DtFilterPillSelected>(useDropdown ? 'sales' : ['sales']);
  const removing = useRef(false);
  const [events, setEvents] = useState<boolean[]>([]);
  const resetButton = useRef<HTMLButtonElement>(null);
  const [focusReset, setFocusReset] = useState(false);

  // Vue's `$nextTick(() => resetButton.focus())`, once the pill is gone.
  useEffect(() => {
    if (focusReset) {
      resetButton.current?.focus();
      setFocusReset(false);
    }
  }, [focusReset]);

  return (
    <DtStack
      as="section"
      aria-label={useDropdown ? 'Dropdown filter close before removal' : 'Popover filter close before removal'}
      gap="500"
    >
      {visible && (
        <DtFilterPill
          open={open}
          onOpenChange={setOpen}
          selected={selected}
          onSelectedChange={setSelected}
          popoverAppendTo="parent"
          useDropdown={useDropdown}
          options={[{ value: 'sales', label: 'Sales' }]}
          label="Removable teams"
          data-qa="close-before-removal-pill"
          onOpened={(value) => {
            setEvents(previous => [...previous, value]);
            if (value || !removing.current) return;
            setVisible(false);
            removing.current = false;
            setFocusReset(true);
          }}
          content={(
            <DtButton
              role={useDropdown ? 'menuitem' : undefined}
              data-qa="close-before-removal-close"
              onClick={() => {
                removing.current = true;
                setOpen(false);
              }}
            >
              Close then remove
            </DtButton>
          )}
        />
      )}
      <DtButton
        ref={resetButton}
        data-qa="close-before-removal-reset"
        onClick={() => {
          setOpen(false);
          setVisible(true);
          removing.current = false;
          setEvents([]);
        }}
      >
        Reset removable filter
      </DtButton>
      <p>Keep the filter mounted until opened(false) completes focus and scroll cleanup.</p>
      <pre data-qa="close-before-removal-trace">{JSON.stringify(events)}</pre>
    </DtStack>
  );
}

export const CustomContent: Story = {
  render: () => <FilterPillCustomContent />,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};

export const SelectionSummaries: Story = {
  render: () => <FilterPillSelectionSummaries />,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};

export const ControlledSelection: Story = {
  render: () => <FilterPillControlled />,
  parameters: { options: { showPanel: false }, controls: { disable: true }, a11y: { context: 'body' } },
};

export const ControlledOpenMenu: Story = {
  render: () => <FilterPillControlled initialMenuOpen />,
  parameters: { options: { showPanel: false }, controls: { disable: true }, a11y: { context: 'body' } },
};

export const ControlledUnavailableChoices: Story = {
  render: () => <FilterPillUnavailableChoices />,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    a11y: { context: 'body' },
    docs: {
      description: {
        story: 'Single-selection dropdown options can set `disabled` (visible and focusable, but activation is refused and the menu stays open), `description` (secondary text, also the row\'s accessible description) and `group` (consecutive options with the same group share one heading).',
      },
    },
  },
};

export const ControlledCloseBeforeRemoval: Story = {
  render: () => <FilterPillCloseBeforeRemoval />,
  parameters: { options: { showPanel: false }, controls: { disable: true }, a11y: { context: 'body' } },
};

export const ControlledDropdownCloseBeforeRemoval: Story = {
  render: () => <FilterPillCloseBeforeRemoval useDropdown />,
  parameters: { options: { showPanel: false }, controls: { disable: true }, a11y: { context: 'body' } },
};
