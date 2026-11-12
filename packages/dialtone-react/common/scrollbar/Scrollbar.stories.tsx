import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtStack } from '../../components/Stack/Stack';
import { useScrollbar, type ScrollbarOptions, type ScrollbarShowMode } from './useScrollbar';

export const argsData = {};

export const argTypesData = {};

const meta = {
  title: 'Directives/Scrollbar',
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const LINES = Array.from({ length: 20 }, (_, i) => i + 1);

// The scrolling box Vue's story puts `v-dt-scrollbar` on, with its label.
function ScrollbarExample ({ label, value, arg }: {
  label: string;
  value?: ScrollbarOptions;
  arg?: ScrollbarShowMode;
}) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useScrollbar(el, value, { arg });
  return (
    <div>
      <p className="d-label--md-compact d-mbe-100">{label}</p>
      <div ref={setEl} className="d-h-250 d-w-400 d-bar-400 d-bc-default d-ba">
        <div className="d-p-200">
          {LINES.map((i) => (
            <p key={i} className="d-body--md">Scrollable content line {i}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScrollbarDirectiveDefault () {
  return (
    <DtStack gap="200" className="d-p-100">
      <ScrollbarExample label="Default (auto-hide on leave)" />
      <ScrollbarExample label="Always visible" arg="always" />
      <ScrollbarExample label="Auto-hide on scroll" arg="scroll" />
      <ScrollbarExample
        label="Offset — block-start & block-end (2rem each)"
        value={{ showScrollbar: 'always', offset: { block: '2rem' } }}
      />
      <ScrollbarExample
        label="Offset — individual sides (blockStart 3rem, blockEnd 1rem, inlineEnd 1rem)"
        value={{ showScrollbar: 'always', offset: { blockStart: '3rem', blockEnd: '1rem', inlineEnd: '1rem' } }}
      />
    </DtStack>
  );
}

export const Default: Story = {
  render: () => <ScrollbarDirectiveDefault />,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
