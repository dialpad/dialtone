import { createTemplateFromVueFile } from '../storybook_utils';
import DtSkeleton from './skeleton';
import DtSkeletonMdx from './skeleton.mdx';
import DtSkeletonDefaultTemplate from './skeleton_default.story.vue';
import DtSkeletonVariantsTemplate from './skeleton_variants.story.vue';

export const argTypesData = {
  paragraphOption: {
    description: `Set this prop to have the skeleton render as multiple lines of text.
    Set only one option prop at a time.`,
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
    description: `Set this prop to have the skeleton render as a list item with an avatar and wrapping text.
    Set only one option prop at a time.`,
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
    description: `Set this prop to have the skeleton render as a single line of text.
    Set only one option prop at a time.`,
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
    description: `Set this prop to have the skeleton render as a specific shape.
    Set only one option prop at a time.`,
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
  animate: {
    description: 'This property has higher priority than "option.animate"',
  },
  ariaLabel: {
    defaultValue: '',
  },
  offset: {
    description: `RippleDuration controls how long the delay is for the animation of a 
    placeholder 1000 pixels from the top of the page. Each placeholder
    from the top down will have a delay duration from 0 to this offset.
    The delay of each placeholder animation is based on how far down the page
    the placeholder is rendered. This is a linear relationship. The unit
    is milliseconds.`,
  },
};

// Story Collection
export default {
  title: 'Components/Skeleton',
  component: DtSkeleton,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    docs: {
      page: DtSkeletonMdx,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtSkeletonDefaultTemplate,
);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtSkeletonVariantsTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.decorators = [() => ({
  template: '<div style="width: 500px"><story /></div>',
})];
Default.args = {};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
