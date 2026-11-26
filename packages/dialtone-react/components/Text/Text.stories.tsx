import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { DtListItem } from '../ListItem';
import { DtStack } from '../Stack';
import { useTooltipDirective } from '../Tooltip';
import { DtText, type DtTextProps } from './Text';
import {
  TEXT_KIND_MODIFIERS,
  TEXT_VARIANT_MODIFIERS,
  TEXT_FONT_SIZE_MODIFIERS,
  TEXT_FAMILY_MODIFIERS,
  TEXT_ALIGN_MODIFIERS,
  TEXT_TONE_MODIFIERS,
  TEXT_STRENGTH_MODIFIERS,
  TEXT_DENSITY_MODIFIERS,
  TEXT_WRAP_MODIFIERS,
  TEXT_BOX_TRIM_MODIFIERS,
  TEXT_SIZE_MODIFIERS,
  TEXT_SLIDE_MODES,
  type TextAlign,
  type TextBoxTrim,
  type TextDensity,
  type TextStrength,
  type TextTone,
  type TextWrap,
} from './TextConstants';

// The default slot is an arg named `default`, as in Vue, so both Storybooks share the arg.
type TextStoryArgs = DtTextProps & { default?: string };

const kindOptions = [undefined, ...Object.keys(TEXT_KIND_MODIFIERS)];
const variantOptions = [undefined, ...Object.keys(TEXT_VARIANT_MODIFIERS)];
const sizeOptions = [undefined, ...Object.keys(TEXT_FONT_SIZE_MODIFIERS)];
const familyOptions = [undefined, ...Object.keys(TEXT_FAMILY_MODIFIERS)];
const alignOptions = [undefined, ...Object.keys(TEXT_ALIGN_MODIFIERS)];
const strengthOptions = [undefined, ...Object.keys(TEXT_STRENGTH_MODIFIERS)];
const densityOptions = [undefined, ...Object.keys(TEXT_DENSITY_MODIFIERS)];
const wrapOptions = [undefined, ...Object.keys(TEXT_WRAP_MODIFIERS)];
const toneOptions = [undefined, ...Object.keys(TEXT_TONE_MODIFIERS)];
const slideOptions = [false, true, ...TEXT_SLIDE_MODES];
const textBoxTrimOptions = [undefined, ...Object.keys(TEXT_BOX_TRIM_MODIFIERS)];

export const argsData = {
  default: 'The quick brown fox jumps over the lazy dog.',
  as: 'span',
  kind: undefined,
  variant: 'body-md',
  size: undefined,
  family: undefined,
  italic: false,
  strength: undefined,
  density: undefined,
  tone: undefined,
  align: undefined,
  truncate: false,
  maxLines: undefined,
  slide: false,
  numeric: false,
  onClick: action('click'),
} satisfies Partial<TextStoryArgs>;

// `type` (not in Vue's argTypes) is set on every prop react-docgen reports as a union: Storybook drops a URL value
// for a union arg, so without it the comparison couldn't drive these args in the React frame.
export const argTypesData = {
  default: {
    control: 'text',
    table: {
      type: { summary: 'VNode' },
    },
  },
  as: {
    control: 'text',
    type: 'string',
  },
  kind: {
    options: kindOptions,
    control: { type: 'select' },
    description: 'Legacy composition prop. Prefer variant for new usage.',
    type: 'string',
  },
  variant: {
    options: variantOptions,
    control: { type: 'select' },
    type: 'string',
  },
  size: {
    options: sizeOptions,
    control: { type: 'select' },
    type: 'string',
  },
  family: {
    options: familyOptions,
    control: { type: 'select' },
    type: 'string',
  },
  italic: {
    control: 'boolean',
  },
  strength: {
    options: strengthOptions,
    control: { type: 'select' },
    type: 'string',
  },
  density: {
    options: densityOptions,
    control: { type: 'select' },
    type: 'string',
  },
  tone: {
    options: toneOptions,
    control: { type: 'select' },
    type: 'string',
  },
  align: {
    options: alignOptions,
    control: { type: 'select' },
    type: 'string',
  },
  truncate: {
    control: 'boolean',
  },
  maxLines: {
    control: { type: 'number', min: 1 },
    type: 'number',
  },
  slide: {
    options: slideOptions,
    control: { type: 'select' },
    description:
      'Slides overflowing single-line text into view on hover or focus. Needs a narrow block container to show.',
  },
  numeric: {
    control: 'boolean',
  },
  wrap: {
    options: wrapOptions,
    control: { type: 'select' },
    description:
      'wrap: default | nowrap: prevent wrapping | balance: even line lengths | pretty: avoid orphans/widows',
    type: 'string',
  },
  textBoxTrim: {
    options: textBoxTrimOptions,
    control: { type: 'select' },
    description:
      'start: trim above | end: trim below | both: trim above and below. CSS text-box-trim for tighter layouts.',
    type: 'string',
  },
  onClick: {
    table: {
      disable: true,
    },
  },
} satisfies Meta<TextStoryArgs>['argTypes'];

const meta = {
  title: 'Components/Text',
  component: DtText,
  args: argsData,
  argTypes: argTypesData,
  parameters: {
    docs: {
      description: {
        component:
          'The Dialtone typography primitive. `DtText` maps `variant`, `size`, `tone`, and `align` to token-backed classes and supports structural helpers like `as`, truncation, multi-line clamping, and numeric tabular figures. `kind` remains available as legacy composition syntax.',
      },
    },
  },
  excludeStories: /.*Data$/,
} satisfies Meta<TextStoryArgs>;

export default meta;
type Story = StoryObj<TextStoryArgs>;

// TextDefault.story.vue
function TextDefault ({ default: defaultSlot, ...args }: TextStoryArgs) {
  return (
    <DtText
      as={args.as}
      kind={args.kind}
      variant={args.variant}
      size={args.size}
      family={args.family}
      italic={args.italic}
      strength={args.strength}
      density={args.density}
      tone={args.tone}
      align={args.align}
      truncate={args.truncate}
      maxLines={args.maxLines}
      slide={args.slide}
      numeric={args.numeric}
      wrap={args.wrap}
      textBoxTrim={args.textBoxTrim}
      onClick={args.onClick}
    >
      {defaultSlot || undefined}
    </DtText>
  );
}

// TextVariants.story.vue
const strengthExamples: { strength: TextStrength; copy: string }[] = [
  { strength: 'bold', copy: 'Bold' },
  { strength: 'semibold', copy: 'Semibold' },
  { strength: 'medium', copy: 'Medium' },
  { strength: 'normal', copy: 'Normal' },
];

const densityExamples: { density: TextDensity; copy: string }[] = [
  { density: 100, copy: 'Lorem ipsume dolor sit amet gemino quis consectuar.' },
  { density: 200, copy: 'Lorem ipsume dolor sit amet gemino quis consectuar.' },
  { density: 300, copy: 'Lorem ipsume dolor sit amet gemino quis consectuar.' },
  { density: 400, copy: 'Lorem ipsume dolor sit amet gemino quis consectuar.' },
  { density: 500, copy: 'Lorem ipsume dolor sit amet gemino quis consectuar.' },
  { density: 600, copy: 'Lorem ipsume dolor sit amet gemino quis consectuar.' },
];

const toneExamples: { key: string; props: { kind: 'body'; tone?: TextTone }; copy: string }[] = [
  { key: 'default', props: { kind: 'body' }, copy: 'Default tone' },
  { key: 'muted', props: { kind: 'body', tone: 'muted' }, copy: 'Muted tone' },
  { key: 'positive', props: { kind: 'body', tone: 'positive' }, copy: 'Positive tone' },
  { key: 'warning', props: { kind: 'body', tone: 'warning' }, copy: 'Warning tone' },
  { key: 'critical', props: { kind: 'body', tone: 'critical' }, copy: 'Critical tone' },
  { key: 'info', props: { kind: 'body', tone: 'info' }, copy: 'Info tone' },
  { key: 'info-strong', props: { kind: 'body', tone: 'info-strong' }, copy: 'Info strong tone' },
];

const alignExamples: { align: TextAlign; copy: string }[] = [
  { align: 'start', copy: 'Start aligned text follows the left edge in LTR contexts.' },
  { align: 'center', copy: 'Center aligned text works well for callouts.' },
  { align: 'end', copy: 'End aligned text pairs nicely with numeric values.' },
  { align: 'justify', copy: 'Justified text distributes words evenly across the full width of the container.' },
];

const wrapExamples: { wrap: TextWrap; copy: string }[] = [
  { wrap: 'wrap', copy: 'Default wrapping behavior for text content. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dolore placeat deleniti, corporis in expedita! Sapiente voluptatem ad expedita, deserunt quisquam quasi, est perferendis impedit fuga nobis ducimus odio in! Animi eaque ex aliquam adipisci aspernatur cum nemo? Placeat asperiores, ex labore similique porro alias cum unde perferendis repudiandae. Sit aut qui alias necessitatibus? Ex voluptates corrupti adipisci unde eos? Quos id cupiditate enim ducimus nihil quidem corporis molestiae! Quod accusamus eveniet dolores ut possimus fugit, doloribus ipsam officiis?' },
  { wrap: 'nowrap', copy: 'No wrapping allowed here. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dolore placeat deleniti, corporis in expedita! Sapiente voluptatem ad expedita, deserunt quisquam quasi, est perferendis impedit fuga nobis ducimus odio in! Animi eaque ex aliquam adipisci aspernatur cum nemo? Placeat asperiores, ex labore similique porro alias cum unde perferendis repudiandae. Sit aut qui alias necessitatibus? Ex voluptates corrupti adipisci unde eos? Quos id cupiditate enim ducimus nihil quidem corporis molestiae! Quod accusamus eveniet dolores ut possimus fugit, doloribus ipsam officiis?' },
  { wrap: 'balance', copy: 'Balanced lines for better visual appeal. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dolore placeat deleniti, corporis in expedita! Sapiente voluptatem ad expedita, deserunt quisquam quasi, est perferendis impedit fuga nobis ducimus odio in! Animi eaque ex aliquam adipisci aspernatur cum nemo? Placeat asperiores, ex labore similique porro alias cum unde perferendis repudiandae. Sit aut qui alias necessitatibus? Ex voluptates corrupti adipisci unde eos? Quos id cupiditate enim ducimus nihil quidem corporis molestiae! Quod accusamus eveniet dolores ut possimus fugit, doloribus ipsam officiis?' },
  { wrap: 'pretty', copy: 'Pretty wrap avoids orphans and widows. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dolore placeat deleniti, corporis in expedita! Sapiente voluptatem ad expedita, deserunt quisquam quasi, est perferendis impedit fuga nobis ducimus odio in! Animi eaque ex aliquam adipisci aspernatur cum nemo? Placeat asperiores, ex labore similique porro alias cum unde perferendis repudiandae. Sit aut qui alias necessitatibus? Ex voluptates corrupti adipisci unde eos? Quos id cupiditate enim ducimus nihil quidem corporis molestiae! Quod accusamus eveniet dolores ut possimus fugit, doloribus ipsam officiis?' },
];

const textBoxTrimExamples: { textBoxTrim: TextBoxTrim; copy: string }[] = [
  { textBoxTrim: 'start', copy: 'Trim Start' },
  { textBoxTrim: 'end', copy: 'Trim End' },
  { textBoxTrim: 'both', copy: 'Trim Both' },
];

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const kindRows = [
  { kind: 'headline', title: 'Headline', sizes: TEXT_SIZE_MODIFIERS.headline },
  { kind: 'body', title: 'Body', sizes: TEXT_SIZE_MODIFIERS.body },
  { kind: 'label', title: 'Label', sizes: TEXT_SIZE_MODIFIERS.label },
  { kind: 'code', title: 'Code', sizes: TEXT_SIZE_MODIFIERS.code },
] as const;

function TextVariants () {
  return (
    <div>
      <DtStack gap="500" className="d-p-400">
          {/* Kind Examples */}
          <section>
            <DtText as="h2" kind="headline" size={600}>
              Kind Examples
            </DtText>
            <DtStack gap="200">
                {kindRows.map(row => (
                  <div key={row.kind}>
                    <DtText as="h3" kind="headline" size={500}>
                      {row.title}
                    </DtText>
                    <div className="d-ba d-bc-default d-p-200 d-bar-400">
                      <DtStack direction="row" gap="100" align="baseline">
                          {row.sizes.map(size => (
                            <DtText key={`${row.kind}-${size}`} kind={row.kind} size={size}>
                              {row.title} {size}
                            </DtText>
                          ))}
                      </DtStack>
                    </div>
                  </div>
                ))}
            </DtStack>
          </section>

          {/* Strength Examples */}
          <section>
            <DtText as="h2" kind="headline" size={600}>
              Strength Examples
            </DtText>
            <DtStack gap="200">
                <div>
                  <DtText as="h3" kind="headline" size={500}>
                    Font Weight Modifiers
                  </DtText>
                  <div className="d-ba d-bc-default d-p-200 d-bar-400">
                    <DtStack direction="row" gap="200" align="baseline">
                        {strengthExamples.map(item => (
                          <DtText key={item.strength} kind="headline" size={600} strength={item.strength}>
                            {item.copy}
                          </DtText>
                        ))}
                    </DtStack>
                  </div>
                </div>
            </DtStack>
          </section>

          {/* Density Examples */}
          <section>
            <DtText as="h2" kind="headline" size={600}>
              Density Examples
            </DtText>
            <DtStack gap="200">
                <div>
                  <DtText as="h3" kind="headline" size={500}>
                    Line Height Modifiers
                  </DtText>
                  <div className="d-ba d-bc-default d-p-200 d-bar-400">
                    <DtStack direction="row" gap="100" align="baseline">
                        {densityExamples.map(item => (
                          <DtText
                            key={item.density}
                            kind="body"
                            as="p"
                            density={item.density}
                            className="d-bgc-moderate-opaque"
                            truncate
                          >
                            {item.density} — {item.copy}
                          </DtText>
                        ))}
                    </DtStack>
                  </div>
                </div>
            </DtStack>
          </section>

          {/* Tone Examples */}
          <section>
            <DtText as="h2" kind="headline" size={600}>
              Tone Examples
            </DtText>
            <DtStack gap="200">
                <div>
                  <div className="d-ba d-bc-default d-p-200 d-bar-400">
                    <DtStack direction="row" gap="100" className="d-fw-wrap">
                        {toneExamples.map(item => (
                          <DtText key={item.key} {...item.props}>
                            {item.copy}
                          </DtText>
                        ))}
                    </DtStack>
                  </div>
                </div>
            </DtStack>
          </section>

          {/* Alignment Examples */}
          <section>
            <DtText as="h2" kind="headline" size={600}>
              Alignment Examples
            </DtText>
            <DtStack gap="200">
                {alignExamples.map(item => (
                  <div key={item.align}>
                    <DtText as="h3" kind="headline" size={400}>
                      {capitalize(item.align)}
                    </DtText>
                    <div className="d-ba d-bc-default d-p-200 d-bar-400">
                      <DtText as="div" align={item.align}>
                        {item.copy}
                      </DtText>
                    </div>
                  </div>
                ))}
            </DtStack>
          </section>

          {/* Truncation Examples */}
          <section>
            <DtText as="h2" kind="headline" size={600}>
              Truncation Examples
            </DtText>
            <DtStack gap="200">
                <div>
                  <DtText as="h3" kind="headline" size={500}>
                    Single Line (truncate)
                  </DtText>
                  <div className="d-ba d-bc-default d-p-200 d-bar-400">
                    <DtText as="p" truncate>
                      Single-line truncate keeps ellipsis within inline-block contexts.
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Tenetur dolore placeat deleniti, corporis in expedita!
                      Sapiente voluptatem ad expedita, deserunt quisquam quasi, est
                      perferendis impedit fuga nobis ducimus odio in! Animi eaque ex
                      aliquam adipisci aspernatur cum nemo? Placeat asperiores, ex
                      labore similique porro alias cum unde perferendis repudiandae.
                      Sit aut qui alias necessitatibus?
                    </DtText>
                  </div>
                </div>

                <div>
                  <DtText as="h3" kind="headline" size={500}>
                    Multi Line (maxLines)
                  </DtText>
                  <DtStack gap="200" className="d-ba d-bc-default d-p-200 d-bar-400">
                      {[4, 3, 2].map(lines => (
                        <DtText key={lines} as="div" maxLines={lines} className="d-w-400">
                          <strong>{lines} lines:</strong> Clamp multi-line content to three lines for summary views.
                          This text will be truncated after three lines with an ellipsis
                          indicating there is more content available. Lorem ipsum dolor
                          sit amet consectetur adipisicing elit. Tenetur dolore placeat
                          deleniti, corporis in expedita! Sapiente voluptatem ad expedita,
                          deserunt quisquam quasi, est perferendis impedit fuga nobis ducimus
                          odio in! Animi eaque ex aliquam adipisci aspernatur cum nemo?
                          Placeat asperiores, ex labore similique porro alias cum unde
                          perferendis repudiandae. Sit aut qui alias necessitatibus?
                        </DtText>
                      ))}
                  </DtStack>
                </div>
            </DtStack>
          </section>

          {/* Wrap Examples */}
          <section>
            <DtText as="h2" kind="headline" size={600}>
              Wrap Examples
            </DtText>
            <DtStack gap="200">
                {wrapExamples.map(item => (
                  <div key={item.wrap}>
                    <DtText as="h3" kind="headline" size={400}>
                      {capitalize(item.wrap)}
                    </DtText>
                    <div className="d-ba d-bc-default d-of-hidden d-p-200 d-bar-400">
                      <DtText kind="headline" size={300} wrap={item.wrap}>
                        {item.copy}
                      </DtText>
                    </div>
                  </div>
                ))}
            </DtStack>
          </section>

          {/* Trim Examples */}
          <section>
            <DtText as="h2" kind="headline" size={600}>
              Trim Examples
            </DtText>
            <DtText as="p" kind="body" tone="muted">
              Text box trim removes extra space above/below text for tighter layouts
            </DtText>
            <DtStack direction="row" gap="200" className="d-ba d-bc-default d-p-200 d-bar-400">
                {textBoxTrimExamples.map(item => (
                  <DtText
                    key={item.textBoxTrim}
                    kind="headline"
                    size={700}
                    textBoxTrim={item.textBoxTrim}
                    className="d-bgc-moderate-opaque"
                  >
                    {item.copy}
                  </DtText>
                ))}
            </DtStack>
          </section>

          {/* Numeric Examples */}
          <section>
            <DtText as="h2" kind="headline" size={600}>
              Numeric Examples
            </DtText>
            <DtStack gap="200">
                <div>
                  <DtText as="h3" kind="headline" size={500}>
                    Tabular Figures
                  </DtText>
                  <div className="d-ba d-bc-default d-p-200 d-bar-400">
                    <DtStack gap="50">
                        <DtText numeric>
                          00123456789 (numeric)
                        </DtText>
                        <DtText>
                          00123456789 (default)
                        </DtText>
                    </DtStack>
                  </div>
                </div>
            </DtStack>
          </section>
      </DtStack>
    </div>
  );
}

// TextSlide.story.vue
const slideTooltipLabel = 'Warehouse dock handset shared between three shifts';

const slideGroups: { qa: string; dir?: 'rtl'; labels: string[] }[] = [
  {
    qa: 'slide-menu',
    labels: [
      'Front desk reception phone, second floor east wing',
      'Conference room Aurora with ceiling microphone array',
      'Short label',
    ],
  },
  {
    qa: 'slide-rtl',
    dir: 'rtl',
    labels: ['قائمة انتظار دعم العملاء لمنطقة الشمال الغربي للمحيط الهادئ والمناطق المجاورة'],
  },
];

// Vue's <dt-list-item v-dt-tooltip="tooltipLabel">
function SlideTooltipItem ({ slide }: Pick<TextStoryArgs, 'slide'>) {
  const [item, setItem] = useState<HTMLElement | null>(null);
  useTooltipDirective(item, slideTooltipLabel);
  return (
    <DtListItem ref={setItem} role="menuitem" navigationType="tab">
      <DtText slide={slide}>
        {slideTooltipLabel}
      </DtText>
    </DtListItem>
  );
}

function TextSlide ({ slide }: TextStoryArgs) {
  return (
    <DtStack gap="400" className="d-p-400">
        <DtText as="p" tone="secondary">
          Hover a row or Tab to it to slide its label; leave or press Esc to snap it back. Pick the mode in
          the slide control. With reduced motion on, the label jumps to its end; the last row also shows
          the full label in a tooltip, so it can be read without motion.
        </DtText>
        {slideGroups.map(group => (
          <ul
            key={group.qa}
            role="menu"
            aria-label={group.qa}
            dir={group.dir}
            className="d-w-350"
            data-qa={group.qa}
          >
            {group.labels.map(label => (
              <DtListItem key={label} role="menuitem" navigationType="tab">
                <DtText slide={slide}>
                  {label}
                </DtText>
              </DtListItem>
            ))}
          </ul>
        ))}
        <ul
          role="menu"
          aria-label="slide-tooltip"
          className="d-w-350"
          data-qa="slide-tooltip"
        >
          <SlideTooltipItem slide={slide} />
        </ul>
    </DtStack>
  );
}

export const Default: Story = {
  render: args => <TextDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: () => <TextVariants />,
  args: {},
  parameters: {
    controls: { disable: true },
    options: { showPanel: false },
  },
};

export const Slide: Story = {
  render: args => <TextSlide {...args} />,
  args: { slide: 'once' },
  parameters: {
    controls: { include: ['slide'] },
    // DtListItem sets aria-selected on menuitem rows, as in the Dropdown stories
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-allowed-attr',
            enabled: false,
          },
        ],
      },
    },
  },
};
