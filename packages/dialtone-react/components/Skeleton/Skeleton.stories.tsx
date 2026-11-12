import type { Meta, StoryObj } from '@storybook/react-vite';
import { StandIn } from '../../.storybook/StandIn';
import { DtSkeleton, type DtSkeletonProps } from './Skeleton';

export const argsData = {
  ariaLabel: '',
} satisfies Partial<DtSkeletonProps>;

// The option props are unions, so each gets a plain object control (conventions › Stories).
export const argTypesData = {
  paragraphOption: {
    control: 'object',
    table: {
      type: {
        detail: `{
          rows?: number | string | 3,
          animate?: boolean | false,
          minWidth?: number | string | 30,
          maxWidth?: number | string | 100,
          width?: string, Array<string> | null,
          randomWidth?: boolean | false,
          offset?: number | 1,
          animationDuration?: number| -1,
          contentClass?: string | '',
          rowClass?: string | '',
        }`,
      },
    },
  },
  listItemOption: {
    control: 'object',
    table: {
      type: {
        detail: `{
          shape?: string<circle | square> | 'circle',
          shapeSize?: string<sm | md | lg> | string <'{n}px|%|rem'>,
          shapeClass?: string | '',
          animate?: boolean | false,
          paragraphs?: paragraphOption | { rows: 3, randomWidth: true }
          offset?: number | 1,
          animationDuration?: number| -1,
          contentClass?: string | '',
        }`,
      },
    },
  },
  textOption: {
    control: 'object',
    table: {
      type: {
        detail: `null | {
          type?: string <body | heading> | 'body',
          headingHeight?: string<sm | md | lg | xl> | 'md',
          width?: string | '100%',
          contentClass?: string | '',
          offset?: number | 1,
          animate?: boolean | false,
          animationDuration?: number| -1
        }`,
      },
    },
  },
  shapeOption: {
    control: 'object',
    table: {
      type: {
        detail: `{
          shape?: string<circle | square> | 'circle',
          size?: string<sm | md | lg> | string <'{n}px|%|rem'>,
          animate?: boolean | false,
          offset?: number | 1,
          animationDuration?: number| -1,
          contentClass?: string | '',
        }`,
      },
    },
  },
} satisfies Meta<DtSkeletonProps>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Skeleton',
  component: DtSkeleton,
  argTypes: argTypesData,
  args: argsData,
  excludeStories: /.*Data$/,
} satisfies Meta<DtSkeletonProps>;

export default meta;
type Story = StoryObj<DtSkeletonProps>;

// SkeletonDefault.story.vue
function SkeletonDefault (args: DtSkeletonProps) {
  return (
    <DtSkeleton
      paragraphOption={args.paragraphOption}
      listItemOption={args.listItemOption}
      textOption={args.textOption}
      shapeOption={args.shapeOption}
      animationDuration={args.animationDuration}
      ariaLabel={args.ariaLabel}
      animate={args.animate}
      offset={args.offset}
    />
  );
}

// SkeletonVariants.story.vue
function SkeletonVariants (args: DtSkeletonProps) {
  return (
    <div>
      <h2 className="d-mbe-400">
        Prefabricated shapes
      </h2>
      <StandIn for="stack">
        <section data-qa="dt-stack" className="d-stack d-stack--row d-stack--gap-0 d-mbe-800">
          <div className="d-p-50 d-fl1 d-w25p">
            <h3>Avatars</h3>
            <p className="d-mbe-300">
              Default sizes matches avatar.
              Size is customizable when needed.
            </p>
            <p>S (24x24px)</p>
            <DtSkeleton
              shapeOption={{
                size: 'sm',
                shape: 'circle',
              }}
              animate={args.animate}
              className="d-mbe-300"
              ariaLabel={args.ariaLabel}
            />
            <p>M (32x32px)</p>
            <DtSkeleton
              shapeOption={{
                shape: 'circle',
              }}
              animate={args.animate}
              className="d-mbe-300"
              ariaLabel={args.ariaLabel}
            />
            <p>L (48x48px)</p>
            <DtSkeleton
              shapeOption={{
                size: 'lg',
                shape: 'circle',
              }}
              animate={args.animate}
              ariaLabel={args.ariaLabel}
            />
          </div>
          <div className="d-p-50 d-fl1 d-w25p">
            <h3>Image / Icon</h3>
            <p className="d-mbe-300">
              Size is customizable.
            </p>
            <DtSkeleton
              shapeOption={{
                shape: 'square',
              }}
              animate={args.animate}
              className="d-mbe-300"
              ariaLabel={args.ariaLabel}
            />
          </div>
          <div className="d-p-50 d-fl1 d-w25p">
            <h3>Text: Body</h3>
            <p className="d-mbe-300" />
            <DtSkeleton
              ariaLabel={args.ariaLabel}
              animate={args.animate}
              textOption={{
                width: '120px',
              }}
              offset={0.5}
            />
          </div>
          <div className="d-p-50 d-fl1 d-w25p">
            <h3>Text: Headings</h3>
            <p className="d-mbe-300">
              Line-lengths is customizable.
            </p>
            <p>S (height: 16px)</p>
            <DtSkeleton
              textOption={{
                type: 'heading',
                width: '160px',
                headingHeight: 'sm',
              }}
              animate={args.animate}
              className="d-mbe-300"
              ariaLabel={args.ariaLabel}
            />
            <p>M (height: 24px)</p>
            <DtSkeleton
              textOption={{
                type: 'heading',
                headingHeight: 'md',
                width: '240px',
              }}
              animate={args.animate}
              className="d-mbe-300"
              ariaLabel={args.ariaLabel}
            />
            <p>L (height: 32px)</p>
            <DtSkeleton
              textOption={{
                type: 'heading',
                headingHeight: 'lg',
                width: '320px',
              }}
              animate={args.animate}
              ariaLabel={args.ariaLabel}
            />
          </div>
        </section>
      </StandIn>
      <h2 className="d-mbe-400">
        Prefabricated combinations
      </h2>
      <StandIn for="stack">
        <section data-qa="dt-stack" className="d-stack d-stack--row d-stack--gap-0 d-mbe-800">
          <div className="d-p-50 d-fl1 d-w50p">
            <h3>Text List</h3>
            <p className="d-mbe-300" />
            {[0, 1, 2, 3].map(item => (
              <DtSkeleton
                key={item}
                ariaLabel={args.ariaLabel}
                textOption={{
                  width: '120px',
                }}
                animate={args.animate}
                offset={0.5}
                className="d-mbe-200"
              />
            ))}

            <h3 className="d-pbs-200">
              Avatar + Name
            </h3>
            <p className="d-mbe-300" />

            <DtSkeleton
              offset={0.6}
              listItemOption={{
                shapeSize: 'sm',
                paragraphs: {
                  rows: 1,
                },
              }}
              animate={args.animate}
              ariaLabel={args.ariaLabel}
            />

            <h3 className="d-pbs-200">
              Icon + Text
            </h3>
            <p className="d-mbe-300" />

            <DtSkeleton
              offset={0.6}
              listItemOption={{
                shapeSize: '2rem',
                shape: 'square',
                paragraphs: {
                  rows: 1,
                },
              }}
              animate={args.animate}
              ariaLabel={args.ariaLabel}
            />
            <h3 className="d-pbs-200">
              Messages / Transcript / Comment
            </h3>
            <p className="d-mbe-300" />
            <DtSkeleton
              offset={0.6}
              listItemOption={{
                shapeSize: '3.6rem',
                paragraphs: {
                  rows: 4,
                  width: [
                    '120px', '311px', '371px', '279px',
                  ],
                },
              }}
              animate={args.animate}
              ariaLabel={args.ariaLabel}
            />
          </div>
          <div className="d-p-50 d-fl1 d-w50p">
            <h3>Text: Paragraphs</h3>
            <p className="d-mbe-300">
              Line-lengths and amount of lines are customizable.
            </p>
            <DtSkeleton
              paragraphOption={{
                rows: 5,
                randomWidth: false,
              }}
              animate={args.animate}
              ariaLabel={args.ariaLabel}
              offset={0.5}
            />
          </div>
        </section>
      </StandIn>
    </div>
  );
}

// Stories
export const Default: Story = {
  render: args => <SkeletonDefault {...args} />,

  decorators: [
    Story => (
      <div style={{ width: '500px' }}><Story /></div>
    ),
  ],

  args: {},
};

export const Variants: Story = {
  render: args => <SkeletonVariants {...args} />,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
