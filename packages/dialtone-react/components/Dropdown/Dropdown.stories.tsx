import { useEffect, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { CONTENT_MODE_TYPES } from '../../common/mode_constants';
import { DtButton } from '../Button';
import { DtListItem } from '../ListItem';
import { DtListItemGroup } from '../ListItemGroup';
import { LIST_ITEM_NAVIGATION_TYPES } from '../ListItem/ListItemConstants';
import { POPOVER_CONTENT_WIDTHS } from '../Popover';
import { POPOVER_DIRECTIONS } from '../Popover/PopoverConstants';
import { DtStack } from '../Stack';
import { DtDropdown, type DtDropdownProps } from './Dropdown';
import { DROPDOWN_PADDING_CLASSES } from './DropdownConstants';
import { DtDropdownSeparator } from './DropdownSeparator';
import { DROPDOWN_STORY_ITEMS } from './DropdownStoryConstants';

// Slots are args named as in Vue: `anchor`, `list` and `footer` are HTML strings, as the .story.vue templates render
// them with v-html.
type DropdownStoryArgs = Omit<DtDropdownProps, 'anchor' | 'list' | 'footer'> & {
  anchor?: string;
  list?: string;
  footer?: string;
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
export const argsData: Partial<DropdownStoryArgs> = {
  onHighlight: action('highlight'),
  onOpened: action('opened'),
  navigationType: 'arrow-keys',
  placement: 'bottom',
  appendTo: 'body',
  padding: 'none',
  contentWidth: '',
};

export const argTypesData = {
  // Slots
  anchor: {
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
    control: {
      type: 'text',
    },
  },
  list: {
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
    control: {
      type: 'text',
    },
  },
  footer: {
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
    control: {
      type: 'text',
    },
  },

  // Props
  contentMode: CONTENT_MODE_ARG_TYPE,
  navigationType: {
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'arrow-keys' },
    },
    options: Object.values(LIST_ITEM_NAVIGATION_TYPES),
    control: {
      type: 'select',
    },
  },
  listId: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  placement: {
    options: POPOVER_DIRECTIONS,
    control: {
      type: 'select',
    },
    table: {
      defaultValue: {
        summary: 'bottom',
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
  contentWidth: {
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'null' },
    },
    options: POPOVER_CONTENT_WIDTHS,
    control: {
      type: 'select',
    },
    // Not in Vue's argTypes: see contentMode.
    type: 'string',
  },

  // Action Event Handlers
  onOpened: {
    table: {
      disable: true,
    },
  },
  onHighlight: {
    table: {
      disable: true,
    },
  },
  'update:open': {
    table: {
      disable: true,
    },
  },

  opened: {
    description: `emitted when dropdown is shown or hidden.`,
    table: {
      type: { summary: 'event' },
    },
  },
  highlight: {
    description: 'Event fired when the highlight changes',
    table: {
      type: { summary: 'event' },
    },
  },
};

// Story Collection
const meta = {
  title: 'Components/Dropdown',
  component: DtDropdown,
  args: argsData,
  // Vue's argTypes as they are, though Storybook's types have no `type: 'select'`.
  argTypes: argTypesData as unknown as Meta<DropdownStoryArgs>['argTypes'],
  excludeStories: /.*Data$/,
} satisfies Meta<DropdownStoryArgs>;

export default meta;
type Story = StoryObj<DropdownStoryArgs>;

const Html = ({ html }: { html: string }) => <div dangerouslySetInnerHTML={{ __html: html }} />;

// DropdownDefault.story.vue
function DropdownDefault ({
  open,
  placement,
  fallbackPlacements,
  contentWidth,
  padding,
  modal,
  maxHeight,
  maxWidth,
  listClass,
  navigationType,
  openOnContext,
  tether,
  transition,
  onHighlight,
  onOpened,
  anchor,
  list,
  footer,
  ...rest
}: DropdownStoryArgs) {
  // v-model:open, starting from the `open` arg and following it.
  const [isOpen, setIsOpen] = useState(open);
  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <DtDropdown
      // DropdownDefault.story.vue declares no props and its root is DtDropdown, so Vue's attribute fallthrough hands
      // it every other arg (appendTo, listId, footerClass, contentMode…). Spread first, as the bindings below are the
      // template's own.
      {...rest}
      open={isOpen}
      onOpenChange={setIsOpen}
      placement={placement}
      fallbackPlacements={fallbackPlacements}
      contentWidth={contentWidth}
      padding={padding}
      modal={modal}
      maxHeight={maxHeight}
      maxWidth={maxWidth}
      listClass={listClass}
      navigationType={navigationType}
      openOnContext={openOnContext}
      tether={tether}
      transition={transition}
      onHighlight={onHighlight}
      onOpened={onOpened}
      anchor={attrs => (anchor
        ? <Html html={anchor} />
        : (
          <DtButton {...attrs}>
            Click to open
          </DtButton>
          ))}
      list={({ close }) => (list
        ? <Html html={list} />
        : DROPDOWN_STORY_ITEMS.map(item => (
          <DtListItem
            key={item.id}
            role="menuitem"
            navigationType={navigationType}
            onClick={close}
          >
            {item.name}
          </DtListItem>
        )))}
      footer={footer ? <Html html={footer} /> : undefined}
    />
  );
}

const PLACEMENT_VARIANTS = ['bottom-start', 'bottom', 'bottom-end'] as const;
const HEADING_CLASS = 'd-py-50 d-px-100 d-fw-semibold d-c-default';

// DropdownVariants.story.vue
function DropdownVariants ({
  open,
  placement,
  fallbackPlacements,
  padding,
  modal,
  maxHeight,
  maxWidth,
  listClass,
  navigationType,
  transition,
  onHighlight,
  onOpened,
  anchor,
}: DropdownStoryArgs) {
  const menuItem = (label: ReactNode, close: () => void, key?: string | number) => (
    <DtListItem
      key={key}
      role="menuitem"
      navigationType={navigationType}
      onClick={close}
    >
      {label}
    </DtListItem>
  );
  const items = (close: () => void) => DROPDOWN_STORY_ITEMS.map(item => menuItem(item.name, close, item.id));

  return (
    <div>
      <DtStack
        direction="row"
        className="d-mbe-150"
      >
        {PLACEMENT_VARIANTS.map(variant => (
          <DtDropdown
            key={variant}
            className="d-mie-100"
            placement={variant}
            padding={padding}
            navigationType={navigationType}
            transition={transition}
            open={open}
            onHighlight={onHighlight}
            anchor={attrs => (
              <DtButton {...attrs}>
                {variant} aligned dropdown
              </DtButton>
            )}
            list={({ close }) => items(close)}
          />
        ))}

        <DtDropdown
          open={open}
          className="d-mie-100"
          placement={placement}
          fallbackPlacements={fallbackPlacements}
          padding={padding}
          modal={modal}
          maxHeight={maxHeight}
          maxWidth={maxWidth}
          navigationType={navigationType}
          transition={transition}
          onOpened={onOpened}
          anchor={attrs => (anchor
            ? <Html html={anchor} />
            : (
              <DtButton {...attrs}>
                with sections
              </DtButton>
              ))}
          list={({ close }) => (
            <>
              <DtListItemGroup listClass={listClass}>
                {menuItem('Menu item 1', close)}
                {menuItem('Menu Item 2', close)}
              </DtListItemGroup>
              <DtDropdownSeparator />
              {menuItem('Menu Item 3', close)}
            </>
          )}
        />

        <DtDropdown
          className="d-mie-100"
          open={open}
          placement={placement}
          fallbackPlacements={fallbackPlacements}
          padding={padding}
          modal={modal}
          maxHeight={maxHeight}
          maxWidth={maxWidth}
          navigationType={navigationType}
          transition={transition}
          onOpened={onOpened}
          anchor={attrs => (anchor
            ? <Html html={anchor} />
            : (
              <DtButton {...attrs}>
                with sections and headings
              </DtButton>
              ))}
          list={({ close }) => (
            <>
              <DtListItemGroup
                headingClass={HEADING_CLASS}
                listClass={listClass}
                heading="Menu Heading A"
              >
                {menuItem('Menu Item 1', close)}
                <DtDropdownSeparator />
                {menuItem('Menu Item 2', close)}
              </DtListItemGroup>
              <DtDropdownSeparator />
              <DtListItemGroup
                listClass={listClass}
                headingClass={HEADING_CLASS}
                heading="Menu Heading B"
              >
                {menuItem('Menu Item 3', close)}
              </DtListItemGroup>
            </>
          )}
        />

        <DtDropdown
          className="d-mie-100"
          open={open}
          anchor={attrs => (
            <DtButton {...attrs}>
              with footer
            </DtButton>
          )}
          list={({ close }) => items(close)}
          footer={({ close }) => (
            <div className="d-px-150">
              <DtButton onClick={close}>
                Dropdown footer
              </DtButton>
            </div>
          )}
        />
      </DtStack>
      <DtStack>
        <p className="d-fw-bold d-mbe-25">
          Context menu
        </p>
        <p className="d-mbe-100">
          Displays the dropdown menu located at the pointer, triggered by a right-click
        </p>
        <DtStack
          direction="row"
        >
          <DtDropdown
            className="d-mie-100"
            padding={padding}
            navigationType={navigationType}
            open={open}
            openOnContext={true}
            transition={transition}
            anchor={attrs => (
              <div
                {...attrs}
                className="d-ba d-bas-dashed d-w264 d-py-600 d-ta-center d-bgc-black-300"
              >
                Right click to open
              </div>
            )}
            list={({ close }) => items(close)}
          />
        </DtStack>
      </DtStack>
    </div>
  );
}

export const Default: Story = {
  render: args => <DropdownDefault {...args} />,
  args: {},

  parameters: {
    percy: {
      args: {
        open: true,
      },
    },
  },

  decorators: [
    Story => (
      <DtStack direction="row" justify="center" align="center" className="d-h-250">
        <Story />
      </DtStack>
    ),
  ],
};

export const Variants: Story = {
  render: args => <DropdownVariants {...args} />,
  args: {},

  parameters: {
    ...Default.parameters,
    options: { showPanel: false },
    controls: { disable: true },
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-allowed-attr',
            enabled: false,
          },
        ],
      },
    },
  },

  decorators: [
    Story => (
      <DtStack direction="row" justify="center" align="center">
        <Story />
      </DtStack>
    ),
  ],
};
