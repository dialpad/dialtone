import { assert } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import DtSkeleton from './skeleton.vue';

describe('DtSkeleton Tests', function () {
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
    skeletonListItem = wrapper.findAll('[data-qa="skeleton-list-item"]');
    skeletonShape = wrapper.findAll('[data-qa="skeleton-shape"]');
  };

  const _mountWrapper = (propsData) => {
    wrapper = mount(DtSkeleton, {
      localVue: createLocalVue(),
      propsData,
    });
    _setWrappers();
  };

  describe('Presentation Tests', function () {
    it('should render the component', function () {
      _mountWrapper();
      assert.exists(wrapper, 'wrapper exists');
    });

    describe('Skeleton text', function () {
      it('should render the skeleton body', function () {
        assert.isTrue(skeletonTextBody.exists());
      });

      it('should render the skeleton heading', async function () {
        _mountWrapper({
          textOption: {
            type: 'heading',
          },
        });
        assert.isTrue(skeletonTextHeading.exists());
      });
    });

    describe('Skeleton paragraph', function () {
      before(function () {
        _mountWrapper({
          paragraphOption: true,
        });
      });

      it('should render the skeleton paragraph', async function () {
        assert.isTrue(skeletonParagraph.exists());
      });

      it('should render rows', async function () {
        assert.equal(skeletonParagraphRows.length, 3);
      });
    });

    describe('Skeleton list item', function () {
      before(function () {
        _mountWrapper({
          listItemOption: true,
        });
      });

      it('should render the skeleton list item', async function () {
        assert.isTrue(skeletonListItem.exists());
      });

      it('should render skeleton paragraph', async function () {
        assert.isTrue(skeletonParagraph.exists());
      });
    });

    describe('Skeleton shape', function () {
      before(function () {
        _mountWrapper({
          shapeOption: true,
        });
      });

      it('should render skeleton shape', async function () {
        assert.isTrue(skeletonShape.exists());
      });
    });
  });

  describe('Accessibility Tests', function () {
    describe('When an aria-label is provided', function () {
      before(function () {
        _mountWrapper({
          ariaLabel: 'ariaLabel',
        });
      });

      it('should be set aria-label value', function () {
        assert.strictEqual(wrapper.attributes('aria-label'), 'ariaLabel');
      });
    });
  });
});
