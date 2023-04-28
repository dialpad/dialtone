import { shallowMount } from '@vue/test-utils';
import { itBehavesLikeHasCorrectClass } from '../../tests/shared_examples/classes';
import DtPresence from './presence.vue';

// Constants
const baseProps = {};

describe('DtPresence Tests', () => {
  let wrapper;
  let presence;
  let innerPresence;
  // Environment
  let props = baseProps;
  let slots = {};

  // Helpers
  const _setChildWrappers = () => {
    presence = wrapper.find('[data-qa="dt-presence"]');
    innerPresence = wrapper.find('.d-presence__inner');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtPresence, {
      props,
      slots,
    });
    _setChildWrappers();
  };

  // Teardown
  afterEach(() => {
    props = baseProps;
    slots = {};
  });

  describe('Presentation Tests', () => {
    describe('When presence renders', () => {
      // Test Setup
      beforeEach(() => { _setWrappers(); });

      it('should exist', () => {
        expect(presence.exists()).toBe(true);
      });
    });

    describe('Presence attributes', () => {
      // Test Setup
      beforeEach(() => { _setWrappers(); });

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
      const srText = 'SR Presence Text';
      beforeEach(() => {
        props = {
          ...baseProps,
          srText,
        };
        _setWrappers();
      });

      it(
        'should correctly render the screen-reader <span/> when an srText prop is passed',
        () => {
          const srSpan = presence.find('span');
          expect(srSpan.exists()).toBe(true);
        },
      );
      it('should have the `sr-only` class', () => {
        const srSpan = presence.find('span');
        expect(srSpan.classes().includes('sr-only')).toBe(true);
      });
      it('should contain the content of the srText prop', () => {
        const srSpan = presence.find('span');
        expect(srSpan.text()).toBe(srText);
      });
    });

    describe('Presence color when presence is passed through a prop', () => {
      beforeEach(() => { _setWrappers(); });

      const itBehavesLikeHasCorrectColorClassForPresence = (presence, color) => {
        it('should have correct color class based on presence', async () => {
          await wrapper.setProps({ presence });
          itBehavesLikeHasCorrectClass(innerPresence, color);
        });
      };

      describe('When presence is active', () => {
        itBehavesLikeHasCorrectColorClassForPresence('active', 'd-presence__inner--active');
      });
      describe('When presence is away', () => {
        itBehavesLikeHasCorrectColorClassForPresence('away', 'd-presence__inner--away');
      });
      describe('When presence is busy', () => {
        itBehavesLikeHasCorrectColorClassForPresence('busy', 'd-presence__inner--busy');
      });
      describe('When presence is offline', () => {
        itBehavesLikeHasCorrectColorClassForPresence('offline', 'd-presence__inner--offline');
      });
    });
  });
});
