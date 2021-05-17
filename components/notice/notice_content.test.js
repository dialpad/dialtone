import { assert } from 'chai';
import DtNoticeContent from './notice_content';
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

describe('DtNoticeContent tests', function () {
  let wrapper;
  let propsData;
  let slotsData;

  let title;
  let content;

  const _setWrappers = () => {
    propsData = basePropsData;
    slotsData = baseSlotsData;
    wrapper = shallowMount(DtNoticeContent, {
      propsData: propsData,
      slots: slotsData,
      localVue: this.localVue,
    });
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    title = wrapper.find('#titleId555');
    content = wrapper.find('#contentId888');
  };

  before(function () {
    this.localVue = createLocalVue();
  });

  beforeEach(function () {
    _setWrappers();
  });

  describe('Presentation Tests', function () {
    describe('When rendered with default content', function () {
      it('Should render notice content component', function () {
        assert.isTrue(wrapper.exists());
      });

      it('Should display title correctly', function () {
        assert.strictEqual(title.text(), basePropsData.title);
      });

      it('Should display the content correctly', function () {
        assert.strictEqual(content.text(), baseSlotsData.default);
      });
    });

    describe('When title override is true', function () {
      beforeEach(function () {
        slotsData.titleOverride = 'this is an override title';
        _setWrappers();
      });
      it('displays the correct text', function () {
        assert.strictEqual(title.text(), slotsData.titleOverride);
      });
    });
  });
});
