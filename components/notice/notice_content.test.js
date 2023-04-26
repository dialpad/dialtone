import DtNoticeContent from './notice_content.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Constants
const basePropsData = {
  title: 'this is the title',
  titleId: 'titleId555',
  contentId: 'contentId888',
};

const baseSlotsData = {
  default: 'this is the content',
};

describe('DtNoticeContent tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  let wrapper;
  let propsData;
  let slotsData;

  let title;
  let content;

  const _setWrappers = () => {
    propsData = basePropsData;
    slotsData = baseSlotsData;
    wrapper = shallowMount(DtNoticeContent, {
      propsData,
      slots: slotsData,
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    title = wrapper.find('#titleId555');
    content = wrapper.find('#contentId888');
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    _setWrappers();
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default content', () => {
      it('Should render notice content component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('Should display title correctly', () => {
        expect(title.text()).toBe(basePropsData.title);
      });

      it('Should display the content correctly', () => {
        expect(content.text()).toBe(baseSlotsData.default);
      });
    });

    describe('When title override is true', () => {
      beforeEach(() => {
        slotsData.titleOverride = 'this is an override title';
        _setWrappers();
      });

      it('displays the correct text', () => {
        expect(title.text()).toBe(slotsData.titleOverride);
      });
    });
  });
});
