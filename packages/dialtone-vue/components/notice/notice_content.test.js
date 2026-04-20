import DtNoticeContent from './notice_content.vue';
import { mount } from '@vue/test-utils';

// Constants
const baseProps = {
  headerText: 'this is the title',
  headerId: 'headerId555',
  contentId: 'contentId888',
};

const baseSlotsData = {
  default: 'this is the content',
};

describe('DtNoticeContent tests', () => {
  let wrapper;
  let props;
  let slotsData;

  let header;
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
    header = wrapper.find('#headerId555');
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

      it('Should display header text correctly', () => {
        expect(header.text()).toBe(props.headerText);
      });

      it('Should display the content correctly', () => {
        expect(content.text()).toBe(baseSlotsData.default);
      });
    });

    describe('When header slot is provided', () => {
      beforeEach(() => {
        slotsData.header = 'this is a slot header';
        _setWrappers();
      });

      it('displays the correct text', () => {
        expect(header.text()).toBe(slotsData.header);
      });
    });
  });
});
