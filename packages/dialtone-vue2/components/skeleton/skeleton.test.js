import { createLocalVue, mount } from '@vue/test-utils';
import DtSkeleton from './skeleton.vue';

const baseProps = {};

let mockProps = {};
const testContext = {};

describe('DtSkeleton Tests', () => {
  let wrapper;
  let skeletonTextBody;
  let skeletonTextHeading;
  let skeletonParagraph;
  let skeletonParagraphRows;
  let skeletonListItem;
  let skeletonShape;

  const updateWrapper = () => {
    wrapper = mount(DtSkeleton, {
      propsData: { ...baseProps, ...mockProps },

      localVue: testContext.localVue,
    });

    skeletonTextBody = wrapper.find('[data-qa="skeleton-text-body"]');
    skeletonTextHeading = wrapper.find('[data-qa="skeleton-text-heading"]');
    skeletonParagraph = wrapper.find('[data-qa="skeleton-paragraph"]');
    skeletonParagraphRows = wrapper.findAll('[data-qa="skeleton-paragraph-row"]');
    skeletonListItem = wrapper.findAll('[data-qa="skeleton-list-item"]');
    skeletonShape = wrapper.findAll('[data-qa="skeleton-shape"]');
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    describe('Skeleton text', () => {
      it('should render the skeleton body', () => {
        expect(skeletonTextBody.exists()).toBe(true);
      });

      it('should render the skeleton heading', async () => {
        mockProps = {
          textOption: {
            type: 'heading',
          },
        };

        updateWrapper();

        expect(skeletonTextHeading.exists()).toBe(true);
      });
    });

    describe('Skeleton paragraph', () => {
      beforeEach(() => {
        mockProps = {
          paragraphOption: true,
        };

        updateWrapper();
      });

      it('should render the skeleton paragraph', async () => {
        expect(skeletonParagraph.exists()).toBe(true);
      });

      it('should render rows', async () => {
        expect(skeletonParagraphRows.length).toBe(3);
      });
    });

    describe('Skeleton list item', () => {
      beforeEach(() => {
        mockProps = {
          listItemOption: true,
        };

        updateWrapper();
      });

      it('should render the skeleton list item', async () => {
        expect(skeletonListItem.exists()).toBe(true);
      });

      it('should render skeleton paragraph', async () => {
        expect(skeletonParagraph.exists()).toBe(true);
      });
    });

    describe('Skeleton shape', () => {
      it('should render skeleton shape', async () => {
        mockProps = {
          shapeOption: true,
        };

        updateWrapper();

        expect(skeletonShape.exists()).toBe(true);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When an aria-label is provided', () => {
      it('should be set aria-label value', () => {
        mockProps = {
          ariaLabel: 'ariaLabel',
        };

        updateWrapper();

        expect(wrapper.attributes('aria-label')).toBe('ariaLabel');
      });
    });
  });
});
