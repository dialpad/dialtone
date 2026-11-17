import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtIconPhoneHangUp } from '../../icons';
import { DtButton, type DtButtonProps } from '../Button';
import { DtStack } from '../Stack';
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

// Vue's <dt-button> with the directive on its element.
function DirectiveButton ({ value, options, ...rest }: DtButtonProps & {
  value: DtTooltipDirectiveValue;
  options?: DtTooltipDirectiveOptions;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  useTooltipDirective(anchor, value, options);
  return <DtButton ref={setAnchor} {...rest} />;
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
    <DtStack direction="row" gap="400" className="d-m-800">
        <span ref={setSpan}>Span with tooltip</span>
        <DirectiveButton
          value="Tooltip on bottom"
          options={{ arg: 'bottom' }}
          importance="clear"
          kind="critical"
          circle
          aria-label="example button"
          startIcon={<DtIconPhoneHangUp size="300" />}
        />
        <DirectiveButton value="Tooltip on top end" options={{ arg: 'top-end' }}>
          Button with tooltip
        </DirectiveButton>
        <DirectiveButton value={undefined}>
          Empty tooltip
        </DirectiveButton>
        <DirectiveButton value={message} options={{ arg: 'top-end' }} onClick={changeOnClick}>
          Change content on click
        </DirectiveButton>
    </DtStack>
  );
}

export const Default: Story = {
  render: () => <TooltipDirectiveDefault />,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
