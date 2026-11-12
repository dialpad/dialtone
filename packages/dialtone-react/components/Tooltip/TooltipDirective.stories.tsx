import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StandIn } from '../../.storybook/StandIn';
import { DtIconPhoneHangUp } from '../../icons';
import { DtTooltip } from './Tooltip';
import {
  useTooltipDirective,
  type DtTooltipDirectiveOptions,
  type DtTooltipDirectiveValue,
} from './TooltipDirective';

export const argsData = {};

export const argTypesData = {};

const meta = {
  title: 'Directives/Tooltip',
  component: DtTooltip,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<typeof DtTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// Button isn't ported: Vue's <dt-button> as it renders, with the directive on its element.
function DirectiveButton ({ value, options, className = '', onClick, children, ...rest }: {
  value: DtTooltipDirectiveValue;
  options?: DtTooltipDirectiveOptions;
  className?: string;
  onClick?: () => void;
  'aria-label'?: string;
  children: ReactNode;
}) {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  useTooltipDirective(anchor, value, options);
  return (
    <StandIn for="button">
      <button
        ref={setAnchor}
        className={`base-button__button d-btn ${className}`.trim()}
        data-qa="dt-button"
        type="button"
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    </StandIn>
  );
}

// dialtone-vue's tooltip_directive_default.story.vue.
function TooltipDirectiveDefault () {
  const [span, setSpan] = useState<HTMLSpanElement | null>(null);
  const defaultMessage = 'This is a simple tooltip. You can set the position of the tooltip using the placement prop! Click to change content';
  const [message, setMessage] = useState(defaultMessage);
  useTooltipDirective(span, 'Default placement');

  const changeOnClick = async () => {
    setMessage('Changed!');
    await new Promise(resolve => setTimeout(resolve, 750));
    setMessage(defaultMessage);
  };

  return (
    <StandIn for="stack">
      <div data-qa="dt-stack" className="d-stack d-stack--row d-stack--gap-400 d-m-800">
        <span ref={setSpan}>Span with tooltip</span>
        <DirectiveButton
          value="Tooltip on bottom"
          options={{ placement: 'bottom' }}
          className="d-btn--clear d-btn--critical d-btn--circle d-btn--icon-only"
          aria-label="example button"
        >
          <span data-qa="dt-button-start-icon" className="base-button__icon d-btn__icon d-btn__icon--left">
            <DtIconPhoneHangUp size="300" />
          </span>
        </DirectiveButton>
        <DirectiveButton value="Tooltip on top end" options={{ placement: 'top-end' }}>
          <span data-qa="dt-button-label" className="base-button__label d-btn__label">Button with tooltip</span>
        </DirectiveButton>
        <DirectiveButton value={undefined}>
          <span data-qa="dt-button-label" className="base-button__label d-btn__label">Empty tooltip</span>
        </DirectiveButton>
        <DirectiveButton value={message} options={{ placement: 'top-end' }} onClick={changeOnClick}>
          <span data-qa="dt-button-label" className="base-button__label d-btn__label">Change content on click</span>
        </DirectiveButton>
      </div>
    </StandIn>
  );
}

export const Default: Story = {
  render: () => <TooltipDirectiveDefault />,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
