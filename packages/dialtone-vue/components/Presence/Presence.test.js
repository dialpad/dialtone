import { mount } from '@vue/test-utils';
import DtPresence from './Presence.vue';
import { PRESENCE_STATES } from './PresenceConstants';

const MOCK_SR_TEXT = 'SR Presence Text';

const baseProps = {};
let mockProps = {};

describe('DtPresence Tests', () => {
  let wrapper;
  let presence;
  let innerPresence;

  const updateWrapper = () => {
    wrapper?.unmount();
    wrapper = mount(DtPresence, {
      props: { ...baseProps, ...mockProps },
    });

    presence = wrapper.find('[data-qa="dt-presence"]');
    innerPresence = wrapper.find('[data-qa="dt-presence-inner"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    wrapper?.unmount();
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
          await wrapper.setProps({ presence: PRESENCE_STATES.ACTIVE });

          expect(innerPresence.classes('d-presence__inner--active')).toBe(true);
        });
      });

      describe('When presence is away', () => {
        it('should have correct color class based on presence', async () => {
          await wrapper.setProps({ presence: PRESENCE_STATES.AWAY });

          expect(innerPresence.classes('d-presence__inner--away')).toBe(true);
        });
      });

      describe('When presence is busy', () => {
        it('should have correct color class based on presence', async () => {
          await wrapper.setProps({ presence: PRESENCE_STATES.BUSY });

          expect(innerPresence.classes('d-presence__inner--busy')).toBe(true);
        });
      });

      describe('When presence is offline', () => {
        it('should have correct color class based on presence', async () => {
          await wrapper.setProps({ presence: PRESENCE_STATES.OFFLINE });

          expect(innerPresence.classes('d-presence__inner--offline')).toBe(true);
        });
      });

      describe('When presence is dnd', () => {
        it('should have correct color class based on presence', async () => {
          await wrapper.setProps({ presence: PRESENCE_STATES.DND });

          expect(innerPresence.classes('d-presence__inner--dnd')).toBe(true);
        });
      });
    });

    describe('Presence icon', () => {
      const ICON_QAS = {
        [PRESENCE_STATES.ACTIVE]: 'dt-presence-active-icon',
        [PRESENCE_STATES.AWAY]: 'dt-presence-away-icon',
        [PRESENCE_STATES.BUSY]: 'dt-presence-busy-icon',
        [PRESENCE_STATES.DND]: 'dt-presence-dnd-icon',
      };

      it.each(Object.entries(ICON_QAS))(
        'should render the matching icon when presence is %s',
        (state, qa) => {
          mockProps = { presence: state };
          updateWrapper();
          expect(wrapper.find(`[data-qa="${qa}"]`).exists()).toBe(true);
        },
      );

      it('should not render an icon when presence is offline', () => {
        mockProps = { presence: PRESENCE_STATES.OFFLINE };
        updateWrapper();
        Object.values(ICON_QAS).forEach((qa) => {
          expect(wrapper.find(`[data-qa="${qa}"]`).exists()).toBe(false);
        });
      });

      it('should not render an icon when showIcon is false', () => {
        mockProps = { showIcon: false };
        updateWrapper();
        expect(wrapper.find(`[data-qa="${ICON_QAS[PRESENCE_STATES.ACTIVE]}"]`).exists()).toBe(false);
      });
    });
  });
});
