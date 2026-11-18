import { useEffect, useId, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StandIn } from '../../.storybook/StandIn';
import { DtAvatar } from '../../components/Avatar/Avatar';
import { DtBadge } from '../../components/Badge/Badge';
import { DtButton } from '../../components/Button/Button';
import { DtCollapsible } from '../../components/Collapsible/Collapsible';
import { DtIcon } from '../../components/Icon/Icon';
import { DtInput } from '../../components/Input/Input';
import { DtLink } from '../../components/Link/Link';
import { DtStack } from '../../components/Stack/Stack';
import type { StackDirection, StackGap } from '../../components/Stack/StackConstants';
import { DtText } from '../../components/Text/Text';
import { DtValidationMessages } from '../../components/ValidationMessages/ValidationMessages';
import type { FocusgroupValue } from './focusgroup_utils';
import { useFocusGroup, type FocusgroupMoveDetail } from './useFocusGroup';

export const argsData = {};
export const argTypesData = {};

const meta = {
  title: 'Directives/Focusgroup',
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const parameters = {
  options: { showPanel: false },
  controls: { disable: true },
};

// ── Helper: the DtStack Vue's stories put `v-dt-focusgroup` on ─
interface GroupProps {
  value?: FocusgroupValue;
  direction?: StackDirection;
  gap?: StackGap;
  role: string;
  label: string;
  className?: string;
  'aria-orientation'?: 'horizontal' | 'vertical';
  tabIndex?: number;
  onMove?: (detail: FocusgroupMoveDetail) => void;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  children: ReactNode;
}

function Group ({ value, direction, gap, role, label, onMove, children, ...rest }: GroupProps) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useFocusGroup(el, value);

  // Vue's `@dt-focusgroup-move` listener.
  useEffect(() => {
    if (!el || !onMove) return undefined;
    const listener = (event: CustomEvent<FocusgroupMoveDetail>) => onMove(event.detail);
    el.addEventListener('dt-focusgroup-move', listener);
    return () => el.removeEventListener('dt-focusgroup-move', listener);
  }, [el, onMove]);

  return (
    <DtStack ref={setEl} direction={direction} gap={gap} role={role} aria-label={label} {...rest}>
      {children}
    </DtStack>
  );
}

const Outlined = ({ children, ...rest }: Parameters<typeof DtButton>[0]) => (
  <DtButton kind="muted" importance="outlined" {...rest}>{children}</DtButton>
);

// ── Default: horizontal toolbar ─────────────────────────────
export const Default: Story = {
  render: () => (
    <Group value="horizontal" direction="row" gap="100" role="toolbar" label="Text formatting">
      <Outlined>Bold</Outlined>
      <Outlined>Italic</Outlined>
      <Outlined>Underline</Outlined>
      <Outlined aria-disabled="true" className="d-btn--disabled">
        Strikethrough (disabled)
      </Outlined>
      <Outlined>Code</Outlined>
    </Group>
  ),
  parameters,
};

// ── Object syntax ───────────────────────────────────────────
export const ObjectSyntax: Story = {
  render: () => (
    <Group value={{ axis: 'vertical', loop: false }} gap="100" role="listbox" label="Fruits" className="d-w-400">
      <Outlined role="option">Apple</Outlined>
      <Outlined role="option">Banana</Outlined>
    </Group>
  ),
  parameters,
};

// ── Vertical toolbar ────────────────────────────────────────
export const Vertical: Story = {
  render: () => (
    <Group
      value="vertical"
      gap="100"
      role="toolbar"
      aria-orientation="vertical"
      label="Formatting"
      className="d-w-400"
    >
      <Outlined>Bold</Outlined>
      <Outlined>Italic</Outlined>
      <Outlined>Underline</Outlined>
    </Group>
  ),
  parameters,
};

// ── No value (defaults: both axes, loop, memory) ────────────
export const Defaults: Story = {
  render: () => (
    <Group direction="row" gap="100" role="toolbar" label="Actions">
      <Outlined>Cut</Outlined>
      <Outlined>Copy</Outlined>
      <Outlined>Paste</Outlined>
    </Group>
  ),
  parameters,
};

// ── Noloop ──────────────────────────────────────────────────
export const Noloop: Story = {
  render: () => (
    <Group value="horizontal noloop" direction="row" gap="100" role="toolbar" label="Pagination">
      <Outlined>First</Outlined>
      <Outlined>Previous</Outlined>
      <Outlined>Next</Outlined>
      <Outlined>Last</Outlined>
    </Group>
  ),
  parameters,
};

// ── Nomemory ────────────────────────────────────────────────
export const Nomemory: Story = {
  render: () => (
    <Group value="horizontal nomemory" direction="row" gap="100" role="toolbar" label="Actions">
      <Outlined>Cut</Outlined>
      <Outlined>Copy</Outlined>
      <Outlined>Paste</Outlined>
    </Group>
  ),
  parameters,
};

// ── Disabled items ──────────────────────────────────────────
export const DisabledSkipped: Story = {
  render: () => (
    <Group value="horizontal" direction="row" gap="100" role="toolbar" label="Tools">
      <Outlined>Pen</Outlined>
      <Outlined aria-disabled="true" disabled>Eraser (disabled)</Outlined>
      <Outlined>Highlighter</Outlined>
    </Group>
  ),
  parameters,
};

export const DisabledFocusable: Story = {
  render: () => (
    <Group value="horizontal nomemory" direction="row" gap="100" role="tablist" label="Platforms">
      <Outlined role="tab">Mac</Outlined>
      <Outlined role="tab" aria-disabled="true" className="d-btn--disabled">Windows (disabled)</Outlined>
      <Outlined role="tab">Linux</Outlined>
    </Group>
  ),
  parameters,
};

// ── Item opt-out ────────────────────────────────────────────
export const OptOut: Story = {
  render: () => (
    <Group value="horizontal" direction="row" gap="100" role="toolbar" label="Formatting with opt-out">
      <Outlined>Bold</Outlined>
      <DtInput data-dt-focusgroup-skip="" placeholder="This will be skipped" />
      <Outlined>Code</Outlined>
      <DtLink data-dt-focusgroup-skip="">Skipped Text link</DtLink>
      <Outlined>Code</Outlined>
    </Group>
  ),
  parameters,
};

// ── Mixed focusable elements ────────────────────────────────
const SELECT_OPTIONS = [
  { value: '', label: 'Please select one' },
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

export const Mixed: Story = {
  render: () => (
    <Group value="horizontal" direction="row" gap="100" role="toolbar" label="Mixed elements">
      <Outlined>Button</Outlined>
      <DtLink>Link</DtLink>
      <StandIn for="select-menu">
        <div>
          <label>
            <div className="d-select" data-qa="dt-select-wrapper">
              <select className="d-select__input" aria-label="Default" data-qa="dt-select" defaultValue="">
                {SELECT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </label>
          <DtValidationMessages data-qa="dt-select-messages" validationMessages={[]} />
        </div>
      </StandIn>
    </Group>
  ),
  parameters,
};

// ── Nesting depth ───────────────────────────────────────────
const NESTED_CLASS = 'd-bgc-moderate-opaque d-p-100';

export const Nesting: Story = {
  render: () => (
    <Group value="horizontal" direction="row" gap="100" role="toolbar" label="Nested groups">
      <DtStack direction="row" gap="100" className={NESTED_CLASS}>
        <Outlined>btn</Outlined>
        <Outlined>btn</Outlined>
        <Outlined>btn</Outlined>
      </DtStack>
      <DtStack direction="row" gap="100" className={NESTED_CLASS}>
        <Outlined>btn</Outlined>
        <Outlined>btn</Outlined>
      </DtStack>
      <DtStack direction="row" gap="100" className={NESTED_CLASS}>
        <DtLink>text link a</DtLink>
        <DtLink>text link b</DtLink>
      </DtStack>
    </Group>
  ),
  parameters,
};

// ── Events (focusgroup_directive_events.story.vue) ──────────
const SOURCE_BASE = 'https://github.com/dialpad/dialtone/blob/staging/packages/dialtone-vue/directives/focusgroup_directive';

function SourceLink ({ file }: { file: string }) {
  return (
    <DtStack>
      <p>
        <DtLink href={`${SOURCE_BASE}/${file}`} target="_blank" rel="noopener noreferrer">
          View source on GitHub
        </DtLink> for code examples.
      </p>
    </DtStack>
  );
}

const TABS = [
  { label: 'Mac', disabled: false },
  { label: 'Windows (disabled)', disabled: true },
  { label: 'Linux', disabled: false },
];

const FRUITS = [
  { label: 'Apple', disabled: false },
  { label: 'Banana', disabled: false },
  { label: 'Cherry', disabled: true },
  { label: 'Orange', disabled: false },
  { label: 'Elderberry', disabled: false },
  { label: 'Avocado', disabled: true },
];

function FocusgroupEvents () {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedFruit, setSelectedFruit] = useState('Apple');

  const onMove = (detail: FocusgroupMoveDetail) => {
    if (!TABS[detail.index].disabled) setSelectedTab(detail.index);
  };

  const selectTabByClick = (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
    const tab = (event.target as HTMLElement).closest('[role="tab"]');
    if (!tab) return;
    const tablist = tab.closest('[role="tablist"]');
    const tabs = Array.from(tablist?.querySelectorAll('[role="tab"]') ?? []);
    const index = tabs.indexOf(tab);
    if (index !== -1 && !TABS[index].disabled) {
      setSelectedTab(index);
    }
  };

  return (
    <DtStack gap="200" className="d-p-100">
      <SourceLink file="focusgroup_directive_events.story.vue" />

      {/* ── Tab list with selection follows focus ──────────── */}
      <DtText as="h3" kind="headline" size={300}>
        Tab list — selection follows focus
      </DtText>
      <DtText kind="body" tone="tertiary">
        Left/Right cycles tabs. <code>dt-focusgroup-move</code> drives selection.
        Click also selects. Disabled tab remains focusable (tablist default).
        <code>useFocusGroup(el, &apos;horizontal nomemory&apos;)</code>
      </DtText>
      <Group
        value="horizontal nomemory"
        direction="row"
        gap="100"
        role="tablist"
        label="Operating system"
        onMove={onMove}
        onClick={selectTabByClick}
        onKeyDown={(event) => { if (event.key === 'Enter') selectTabByClick(event); }}
      >
        {TABS.map((tab, index) => (
          <Outlined
            key={tab.label}
            role="tab"
            active={selectedTab === index}
            aria-selected={selectedTab === index ? 'true' : 'false'}
            aria-disabled={tab.disabled ? 'true' : undefined}
            className={tab.disabled ? 'd-btn--disabled' : ''}
          >
            {tab.label}
          </Outlined>
        ))}
      </Group>
      <div className="d-p-300 d-ba d-bc-subtle d-bar-400" role="tabpanel">
        <DtText kind="body">
          Selected: {TABS[selectedTab].label}
        </DtText>
      </div>

      {/* ── Listbox with click selection ──────────────────── */}
      <DtText as="h3" kind="headline" size={300}>
        Listbox — vertical, noloop
      </DtText>
      <DtText kind="body" tone="tertiary">
        Up/Down navigates. Does not loop. Disabled item skipped. Click to select.
        <code>useFocusGroup(el, &apos;vertical noloop&apos;)</code>
      </DtText>
      <Group value="vertical noloop" role="listbox" label="Fruits" className="d-w-400" gap="100">
        {FRUITS.map(fruit => (
          <Outlined
            key={fruit.label}
            role="option"
            active={selectedFruit === fruit.label}
            aria-selected={selectedFruit === fruit.label ? 'true' : 'false'}
            aria-disabled={fruit.disabled ? 'true' : undefined}
            disabled={fruit.disabled}
            onClick={() => { if (!fruit.disabled) setSelectedFruit(fruit.label); }}
            startIcon={<DtIcon name="check" size={200} className="d-o0" />}
            endIcon={<DtIcon name="check" size={200} className={selectedFruit !== fruit.label ? 'd-o0' : ''} />}
          >
            {fruit.label}
            {fruit.disabled ? ' (sold out)' : ''}
          </Outlined>
        ))}
      </Group>
    </DtStack>
  );
}

export const Events: Story = {
  render: () => <FocusgroupEvents />,
  parameters,
};

// ── Recipes (focusgroup_directive_recipes.story.vue) ────────
const ROW_CLASS = 'h:d-bgc-moderate-opaque fv:d-bgc-moderate-opaque d-c-pointer';
const CONTACT_CLASS = 'd-p-100 d-w-800 h:d-bgc-moderate-opaque fv:d-bgc-moderate-opaque d-bar-400';

const OFFICES = [
  { office: 'Austin, TX', country: 'United States', employees: 48, contact: 'Henna Ferry' },
  { office: 'Bangalore', country: 'India', employees: 13, contact: 'Arun Chadda' },
  { office: 'San Francisco, CA', country: 'United States', employees: 108, contact: 'Shane Holmes' },
  { office: 'Vancouver, BC', country: 'Canada', employees: 76, contact: 'Kendal Lewis' },
];

const CONTACTS = [
  {
    name: 'Ashanti Trevor',
    icon: 'phone-outgoing',
    iconClass: 'd-fc-tertiary',
    call: 'Outgoing call',
    duration: '2 minutes 10 seconds',
    time: '3:23 pm',
    unread: '6',
  },
  {
    name: 'Marcus Chen',
    icon: 'phone-incoming',
    iconClass: 'd-fc-tertiary',
    call: 'Incoming call',
    duration: '14 minutes 32 seconds',
    time: '1:47 pm',
    unread: null,
  },
  {
    name: 'Priya Sharma',
    icon: 'phone-missed',
    iconClass: 'd-fc-critical',
    call: 'Missed call',
    duration: '0 seconds',
    time: '11:05 am',
    unread: '3',
  },
] as const;

function TreeItem ({ children, ...rest }: Parameters<typeof DtButton>[0]) {
  return (
    <DtButton role="treeitem" kind="muted" importance="clear" labelClass="d-jc-space-between" {...rest}>
      {children}
    </DtButton>
  );
}

function ChannelItem ({ parent, children }: { parent: string; children: ReactNode }) {
  return (
    <TreeItem data-tree-parent={parent} className="d-w100p" startIcon={<DtIcon name="hash" size={200} />}>
      {children}
    </TreeItem>
  );
}

interface TreeGroupProps {
  id: string;
  label: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
}

// The collapsible itself is the treeitem (Vue's recipe); its anchor is plain content, not a button.
function TreeGroup ({ id, label, open, setOpen, children }: TreeGroupProps) {
  const labelId = useId();

  // Vue's `toggleTreeGroup`: only clicks whose nearest treeitem is this group toggle it.
  const onClick = (event: MouseEvent<HTMLElement>) => {
    const item = event.currentTarget;
    if ((event.target as HTMLElement).closest('[role="treeitem"]') !== item) return;
    item.focus();
    setOpen(item.getAttribute('aria-expanded') !== 'true');
  };

  // Vue's `@keydown.enter.self.prevent` and `@keydown.space.self.prevent`.
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(!open);
    }
  };

  return (
    <DtCollapsible
      role="treeitem"
      aria-expanded={open}
      aria-labelledby={labelId}
      data-tree-group={id}
      tabIndex={-1}
      className="d-bar-400"
      open={open}
      anchorClass="d-w100p"
      onOpenChange={setOpen}
      onClick={onClick}
      onKeyDown={onKeyDown}
      anchor={(
        <DtStack
          direction="row"
          justify="space-between"
          align="center"
          className="d-p-100 h:d-bgc-moderate-opaque d-bar-400"
        >
          <DtText id={labelId} kind="body">{label}</DtText>
          <DtIcon name={open ? 'chevron-down' : 'chevron-right'} size={200} />
        </DtStack>
      )}
      content={<DtStack role="group" className="d-pis-150">{children}</DtStack>}
    />
  );
}

function FocusgroupRecipes () {
  const [groupExpanded, setGroupExpanded] = useState(true);
  const [channelsExpanded, setChannelsExpanded] = useState(false);
  const [tableEl, setTableEl] = useState<HTMLElement | null>(null);
  useFocusGroup(tableEl, { axis: 'vertical', selector: 'tbody tr', memory: false });

  const toggleGroup = (groupId: string | undefined, value: boolean) => {
    if (groupId === 'ops') setGroupExpanded(value);
    if (groupId === 'channels') setChannelsExpanded(value);
  };

  const expandOrEnter = () => {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return;
    if (el.getAttribute('aria-expanded') === 'false') {
      toggleGroup(el.dataset.treeGroup, true);
      return;
    }
    if (el.getAttribute('aria-expanded') === 'true') {
      const groupId = el.dataset.treeGroup;
      const firstChild = el.closest('[role="tree"]')
        ?.querySelector<HTMLElement>(`[data-tree-parent="${groupId}"]`);
      if (firstChild) firstChild.focus();
    }
  };

  const collapseOrParent = () => {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return;
    if (el.getAttribute('aria-expanded') === 'true') {
      toggleGroup(el.dataset.treeGroup, false);
      return;
    }
    const parentId = el.dataset.treeParent;
    if (parentId) {
      const parent = el.closest('[role="tree"]')
        ?.querySelector<HTMLElement>(`[data-tree-group="${parentId}"]`);
      if (parent) parent.focus();
    }
  };

  // Vue's `@keydown.right.prevent` and `@keydown.left.prevent`.
  const onTreeKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      expandOrEnter();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      collapseOrParent();
    }
  };

  return (
    <DtStack gap="200" className="d-p-100">
      <SourceLink file="focusgroup_directive_recipes.story.vue" />

      {/* ── Treeview sidebar with DtCollapsible ────────────── */}
      <DtText as="h3" kind="headline" size={400}>
        Treeview sidebar
      </DtText>
      <DtText kind="body" className="d-fc-tertiary">
        Up/Down cycles all visible items. Right expands a group, Left collapses or
        moves to parent. Hook owns vertical nav; consumer owns tree structure.
        Uses <code>DtCollapsible</code> for expand/collapse.
        <code>selector: &apos;[role=treeitem]&apos;</code> keeps the collapsible content wrapper out of navigation.
      </DtText>
      <Group
        value={{ axis: 'vertical', selector: '[role=treeitem]' }}
        role="tree"
        tabIndex={-1}
        label="Sidebar navigation"
        className="d-ba d-bc-subtle d-bar-400 d-w-500 d-p-50"
        onKeyDown={onTreeKeyDown}
      >
        <TreeItem>Inbox</TreeItem>
        <TreeItem>Launchpad</TreeItem>
        <TreeGroup id="ops" label="Operations & Planning" open={groupExpanded} setOpen={setGroupExpanded}>
          <ChannelItem parent="ops">company-announcements</ChannelItem>
          <ChannelItem parent="ops">fun-travel-stories</ChannelItem>
        </TreeGroup>
        <TreeGroup id="channels" label="Channels" open={channelsExpanded} setOpen={setChannelsExpanded}>
          <ChannelItem parent="channels">design-reviews</ChannelItem>
          <ChannelItem parent="channels">watercooler</ChannelItem>
          <ChannelItem parent="channels">shipped-it</ChannelItem>
        </TreeGroup>
        <TreeItem>Recents</TreeItem>
      </Group>

      {/* ── Table with row navigation ─────────────────────── */}
      <DtText as="h3" kind="headline" size={400}>
        Table with row navigation
      </DtText>
      <DtText kind="body" className="d-fc-tertiary">
        Up/Down cycles rows. Tab reaches interactive content within a row.
        Uses <code>selector: &apos;tbody tr&apos;</code> so the header row is excluded.
      </DtText>
      <table ref={setTableEl} className="d-table dialtone-doc-table" aria-label="Office List">
        <caption className="d-table__caption">
          Office List
        </caption>
        <thead>
          <tr>
            <th scope="col">Office</th>
            <th scope="col">Country</th>
            {/* React's types lack the obsolete `width` attribute Vue's template sets: the same width as a style. */}
            <th scope="col" style={{ width: '10%' }}>Employees</th>
            <th scope="col" colSpan={2}>Contact</th>
          </tr>
        </thead>
        <tbody>
          {OFFICES.map((row, index) => (
            <tr key={row.office} className={ROW_CLASS} tabIndex={index === 0 ? 0 : -1}>
              <th scope="row">{row.office}</th>
              <td>{row.country}</td>
              <td>{row.employees}</td>
              <td>{row.contact}</td>
              <td className="d-ta-right">
                <Outlined size="200">Button 1</Outlined>
              </td>
              <td className="d-ta-right">
                <Outlined size="200">Button 2</Outlined>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Contact list with rich content ────────────────── */}
      <DtText as="h3" kind="headline" size={400}>
        Contact list — rich content
      </DtText>
      <DtText kind="body" className="d-fc-tertiary">
        Vertical list of rich content items built with Dialtone primitives.
      </DtText>
      <Group value="vertical" role="list" label="Contacts">
        {CONTACTS.map((contact, index) => (
          <DtStack key={contact.name} role="listitem" tabIndex={index === 0 ? 0 : -1} gap="100" className={CONTACT_CLASS}>
            <DtStack direction="row" gap="100" className="d-w100p">
              <DtAvatar fullName={contact.name} />
              <DtStack className="d-fl1">
                <DtText kind="body" size={200} strength="bold">
                  {contact.name}
                </DtText>
                <DtStack direction="row" gap="50">
                  <DtStack direction="row" gap="100">
                    <DtIcon name={contact.icon} size={200} className={contact.iconClass} />
                    <DtText kind="body" size={100} tone="tertiary">
                      {contact.call}
                    </DtText>
                  </DtStack>
                  <DtText kind="body" size={100} tone="tertiary">
                    &bull;
                  </DtText>
                  <DtText kind="body" size={100} tone="tertiary">
                    {contact.duration}
                  </DtText>
                </DtStack>
              </DtStack>
              <DtText kind="body" size={200} tone="tertiary" numeric>
                {contact.time}
              </DtText>
              {contact.unread && <DtBadge kind="count" type="bulletin" text={contact.unread} />}
            </DtStack>
          </DtStack>
        ))}
      </Group>
    </DtStack>
  );
}

export const Recipes: Story = {
  render: () => <FocusgroupRecipes />,
  parameters,
};
