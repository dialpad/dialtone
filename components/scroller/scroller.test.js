import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import DtScroller from './scroller.vue';

// Constants
const items = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
}));

const baseSlotsData = {
  default: ` <div class="user">
          {{ item.name }}
        </div>`,
};

const baseProps = {
  items,
  itemSize: 30,
  scrollerHeight: 60,
  scrollerWidth: 60,
};

describe('DtScroller Tests', function () {
  // Wrappers
  let wrapper;

  let defaultContent;

  // Environment
  let props = baseProps;
  let slots = baseSlotsData;

  // Helpers
  const _setChildWrappers = () => {
    defaultContent = wrapper.find('[data-qa="dt-scroller"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtScroller, {
      props,
      slots,
    });
    _setChildWrappers();
  };

  // Teardown
  afterEach(function () {
    props = baseProps;
    slots = baseSlotsData;
  });

  beforeEach(function () {
    _setWrappers();
    global.requestAnimationFrame = cb => cb();
  });

  describe('Presentation Tests', function () {
    describe('When scroller renders', function () {
      it('scroller exist', function () {
        assert.isTrue(wrapper.exists());
      });

      it('scroller content should render correctly', function () {
        assert.isTrue(defaultContent.exists());
      });
    });
  });

  describe('Interactivity Tests', function () {
    describe('Should emit', function () {
      it('`top` event when scroll reach the top of the component', function () {
        defaultContent.element.scrollTop = 25;
        wrapper.trigger('scroll');
        defaultContent.element.scrollTop = 0;
        wrapper.trigger('scroll');

        assert.equal(wrapper.emitted()['user-position'][1], 'top');
      });

      it('`middle` on scroll', function () {
        defaultContent.element.scrollTop = 25;
        wrapper.trigger('scroll');

        assert.equal(wrapper.emitted()['user-position'][0], 'middle');
      });

      it('`bottom` event when scroll reach the bottom of the component', function () {
        defaultContent.element.scrollTop = defaultContent.element.scrollHeight - defaultContent.element.clientHeight;
        wrapper.trigger('scroll');

        assert.equal(wrapper.emitted()['user-position'][2], 'bottom');
      });
    });

    describe('On `scrollToItem` event', function () {
      it('should scroll to the item', function () {
        wrapper.vm.scrollToItem(15);
        wrapper.trigger('scroll');

        assert.equal(defaultContent.element.scrollTop, 450);
      });
    });
  });
});
