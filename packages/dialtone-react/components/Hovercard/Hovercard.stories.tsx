import { useRef, useState, type MouseEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { CONTENT_MODE_TYPES } from '../../common/mode_constants';
import { DtAvatar } from '../Avatar';
import { DtButton } from '../Button';
import { DtIcon } from '../Icon';
import { DtInput } from '../Input';
import { POPOVER_DIRECTIONS, POPOVER_PADDING_CLASSES } from '../Popover';
import { DtStack } from '../Stack';
import { DtHovercard, type DtHovercardHandle, type DtHovercardProps } from './Hovercard';

import { asset } from '../../.storybook/asset';
// Slots are args named as in Vue: `content`, `headerContent` and `footerContent` are HTML strings, as the .story.vue
// templates render them with v-html.
type HovercardStoryArgs = Omit<DtHovercardProps, 'content' | 'headerContent' | 'footerContent'> & {
  content?: string;
  headerContent?: string;
  footerContent?: string;
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

const defaultImage = asset('avatar2.png');

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
  contentMode: CONTENT_MODE_ARG_TYPE,
  open: {
    control: {
      type: 'boolean',
    },
  },
  fallbackPlacements: {
    description: `If the popover does not fit in the direction described by "placement",
    it will attempt to change its direction to the "fallbackPlacements".
    <a
      class="d-link"
      href="https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements"
      target="_blank"
    >
      Popper.js docs
    </a>`,
  },
  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  offset: {
    description: `Displaces the content box from its anchor element
    by the specified number of pixels.
    <a
      class="d-link"
      href="https://atomiks.github.io/tippyjs/v6/all-props/#offset"
      target="_blank"
    >
      Tippy.js docs
    </a>`,
  },
  padding: {
    options: Object.keys(POPOVER_PADDING_CLASSES),
    control: {
      type: 'select',
    },
  },
  placement: {
    description: `The direction the popover displays relative to the anchor.
    <a
      class="d-link"
      href="https://atomiks.github.io/tippyjs/v6/all-props/#placement"
      target="_blank"
    >
      Tippy.js docs
    </a>`,
    options: POPOVER_DIRECTIONS,
    control: {
      type: 'select',
    },
    table: {
      defaultValue: {
        summary: 'top-start',
      },
      type: {
        summary: `top, top-start, top-end,
        right, right-start, right-end,
        left, left-start, left-end,
        bottom, bottom-start, bottom-end,
        auto, auto-start, auto-end`,
      },
    },
  },
  transition: {
    control: {
      type: 'boolean',
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

  opened: {
    description: `emitted when popover is shown or hidden.`,
    table: {
      type: {
        summary: 'event',
      },
    },
  },
};

export const argsData: Partial<HovercardStoryArgs> = {
  placement: 'top-start',
  fallbackPlacements: ['bottom-start'],
  offset: [0, 16],
  appendTo: 'body',
  onOpened: action('opened'),
  transition: false,
};

const meta = {
  title: 'Components/Hovercard',
  component: DtHovercard,
  args: argsData,
  // Vue's argTypes as they are, though Storybook's types have no `type: 'select'`.
  argTypes: argTypesData as unknown as Meta<HovercardStoryArgs>['argTypes'],
  excludeStories: /.*Data$/,
} satisfies Meta<HovercardStoryArgs>;

export default meta;
type Story = StoryObj<HovercardStoryArgs>;

// What the .story.vue templates bind from $attrs, which they pass to DtHovercard one by one.
const sharedProps = ({
  id, placement, contentClass, fallbackPlacements, padding, transition, offset, headerClass, footerClass, appendTo,
  enterDelay, leaveDelay, onOpened,
}: HovercardStoryArgs) => ({
  id,
  placement,
  contentClass,
  fallbackPlacements,
  padding,
  transition,
  offset,
  headerClass,
  footerClass,
  appendTo,
  enterDelay,
  leaveDelay,
  onOpened,
});

const htmlSlot = (html?: string) => (html ? <span dangerouslySetInnerHTML={{ __html: html }} /> : undefined);

// The actions row the profile cards share. Vue's templates differ only in the button width's token.
function ProfileActions ({ width }: { width: string }) {
  return (
    <DtStack direction="row" gap="100">
      <DtButton width={width} importance="outlined" kind="muted">
        Call
      </DtButton>
      <DtButton width={width} importance="outlined" kind="muted">
        Message
      </DtButton>
    </DtStack>
  );
}

function ProfileDetails () {
  return (
    <DtStack direction="column" gap="50" className="d-fc-secondary">
      <p>
        Vice President of Sales Enablement Aerolabs
      </p>
      <DtStack direction="row" gap="50">
        <DtIcon name="clock-4" size="200" />
        <p className="d-body--sm">
          <b>Local Time:</b> 12:32 PM
        </p>
      </DtStack>
    </DtStack>
  );
}

function ProfileHeader () {
  return (
    <DtStack direction="row" gap="50">
      <DtAvatar
        fullName="Jaqueline Nackos"
        imageSrc={defaultImage}
        imageAlt="Person avatar"
        seed="JN"
        size={300}
        presence="busy"
      />
      <DtStack direction="column" gap="0">
        <p className="d-headline--md-compact">
          Jaqueline Nackos
        </p>
        <p className="d-body--sm d-fc-tertiary">
          <span className="d-fc-critical">In a meeting</span> • Working from SF
        </p>
      </DtStack>
    </DtStack>
  );
}

// HovercardDefault.story.vue
function HovercardDefault ({ open, headerContent, footerContent, ...args }: HovercardStoryArgs) {
  const [activatedOpen, setActivatedOpen] = useState<boolean | null>(null);
  const openCard = (event: MouseEvent) => {
    if (event.detail === 0 && open == null) setActivatedOpen(prev => !prev);
  };
  const onOpened = (isOpen: boolean) => {
    if (!isOpen) setActivatedOpen(null);
    args.onOpened?.(isOpen);
  };

  return (
    <DtHovercard
      {...sharedProps(args)}
      open={open ?? activatedOpen}
      onOpened={onOpened}
      anchor={attrs => (
        <DtAvatar
          fullName="Jaqueline Nackos"
          imageSrc={defaultImage}
          imageAlt=""
          seed="JN"
          presence="busy"
          interactive
          aria-label="Show Jaqueline Nackos profile"
          {...attrs}
          onClick={openCard}
        />
      )}
      content={(
        <DtStack direction="column" gap="100">
          <ProfileHeader />
          <ProfileDetails />
          <ProfileActions width="var(--dt-layout-100-percent)" />
        </DtStack>
      )}
      headerContent={htmlSlot(headerContent)}
      footerContent={htmlSlot(footerContent)}
    />
  );
}

const cardData = [{
  name: 'Jaqueline Nackos', src: asset('avatar2.png'), time: '4:54 PM', default: `<p class="d-fs-200 d-lh-400 d-wmx90ch">
  Elementum fames nullam elementum velit proin vitae aliquet.
  Platea nulla consectetur consequat sagittis nullam et ultricies nisl rhoncus
  aliquet elementum venenatis quisque.</p>`,
},
{
  name: 'Joseph Lumaban', src: asset('avatar1.png'), time: '5:05 PM', default: `<p class="d-fs-200 d-lh-400 d-wmx90ch">
  Elementum fames nullam elementum velit proin vitae aliquet.
  Platea nulla consectetur consequat sagittis nullam et ultricies nisl rhoncus
  aliquet elementum venenatis quisque.</p>`,
},
{
  name: 'Purdie Afra', src: undefined, time: '5:16 PM', default: `<p class="d-fs-200 d-lh-400 d-wmx90ch">
  Elementum fames nullam elementum velit proin vitae aliquet.
  Platea nulla consectetur consequat sagittis nullam et ultricies nisl rhoncus
  aliquet elementum venenatis quisque.</p>`,
}];

// HovercardMany.story.vue
function HovercardMany (args: HovercardStoryArgs) {
  const [openByName, setOpenByName] = useState<Record<string, boolean | null>>({});
  const openCard = (name: string, event: MouseEvent) => {
    if (event.detail === 0 && args.open == null) setOpenByName(prev => ({ ...prev, [name]: !prev[name] }));
  };
  const onOpened = (name: string, isOpen: boolean) => {
    if (!isOpen) setOpenByName(prev => ({ ...prev, [name]: null }));
    args.onOpened?.(isOpen);
  };

  return (
    <ul className="d-mbe-50">
      {cardData.map(data => (
        <li key={data.name} className="d-d-flex d-gap-100 d-mbe-100">
          <div>
            <DtHovercard
              {...sharedProps(args)}
              open={args.open ?? openByName[data.name] ?? null}
              onOpened={isOpen => onOpened(data.name, isOpen)}
              anchor={attrs => (
                <DtAvatar
                  fullName={data.name}
                  imageSrc={data.src}
                  seed={data.name}
                  imageAlt=""
                  interactive
                  aria-label={`Show ${data.name} profile`}
                  {...attrs}
                  onClick={(event: MouseEvent) => openCard(data.name, event)}
                />
              )}
              content={(
                <DtStack direction="column" gap="100">
                  <DtStack direction="row" gap="50">
                    <DtAvatar
                      fullName={data.name}
                      imageSrc={data.src}
                      imageAlt="Person avatar"
                      seed="JN"
                      size={300}
                      presence="active"
                    />
                    <DtStack direction="column" gap="0">
                      <p className="d-headline--md-compact">
                        {data.name}
                      </p>
                      <p className="d-body--sm d-fc-tertiary">
                        Good Morning! :smile:
                      </p>
                    </DtStack>
                  </DtStack>
                  <ProfileDetails />
                  <ProfileActions width="var(--dt-layout-100-percent)" />
                </DtStack>
              )}
            />
          </div>
          <DtStack direction="column" gap="50" className="d-fl-grow1">
            <DtStack direction="row" gap="50" justify="space-between">
              <p className="d-body--sm-bold">
                {data.name}
              </p>
              <p className="d-body--sm d-fc-tertiary">
                {data.time}
              </p>
            </DtStack>
            {data.default && <span dangerouslySetInnerHTML={{ __html: data.default }} />}
            <DtButton
              importance="clear"
              size={200}
              aria-label="Add reaction"
              data-qa="feed-item-reaction-button"
            >
              <DtIcon size="300" name="satisfied" />
            </DtButton>
          </DtStack>
        </li>
      ))}
    </ul>
  );
}

// HovercardWithInput.story.vue
function HovercardWithInput ({ open, headerContent, footerContent, ...args }: HovercardStoryArgs) {
  const [inputValue, setInputValue] = useState('');
  const [activatedOpen, setActivatedOpen] = useState<boolean | null>(null);
  const openCard = (event: MouseEvent) => {
    if (event.detail === 0 && open == null) setActivatedOpen(prev => !prev);
  };
  const onOpened = (isOpen: boolean) => {
    if (!isOpen) setActivatedOpen(null);
    args.onOpened?.(isOpen);
  };

  return (
    <DtHovercard
      {...sharedProps(args)}
      open={open ?? activatedOpen}
      onOpened={onOpened}
      anchor={attrs => (
        <DtAvatar
          fullName="Jaqueline Nackos"
          imageSrc={defaultImage}
          imageAlt=""
          seed="JN"
          presence="busy"
          interactive
          aria-label="Show Jaqueline Nackos profile"
          {...attrs}
          onClick={openCard}
        />
      )}
      content={(
        <DtStack direction="column" gap="100">
          <ProfileHeader />
          <ProfileDetails />
          <ProfileActions width="var(--dt-layout-100-percent)" />
          <DtInput
            value={inputValue}
            onValueChange={value => setInputValue(value as string)}
            placeholder="Quick message"
            size={300}
            width="var(--dt-layout-100-percent)"
          />
        </DtStack>
      )}
      headerContent={htmlSlot(headerContent)}
      footerContent={htmlSlot(footerContent)}
    />
  );
}

// HovercardExternalAnchor.story.vue
function HovercardExternalAnchor (args: HovercardStoryArgs) {
  const hovercard = useRef<DtHovercardHandle>(null);
  const [mentionElement, setMentionElement] = useState<HTMLElement | null>(null);

  const onMentionEnter = (event: MouseEvent<HTMLSpanElement>) => {
    setMentionElement(event.currentTarget);
    hovercard.current?.show();
  };

  const onMentionLeave = () => {
    hovercard.current?.hide();
  };

  return (
    <>
      <p className="d-body--md">
        Send a message to
        {' '}
        <span
          className="d-fw-bold d-fc-primary d-c-pointer"
          onMouseEnter={onMentionEnter}
          onMouseLeave={onMentionLeave}
        >@Jaqueline Nackos</span>
        {' '}
        to get started.
      </p>

      <DtHovercard
        {...sharedProps(args)}
        ref={hovercard}
        externalAnchorElement={mentionElement}
        content={(
          <DtStack direction="column" gap="100">
            <ProfileHeader />
            <ProfileDetails />
            <ProfileActions width="var(--dt-size-100-percent)" />
          </DtStack>
        )}
      />
    </>
  );
}

export const Default: Story = {
  render: args => <HovercardDefault {...args} />,
  decorators: [Story => <div> <Story /> </div>],
  args: {},
};

export const Many: Story = {
  render: args => <HovercardMany {...args} />,
  decorators: [Story => <div><Story /></div>],
  args: { ...Default.args, offset: [0, 5] },
};

export const WithInput: Story = {
  render: args => <HovercardWithInput {...args} />,
  decorators: [Story => <div><Story /></div>],
  args: { ...Default.args, offset: [0, 5] },
};

export const ExternalAnchor: Story = {
  render: args => <HovercardExternalAnchor {...args} />,
  decorators: [Story => (
    <DtStack direction="row" justify="center" align="center" className="d-h-700">
      <div className="d-w-500">
        <Story />
      </div>
    </DtStack>
  )],
  args: { ...Default.args },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates using <code>externalAnchorElement</code> with the exposed <code>show()</code>/<code>hide()</code> API. ' +
          'This pattern is used when the anchor lives outside the hovercard\'s DOM scope (e.g. inside a Shadow DOM), ' +
          'so the hovercard cannot detect hover events automatically. ' +
          'The parent listens for hover events and calls <code>show()</code>/<code>hide()</code> directly on the hovercard ref.',
      },
    },
  },
};
