import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor } from 'storybook/test';
import { DtIcon } from '../Icon';
import { DtStack } from '../Stack';
import { DtText, TEXT_SIZE_MODIFIERS, TEXT_STRENGTH_MODIFIERS } from '../Text';
import { DtSlider, type DtSliderProps, type SliderValue } from './Slider';
import { SLIDER_ORIENTATIONS, SLIDER_READOUT_MODES } from './SliderConstants';

// Vue's slot args are HTML strings, which its template renders through v-html.
type SliderStoryArgs = DtSliderProps & { labelSlot?: string; startSlot?: string; endSlot?: string };

// Default Prop Values
export const argsData = {
  value: 50,
  min: 0,
  max: 100,
  step: 1,
  snapPoints: undefined,
  disabled: false,
  orientation: 'horizontal',
  showTicks: 10,
  minGapSteps: 0,
  label: 'Slider label',
  showLabel: true,
  labelSize: undefined,
  labelStrength: undefined,
  name: '',
  largeStep: 10,
  fillOrigin: 'start',
  readout: 'tooltip',
  onValueChange: action('update:modelValue'),
  onValueCommit: action('change'),
  onFocus: action('focus'),
  onBlur: action('blur'),
} satisfies Partial<SliderStoryArgs>;

// Controls
export const argTypesData = {
  // Slots
  labelSlot: {
    name: 'label',
    description: 'Slot for the label. Defaults to the label prop. Required for accessibility.',
    control: 'text',
    table: {
      category: 'slots',
      type: { summary: 'ReactNode' },
    },
  },
  startSlot: {
    name: 'start',
    description: 'Optional content at the inline-start end of the track (aka left).',
    control: 'text',
    table: {
      category: 'slots',
      type: { summary: 'ReactNode' },
    },
  },
  endSlot: {
    name: 'end',
    description: 'Optional content at the inline-end end of the track (aka right).',
    control: 'text',
    table: {
      category: 'slots',
      type: { summary: 'ReactNode' },
    },
  },

  // Props
  value: {
    description: 'Controlled value. A Number enables single-thumb mode; a Number[] enables range mode.',
    control: { type: 'object' },
    table: {
      category: 'props',
      type: { summary: 'Number | Number[]' },
    },
  },
  min: {
    description: 'Minimum allowed value.',
    control: { type: 'number' },
    table: {
      category: 'props',
      type: { summary: 'Number' },
    },
  },
  max: {
    description: 'Maximum allowed value.',
    control: { type: 'number' },
    table: {
      category: 'props',
      type: { summary: 'Number' },
    },
  },
  step: {
    description: 'Increment/decrement step.',
    control: { type: 'number' },
    table: {
      category: 'props',
      type: { summary: 'Number' },
    },
  },
  snapPoints: {
    description: 'Magnetic snap points the thumb pulls toward while dragging (pointer only — keyboard stepping is unaffected). A Number sets an evenly spaced interval (e.g. 25); a Number[] sets arbitrary, not-necessarily-even values (e.g. [10, 42, 90]). Unlike step, this doesn\'t restrict which values are selectable — a value just outside the snap radius stays freely reachable.',
    control: { type: 'object' },
    table: {
      category: 'props',
      type: { summary: 'Number | Number[]' },
      defaultValue: { summary: 'undefined' },
    },
  },
  disabled: {
    description: 'Disables the slider.',
    control: 'boolean',
    table: {
      category: 'props',
      type: { summary: 'Boolean' },
    },
  },
  orientation: {
    description: 'Track orientation.',
    control: { type: 'select' },
    options: SLIDER_ORIENTATIONS,
    table: {
      category: 'props',
      type: { summary: 'String' },
      defaultValue: { summary: 'horizontal' },
    },
  },
  fillOrigin: {
    description: 'Which end the indicator fills from toward the thumb — start (the default, aka left) or end (aka right). Pass a Number instead to fill outward from that value toward the thumb, useful for balance/pan controls (fillOrigin={50} on a 0–100 range) or deviation displays. Ignored in range mode; a numeric origin is clamped to [min, max].',
    control: { type: 'text' },
    table: {
      category: 'props',
      type: { summary: 'Number | String' },
      defaultValue: { summary: 'start' },
    },
  },
  readout: {
    description: 'Controls the live value readout: a tooltip-styled bubble above the thumb (the default), always visible below the track, or never shown.',
    control: { type: 'select' },
    options: SLIDER_READOUT_MODES,
    table: {
      category: 'props',
      type: { summary: 'String' },
      defaultValue: { summary: 'tooltip' },
    },
  },
  showTicks: {
    description: 'Renders tick marks along the track — true for one per step, or a Number for a custom interval.',
    control: { type: 'text' },
    table: {
      category: 'props',
      type: { summary: 'Boolean | Number' },
      defaultValue: { summary: 'false' },
    },
  },
  minGapSteps: {
    description: 'Minimum gap (in steps) between thumbs in range mode.',
    control: { type: 'number' },
    table: {
      category: 'props',
      type: { summary: 'Number' },
    },
  },
  label: {
    description: 'Visible label text. Required for accessibility.',
    control: 'text',
    // react-docgen reports label as ReactNode; the control sets the string label.
    type: 'string',
    table: {
      category: 'props',
      type: { summary: 'String' },
    },
  },
  showLabel: {
    description: 'When false, removes the label and uses the label text as aria-label. Label content other than a string does not name a hidden-label slider.',
    control: 'boolean',
    table: {
      category: 'props',
      type: { summary: 'Boolean' },
    },
  },
  labelSize: {
    description: 'Overrides the label text size.',
    control: { type: 'select' },
    options: TEXT_SIZE_MODIFIERS.label,
    table: {
      category: 'props',
      type: { summary: 'Number | String' },
      defaultValue: { summary: '300' },
    },
  },
  labelStrength: {
    description: 'Overrides the label font weight.',
    control: { type: 'select' },
    options: Object.keys(TEXT_STRENGTH_MODIFIERS),
    table: {
      category: 'props',
      type: { summary: 'String' },
      defaultValue: { summary: 'semibold (DtText\'s own default for kind="label")' },
    },
  },
  name: {
    description: 'Native name attribute for form submission. In range mode, both inputs share this name.',
    control: 'text',
    table: {
      category: 'props',
      type: { summary: 'String' },
    },
  },
  largeStep: {
    description: 'Approximate distance (same units as step) to move on Page Up/Page Down or Shift+Arrow, rounded to a whole number of steps (at least one).',
    control: { type: 'number' },
    table: {
      category: 'props',
      type: { summary: 'Number' },
      defaultValue: { summary: '10' },
    },
  },
  showMarks: {
    description: 'Text annotations below the track. Off by default; true = min/max only; a Number[] generates marks with auto-text; a { value, text }[] uses custom text.',
    control: { type: 'object' },
    table: {
      category: 'props',
      type: { summary: 'Boolean | Number[] | { value: Number, text: String }[]' },
      defaultValue: { summary: 'false' },
    },
  },
  bodyClass: {
    control: 'text',
    table: { category: 'props' },
  },
  labelClass: {
    control: 'text',
    table: { category: 'props' },
  },
  startClass: {
    control: 'text',
    table: { category: 'props' },
  },
  endClass: {
    control: 'text',
    table: { category: 'props' },
  },
  readoutClass: {
    description: 'Classes for individual and merged readouts in always mode. Ignored in tooltip and never modes.',
    control: 'text',
    if: { arg: 'readout', eq: 'always' },
    table: { category: 'props' },
  },
  getValueText: {
    description: 'Function formatting a value for the readout and aria-valuetext (not marks — see showMarks). Signature: (value, index?) => string. Takes precedence over prefix/suffix.',
    control: false,
    table: {
      category: 'props',
      type: { summary: 'Function' },
    },
  },
  prefix: {
    description: 'Text prepended to the raw number wherever it\'s displayed. Always applied to marks; ignored by the readout/aria-valuetext when getValueText is set.',
    control: 'text',
    table: { category: 'props' },
  },
  suffix: {
    description: 'Text appended to the raw number wherever it\'s displayed. Always applied to marks; ignored by the readout/aria-valuetext when getValueText is set.',
    control: 'text',
    table: { category: 'props' },
  },

  // Action Event Handlers
  onValueChange: {
    table: { disable: true },
  },
  onValueCommit: {
    table: { disable: true },
  },
  onFocus: {
    table: { disable: true },
  },
  onBlur: {
    table: { disable: true },
  },
};

// Story Collection
const meta = {
  title: 'Components/Slider',
  component: DtSlider,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<SliderStoryArgs>;

export default meta;
type Story = StoryObj<SliderStoryArgs>;

const html = (value: string): ReactNode => <span dangerouslySetInnerHTML={{ __html: value }} />;

// SliderDefault.story.vue. The slider keeps its own value, as Vue's does, and follows the value arg when it changes.
function SliderDefault ({ labelSlot, startSlot, endSlot, label, ...props }: SliderStoryArgs) {
  return (
    <DtSlider
      {...props}
      label={labelSlot ? html(labelSlot) : label}
      start={startSlot ? html(startSlot) : undefined}
      end={endSlot ? html(endSlot) : undefined}
    />
  );
}

// The `#label="{ value }"` template the use-case examples share.
function valueLabel (title: string, format: (value: SliderValue) => ReactNode) {
  return function ValueLabel ({ value }: { value: SliderValue }) {
    return (
      <DtStack direction="row" gap="100" justify="space-between" align="baseline">
        <DtText variant="label-md" tone="secondary">{title}</DtText>
        <DtText variant="code-sm" tone="secondary">{format(value)}</DtText>
      </DtStack>
    );
  };
}

const pair = (value: SliderValue) => (Array.isArray(value) ? value : [value, value]);
const NOISE_LEVELS = ['Off', 'Low', 'Medium', 'High', 'Max'];
const minMaxDollars = (value: number, index?: number) => (index === 0 ? `Minimum: $${value}` : `Maximum: $${value}`);

function Section ({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <p className="d-body--sm-compact d-mbe-300 d-fc-tertiary">{title}</p>
      {children}
    </section>
  );
}

// SliderVariants.story.vue, each v-model in its own state.
function SliderVariants () {
  const [singleValue, setSingleValue] = useState<SliderValue>(50);
  const [rangeValue, setRangeValue] = useState<SliderValue>([20, 70]);
  const [iconValue, setIconValue] = useState<SliderValue>(65);
  const [emojiValue, setEmojiValue] = useState<SliderValue>(50);
  const [tickValue, setTickValue] = useState<SliderValue>(7);
  const [canvasZoomValue, setCanvasZoomValue] = useState<SliderValue>(60);
  const [labelsWithBoundariesValue, setLabelsWithBoundariesValue] = useState<SliderValue>(10);
  const [midpointValue, setMidpointValue] = useState<SliderValue>(0);
  const [readoutTooltipValue, setReadoutTooltipValue] = useState<SliderValue>(48);
  const [readoutAlwaysValue, setReadoutAlwaysValue] = useState<SliderValue>(48);
  const [invertedValue, setInvertedValue] = useState<SliderValue>(40);
  const [percentageValue, setPercentageValue] = useState<SliderValue>(0);
  const [verticalValue, setVerticalValue] = useState<SliderValue>(60);
  const [hiddenLabelValue, setHiddenLabelValue] = useState<SliderValue>(50);
  // Use-case examples
  const [durationFilter, setDurationFilter] = useState<SliderValue>([5, 45]);
  const [fontSize, setFontSize] = useState<SliderValue>(16);
  const [noiseCancellation, setNoiseCancellation] = useState<SliderValue>(2);
  const [playbackSpeed, setPlaybackSpeed] = useState<SliderValue>(100);
  const [zoomLevel, setZoomLevel] = useState<SliderValue>(100);
  const [micSensitivity, setMicSensitivity] = useState<SliderValue>(65);
  const [retentionRange, setRetentionRange] = useState<SliderValue>([14, 60]);
  const [batteryThreshold, setBatteryThreshold] = useState<SliderValue>(20);

  return (
    <div id="components-slider--variants-container" className="d-d-flex d-fd-column d-g-500 d-p-500">
      <Section title="Single thumb">
        <DtSlider value={singleValue} onValueChange={setSingleValue} label="Volume" />
      </Section>

      <Section title="Range slider">
        <DtSlider
          value={rangeValue}
          onValueChange={setRangeValue}
          label="Price range"
          showMarks={[{ value: 0, text: 'Min $0' }, { value: 100, text: 'Max $100' }]}
          getValueText={minMaxDollars}
        />
      </Section>

      <Section title="With start and end labels">
        <DtSlider
          value={iconValue}
          onValueChange={setIconValue}
          label="Brightness"
          showMarks={false}
          start={<span>0%</span>}
          end={<span>100%</span>}
        />
      </Section>

      <Section title="Emoji start and end labels">
        <DtSlider
          value={emojiValue}
          onValueChange={setEmojiValue}
          label="Mood"
          showMarks={false}
          start={<span role="img" aria-label="sad">😞</span>}
          end={<span role="img" aria-label="happy">😄</span>}
        />
      </Section>

      <Section title="With ticks">
        <DtSlider value={tickValue} onValueChange={setTickValue} label="Rating" min={0} max={10} step={1} showTicks={1} />
      </Section>

      {/* Magnetic snapping — pulls toward snapPoints while dragging, but a value just outside the snap radius stays
          freely reachable (unlike step's hard grid) */}
      <Section title="Magnetic snapping (arbitrary, non-uniform snap points)">
        <DtSlider
          value={canvasZoomValue}
          onValueChange={setCanvasZoomValue}
          label="Canvas zoom"
          min={10}
          max={400}
          snapPoints={[25, 50, 75, 100, 150, 200, 300]}
          getValueText={(value) => `${value}%`}
          suffix="%"
        />
      </Section>

      <Section title="Start/end slots with marks">
        <DtSlider
          value={labelsWithBoundariesValue}
          onValueChange={setLabelsWithBoundariesValue}
          label="Temperature"
          min={-20}
          max={40}
          showMarks={[-20, 0, 40]}
          start={<span role="img" aria-label="cold">❄️</span>}
          end={<span role="img" aria-label="hot">🔥</span>}
        />
      </Section>

      <Section title="Marks at arbitrary positions">
        <DtSlider
          value={midpointValue}
          onValueChange={setMidpointValue}
          label="Balance"
          min={-100}
          max={100}
          fillOrigin={0}
          showMarks={[{ value: -100, text: '−100' }, { value: 0, text: '0' }, { value: 100, text: '100' }]}
          showTicks={25}
        />
      </Section>

      <Section title="Value readout — tooltip (the default; hover, drag, or focus to show)">
        <DtSlider value={readoutTooltipValue} onValueChange={setReadoutTooltipValue} label="Volume" />
      </Section>

      <Section title="Value readout — always">
        <DtSlider value={readoutAlwaysValue} onValueChange={setReadoutAlwaysValue} label="Volume" readout="always" />
      </Section>

      <Section title={'Fill from end (fill-origin="end")'}>
        <DtSlider value={invertedValue} onValueChange={setInvertedValue} label="Download limit" fillOrigin="end" />
      </Section>

      <Section title="Fill from origin — percentage selector">
        <DtSlider
          value={percentageValue}
          onValueChange={setPercentageValue}
          min={-100}
          max={100}
          step={1}
          fillOrigin={0}
          showMarks={[{ value: -100, text: '-100%' }, { value: 0, text: '0%' }, { value: 100, text: '100%' }]}
          readout="never"
          label={valueLabel('Percentage', (value) => `${value}%`)}
        />
      </Section>

      <Section title="Disabled — single">
        <DtSlider value={30} label="Volume (disabled)" disabled />
      </Section>

      <Section title="Disabled — range">
        <DtSlider value={[20, 80]} label="Price range (disabled)" getValueText={minMaxDollars} disabled />
      </Section>

      <Section title="Vertical orientation">
        <div className="d-d-flex d-g-600">
          <DtSlider value={verticalValue} onValueChange={setVerticalValue} label="Height" orientation="vertical" />
          <DtSlider
            value={[30, 70]}
            label="Range vertical"
            orientation="vertical"
            getValueText={(value, index) => (index === 0 ? `Min: ${value}` : `Max: ${value}`)}
          />
        </div>
      </Section>

      <Section title="Use-case examples">
        <div className="d-d-flex d-fd-column d-g-500">
          {/* Call duration filter — range mode, formatted time output */}
          <DtSlider
            value={durationFilter}
            onValueChange={setDurationFilter}
            min={0}
            max={120}
            step={1}
            getValueText={(value, index) => (index === 0 ? `Start: ${value} min` : `End: ${value} min`)}
            readout="never"
            label={valueLabel('Call duration filter', (value) => `${pair(value)[0]}–${pair(value)[1]} min`)}
          />

          {/* Chat font size — discrete steps with ticks, formatted "px" output */}
          <DtSlider
            value={fontSize}
            onValueChange={setFontSize}
            min={12}
            max={32}
            step={2}
            showTicks={2}
            showMarks
            readout="never"
            label={valueLabel('Chat text size', (value) => `${value}px`)}
            start={<DtIcon name="font-size" size="100" />}
            end={<DtIcon name="font-size" size="400" />}
          />

          {/* Noise cancellation — 5 named discrete levels with ticks */}
          <DtSlider
            value={noiseCancellation}
            onValueChange={setNoiseCancellation}
            min={0}
            max={4}
            step={1}
            showTicks={1}
            showMarks={[{ value: 0, text: 'Off' }, { value: 4, text: 'Max' }]}
            getValueText={(value) => NOISE_LEVELS[value]}
            readout="never"
            label={valueLabel('Noise cancellation', (value) => NOISE_LEVELS[Number(value)])}
            start={<DtIcon name="volume-1" size="200" />}
            end={<DtIcon name="volume-x" size="200" />}
          />

          {/* Playback speed — discrete steps, formatted "×" multiplier output */}
          <DtSlider
            value={playbackSpeed}
            onValueChange={setPlaybackSpeed}
            min={25}
            max={200}
            step={25}
            showTicks={25}
            readout="never"
            label={valueLabel('Playback speed', (value) => `${(Number(value) / 100).toFixed(2)}×`)}
            start="🐢"
            end="🐇"
          />

          {/* Zoom level — discrete steps with ticks and marks */}
          <DtSlider
            value={zoomLevel}
            onValueChange={setZoomLevel}
            min={50}
            max={200}
            step={25}
            showTicks={25}
            showMarks={[50, 100, 150, 200]}
            readout="never"
            label={valueLabel('Zoom level', (value) => `${value}%`)}
            start={<DtIcon name="zoom-out" size="200" />}
            end={<DtIcon name="zoom-in" size="200" />}
          />

          {/* Mic sensitivity — single thumb, percentage output */}
          <DtSlider
            value={micSensitivity}
            onValueChange={setMicSensitivity}
            min={0}
            max={100}
            step={5}
            readout="never"
            label={valueLabel('Mic sensitivity', (value) => `${value}%`)}
            start={<DtIcon name="mic-off" size="200" />}
            end={<DtIcon name="mic" size="200" />}
          />

          {/* Auto-delete recordings after — range mode, day-count output */}
          <DtSlider
            value={retentionRange}
            onValueChange={setRetentionRange}
            min={1}
            max={90}
            step={1}
            showMarks={[1, 30, 60, 90]}
            getValueText={(value, index) => (index === 0 ? `From day ${value}` : `To day ${value}`)}
            readout="never"
            label={valueLabel('Auto-delete recordings after', (value) => `${pair(value)[0]}–${pair(value)[1]} days`)}
            start={<DtIcon name="calendar-range" size="200" />}
            end={<DtIcon name="trash" size="200" />}
          />

          {/* Battery saver threshold — single thumb, low-end warning range */}
          <DtSlider
            value={batteryThreshold}
            onValueChange={setBatteryThreshold}
            min={5}
            max={50}
            step={5}
            showTicks={5}
            readout="never"
            label={valueLabel('Battery saver threshold', (value) => `${value}%`)}
            start={<DtIcon name="battery-low" size="200" />}
            end={<DtIcon name="battery-full" size="200" />}
          />
        </div>
      </Section>

      <Section title="Label hidden (visually, still in DOM)">
        <DtSlider
          value={hiddenLabelValue}
          onValueChange={setHiddenLabelValue}
          label="This label is for screen readers only"
          showLabel={false}
        />
      </Section>
    </div>
  );
}

export const Default: Story = {
  render: args => <SliderDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: () => <SliderVariants />,
  args: {},
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false,
          },
        ],
      },
    },
  },
};

function TooltipClippingStory () {
  const [value, setValue] = useState<SliderValue>(50);
  return (
    <div className="d-p32">
      <div
        style={{
          overflow: 'hidden', transform: 'translateZ(0)', clipPath: 'inset(0)', maskImage: 'linear-gradient(#000, #000)',
        }}
      >
        <div className="d-py16" style={{ overflow: 'clip' }}>
          <DtSlider
            value={value}
            onValueChange={setValue}
            label="Value inside clipping ancestors"
            getValueText={(v) => `Formatted value ${v} with additional localized context. `.repeat(200)}
          />
        </div>
      </div>
      <button className="d-btn d-btn--outlined d-mt16" data-qa="slider-tooltip-next-control">Next control</button>
    </div>
  );
}

export const TooltipClipping: Story = {
  render: () => <TooltipClippingStory />,
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector<HTMLInputElement>('[data-qa="dt-slider-thumb"]')!;
    const anchor = canvasElement.querySelector<HTMLElement>('[data-qa="dt-slider-thumb-visual"]')!;
    const tooltip = canvasElement.querySelector<HTMLElement>('[data-qa="dt-slider-thumb-readout-tooltip"]')!;
    const next = canvasElement.querySelector<HTMLElement>('[data-qa="slider-tooltip-next-control"]')!;
    const view = canvasElement.ownerDocument.defaultView!;
    input.focus();
    try {
      await waitFor(() => {
        expect(tooltip.matches(':popover-open')).toBe(true);
        expect(tooltip.inert).toBe(true);
        expect(view.getComputedStyle(tooltip).visibility).toBe('visible');
        expect(view.getComputedStyle(tooltip.firstElementChild!).overflow).toBe('hidden');
        const bubble = tooltip.getBoundingClientRect();
        const thumb = anchor.getBoundingClientRect();
        expect(bubble.bottom <= thumb.top || bubble.top >= thumb.bottom ||
          bubble.right <= thumb.left || bubble.left >= thumb.right).toBe(true);
        expect(bubble.left).toBeGreaterThanOrEqual(0);
        expect(bubble.top).toBeGreaterThanOrEqual(0);
        expect(bubble.right).toBeLessThanOrEqual(view.innerWidth);
        expect(bubble.bottom).toBeLessThanOrEqual(view.innerHeight);
        expect(input.getAttribute('aria-valuetext')).toBe(tooltip.textContent);
      });
      await userEvent.tab();
      expect(canvasElement.ownerDocument.activeElement).toBe(next);
      await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(false));
    } finally {
      input.blur();
      next.blur();
    }
  },
};
