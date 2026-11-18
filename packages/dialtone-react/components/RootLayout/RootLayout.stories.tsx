import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtRootLayout, type DtRootLayoutProps } from './RootLayout';
import { ROOT_LAYOUT_RESPONSIVE_BREAKPOINTS, ROOT_LAYOUT_SIDEBAR_POSITIONS } from './RootLayoutConstants';

// Slots are HTML strings, as in Vue (its story templates render them through html-fragment and v-html).
type RootLayoutStoryArgs = Omit<DtRootLayoutProps, 'header' | 'sidebar' | 'footer' | 'children'> & {
  header?: string;
  sidebar?: string;
  footer?: string;
  children?: string;
};

const sidebarItems = '<div>Sidebar item</div>'.repeat(45);

// Default Prop Values
export const argsData = {
  sidebarPosition: 'left',
  header: '<div class="d-h-100">Header</div>',
  headerClass: 'd-bgc-purple-200',
  footer: '<div class="d-h-100">Footer</div>',
  footerClass: 'd-bgc-gold-200',
  sidebar: `<div class="d-w-400">${sidebarItems}</div>`,
  sidebarClass: 'd-bgc-black-200',
  children: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim eleifend condimentum.
  Vestibulum euismod leo at finibus mattis. Integer ut dui id ligula tincidunt pellentesque. Vestibulum a ullamcorper
  risus. Ut tristique sapien eget magna lacinia, non interdum lacus malesuada. Proin augue lacus, finibus eget aliquam
  eu, efficitur sit amet magna. Suspendisse a nunc volutpat, maximus enim vitae, pretium dui. Suspendisse pretium
  faucibus posuere. Aenean consequat imperdiet laoreet. Pellentesque habitant morbi tristique senectus et netus et
  malesuada fames ac turpis egestas. Aliquam elit lacus, venenatis ac risus at, ullamcorper tempor tortor. Ut sed
  pulvinar mi, vitae vehicula odio. Fusce ornare vestibulum rhoncus. In vel ante arcu. Nunc pharetra libero non
  enim dapibus efficitur. Suspendisse dolor ante, pulvinar et faucibus quis, condimentum at dui.`,
} satisfies RootLayoutStoryArgs;

export const argTypesData = {
  // Slots
  children: {
    control: 'text',
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },

  header: {
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'ReactNode',
      },
    },
  },

  sidebar: {
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'ReactNode',
      },
    },
  },

  footer: {
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'ReactNode',
      },
    },
  },

  // Props
  sidebarPosition: {
    options: Object.values(ROOT_LAYOUT_SIDEBAR_POSITIONS),
    control: {
      type: 'select',
    },
  },

  responsiveBreakpoint: {
    options: ROOT_LAYOUT_RESPONSIVE_BREAKPOINTS,
    control: {
      type: 'select',
    },
  },

  headerSticky: {
    control: 'boolean',
  },

  fixed: {
    control: 'boolean',
  },
} satisfies Meta<RootLayoutStoryArgs>['argTypes'];

const meta = {
  title: 'Components/Root Layout',
  component: DtRootLayout,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<RootLayoutStoryArgs>;

export default meta;
type Story = StoryObj<RootLayoutStoryArgs>;

const html = (value: string | undefined) => (
  <span style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: value ?? '' }} />
);

// RootLayoutDefault.story.vue
function RootLayoutDefault ({ header, sidebar, footer, children, ...args }: RootLayoutStoryArgs) {
  return (
    <DtRootLayout
      headerClass={args.headerClass}
      headerSticky={args.headerSticky}
      contentClass={args.contentClass}
      sidebarClass={args.sidebarClass}
      sidebarPosition={args.sidebarPosition}
      footerClass={args.footerClass}
      fixed={args.fixed}
      responsiveBreakpoint={args.responsiveBreakpoint}
      header={html(header)}
      sidebar={html(sidebar)}
      footer={html(footer)}
    >
      {html(children)}
    </DtRootLayout>
  );
}

// RootLayoutSticky.story.vue. Its default slot renders `defaultSlot`, which Vue's template never defines, so the
// content is empty there too.
function RootLayoutSticky ({ header, sidebar, footer, children: _children, ...args }: RootLayoutStoryArgs) {
  return (
    <DtRootLayout
      headerClass={args.headerClass}
      headerSticky={args.headerSticky}
      contentClass={args.contentClass}
      sidebarClass={args.sidebarClass}
      sidebarPosition={args.sidebarPosition}
      footerClass={args.footerClass}
      fixed={args.fixed}
      responsiveBreakpoint={args.responsiveBreakpoint}
      header={html(header)}
      sidebar={html(sidebar)}
      footer={html(footer)}
    >
      {html(undefined)}
    </DtRootLayout>
  );
}

export const Default: Story = {
  render: args => <RootLayoutDefault {...args} />,

  args: {
    children: argsData.children.repeat(40),
  },
};

export const StickyHeader: Story = {
  render: args => <RootLayoutSticky {...args} />,

  args: {
    headerSticky: true,
    fixed: false,
    children: argsData.children.repeat(40),
  },
};
