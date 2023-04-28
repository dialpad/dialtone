import { mount } from '@vue/test-utils';
import DtSkeleton from './skeleton.vue';

describe('DtSkeleton Tests', () => {
  // Wrappers
  let wrapper;
  let skeletonTextBody;
  let skeletonTextHeading;
  let skeletonParagraph;
  let skeletonParagraphRows;
  let skeletonListItem;
  let skeletonShape;

  const _setWrappers = () => {
    skeletonTextBody = wrapper.find('[data-qa="skeleton-text-body"]');
    skeletonTextHeading = wrapper.find('[data-qa="skeleton-text-heading"]');
    skeletonParagraph = wrapper.find('[data-qa="skeleton-paragraph"]');
    skeletonParagraphRows = wrapper.findAll('[data-qa="skeleton-paragraph-row"]');
    skeletonListItem = wrapper.find('[data-qa="skeleton-list-item"]');
    skeletonShape = wrapper.find('[data-qa="skeleton-shape"]');
  };

  const _mountWrapper = (props) => {
    wrapper = mount(DtSkeleton, {
      props,
    });
    _setWrappers();
  };

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      _mountWrapper();
      expect(wrapper.exists()).toBe(true);
    });

    describe('Skeleton text', () => {
      it('should render the skeleton body', () => {
        expect(skeletonTextBody.exists()).toBe(true);
      });

      it('should render the skeleton heading', async () => {
        _mountWrapper({
          textOption: {
            type: 'heading',
          },
        });
        expect(skeletonTextHeading.exists()).toBe(true);
      });
    });

    describe('Skeleton paragraph', () => {
      beforeAll(() => {
        _mountWrapper({
          paragraphOption: true,
        });
      });

      it('should render the skeleton paragraph', async () => {
        expect(skeletonParagraph.exists()).toBe(true);
      });

      it('should render rows', async () => {
        expect(skeletonParagraphRows.length).toEqual(3);
      });
    });

    describe('Skeleton list item', () => {
      beforeAll(() => {
        _mountWrapper({
          listItemOption: true,
        });
      });

      it('should render the skeleton list item', async () => {
        expect(skeletonListItem.exists()).toBe(true);
      });

      it('should render skeleton paragraph', async () => {
        expect(skeletonParagraph.exists()).toBe(true);
      });
    });

    describe('Skeleton shape', () => {
      beforeAll(() => {
        _mountWrapper({
          shapeOption: true,
        });
      });

      it('should render skeleton shape', async () => {
        expect(skeletonShape.exists()).toBe(true);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When an aria-label is provided', () => {
      beforeAll(() => {
        _mountWrapper({
          ariaLabel: 'ariaLabel',
        });
      });

      it('should be set aria-label value', () => {
        expect(wrapper.attributes('aria-label')).toBe('ariaLabel');
      });
    });
  });
});
