import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { DtPagination, type DtPaginationProps } from './Pagination';

// Default Prop Values
// Vue's `change` event is `onPageChange` here.
export const argsData = {
  ariaLabel: 'pagination',
  totalPages: 5,
  activePage: 1,
  maxVisible: 5,
  showEdges: true,
  onPageChange: action('change'),
} satisfies Partial<DtPaginationProps>;

export const argTypesData = {
  // Props
  totalPages: {
    control: {
      type: 'number',
    },
  },
  activePage: {
    control: {
      type: 'number',
    },
  },
  maxVisible: {
    control: {
      type: 'number',
    },
  },
  showEdges: {
    control: {
      type: 'boolean',
    },
  },

  // Action Event Handlers
  onPageChange: {
    table: {
      disable: true,
    },
  },
} satisfies Meta<DtPaginationProps>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Pagination',
  component: DtPagination,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<DtPaginationProps>;

export default meta;
type Story = StoryObj<DtPaginationProps>;

// Templates
// PaginationDefault.story.vue
function PaginationDefault (args: DtPaginationProps) {
  return (
    <DtPagination
      ariaLabel={args.ariaLabel}
      totalPages={args.totalPages}
      activePage={args.activePage}
      maxVisible={args.maxVisible}
      showEdges={args.showEdges}
      onPageChange={args.onPageChange}
    />
  );
}

// PaginationVariants.story.vue
function PaginationVariants () {
  return (
    <div className="d-divide-y">
      <div className="d-m-400">
        <p className="d-my-200 d-fs-200 d-fw-bold">
          Separator in the end
        </p>
        <DtPagination
          totalPages={10}
          ariaLabel="pagination with separator in the end"
        />
      </div>
      <div className="d-m-400">
        <p className="d-my-200 d-fs-200 d-fw-bold">
          Separator in the beginning
        </p>
        <DtPagination
          totalPages={15}
          activePage={13}
          ariaLabel="pagination with separator in the beginning"
        />
      </div>
      <div className="d-m-400">
        <p className="d-my-200 d-fs-200 d-fw-bold">
          Separator on both sides
        </p>
        <DtPagination
          totalPages={10}
          activePage={5}
          ariaLabel="pagination with separator on both sides"
        />
      </div>
      <div className="d-m-400">
        <p className="d-my-200 d-fs-200 d-fw-bold">
          Hide edges
        </p>
        <DtPagination
          totalPages={10}
          activePage={5}
          ariaLabel="pagination with separator on both sides"
          showEdges={false}
        />
      </div>
    </div>
  );
}

export const Default: Story = {
  render: args => <PaginationDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: () => <PaginationVariants />,
  args: {},
};
