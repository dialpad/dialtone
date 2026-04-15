import DtNoticeContent from './notice_content.vue';
import { mount } from '@vue/test-utils';

// Constants
const baseProps = {
  title: 'this is the title',
  titleId: 'titleId555',
  contentId: 'contentId888',
};

const baseSlotsData = {
  default: 'this is the content',
};

describe('DtNoticeContent tests', () => {
  let wrapper;
  let props;
  let slotsData;

  let title;
  let content;

  const _setWrappers = () => {
    props = baseProps;
    slotsData = baseSlotsData;
    wrapper = mount(DtNoticeContent, {
      props,
      slots: slotsData,
    });
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    title = wrapper.find('#titleId555');
    content = wrapper.find('#contentId888');
  };

  beforeEach(function () {
    _setWrappers();
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default content', () => {
      it('Should render notice content component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('Should display title correctly', () => {
        expect(title.text()).toBe(props.title);
      });

      it('Should display the content correctly', () => {
        expect(content.text()).toBe(baseSlotsData.default);
      });
    });

    describe('When title slot is provided', () => {
      beforeEach(() => {
        slotsData.title = 'this is a slot title';
        _setWrappers();
      });

      it('displays the correct text', () => {
        expect(title.text()).toBe(slotsData.title);
      });
    });
  });
});
