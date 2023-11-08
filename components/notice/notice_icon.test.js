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

  const _setWrappers = async () => {
    wrapper = mount(DtNoticeIcon, {
      global: { components: { 'dt-icon': DtIcon } },
      props,
      slots: slotsData,
    });
    await _setChildWrappers();
  };

  const _setChildWrappers = async () => {
    await vi.dynamicImportSettled();
    icon = wrapper.findComponent(DtIcon);
  };

  beforeEach(async function () {
    props = baseProps;
    slotsData = baseSlotsData;
    await _setWrappers();
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
        await _setChildWrappers();
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
        await _setWrappers();
      });

      it('Should render correctly', async () => {
        expect(icon.classes().includes('d-icon--accessibility')).toBe(true);
      });
    });
  });
});
