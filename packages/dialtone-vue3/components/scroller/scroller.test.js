import { mount } from '@vue/test-utils';
import DtScroller from './DtScroller.vue';

const MOCK_ITEMS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
}));

const baseProps = {
  items: MOCK_ITEMS,
  itemSize: 30,
  scrollerHeight: 60,
  scrollerWidth: 60,
};
const baseSlots = {
  default: ` <div class="user">
          {{ item.name }}
        </div>`,
};

let mockProps = {};
let mockSlots = {};

describe('DtScroller Tests', () => {
  let wrapper;
  let defaultContent;

  const updateWrapper = () => {
    wrapper = mount(DtScroller, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
    });

    defaultContent = wrapper.find('[data-qa="dt-scroller"]');
  };

  beforeEach(() => {
    global.requestAnimationFrame = cb => cb();
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    describe('When scroller renders', () => {
      it('scroller exist', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('scroller content should render correctly', () => {
        expect(defaultContent.exists()).toBe(true);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('Should emit', () => {
      it('`top` event when scroll reach the top of the component', () => {
        defaultContent.element.scrollTop = 25;
        wrapper.trigger('scroll');
        defaultContent.element.scrollTop = 0;
        wrapper.trigger('scroll');

        expect(wrapper.emitted()['user-position'][1]).toEqual(['top']);
      });

      it('`middle` on scroll', () => {
        defaultContent.element.scrollTop = 25;
        wrapper.trigger('scroll');

        expect(wrapper.emitted()['user-position'][0]).toEqual(['middle']);
      });

      it('`bottom` event when scroll reach the bottom of the component', () => {
        defaultContent.element.scrollTop = defaultContent.element.scrollHeight - defaultContent.element.clientHeight;
        wrapper.trigger('scroll');

        expect(wrapper.emitted()['user-position'][2]).toEqual(['bottom']);
      });
    });

    describe('On `scrollToItem` event', () => {
      it('should scroll to the item', () => {
        wrapper.vm.scrollToItem(15);
        wrapper.trigger('scroll');

        expect(defaultContent.element.scrollTop).toBe(450);
      });
    });
  });
});
