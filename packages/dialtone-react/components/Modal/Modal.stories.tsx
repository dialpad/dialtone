import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { cx } from '../../common/cx';
import { CONTENT_MODE_TYPES } from '../../common/mode_constants';
import { DtButton } from '../Button';
import { DtCombobox } from '../Combobox';
import { DtDropdown } from '../Dropdown';
import { DtImageViewer } from '../ImageViewer';
import { DtInput } from '../Input';
import { DtListItem } from '../ListItem';
import { NOTICE_KINDS } from '../Notice';
import { DtPopover } from '../Popover';
import { DtStack } from '../Stack';
import { DtTooltip } from '../Tooltip';
import { DtModal, type DtModalProps } from './Modal';
import { MODAL_KIND_MODIFIERS } from './ModalConstants';

// Vue imports this file; Storybook serves Vue's assets directory at the root.
const imageSrc = '/test.jpg';

// Slots are args named as in Vue: `default`, `banner`, `header` and `footer` are HTML strings, as ModalDefault.story.vue
// renders them with v-html. `showFooter` and `onClose` are that template's own inputs.
type ModalStoryArgs = Omit<DtModalProps, 'banner' | 'header' | 'footer' | 'children'> & {
  default?: string;
  banner?: string;
  header?: string;
  footer?: string;
  showFooter?: boolean;
  onClose?: (open: boolean) => void;
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
export const argsData = {
  fullscreen: false,
  kind: 'default',
  bannerKind: 'warning',
  copy: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget lacus quis velit \
viverra iaculis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum \
maximus ipsum ex. Curabitur elementum luctus augue, quis eleifend tortor feugiat vel. \
Maecenas maximus, ipsum et laoreet congue, diam massa aliquam libero, at pellentesque \
orci ipsum et velit.`,
  headerText: 'Example Title',
  onClose: action('update:open'),
} satisfies Partial<ModalStoryArgs>;

export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },
  banner: {
    control: 'text',
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },
  footer: {
    control: 'text',
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },
  header: {
    control: 'text',
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },

  // Props
  headerText: {
    control: {
      type: 'text',
    },
  },
  bannerHeaderText: {
    control: {
      type: 'text',
    },
  },
  contentMode: CONTENT_MODE_ARG_TYPE,
  fullscreen: {
    control: {
      type: 'boolean',
    },
  },
  kind: {
    options: Object.keys(MODAL_KIND_MODIFIERS),
    control: {
      type: 'select',
    },
    // Not in Vue's argTypes: see contentMode.
    type: 'string',
  },
  bannerKind: {
    options: NOTICE_KINDS,
    control: {
      type: 'select',
    },
    // Not in Vue's argTypes: see contentMode.
    type: 'string',
  },
  showFooter: {
    table: {
      disable: true,
    },
  },
  labelledById: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  closeOnClick: {
    control: {
      type: 'boolean',
    },
  },
  fixedHeaderFooter: {
    control: {
      type: 'boolean',
    },
  },
  showClose: {
    control: {
      type: 'boolean',
    },
  },
  transparentBackdrop: {
    control: {
      type: 'boolean',
    },
  },
  open: {
    control: {
      type: 'boolean',
    },
  },
  appendTo: {
    options: [undefined, 'body', 'html'],
    control: {
      type: 'select',
    },
  },

  // Events
  onOpenChange: {
    description: `Vue's \`update:open\`. The modal calls it with \`false\` when the user performs a modal-closing \
action. Parent components can sync \`open\` on it to control modal visibility.`,
    table: {
      type: {
        summary: '(open: boolean) => void',
      },
    },
  },
  onClose: {
    table: {
      disable: true,
    },
  },
};

const meta = {
  title: 'Components/Modal',
  component: DtModal,
  args: argsData,
  // Vue's argTypes as they are, though Storybook's types have no `type: 'select'`.
  argTypes: argTypesData as unknown as Meta<ModalStoryArgs>['argTypes'],
  excludeStories: /.*Data$/,
} satisfies Meta<ModalStoryArgs>;

export default meta;
type Story = StoryObj<ModalStoryArgs>;

const html = (content: string) => <span dangerouslySetInnerHTML={{ __html: content }} />;

// ModalDefault.story.vue
function ModalDefault ({
  default: defaultSlot,
  banner,
  header,
  footer,
  showFooter = false,
  onClose,
  ...args
}: ModalStoryArgs) {
  const [isOpen, setIsOpen] = useState(args.open ?? false);

  const secondaryButtonKind = args.kind === 'critical' ? 'muted' : 'default';

  const close = (open: boolean) => {
    setIsOpen(open);
    onClose?.(open);
  };

  return (
    <div>
      <DtModal
        headerText={args.headerText}
        bannerHeaderText={args.bannerHeaderText}
        open={isOpen}
        kind={args.kind}
        fullscreen={args.fullscreen}
        copy={args.copy}
        modalClass={args.modalClass}
        bannerClass={args.bannerClass}
        bannerKind={args.bannerKind}
        dialogClass={args.dialogClass}
        contentClass={args.contentClass}
        headerClass={args.headerClass}
        footerClass={args.footerClass}
        showClose={args.showClose}
        labelledById={args.labelledById}
        fixedHeaderFooter={args.fixedHeaderFooter}
        closeOnClick={args.closeOnClick}
        appendTo={args.appendTo}
        contentMode={args.contentMode}
        transparentBackdrop={args.transparentBackdrop}
        modal={args.modal}
        onOpenChange={close}
        banner={banner ? html(banner) : undefined}
        header={header ? html(header) : undefined}
        footer={showFooter
          ? (footer
            ? html(footer)
            : (
              <div>
                <DtButton kind={secondaryButtonKind} importance="clear">
                  Cancel
                </DtButton>
                <DtButton kind={args.kind} importance="primary" className="d-mis-75">
                  Confirm
                </DtButton>
              </div>
            ))
          : undefined}
      >
        {defaultSlot ? html(defaultSlot) : undefined}
      </DtModal>
      <DtButton onClick={() => setIsOpen(!isOpen)}>
        Click to open
      </DtButton>
    </div>
  );
}

const dropdownItems = ['First item', 'Second item', 'Third item'];
const comboboxItems = ['Apple', 'Banana', 'Cherry'];

// ModalWithOverlays.story.vue
function ModalWithOverlays ({ open }: ModalStoryArgs) {
  const [isOpen, setIsOpen] = useState(open ?? false);
  const [comboboxValue, setComboboxValue] = useState('');

  return (
    <div>
      <style>
        {`.overlays-story__thumbnail {
  max-inline-size: 96px;
  max-block-size: 96px;
  object-fit: cover;
}`}
      </style>
      <DtModal
        headerText="Overlay components inside a modal"
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <p className="d-mbe-400">
          Both tooltips below sit inside this modal&apos;s native
          {' '}<code>&lt;dialog&gt;</code>. The first uses the Tooltip default
          {' '}<code>appendTo=&quot;body&quot;</code>, which detects the ancestor
          {' '}<code>&lt;dialog&gt;</code> and stays in the browser&apos;s top layer. The
          second forces <code>appendTo</code> to an explicit
          {' '}<code>document.body</code> element, which escapes the dialog&apos;s top
          layer and renders behind the modal despite matching z-index.
        </p>
        <DtStack direction="row" gap="400" className="d-mbe-400">
          <DtTooltip
            message="I stay above the modal"
            anchor={<DtButton>Default appendTo (correct)</DtButton>}
          />
          <DtTooltip
            message="I render behind the modal"
            appendTo={document.body}
            anchor={(
              <DtButton kind="critical">
                Forced document.body (bug)
              </DtButton>
            )}
          />
        </DtStack>

        <p className="d-mbe-200">
          Dropdown and Popover default to <code>modal=&quot;true&quot;</code>, which renders
          a click-blocking scrim while open. That scrim now resolves the same
          ancestor-<code>&lt;dialog&gt;</code> target as the overlay&apos;s own content, so
          it lands in the same top layer: opening either one below correctly blocks
          clicks on the rest of this modal (try clicking this text while one is open)
          while its own list/content stays clickable.
        </p>
        <DtStack direction="row" gap="400" align="start" className="d-mbe-400">
          <DtDropdown
            modal
            anchor={attrs => (
              <DtButton {...attrs}>
                Open dropdown
              </DtButton>
            )}
            list={({ close }) => dropdownItems.map(item => (
              <DtListItem
                key={item}
                role="menuitem"
                navigationType="arrow-keys"
                onClick={close}
              >
                {item}
              </DtListItem>
            ))}
          />

          <DtPopover
            placement="bottom-start"
            anchor={({ attrs }) => (
              <DtButton {...attrs}>
                Open popover
              </DtButton>
            )}
            content={({ close }) => (
              <>
                <p className="d-mbe-50">
                  Popover inside a modal
                </p>
                <DtButton onClick={close}>
                  Close
                </DtButton>
              </>
            )}
          />

          <DtCombobox
            showList={!!comboboxValue}
            label="Combobox"
            showLabel
            input={({ inputProps }) => (
              <DtInput
                {...inputProps}
                size={inputProps.size ?? undefined}
                value={comboboxValue}
                onValueChange={next => setComboboxValue(String(next))}
                placeholder="Type to filter"
              />
            )}
            list={({ listProps }) => (
              <ol {...listProps} className={cx(listProps.className, 'd-p-0 d-mbs-100')}>
                {comboboxItems.map(item => (
                  <DtListItem
                    key={item}
                    role="option"
                    navigationType="arrow-keys"
                    onClick={() => setComboboxValue(item)}
                  >
                    {item}
                  </DtListItem>
                ))}
              </ol>
            )}
          />
        </DtStack>

        <p className="d-mbe-200">
          ImageViewer inside the modal: its <code>appendTo</code> now detects the
          ancestor <code>&lt;dialog&gt;</code> the same way Tooltip/Popover do, so the
          full-size view stays in the top layer instead of rendering hidden behind
          this modal.
        </p>
        <DtImageViewer
          imageSrc={imageSrc}
          imageAlt="Example preview image"
          ariaLabel="Open example image"
          imageButtonClass="overlays-story__thumbnail"
        />
      </DtModal>
      <DtButton onClick={() => setIsOpen(!isOpen)}>
        Click to open
      </DtButton>
    </div>
  );
}

const DefaultTemplate = (args: ModalStoryArgs) => <ModalDefault {...args} />;

export const Default: Story = {
  render: DefaultTemplate,

  args: {},
  parameters: {
    percy: {
      args: {
        open: true,
      },
    },
  },
};

export const WithFooter: Story = {
  render: DefaultTemplate,

  args: {
    showFooter: true,
  },

  parameters: { ...Default.parameters },
};

export const WithFixedHeaderFooter: Story = {
  render: DefaultTemplate,

  args: {
    showFooter: true,
    fixedHeaderFooter: true,
    copy: argsData.copy.repeat(4),
  },

  parameters: { ...Default.parameters },
};

export const WithBanner: Story = {
  render: DefaultTemplate,

  args: {
    bannerHeaderText: 'Example banner',
  },

  parameters: { ...Default.parameters },
};

export const WithCriticalStyle: Story = {
  render: DefaultTemplate,

  args: {
    kind: 'critical',
    showFooter: true,
  },

  parameters: { ...Default.parameters },
};

export const WithFullscreen: Story = {
  render: DefaultTemplate,

  args: {
    fullscreen: true,
    showFooter: true,
  },

  parameters: { ...Default.parameters },
};

export const WithTransparentBackdrop: Story = {
  render: DefaultTemplate,

  args: {
    transparentBackdrop: true,
    showFooter: true,
  },

  parameters: { ...Default.parameters },
};

export const WithOverlays: Story = {
  render: args => <ModalWithOverlays {...args} />,

  args: {},

  parameters: {
    options: { showPanel: false },
    percy: {
      args: {
        open: true,
      },
    },
  },
};

export const WithCustomHeaderAndContent: Story = {
  render: DefaultTemplate,

  // Vue's strings as they are: its template renders them with v-html, which leaves <dt-stack> an unknown element too.
  args: {
    header: `
      <dt-stack direction="row" align="center" justify="center" class="d-p-150 d-bgc-purple-100">
        <div>[custom header]</div>
      </dt-stack>`,
    default: `
      <dt-stack direction="row" align="center" justify="center" class="d-p-400 d-bgc-gold-200">
        <h2>[custom body]</h2>
      </dt-stack>`,
  },

  parameters: { ...Default.parameters },
};
