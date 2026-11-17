import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { StandIn } from '../../.storybook/StandIn';
import { cx, type ClassValue } from '../../common/cx';
import { CONTENT_MODE_TYPES } from '../../common/mode_constants';
import { DtIconDpPhone } from '../../icons';
import { useModeRegion } from '../ModeIsland/ModeDirective';
import { DtStack } from '../Stack';
import { DtTooltip, type DtTooltipProps } from './Tooltip';
import { TOOLTIP_DIRECTIONS, TOOLTIP_STICKY_VALUES, type TooltipDirection } from './TooltipConstants';

// Slots are args named as in Vue: `default` (the content) and `anchor` (the button's label). `showTooltip`,
// `globalShow` and `customDirections` are template inputs, as in the .story.vue files.
type TooltipStoryArgs = Omit<DtTooltipProps, 'anchor'> & {
  default?: string;
  anchor?: string;
  showTooltip?: boolean | null;
  globalShow?: boolean;
  customDirections?: (TooltipDirection | null)[];
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
  message: 'This is a Tooltip',
  anchor: 'Hover over me to see a tooltip',
  default: `This is a simple tooltip. You can set the position of the tooltip using the placement prop!`,
  onShown: action('shown'),
  showArrow: true,
  showTooltip: null,
};

export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  anchor: {
    name: 'anchor',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  placement: {
    options: TOOLTIP_DIRECTIONS,
    control: {
      type: 'select',
    },
    // Not in Vue's argTypes: see contentMode.
    type: 'string',
  },
  sticky: {
    options: TOOLTIP_STICKY_VALUES,
    control: {
      type: 'select',
    },
  },

  appendTo: {
    control: {
      type: null,
    },
  },

  enabled: {
    type: 'boolean',
  },
  showArrow: {
    type: 'boolean',
  },
  open: {
    options: [null, true, false],
    type: 'select',
  },

  contentMode: CONTENT_MODE_ARG_TYPE,

  inverted: {
    type: 'boolean',
  },

  delay: {
    type: 'boolean',
  },

  // Not in Vue's argTypes: react-docgen reports `theme` as a union (string | null), and Storybook drops a URL value
  // for a union arg, so without it the comparison couldn't drive it in the React frame.
  theme: {
    type: 'string',
  },

  transition: {
    type: 'boolean',
  },

  // Events
  showTooltip: {
    table: {
      disable: true,
    },
  },
  onShown: {
    table: {
      disable: true,
    },
  },
  'update:open': {
    table: {
      disable: true,
    },
  },
  shown: {
    description: `emitted when tooltip is shown or hidden`,
    table: {
      type: {
        summary: 'boolean',
      },
    },
  },
};

// Story Collection
const meta = {
  title: 'Components/Tooltip',
  component: DtTooltip,
  args: argsData,
  // Vue's argTypes as they are, though Storybook's types have no `type: 'select'` or `control: { type: null }`.
  argTypes: argTypesData as unknown as Meta<TooltipStoryArgs>['argTypes'],
  excludeStories: /.*Data$/,
} satisfies Meta<TooltipStoryArgs>;

export default meta;
type Story = StoryObj<TooltipStoryArgs>;

// Button isn't ported: Vue's <dt-button importance="outlined"> (kind default or inverted), as it renders.
function OutlinedButton ({ id, kind = 'default', className, onClick, children }: {
  id?: string;
  kind?: 'default' | 'inverted';
  className?: ClassValue;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <StandIn for="button">
      <button
        className={cx('base-button__button d-btn d-btn--outlined', { 'd-btn--inverted': kind === 'inverted' }, className)}
        data-qa="dt-button"
        type="button"
        id={id}
        onClick={onClick}
      >
        <span data-qa="dt-button-label" className="base-button__label d-btn__label">{children}</span>
      </button>
    </StandIn>
  );
}

const PURPLE_THEME_CSS = `
.tippy-box[data-theme~='purple'] > .tippy-svg-arrow {
  fill: var(--dt-color-purple-200);
}
.tippy-box[data-theme~='purple'] > .d-tooltip {
  background-color: var(--dt-color-purple-200);
}
`;

// TooltipDefault.story.vue
function TooltipDefault ({
  anchor, default: defaultSlot, showTooltip: _showTooltip, globalShow, customDirections: _customDirections,
  open, inverted, ...args
}: TooltipStoryArgs) {
  return (
    <div className={cx('d-fl-center d-fd-column d-pbs-800', { 'd-bgc-contrast d-pbe-800': inverted })}>
      <style>{PURPLE_THEME_CSS}</style>
      <div className="d-pbs-200">
        <DtTooltip
          {...args}
          inverted={inverted}
          open={globalShow ?? open}
          anchor={<OutlinedButton kind={inverted ? 'inverted' : 'default'}>{anchor}</OutlinedButton>}
        >
          {defaultSlot || undefined}
        </DtTooltip>
      </div>
    </div>
  );
}

// TooltipChangeOnClick.story.vue
function TooltipChangeOnClick ({
  anchor, default: _defaultSlot, showTooltip: _showTooltip, globalShow: _globalShow,
  customDirections: _customDirections, inverted, ...args
}: TooltipStoryArgs) {
  // Vue keeps this in a module-level ref, so it survives a remount; here it is the story's own state.
  const [isButtonActive, setIsButtonActive] = useState(false);
  return (
    <div className={cx('d-fl-center d-fd-column d-pbs-800', { 'd-bgc-contrast d-pbe-800': inverted })}>
      <div className="d-pbs-200">
        <DtTooltip
          {...args}
          inverted={inverted}
          anchor={(
            <OutlinedButton kind={inverted ? 'inverted' : 'default'} onClick={() => setIsButtonActive(active => !active)}>
              {anchor}
            </OutlinedButton>
          )}
        >
          {isButtonActive ? 'Remove from starred' : 'Add to starred'}
        </DtTooltip>
      </div>
    </div>
  );
}

// TooltipFlip.story.vue. Its scoped Less, as plain CSS: the classes are the template's, and the style element only
// exists while the story renders.
const FLIP_CSS = `
.tooltip-holder {
  margin: 150px;
}

.container {
  position: relative;
  inline-size: 800px;
  block-size: 300px;
  background-color: var(--black-050);
  padding: 10px;
  border-radius: 10px;
  overflow-y: scroll;
  overscroll-behavior: contain;
  border: 2px dashed #ff6b81;
}

.some-text {
  block-size: 400px;
  cursor: pointer;
  padding: 100px 10px 0;
}

.tooltip {
  margin-inline-start: 4px;
}
`;

function TooltipFlip ({ id, placement, offset, inverted, default: defaultSlot }: TooltipStoryArgs) {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    container.current?.scrollTo(0, container.current.scrollHeight / 3);
  }, []);

  return (
    <div className="d-m-800">
      <style>{FLIP_CSS}</style>
      <div ref={container} className="container">
        <div className="some-text" />
        <div className="some-text">
          <DtTooltip
            id={id}
            placement={placement}
            className="tooltip"
            fallbackPlacements={['right', 'bottom']}
            offset={offset}
            open={true}
            anchor={<OutlinedButton kind={inverted ? 'inverted' : 'default'}>Click me to see a tooltip</OutlinedButton>}
          >
            <div>
              {defaultSlot}
            </div>
          </DtTooltip>
        </div>
        <div className="some-text" />
      </div>
    </div>
  );
}

// TooltipVariants.story.vue
function sliceIntoChunks<T> (arr: readonly T[], chunkSize: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

const VARIANTS_PURPLE_THEME_CSS = `
.tippy-box[data-theme~='purple'] > .tippy-svg-arrow {
  fill: var(--dt-color-purple-200);
}
.tippy-box[data-theme~='purple'] .d-tooltip {
  background-color: var(--dt-color-purple-200);
  color: var(--dt-color-foreground-primary);
}
`;

// dialtone-vue's localization (en-US.ftl): React has no i18n yet, so the English strings.
const i18n = {
  DIALTONE_TOOLTIP_WITHOUT_ARROW_MESSAGE: 'Tooltip without an arrow',
  DIALTONE_TOOLTIP_WITHOUT_ARROW_LABEL: 'Without Arrow',
  DIALTONE_TOOLTIP_WITHOUT_ARROW_BOTTOM_LABEL: 'Without Arrow Bottom',
  DIALTONE_TOOLTIP_WITHOUT_ARROW_OPEN_LABEL: 'Without Arrow + Open',
};

const localMessage = `This is a simple tooltip. The tooltip can be positioned in multiple areas too!`;

function InvertedButton () {
  const [el, setEl] = useState<HTMLButtonElement | null>(null);
  useModeRegion(el, 'invert');
  return (
    <StandIn for="button">
      <button ref={setEl} className="base-button__button d-btn d-btn--outlined" data-qa="dt-button" type="button">
        <span data-qa="dt-button-label" className="base-button__label d-btn__label">Inverted</span>
      </button>
    </StandIn>
  );
}

function TooltipVariants ({ transition, showTooltip, customDirections }: TooltipStoryArgs) {
  const directionRows = sliceIntoChunks(customDirections || TOOLTIP_DIRECTIONS, 3);
  const [show1, setShow1] = useState(showTooltip ?? false);

  // Vue passes the anchor as a selector (external-anchor="#external-tooltip-anchor"); React takes the element.
  const [externalAnchor, setExternalAnchor] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setExternalAnchor(document.getElementById('external-tooltip-anchor'));
  }, []);

  return (
    <div id="forms-radio--variants-container" className="d-pbs-200 d-px-800">
      <style>{VARIANTS_PURPLE_THEME_CSS}</style>
      <DtStack direction="row" gap="0" justify="center" className="d-w100p d-mbe-800 d-my-400">
        <OutlinedButton id="external-tooltip-anchor">
          External anchor
        </OutlinedButton>
      </DtStack>
      {/* Arrow Description */}
      {directionRows.map((rowDirection, i) => (
        <DtStack key={i} direction="row" gap="0" align="center" justify="center" className="d-my-200">
            {rowDirection.map(direction => (
              <div key={direction} className="d-mx-100">
                {direction !== null && (
                  <DtTooltip
                    transition={transition}
                    placement={direction}
                    message={localMessage}
                    open={showTooltip}
                    anchor={(
                      <OutlinedButton className="d-w-200">
                        {direction}
                      </OutlinedButton>
                    )}
                  />
                )}
              </div>
            ))}
        </DtStack>
      ))}
      <DtStack direction="row" gap="0" align="center" justify="center" className="d-w100p">
          <div id="circle-button-tooltip-label">
            Circle button tooltip
          </div>
          {/* Vue binds :transition="transition", which the template never defines, so it is unset. */}
          <DtTooltip
            className="d-mx-100"
            message={localMessage}
            open={showTooltip}
            anchor={(
              <StandIn for="button">
                <button className="base-button__button d-btn d-btn--outlined d-btn--circle d-btn--icon-only" data-qa="dt-button" type="button" aria-labelledby="circle-button-tooltip-label">
                  <span data-qa="dt-button-start-icon" className="base-button__icon d-btn__icon d-btn__icon--left">
                    <DtIconDpPhone size="300" />
                  </span>
                </button>
              </StandIn>
            )}
          />
      </DtStack>
      <DtStack direction="row" gap="0" justify="center" className="d-w100p">
          {/* Text */}
          <DtTooltip
            className="d-my-100"
            transition={transition}
            message={localMessage}
            open={showTooltip}
            anchor={(
              <StandIn for="button">
                <button className="base-button__button d-link" data-qa="dt-button" type="button">
                  <span data-qa="dt-button-label" className="base-button__label d-btn__label">Link Tooltip</span>
                </button>
              </StandIn>
            )}
          />
      </DtStack>
      <DtStack direction="row" gap="200" justify="center" className="d-w100p d-pbs-800">
          {/* Without arrow */}
          <DtTooltip
            className="d-my-100"
            showArrow={false}
            transition={transition}
            message={i18n.DIALTONE_TOOLTIP_WITHOUT_ARROW_MESSAGE}
            anchor={(
              <OutlinedButton>
                {i18n.DIALTONE_TOOLTIP_WITHOUT_ARROW_LABEL}
              </OutlinedButton>
            )}
          />
          {/* Without arrow, bottom */}
          <DtTooltip
            className="d-my-100"
            placement="bottom"
            showArrow={false}
            transition={transition}
            message={i18n.DIALTONE_TOOLTIP_WITHOUT_ARROW_MESSAGE}
            anchor={(
              <OutlinedButton>
                {i18n.DIALTONE_TOOLTIP_WITHOUT_ARROW_BOTTOM_LABEL}
              </OutlinedButton>
            )}
          />
          {/* Without arrow, open */}
          <DtTooltip
            className="d-my-100"
            placement="top"
            showArrow={false}
            transition={transition}
            message={i18n.DIALTONE_TOOLTIP_WITHOUT_ARROW_MESSAGE}
            open={true}
            anchor={(
              <OutlinedButton>
                {i18n.DIALTONE_TOOLTIP_WITHOUT_ARROW_OPEN_LABEL}
              </OutlinedButton>
            )}
          />
      </DtStack>
      <DtStack direction="row" gap="0" justify="center" className="d-w100p">
          {/* Open state */}
          <DtTooltip
            className="d-my-100"
            transition={transition}
            message={localMessage}
            open={show1}
            anchor={(
              <OutlinedButton onClick={() => setShow1(!show1)}>
                Open on click
              </OutlinedButton>
            )}
          />
      </DtStack>
      <DtStack direction="row" gap="0" justify="center" className="d-w100p">
          {/* Custom Theme */}
          <DtTooltip
            className="d-my-100"
            theme="purple"
            transition={transition}
            message={localMessage}
            open={showTooltip}
            anchor={(
              <OutlinedButton>
                Custom Theme
              </OutlinedButton>
            )}
          />
      </DtStack>
      <DtStack direction="row" gap="0" justify="center" className="d-bgc-contrast d-py-100">
          <div className="d-py-800">
            {/* Inverted state */}
            <DtTooltip
              inverted={true}
              transition={transition}
              message={localMessage}
              open={showTooltip}
              anchor={(
                // v-dt-mode:invert on the button: the hook sets the mode attributes, as the directive does.
                <InvertedButton />
              )}
            />
          </div>
      </DtStack>
      {/* Vue binds :transition="transition", which the template never defines, so it is unset. */}
      <DtTooltip
        externalAnchorElement={externalAnchor}
        open={showTooltip}
      >
        This is a tooltip with external anchor, the actual dt-tooltip component
        is at the end of this page
      </DtTooltip>
    </div>
  );
}

// Templates
export const Default: Story = {
  render: args => <TooltipDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: args => <TooltipVariants {...args} />,
  args: {},
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    percy: {
      args: {
        showTooltip: true,
      },
    },
  },
};

export const Flip: Story = {
  render: args => <TooltipFlip {...args} />,

  args: {
    default: 'Scroll down to see how the tooltip changes based on the available space.',
  },

  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};

export const ChangeOnClick: Story = {
  render: args => <TooltipChangeOnClick {...args} />,
  args: {
    anchor: 'Click to see the tooltip content change',
    sticky: 'popper',
  },
};
