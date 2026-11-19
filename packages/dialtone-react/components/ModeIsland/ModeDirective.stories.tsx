import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ContentMode } from '../../common/mode_constants';
import { DtSelectMenu } from '../SelectMenu/SelectMenu';
import { DtStack } from '../Stack/Stack';
import { DtText } from '../Text/Text';
import { DtToggle } from '../Toggle/Toggle';
import { useModeRegion } from './ModeDirective';

const MODE_OPTIONS: { value: ContentMode; label: string }[] = [
  { value: 'invert', label: 'invert' },
  { value: 'light', label: 'light' },
  { value: 'dark', label: 'dark' },
];

const REGION = 'd-bgc-secondary d-p-200 d-ba d-bc-subtle d-bar-400';

// The hook is the directive: each element that has `v-dt-mode` in Vue's story is one of these.
function Region ({ as: Tag = 'section', mode, className, children }: {
  as?: 'section' | 'div';
  mode?: ContentMode | false;
  className: string;
  children: ReactNode;
}) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useModeRegion(el, mode);
  return <Tag ref={setEl} className={className}>{children}</Tag>;
}

function Swatches () {
  return (
    <DtStack direction="row" gap="400">
      <span className="d-fc-primary">Primary</span>
      <span className="d-fc-tertiary">Tertiary</span>
      <span className="d-fc-positive">Positive</span>
      <span className="d-fc-critical">Critical</span>
    </DtStack>
  );
}

function Heading ({ children }: { children: ReactNode }) {
  return <DtText as="h3" kind="headline" size={400}>{children}</DtText>;
}

function Body ({ children }: { children: ReactNode }) {
  return <DtText kind="body" tone="primary">{children}</DtText>;
}

// mode_directive_default.story.vue
function ModeDirectiveDefault () {
  const [enabled, setEnabled] = useState(true);
  const [dynamicMode, setDynamicMode] = useState<ContentMode>('invert');

  return (
    <DtStack gap="200" className="d-p-100">
        <Heading>Explicit modes</Heading>
        <DtStack direction="row" gap="500">
            <Region mode="light" className={`${REGION} d-fl1`}>
              <DtStack gap="400">
                <Body>Light mode (v-dt-mode:light)</Body>
                <Swatches />
              </DtStack>
            </Region>
            <Region mode="dark" className={`${REGION} d-fl1`}>
              <DtStack gap="400">
                <Body>Dark mode (v-dt-mode:dark)</Body>
                <Swatches />
              </DtStack>
            </Region>
        </DtStack>

        <Heading>Invert mode (default)</Heading>
        <Region className={`${REGION} d-w264`}>
          <Body>Inverted from root (v-dt-mode)</Body>
        </Region>

        <Heading>Nested directives</Heading>
        <Region as="div" mode="dark" className={REGION}>
          <DtStack gap="400">
            <Body>Dark (outer)</Body>
            <Region as="div" mode="invert" className={REGION}>
              <DtStack gap="400">
                <Body>Light — inverted from dark (inner)</Body>
                <Region as="div" mode="invert" className={REGION}>
                  <Body>Dark — inverted again (deepest)</Body>
                </Region>
              </DtStack>
            </Region>
          </DtStack>
        </Region>

        <Heading>Disabled (value = false)</Heading>
        <DtStack direction="row" gap="400" align="start">
            <Region mode={false} className={`${REGION} d-fl1`}>
              <Body>v-dt-mode:invert=&quot;false&quot; — no mode applied</Body>
            </Region>
            <Region mode={enabled ? 'dark' : false} className={`${REGION} d-fl1`}>
              <DtStack gap="400">
                  <Body>v-dt-mode:dark=&quot;{String(enabled)}&quot; — toggle to compare</Body>
                  <DtToggle checked={enabled} onCheckedChange={setEnabled}>
                    Enable mode
                  </DtToggle>
              </DtStack>
            </Region>
        </DtStack>

        <Heading>Dynamic arg</Heading>
        <DtStack gap="400">
            <span className="d-w-200">
              <DtSelectMenu
                label="Mode"
                options={MODE_OPTIONS}
                value={dynamicMode}
                onValueChange={value => setDynamicMode(value as ContentMode)}
              />
            </span>
            <Region mode={dynamicMode} className={`${REGION} d-w264`}>
              <Body>v-dt-mode:{dynamicMode}</Body>
            </Region>
        </DtStack>
    </DtStack>
  );
}

export const argsData = {};

export const argTypesData = {};

// Story Collection
const meta = {
  title: 'Directives/Mode',
  component: ModeDirectiveDefault,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<typeof ModeDirectiveDefault>;

export default meta;
type Story = StoryObj<typeof meta>;

// Stories
export const Default: Story = {
  render: () => <ModeDirectiveDefault />,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
