import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { DtButton } from '../Button/Button';
import { DtStack } from '../Stack/Stack';
import { DtMotionText, type DtMotionTextHandle, type DtMotionTextProps } from './MotionText';
import {
  MOTION_TEXT_ANIMATION_MODES,
  MOTION_TEXT_SPEEDS,
  type MotionTextAnimationMode,
} from './MotionTextConstants';

type MotionTextStoryArgs = DtMotionTextProps;

// Default Prop Values
export const argsData = {
  // Reference sentence used by the "Motion-Text-Effects" Figma spec
  text: 'The AI platform for customer experience',
  animationMode: 'gradient-in',
  speed: '300',
  autoStart: true,
  loop: false,
  respectsReducedMotion: true,
  screenReaderText: '',
  onStart: action('start'),
  onComplete: action('complete'),
  onProgress: action('progress'),
  onPause: action('pause'),
  onResume: action('resume'),
} satisfies Partial<MotionTextStoryArgs>;

export const argTypesData = {
  // Props
  text: {
    control: 'text',
    description: 'The text content to animate. Text is split into words and animated word by word.',
    table: {
      category: 'props',
      type: {
        summary: 'string',
      },
    },
  },
  animationMode: {
    control: {
      type: 'select',
    },
    options: [...MOTION_TEXT_ANIMATION_MODES],
    description: 'The word-by-word animation to play. gradient-in, fade-in, slide-in and slide-in-gradient reveal ' +
      'the text; gradient-sweep and shimmer play over text that is already visible.',
    table: {
      category: 'props',
      type: {
        summary: MOTION_TEXT_ANIMATION_MODES.join(' | '),
      },
      defaultValue: {
        summary: 'gradient-in',
      },
    },
  },
  speed: {
    control: {
      type: 'select',
    },
    options: [...MOTION_TEXT_SPEEDS],
    description: 'Animation speed. 300 plays the motion as designed; lower values are faster and higher values are slower.',
    table: {
      category: 'props',
      type: {
        summary: MOTION_TEXT_SPEEDS.join(' | '),
      },
      defaultValue: {
        summary: '300',
      },
    },
  },
  autoStart: {
    control: 'boolean',
    description: 'Whether to start animation automatically when component is mounted',
    table: {
      category: 'props',
      type: {
        summary: 'boolean',
      },
      defaultValue: {
        summary: 'true',
      },
    },
  },
  loop: {
    control: 'boolean',
    description: 'Whether to loop the animation. Each cycle holds briefly after the last word settles, ' +
      'then every word restarts together.',
    table: {
      category: 'props',
      type: {
        summary: 'boolean',
      },
      defaultValue: {
        summary: 'false',
      },
    },
  },
  respectsReducedMotion: {
    control: 'boolean',
    description: 'Whether to respect the user\'s prefers-reduced-motion system setting',
    table: {
      category: 'props',
      type: {
        summary: 'boolean',
      },
      defaultValue: {
        summary: 'true',
      },
    },
  },
  screenReaderText: {
    control: 'text',
    description: 'Alternative text for screen readers',
    table: {
      category: 'props',
      type: {
        summary: 'string',
      },
    },
  },

  // Slots
  children: {
    name: 'children',
    description: 'Text content to animate when not using the text prop. Only the text is animated; markup is not preserved.',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'ReactNode',
      },
    },
  },

  // Action Event Handlers
  onStart: {
    description: 'Called when the animation starts, and again at the start of each looped cycle',
    table: {
      category: 'events',
      type: {
        summary: '() => void',
      },
    },
  },
  onComplete: {
    description: 'Called when the animation completes, and at the end of each looped cycle',
    table: {
      category: 'events',
      type: {
        summary: '() => void',
      },
    },
  },
  onProgress: {
    description: 'Called as each word finishes animating, with wordsComplete, totalWords, and progress (0 to 1)',
    table: {
      category: 'events',
      type: {
        summary: '(progress) => void',
        detail: '{ wordsComplete: number, totalWords: number, progress: number }',
      },
    },
  },
  onPause: {
    description: 'Called when the animation is paused',
    table: {
      category: 'events',
      type: {
        summary: '() => void',
      },
    },
  },
  onResume: {
    description: 'Called when the animation resumes',
    table: {
      category: 'events',
      type: {
        summary: '() => void',
      },
    },
  },
} satisfies Meta<MotionTextStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Motion Text',
  component: DtMotionText,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<MotionTextStoryArgs>;

export default meta;
type Story = StoryObj<MotionTextStoryArgs>;

/** Vue's `ref.reset(); $nextTick(() => ref.start())`. The handle's methods see each other's state at once. */
const restart = (motionText: DtMotionTextHandle | null | undefined) => {
  if (motionText) {
    motionText.reset();
    motionText.start();
  }
};

const formatLabel = (mode: string) => mode.split('-').map(word =>
  word.charAt(0).toUpperCase() + word.slice(1),
).join(' ');

// MotionTextDefault.story.vue
function MotionTextDefault (args: MotionTextStoryArgs) {
  // Keyed on the animation settings so changing a control replays the animation
  const replayKey = [args.text, args.children ?? '', args.animationMode, args.speed, args.loop].map(String).join('|');

  return (
    <DtStack
      direction="row"
      align="center"
      className="d-hmn-400 d-p-300"
    >
      <DtMotionText
        key={replayKey}
        text={args.text}
        animationMode={args.animationMode}
        speed={args.speed}
        autoStart={args.autoStart}
        loop={args.loop}
        respectsReducedMotion={args.respectsReducedMotion}
        screenReaderText={args.screenReaderText}
        className="d-headline--xl"
        onStart={args.onStart}
        onComplete={args.onComplete}
        onProgress={args.onProgress}
        onPause={args.onPause}
        onResume={args.onResume}
      >
        {args.children}
      </DtMotionText>
    </DtStack>
  );
}

const MODE_DESCRIPTIONS: Partial<Record<MotionTextAnimationMode, string>> = {
  'gradient-in': 'Each word fades in showing its slice of a purple-to-orange gradient, then settles into the text color',
  'fade-in': 'Each word fades in, one after another',
  'slide-in': 'Each word fades in while rising into place',
  'slide-in-gradient': 'Each word rises into place showing its slice of a purple-to-orange gradient, then settles ' +
    'into the text color',
  'gradient-sweep': 'Text stays visible while a purple-to-orange gradient sweeps across it word by word, holds, ' +
    'and fades back',
  shimmer: 'Text stays visible while a dimmed band sweeps left to right across it',
};

// MotionTextModes.story.vue
function MotionTextModes () {
  const modeRefs = useRef<Partial<Record<MotionTextAnimationMode, DtMotionTextHandle | null>>>({});
  // Reference sentence used by the "Motion-Text-Effects" Figma spec
  const exampleText = 'The AI platform for customer experience';
  // `none` has no motion to show
  const animationModes = MOTION_TEXT_ANIMATION_MODES.filter(mode => mode !== 'none').map(mode => ({
    value: mode,
    label: formatLabel(mode),
    description: MODE_DESCRIPTIONS[mode] || '',
  }));

  return (
    <DtStack
      gap="300"
      className="d-p-300"
    >
      {animationModes.map(mode => (
        <DtStack
          key={mode.value}
          gap="100"
        >
          <DtStack
            direction="row"
            align="center"
            justify="between"
          >
            <h3 className="d-headline--md">
              {mode.label} Mode
            </h3>
            <DtButton
              size={200}
              importance="outlined"
              kind="muted"
              onClick={() => restart(modeRefs.current[mode.value])}
            >
              Restart
            </DtButton>
          </DtStack>
          <p className="d-body--sm d-fc-tertiary">
            {mode.description}
          </p>
          <DtStack
            direction="row"
            align="center"
            className="d-p-300 d-bar-400 d-ba d-bc-subtle d-bgc-secondary d-hmn-200"
          >
            {/* Every mode loops, like the Figma prototypes, so they can be compared side by side */}
            <DtMotionText
              ref={(el) => { if (el) modeRefs.current[mode.value] = el; }}
              text={exampleText}
              animationMode={mode.value}
              loop
              className="d-headline--xl"
            />
          </DtStack>
        </DtStack>
      ))}
    </DtStack>
  );
}

const SPEED_LABELS: Record<string, string> = {
  100: 'Fastest',
  200: 'Fast',
  300: 'Default',
  400: 'Slow',
  500: 'Slowest',
};

const TEXT_SIZES = [
  { class: 'd-headline--xxl', label: 'Headline XXL' },
  { class: 'd-headline--xl', label: 'Headline XL' },
  { class: 'd-headline--lg', label: 'Headline Large' },
  { class: 'd-headline--md', label: 'Headline Medium' },
  { class: 'd-body--lg', label: 'Body Large' },
  { class: 'd-body--md', label: 'Body Medium' },
  { class: 'd-body--sm', label: 'Body Small' },
];

const MANUAL_CONTROLS = [
  { method: 'start', label: 'Start' },
  { method: 'pause', label: 'Pause' },
  { method: 'resume', label: 'Resume' },
  { method: 'reset', label: 'Reset' },
  { method: 'skipToEnd', label: 'Skip to End' },
] as const;

// MotionTextVariants.story.vue
function MotionTextVariants () {
  const speedRefs = useRef<Record<string, DtMotionTextHandle | null>>({});
  const sizeRefs = useRef<Record<string, DtMotionTextHandle | null>>({});
  const manualRef = useRef<DtMotionTextHandle>(null);
  const speeds = MOTION_TEXT_SPEEDS.map(speed => ({
    value: speed,
    label: SPEED_LABELS[speed] || speed,
  }));

  return (
    <DtStack
      gap="400"
      className="d-p-300"
    >
      {/* Speed Variants */}
      <section>
        <h2 className="d-headline--lg d-mbe-200">
          Speed Variants
        </h2>
        <DtStack gap="200">
          {speeds.map(speed => (
            <DtStack
              key={speed.value}
              gap="100"
            >
              <DtStack
                direction="row"
                align="center"
                justify="between"
              >
                <h3 className="d-headline--md">
                  {speed.label} ({speed.value})
                </h3>
                <DtButton
                  size={200}
                  importance="outlined"
                  kind="muted"
                  onClick={() => restart(speedRefs.current[speed.value])}
                >
                  Restart
                </DtButton>
              </DtStack>
              <DtStack
                direction="row"
                align="center"
                className="d-p-200 d-bar-400 d-ba d-bc-subtle d-bgc-secondary d-hmn-150"
              >
                <DtMotionText
                  ref={(el) => { if (el) speedRefs.current[speed.value] = el; }}
                  text="Quick brown fox jumps"
                  animationMode="gradient-in"
                  speed={speed.value}
                  className="d-body--lg"
                />
              </DtStack>
            </DtStack>
          ))}
        </DtStack>
      </section>

      {/* Text Size Variants */}
      <section>
        <h2 className="d-headline--lg d-mbe-200">
          Text Size Variants
        </h2>
        <DtStack gap="200">
          {TEXT_SIZES.map(size => (
            <DtStack
              key={size.class}
              gap="100"
            >
              <DtStack
                direction="row"
                align="center"
                justify="between"
              >
                <h3 className="d-headline--md">
                  {size.label}
                </h3>
                <DtButton
                  size={200}
                  importance="outlined"
                  kind="muted"
                  onClick={() => restart(sizeRefs.current[size.class])}
                >
                  Restart
                </DtButton>
              </DtStack>
              <DtStack
                direction="row"
                align="center"
                className="d-p-200 d-bar-400 d-ba d-bc-subtle d-bgc-secondary d-hmn-150"
              >
                <DtMotionText
                  ref={(el) => { if (el) sizeRefs.current[size.class] = el; }}
                  text="Animated text"
                  animationMode="slide-in-gradient"
                  className={size.class}
                />
              </DtStack>
            </DtStack>
          ))}
        </DtStack>
      </section>

      {/* Looping Animation */}
      <section>
        <h2 className="d-headline--lg d-mbe-200">
          Looping Animation
        </h2>
        <DtStack
          direction="row"
          align="center"
          className="d-p-300 d-bar-400 d-ba d-bc-subtle d-bgc-secondary d-hmn-200"
        >
          <DtMotionText
            text="This text loops continuously"
            animationMode="slide-in"
            loop
            className="d-headline--md"
          />
        </DtStack>
      </section>

      {/* Manual Controls */}
      <section>
        <h2 className="d-headline--lg d-mbe-200">
          Manual Controls
        </h2>
        <DtStack gap="200">
          <DtStack
            direction="row"
            gap="100"
            className="d-fw-wrap"
          >
            {MANUAL_CONTROLS.map(control => (
              <DtButton
                key={control.method}
                size={200}
                importance="outlined"
                onClick={() => manualRef.current?.[control.method]()}
              >
                {control.label}
              </DtButton>
            ))}
          </DtStack>
          <DtStack
            direction="row"
            align="center"
            className="d-p-300 d-bar-400 d-ba d-bc-subtle d-bgc-secondary d-hmn-200"
          >
            <DtMotionText
              ref={manualRef}
              text="Control me with the buttons above"
              animationMode="gradient-in"
              speed={400}
              autoStart={false}
              className="d-headline--md"
            />
          </DtStack>
        </DtStack>
      </section>
    </DtStack>
  );
}

export const Default: Story = {
  render: args => <MotionTextDefault {...args} />,
  args: {},
};

export const Modes: Story = {
  render: () => <MotionTextModes />,
  args: {},
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};

export const Variants: Story = {
  render: () => <MotionTextVariants />,
  args: {},
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
