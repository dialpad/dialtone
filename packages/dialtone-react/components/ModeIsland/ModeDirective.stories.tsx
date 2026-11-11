import { useId, useRef, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StandIn } from '../../.storybook/StandIn';
import type { ContentMode } from '../../common/mode_constants';
import { DtText } from '../Text/Text';
import { DtValidationMessages } from '../ValidationMessages/ValidationMessages';
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
  // A div ref fits both tags: the hook only needs an Element.
  const ref = useRef<HTMLDivElement>(null);
  useModeRegion(ref, mode);
  return <Tag ref={ref} className={className}>{children}</Tag>;
}

function Swatches () {
  return (
    <StandIn for="stack">
      <div data-qa="dt-stack" className="d-stack d-stack--row d-stack--gap-400">
        <span className="d-fc-primary">Primary</span>
        <span className="d-fc-tertiary">Tertiary</span>
        <span className="d-fc-positive">Positive</span>
        <span className="d-fc-critical">Critical</span>
      </div>
    </StandIn>
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
  const toggleId = useId();

  return (
    <StandIn for="stack">
      <div data-qa="dt-stack" className="d-stack d-stack--column d-stack--gap-200 d-p-100">
        <Heading>Explicit modes</Heading>
        <StandIn for="stack">
          <div data-qa="dt-stack" className="d-stack d-stack--row d-stack--gap-500">
            <Region mode="light" className={`${REGION} d-fl1`}>
              <StandIn for="stack">
                <div data-qa="dt-stack" className="d-stack d-stack--column d-stack--gap-400">
                  <Body>Light mode (v-dt-mode:light)</Body>
                  <Swatches />
                </div>
              </StandIn>
            </Region>
            <Region mode="dark" className={`${REGION} d-fl1`}>
              <StandIn for="stack">
                <div data-qa="dt-stack" className="d-stack d-stack--column d-stack--gap-400">
                  <Body>Dark mode (v-dt-mode:dark)</Body>
                  <Swatches />
                </div>
              </StandIn>
            </Region>
          </div>
        </StandIn>

        <Heading>Invert mode (default)</Heading>
        <Region className={`${REGION} d-w264`}>
          <Body>Inverted from root (v-dt-mode)</Body>
        </Region>

        <Heading>Nested directives</Heading>
        <Region as="div" mode="dark" className={REGION}>
          <StandIn for="stack">
            <div data-qa="dt-stack" className="d-stack d-stack--column d-stack--gap-400">
              <Body>Dark (outer)</Body>
              <Region as="div" mode="invert" className={REGION}>
                <StandIn for="stack">
                  <div data-qa="dt-stack" className="d-stack d-stack--column d-stack--gap-400">
                    <Body>Light — inverted from dark (inner)</Body>
                    <Region as="div" mode="invert" className={REGION}>
                      <Body>Dark — inverted again (deepest)</Body>
                    </Region>
                  </div>
                </StandIn>
              </Region>
            </div>
          </StandIn>
        </Region>

        <Heading>Disabled (value = false)</Heading>
        <StandIn for="stack">
          <div data-qa="dt-stack" className="d-stack d-stack--row d-stack--gap-400 d-stack--align-start">
            <Region mode={false} className={`${REGION} d-fl1`}>
              <Body>v-dt-mode:invert=&quot;false&quot; — no mode applied</Body>
            </Region>
            <Region mode={enabled ? 'dark' : false} className={`${REGION} d-fl1`}>
              <StandIn for="stack">
                <div data-qa="dt-stack" className="d-stack d-stack--column d-stack--gap-400">
                  <Body>v-dt-mode:dark=&quot;{String(enabled)}&quot; — toggle to compare</Body>
                  <StandIn for="toggle">
                    <div className="d-toggle-wrapper">
                      <button
                        id={toggleId}
                        role="switch"
                        type="button"
                        aria-checked={enabled}
                        aria-disabled="false"
                        className={enabled ? 'd-toggle d-toggle--checked' : 'd-toggle'}
                        aria-label="Enable mode"
                        {...{ label: 'Enable mode' }}
                        onClick={() => setEnabled(!enabled)}
                      >
                        <span className="d-toggle__inner" />
                      </button>
                    </div>
                  </StandIn>
                </div>
              </StandIn>
            </Region>
          </div>
        </StandIn>

        <Heading>Dynamic arg</Heading>
        <StandIn for="stack">
          <div data-qa="dt-stack" className="d-stack d-stack--column d-stack--gap-400">
            <span className="d-w-200">
              <StandIn for="select-menu">
                <div className="">
                  <label>
                    <div data-qa="dt-select-label" className="d-text d-text-label--md d-text--tone-secondary d-select__label-text">Mode</div>
                    <div className="d-select" data-qa="dt-select-wrapper">
                      <select
                        className="d-select__input"
                        data-qa="dt-select"
                        value={dynamicMode}
                        onChange={event => setDynamicMode(event.target.value as ContentMode)}
                      >
                        {MODE_OPTIONS.map(option => (
                          <option key={option.value} className="" value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </label>
                  <DtValidationMessages data-qa="dt-select-messages" validationMessages={[]} />
                </div>
              </StandIn>
            </span>
            <Region mode={dynamicMode} className={`${REGION} d-w264`}>
              <Body>v-dt-mode:{dynamicMode}</Body>
            </Region>
          </div>
        </StandIn>
      </div>
    </StandIn>
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
