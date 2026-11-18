import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { CONTENT_MODE_TYPES } from '../../common/mode_constants';
import { DtButton } from '../Button';
import { DtDropdown } from '../Dropdown';
import { DtIcon } from '../Icon';
import { DtListItem } from '../ListItem';
import { DtModal } from '../Modal';
import { DtStack } from '../Stack';
import { DtTooltip } from '../Tooltip';
import { DtPopover, type DtPopoverProps } from './Popover';
import {
  POPOVER_CONTENT_WIDTHS,
  POPOVER_DIRECTIONS,
  POPOVER_INITIAL_FOCUS_STRINGS,
  POPOVER_PADDING_CLASSES,
  POPOVER_ROLES,
  POPOVER_STICKY_VALUES,
} from './PopoverConstants';

// Slots are args named as in Vue: `content`, `headerContent` and `footerContent` are HTML strings, as the
// .story.vue templates render them with v-html. `popoverOpen` and `tooltipOpen` are InsideDialog's template inputs.
type PopoverStoryArgs = Omit<DtPopoverProps, 'content' | 'headerContent' | 'footerContent'> & {
  content?: string;
  headerContent?: string;
  footerContent?: string;
  popoverOpen?: boolean;
  tooltipOpen?: boolean;
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

// Default Props for all variations
export const argsData: Partial<PopoverStoryArgs> = {
  placement: 'bottom-end',
  contentWidth: null,
  sticky: false,
  offset: [0, 4],
  appendTo: 'body',
  onOpened: action('opened'),
};

export const argTypesData = {
  // Slots
  anchor: {
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  content: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  headerContent: {
    name: 'headerContent',
    description: 'Slot for popover header content',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },
  footerContent: {
    name: 'footerContent',
    description: 'Slot for popover footer content',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  anchorClass: {
    description: 'Pass through classes. Used to customize the anchor wrapper element',
  },
  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  padding: {
    options: Object.keys(POPOVER_PADDING_CLASSES),
    control: {
      type: 'select',
    },
  },
  initialFocusElement: {
    options: [...Object.values(POPOVER_INITIAL_FOCUS_STRINGS), '#content-close'],
    control: {
      type: 'select',
    },
    // Not in Vue's argTypes: see contentMode.
    type: 'string',
  },
  role: {
    options: POPOVER_ROLES,
    control: {
      type: 'select',
    },
  },
  placement: {
    options: POPOVER_DIRECTIONS,
    control: {
      type: 'select',
    },
    table: {
      defaultValue: {
        summary: 'bottom-end',
      },
    },
  },
  contentMode: CONTENT_MODE_ARG_TYPE,
  contentWidth: {
    options: POPOVER_CONTENT_WIDTHS,
    control: {
      type: 'select',
    },
    // Not in Vue's argTypes: see contentMode.
    type: 'string',
  },
  sticky: {
    options: POPOVER_STICKY_VALUES,
    control: {
      type: 'select',
    },
    table: {
      defaultValue: {
        summary: 'false',
      },
    },
  },
  transition: {
    options: ['', 'fade', 'pop', 'shake'],
    control: {
      type: 'select',
    },
  },
  appendTo: {
    table: {
      defaultValue: {
        summary: 'body',
      },
    },
  },

  // Events
  onOpened: {
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
    description: `emitted when popover is shown or hidden.`,
    table: {
      type: {
        summary: 'event',
      },
    },
  },
};

const meta = {
  title: 'Components/Popover',
  component: DtPopover,
  args: argsData,
  // Vue's argTypes as they are, though Storybook's types have no `type: 'select'`.
  argTypes: argTypesData as unknown as Meta<PopoverStoryArgs>['argTypes'],
  excludeStories: /.*Data$/,
} satisfies Meta<PopoverStoryArgs>;

export default meta;
type Story = StoryObj<PopoverStoryArgs>;

// PopoverDefault.story.vue
function PopoverDefault ({
  open, content, headerContent, footerContent, popoverOpen: _popoverOpen, tooltipOpen: _tooltipOpen, ...args
}: PopoverStoryArgs) {
  // v-model:open, starting from the `open` arg and following it.
  const [isOpen, setIsOpen] = useState(open);
  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <DtPopover
      {...args}
      open={isOpen ?? null}
      onOpenChange={setIsOpen}
      anchor={({ attrs }) => (
        <DtButton {...attrs}>
          Click to open
        </DtButton>
      )}
      content={({ close }) => (
        <div>
          {content
            ? <span dangerouslySetInnerHTML={{ __html: content }} />
            : (
              <>
                <p className="d-mbe-50">
                  I will be displayed in the popover!
                </p>
                <DtButton id="content-close" onClick={close}>
                  Click to close
                </DtButton>
              </>
              )}
        </div>
      )}
      headerContent={headerContent ? <span dangerouslySetInnerHTML={{ __html: headerContent }} /> : undefined}
      footerContent={footerContent ? <span dangerouslySetInnerHTML={{ __html: footerContent }} /> : undefined}
    />
  );
}

const sampleText = `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Consequuntur delectus distinctio id iure labore,
            maiores mollitia reprehenderit sunt tempore veritatis.
            Aliquam delectus earum ex, expedita ipsam nobis
            obcaecati quibusdam repudiandae.`;

const SampleParagraphs = () => (
  <DtStack gap="100">
    <p>{sampleText}</p>
    <p>{sampleText}</p>
    <p>{sampleText}</p>
  </DtStack>
);

const closeContent = ({ close }: { close: () => void }) => (
  <div>
    <p className="d-mbe-50">
      I will be displayed in the popover!
    </p>
    <DtButton onClick={close}>
      Click to close
    </DtButton>
  </div>
);

const dropdownItems: [string, string][] = [
  ['pd-1', 'Item 1'],
  ['pd-2', 'Item 2 Item 2 Item 2'],
  ['pd-3', 'Item 3'],
  ['pd-4', 'Item 4'],
  ['pd-5', 'Item 5'],
  ['pd-6', 'Item 6'],
];

// Vue's <dt-dropdown :open max-height="13rem">.
function DropdownExample ({ open }: { open?: boolean | null }) {
  return (
    <DtDropdown
      open={open ?? null}
      maxHeight="13rem"
      anchor={attrs => (
        <DtButton {...attrs}>
          Open dropdown
        </DtButton>
      )}
      list={({ close }) => (
        <>
          {dropdownItems.map(([key, label]) => (
            <DtListItem key={key} navigationType="arrow-keys" role="menuitem" onClick={close}>
              {label}
            </DtListItem>
          ))}
        </>
      )}
    />
  );
}

// PopoverVariants.story.vue
function PopoverVariants ({ open, modal, closeOnClick, transition }: PopoverStoryArgs) {
  const [switchAnchor, setSwitchAnchor] = useState(true);
  // Vue's mouseenter handlers set this, but no popover reads it.
  const [, setOpenPopoverWithTriggerOverride] = useState(open);
  const withURLprefix = (query: string) => window.location.origin + window.location.pathname + query;
  const shared = { open, modal, closeOnClick, transition };

  return (
    <div className="d-d-flex d-jc-space-between d-fw-wrap d-w100p d-cg-150 d-fl-col2">
      <DtPopover
        {...shared}
        width-content="anchor"
        placement="bottom-start"
        initialFocusElement="first"
        className="d-mbe-200"
        anchor={({ attrs }) => <DtButton {...attrs}>bottom-end placement</DtButton>}
        content={closeContent}
      />
      <DtPopover
        {...shared}
        width-content="anchor"
        initialFocusElement="first"
        className="d-mbe-200 d-jc-flex-end"
        anchor={({ attrs }) => <DtButton {...attrs}>bottom-start placement</DtButton>}
        content={closeContent}
      />
      <DtPopover
        {...shared}
        padding="none"
        width-content="anchor"
        initialFocusElement="first"
        className="d-mbe-200"
        anchor={({ attrs }) => <DtButton {...attrs}>No padding</DtButton>}
        content={({ close }) => (
          <div className="d-fs-200 d-m-0">
            <div>
              <DtButton onClick={close}>
                Click to close
              </DtButton>
            </div>
          </div>
        )}
      />
      <DtPopover
        {...shared}
        modal={false}
        width-content="anchor"
        className="d-jc-flex-end"
        anchor={({ attrs }) => <DtButton {...attrs}>Non-Modal</DtButton>}
        content={closeContent}
      />
      <DtPopover
        {...shared}
        className="d-mbe-200"
        showCloseButton={true}
        placement="bottom-start"
        headerClass="d-d-flex d-ai-center d-jc-space-between"
        initialFocusElement="first"
        maxHeight="20rem"
        maxWidth="50rem"
        anchor={({ attrs }) => (
          <DtTooltip anchor={<DtButton {...attrs}>Popover with header and anchor tooltip</DtButton>}>
            This is a test tooltip
          </DtTooltip>
        )}
        headerContent={(
          <>
            <div>
              Potential Title
            </div>
            <div>
              <DtButton
                circle
                className="d-p-75 d-bc-transparent"
                importance="outlined"
                startIcon={<DtIcon name="external-link" size="300" />}
              />
              <DtButton
                circle
                className="d-p-75 d-bc-transparent"
                importance="outlined"
                startIcon={<DtIcon name="more-vertical" size="300" />}
              />
            </div>
          </>
        )}
        content={<SampleParagraphs />}
      />
      <DtPopover
        {...shared}
        className="d-mbe-200 d-jc-flex-end"
        showCloseButton={true}
        maxHeight="20rem"
        maxWidth="50rem"
        initialFocusElement="first"
        anchor={({ attrs }) => <DtButton {...attrs}>Popover with close</DtButton>}
        content={<SampleParagraphs />}
      />
      <DtPopover
        {...shared}
        className="d-my-200"
        maxHeight="20rem"
        maxWidth="50rem"
        initialFocusElement="first"
        anchor={({ attrs }) => <DtButton {...attrs}>Popover with footer</DtButton>}
        footerContent={<div>This is a footer</div>}
        content={<SampleParagraphs />}
      />
      <DtPopover
        {...shared}
        contentClass="d-pis-150 d-pie-200"
        initialFocusElement="first"
        className="d-my-200 d-jc-flex-end"
        maxHeight="15rem"
        maxWidth="50rem"
        anchor={({ attrs }) => <DtButton {...attrs}>Popover with dropdown</DtButton>}
        content={(
          <DtStack gap="100">
            <p>{sampleText}</p>
            <DropdownExample open={open} />
          </DtStack>
        )}
      />
      <DtPopover
        {...shared}
        contentClass="d-pis-150 d-pie-200"
        className="d-my-200"
        initialFocusElement="first"
        maxHeight="20rem"
        maxWidth="50rem"
        anchor={({ attrs }) => <DtButton {...attrs}>Popover with tooltip</DtButton>}
        content={(
          <DtStack gap="100">
            <p>{sampleText}</p>
            <DtTooltip open={open} anchor={<DtButton>Hover me</DtButton>}>
              This is the tooltip content
            </DtTooltip>
          </DtStack>
        )}
      />
      <DtPopover
        modal={false}
        closeOnClick={closeOnClick}
        transition={transition}
        contentClass="d-pis-150 d-pie-200"
        className="d-my-200 d-jc-flex-end"
        maxHeight="20rem"
        maxWidth="50rem"
        anchor={({ attrs }) => (
          <DtButton
            {...attrs}
            onMouseEnter={() => setOpenPopoverWithTriggerOverride(true)}
            onMouseLeave={() => setOpenPopoverWithTriggerOverride(false)}
          >
            Popover with mouseenter trigger
          </DtButton>
        )}
        content={<p>{sampleText}</p>}
      />
      <DtPopover
        anchor={({ attrs }) => (switchAnchor
          ? <DtButton key="1" {...attrs}>Changing anchor 1</DtButton>
          : <DtButton key="2" {...attrs}>Changing anchor 2</DtButton>)}
        content={<DtButton onClick={() => setSwitchAnchor(!switchAnchor)}>switch anchor</DtButton>}
      />

      <iframe
        title="iframe popover example"
        src={withURLprefix('?args=&id=components-popover--iframe-test&viewMode=story')}
      />

      <iframe
        title="iframe popover example 2"
        src={withURLprefix('?args=&id=components-popover--iframe-test&viewMode=story')}
      />
    </div>
  );
}

// PopoverIframe.story.vue
function PopoverIframe ({ open, placement }: PopoverStoryArgs) {
  return (
    <div className="d-mis-200">
      <DtPopover
        open={open}
        modal={true}
        width-content="anchor"
        placement={placement}
        initialFocusElement="first"
        appendTo="root"
        anchor={({ attrs }) => <DtButton {...attrs}>popover anchor</DtButton>}
        content={closeContent}
      />
    </div>
  );
}

// PopoverInsideDialog.story.vue
function PopoverInsideDialog ({ open, popoverOpen, tooltipOpen }: PopoverStoryArgs) {
  const [isModalOpen, setIsModalOpen] = useState(open ?? false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(popoverOpen ?? false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(tooltipOpen ?? false);
  useEffect(() => { setIsModalOpen(open ?? false); }, [open]);
  useEffect(() => { setIsPopoverOpen(popoverOpen ?? false); }, [popoverOpen]);
  useEffect(() => { setIsTooltipOpen(tooltipOpen ?? false); }, [tooltipOpen]);

  return (
    <div>
      <DtModal
        open={isModalOpen}
        headerText="Modal with Popover and Tooltip"
        onOpenChange={setIsModalOpen}
        footer={(
          <DtButton importance="clear" onClick={() => setIsModalOpen(false)}>
            Close modal
          </DtButton>
        )}
      >
        <div className="d-d-flex d-ai-center d-gg-400">
          <DtPopover
            open={isPopoverOpen}
            placement="bottom-start"
            onOpenChange={setIsPopoverOpen}
            anchor={({ attrs }) => (
              <DtButton {...attrs}>
                Open popover
              </DtButton>
            )}
            content={({ close }) => (
              <>
                <p className="d-mbe-50">
                  Popover inside a dialog
                </p>
                <DtButton onClick={close}>
                  Close
                </DtButton>
              </>
            )}
          />
          <DtTooltip
            message="Tooltip inside a dialog"
            open={isTooltipOpen}
            anchor={(
              <DtButton
                onMouseEnter={() => setIsTooltipOpen(true)}
                onMouseLeave={() => setIsTooltipOpen(false)}
                onFocus={() => setIsTooltipOpen(true)}
                onBlur={() => setIsTooltipOpen(false)}
              >
                Hover for tooltip
              </DtButton>
            )}
          />
        </div>
      </DtModal>
      <DtButton onClick={() => setIsModalOpen(true)}>
        Open modal
      </DtButton>
    </div>
  );
}

export const Default: Story = {
  render: args => <PopoverDefault {...args} />,
  args: {},

  decorators: [
    Story => (
      <DtStack direction="row" justify="center" align="center" className="d-h-500">
        <Story />
      </DtStack>
    ),
  ],
};

export const Variants: Story = {
  render: args => <PopoverVariants {...args} />,
  args: {},

  parameters: {
    options: {
      showPanel: false,
    },
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

    percy: {
      args: {
        open: true,
      },
    },
  },
};

export const IframeTest: Story = {
  render: args => <PopoverIframe {...args} />,

  args: {
    placement: 'top-end',
  },

  parameters: {
    options: {
      showPanel: false,
    },

    percy: {
      args: {
        open: true,
      },
    },
  },
};

export const InsideDialog: Story = {
  render: args => <PopoverInsideDialog {...args} />,

  args: {
    open: false,
    popoverOpen: false,
    tooltipOpen: false,
  },

  parameters: {
    options: {
      showPanel: false,
    },

    percy: {
      args: {
        open: true,
        popoverOpen: true,
        tooltipOpen: true,
      },
    },
  },
};
