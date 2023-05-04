import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtSkeleton from './skeleton.vue';

import DtSkeletonDefaultTemplate from './skeleton_default.story.vue';
import DtSkeletonVariantsTemplate from './skeleton_variants.story.vue';

export const argsData = {
  ariaLabel: '',
};

export const argTypesData = {
  paragraphOption: {
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
};

// Story Collection
export default {
  title: 'Components/Skeleton',
  component: DtSkeleton,
  argTypes: argTypesData,
  args: argsData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtSkeletonDefaultTemplate);
const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtSkeletonVariantsTemplate);

export const Default = {
  render: DefaultTemplate,

  decorators: [
    () => ({
      template: '<div style="width: 500px"><story /></div>',
    }),
  ],

  args: {},
};

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
