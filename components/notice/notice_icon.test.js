import DtNoticeIcon from './notice_icon.vue';
import { mount } from '@vue/test-utils';
import { DtIcon } from '@/components/icon';

// Constants
const baseProps = {
  kind: 'warning',
};

const baseSlotsData = {};

describe('DtNoticeIcon tests', () => {
  let wrapper;
  let icon;
  let props;
  let slotsData;

  const _setWrappers = () => {
    wrapper = mount(DtNoticeIcon, {
      global: { components: { 'dt-icon': DtIcon } },
      props,
      slots: slotsData,
    });
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    icon = wrapper.findComponent(DtIcon);
  };

  beforeEach(function () {
    props = baseProps;
    slotsData = baseSlotsData;
    _setWrappers();
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default content', () => {
      it('Should render notice icon component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('Should render an icon', () => {
        expect(icon.exists()).toBe(true);
      });

      it('Should have aria-hidden set to true', () => {
        expect(wrapper.attributes('aria-hidden')).toBe('true');
      });
    });

    describe('When kind is base', () => {
      beforeEach(async () => {
        await wrapper.setProps({ kind: 'base' });
        _setChildWrappers();
      });

      it('Should render base icon', () => {
        expect(icon.classes().includes('d-icon--bell')).toBe(true);
      });
    });

    describe('When custom icon is passed into the slot', () => {
      beforeEach(async () => {
        slotsData = {
          default: '<dt-icon name="accessibility" />',
        };
        _setWrappers();
      });

      it('Should render correctly', async () => {
        expect(icon.classes().includes('d-icon--accessibility')).toBe(true);
      });
    });
  });
});
