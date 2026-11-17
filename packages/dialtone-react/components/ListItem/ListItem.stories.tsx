import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { StandIn } from '../../.storybook/StandIn';
import { HighlightIdContext, useKeyboardListNavigation } from '../../common/keyboard-list-navigation';
import { DtIcon, type DtIconProps } from '../Icon';
import { ICON_NAMES } from '../Icon/IconConstants';
import { DtStack } from '../Stack';
import { DtListItem, type DtListItemProps } from './ListItem';
import { LIST_ITEM_NAVIGATION_TYPES, LIST_ITEM_TYPES } from './ListItemConstants';

// The slots are string args, as in Vue (`default` is the default slot): the Vue templates render each through
// `v-html`, and `start` and `end` name an icon.
type ListItemStoryArgs = Omit<DtListItemProps, 'start' | 'end' | 'subtitle' | 'blockEnd' | 'left' | 'right' | 'bottom'> & {
  default?: string;
  start?: string;
  end?: string;
  subtitle?: string;
  blockEnd?: string;
  left?: string;
  right?: string;
  bottom?: string;
};

// Vue's getIconNames(): every icon name, after an empty choice.
const iconsList = [undefined, ...ICON_NAMES];

// Default Prop Values
export const argsData = {
  onClick: action('click'),
} satisfies Partial<ListItemStoryArgs>;

export const argTypesData = {
  // Slots
  default: {
    description: 'Slot for the main content',
    table: {
      category: 'slots',
      type: { summary: 'ReactNode' },
    },
    control: {
      type: 'text',
    },
  },
  start: {
    options: iconsList,
    description: 'Slot for the start content',
    table: {
      category: 'slots',
      type: { summary: 'component' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  left: {
    table: {
      disable: true,
    },
  },
  end: {
    options: iconsList,
    description: 'Slot for the end content',
    table: {
      category: 'slots',
      type: { summary: 'component' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  right: {
    table: {
      disable: true,
    },
  },
  subtitle: {
    description: 'Slot for the content below the main content',
    table: {
      category: 'slots',
      type: { summary: 'ReactNode' },
    },
    control: {
      type: 'text',
    },
  },
  blockEnd: {
    description: 'Slot for the content below the subtitle',
    table: {
      category: 'slots',
      type: { summary: 'ReactNode' },
    },
    control: {
      type: 'text',
    },
  },
  bottom: {
    table: {
      disable: true,
    },
  },

  // Props
  id: {
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'generated unique ID' },
    },
    control: {
      type: 'text',
    },
  },
  role: {
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'listitem' },
    },
    control: {
      type: 'text',
    },
  },
  elementType: {
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'li' },
    },
    control: {
      type: 'text',
    },
  },
  type: {
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: LIST_ITEM_TYPES.DEFAULT },
    },
    options: Object.values(LIST_ITEM_TYPES),
    control: {
      type: 'select',
    },
  },
  navigationType: {
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'none' },
    },
    control: {
      type: 'select',
      options: Object.values(LIST_ITEM_NAVIGATION_TYPES),
    },
  },

  // Action Event Handlers
  onClick: {
    description: 'Click event fired when clicking on the item',
    table: {
      type: { summary: 'event' },
    },
  },
} satisfies Meta<ListItemStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/List Item',
  component: DtListItem,
  args: argsData,
  argTypes: argTypesData,
  decorators: [
    Story => (
      <div className="d-w-950">
        <Story />
      </div>
    ),
  ],
  excludeStories: /.*Data$/,
} satisfies Meta<ListItemStoryArgs>;

export default meta;
type Story = StoryObj<ListItemStoryArgs>;

// Vue's `<span v-html="…" />`, rendered even when the arg is empty.
const htmlSpan = (html?: string) => <span dangerouslySetInnerHTML={{ __html: html ?? '' }} />;

// Vue's KeyboardNavigation mixin on the story: it provides `highlightId` to the list items under the `ul`.
function useListNavigation () {
  const listWrapper = useRef<HTMLUListElement>(null);
  const { highlightIdContext } = useKeyboardListNavigation({ getListElement: () => listWrapper.current });
  return { listWrapper, highlightIdContext };
}

// ListItemDefault.story.vue
function ListItemDefault ({
  default: defaultSlot, start, end, subtitle, blockEnd, id, role, elementType, type, navigationType, selected,
  wrapperClass,
}: ListItemStoryArgs) {
  const { listWrapper, highlightIdContext } = useListNavigation();
  return (
    <HighlightIdContext.Provider value={highlightIdContext}>
      <ul ref={listWrapper}>
        <DtListItem
          id={id}
          role={role}
          elementType={elementType}
          type={type}
          navigationType={navigationType}
          selected={selected}
          wrapperClass={wrapperClass}
          start={<DtIcon name={start as DtIconProps['name']} />}
          subtitle={htmlSpan(subtitle)}
          blockEnd={htmlSpan(blockEnd)}
          end={<DtIcon name={end as DtIconProps['name']} />}
        >
          {htmlSpan(defaultSlot)}
        </DtListItem>
      </ul>
    </HighlightIdContext.Provider>
  );
}

// Button isn't ported: Vue's <dt-button importance="clear"> with only a startIcon, as it renders.
function ShareButton ({ title, className, icon }: { title: string; className: string; icon: DtIconProps['name'] }) {
  return (
    <StandIn for="button">
      <button
        className={`base-button__button d-btn d-btn--icon-only ${className}`}
        data-qa="dt-button"
        title={title}
        type="button"
        onClick={event => event.stopPropagation()}
      >
        <span data-qa="dt-button-start-icon" className="base-button__icon d-btn__icon d-btn__icon--left">
          <DtIcon name={icon} size={200} />
        </span>
      </button>
    </StandIn>
  );
}

// ListItemCustom.story.vue, and its styles.
function ListItemCustom ({ default: defaultSlot, onClick }: ListItemStoryArgs) {
  const { listWrapper, highlightIdContext } = useListNavigation();
  return (
    <HighlightIdContext.Provider value={highlightIdContext}>
      <ul ref={listWrapper}>
        <DtListItem navigationType="tab" type="custom" onClick={onClick}>
          {defaultSlot
            ? htmlSpan(defaultSlot)
            : (
              <DtStack
                direction="row"
                align="center"
                className="custom-list-item d-ps-relative d-py-100 d-px-150"
              >
                <time className="custom-list-item--time d-fs-100 d-pie-150" dateTime="10:00">
                  10:00
                </time>
                <span className="d-fs-200">
                  Custom List Item Example
                </span>
                <DtStack
                  direction="row"
                  className={
                    'custom-list-item--actions d-ps-absolute d-p-75 d-ibs-n100 d-iie-150 d-bgc-white d-bar-300 d-bs-md'
                  }
                >
                  <ShareButton title="share" className="d-p-50 d-py-100" icon="share-2" />
                  <ShareButton title="star" className="d-p-50 d-py-100 d-mis-50" icon="star" />
                  <ShareButton title="more" className="d-p-50 d-py-100 d-mis-50" icon="more-vertical" />
                </DtStack>
              </DtStack>
            )}
        </DtListItem>
      </ul>
      <style>{`
        .custom-list-item--time,
        .custom-list-item--actions {
          opacity: 0;
        }
        .dt-list-item:hover .custom-list-item--time,
        .dt-list-item:focus-within .custom-list-item--time {
          opacity: 0.75;
        }
        .dt-list-item:hover .custom-list-item--actions,
        .dt-list-item:focus-within .custom-list-item--actions {
          opacity: 1;
        }
      `}
      </style>
    </HighlightIdContext.Provider>
  );
}

const a11y = {
  config: {
    rules: [
      {
        id: 'aria-allowed-attr',
        enabled: false,
      },
    ],
  },
};

// Stories
export const Default: Story = {
  render: args => <ListItemDefault {...args} />,

  args: {
    start: 'globe-2',
    end: 'external-link',
    default: 'Default List Item',
    subtitle: 'Description',
    blockEnd: '<span class="d-badge">Label</span>',
    navigationType: LIST_ITEM_NAVIGATION_TYPES.TAB,
  },
  parameters: { a11y },
};

export const Custom: Story = {
  render: args => <ListItemCustom {...args} />,
  args: {},
  parameters: { a11y },
};
