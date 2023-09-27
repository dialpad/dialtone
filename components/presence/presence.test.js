import { createLocalVue, mount } from '@vue/test-utils';
import DtPresence from './presence.vue';

const MOCK_SR_TEXT = 'SR Presence Text';

const baseProps = {};
let mockProps = {};
const testContext = {};

describe('DtPresence Tests', () => {
  let wrapper;
  let presence;
  let innerPresence;

  const updateWrapper = () => {
    wrapper = mount(DtPresence, {
      propsData: { ...baseProps, ...mockProps },
      localVue: testContext.localVue,
    });

    presence = wrapper.find('[data-qa="dt-presence"]');
    innerPresence = wrapper.find('.d-presence__inner');
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    describe('When presence renders', () => {
      it('should exist', () => {
        expect(presence.exists()).toBe(true);
      });
    });

    describe('Presence attributes', () => {
      it('should have role=status', () => {
        expect(presence.attributes('role')).toBe('status');
      });

      it('should have aria-live=off by default', () => {
        expect(presence.attributes('aria-live')).toBe('off');
      });

      it('should be able to set aria-live attribute', async () => {
        await wrapper.setProps({ ariaLive: 'assertive' });

        expect(presence.attributes('aria-live')).toBe('assertive');
      });
    });

    describe('SR Text', () => {
      beforeEach(() => {
        mockProps = { srText: MOCK_SR_TEXT };

        updateWrapper();
      });

      it('should correctly render the screen-reader <span/> when an srText prop is passed', () => {
        const srSpan = presence.find('span');

        expect(srSpan.exists()).toBe(true);
      });

      it('should have the `sr-only` class', () => {
        const srSpan = presence.find('span');

        expect(srSpan.classes().includes('sr-only')).toBe(true);
      });

      it('should contain the content of the srText prop', () => {
        const srSpan = presence.find('span');

        expect(srSpan.text()).toBe(MOCK_SR_TEXT);
      });
    });

    describe('Presence color when presence is passed through a prop', () => {
      describe('When presence is active', () => {
        it('should have correct color class based on presence', async () => {
          await wrapper.setProps({ presence: 'active' });

          expect(innerPresence.classes('d-presence__inner--active')).toBe(true);
        });
      });

      describe('When presence is away', () => {
        it('should have correct color class based on presence', async () => {
          await wrapper.setProps({ presence: 'away' });

          expect(innerPresence.classes('d-presence__inner--away')).toBe(true);
        });
      });

      describe('When presence is busy', () => {
        it('should have correct color class based on presence', async () => {
          await wrapper.setProps({ presence: 'busy' });

          expect(innerPresence.classes('d-presence__inner--busy')).toBe(true);
        });
      });

      describe('When presence is offline', () => {
        it('should have correct color class based on presence', async () => {
          await wrapper.setProps({ presence: 'offline' });

          expect(innerPresence.classes('d-presence__inner--offline')).toBe(true);
        });
      });
    });
  });
});
