import DtNoticeIcon from './notice_icon.vue';
import { createLocalVue, mount } from '@vue/test-utils';
import { DtIcon } from '@/components/icon';

const baseProps = {
  kind: 'warning',
};
const baseSlots = {};

let mockProps = {};
let mockSlots = {};

const testContext = {};

describe('DtNoticeIcon tests', () => {
  let wrapper;
  let icon;

  const updateWrapper = async () => {
    wrapper = mount(DtNoticeIcon, {
      components: { DtIcon },
      propsData: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      localVue: testContext.localVue,
    });

    await vi.dynamicImportSettled();

    icon = wrapper.findComponent(DtIcon);
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(async function () {
    await updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
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
        mockProps = { kind: 'base' };

        await updateWrapper();
      });

      it('Should render base icon', () => {
        expect(icon.classes().includes('d-icon--bell')).toBe(true);
      });
    });

    describe('When custom icon is passed into the slot', () => {
      beforeEach(async () => {
        mockSlots = { default: '<dt-icon name="accessibility" />' };
        await updateWrapper();
      });

      it('Should render correctly', async () => {
        expect(icon.classes().includes('d-icon--accessibility')).toBe(true);
      });
    });
  });
});
