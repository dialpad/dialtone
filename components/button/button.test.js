import { mount } from '@vue/test-utils';
import DtButton from './button.vue';
import EmptyComponentFixture from '../../tests/fixtures/component.vue';

const MOCK_BUTTON_STUB = vi.fn();

const baseProps = {};
const baseSlots = {};
const baseAttrs = {};

let mockProps = {};
let mockSlots = {};
let mockAttrs = {};

describe('DtButton Tests', () => {
  let wrapper;
  let button;
  let icon;
  let label;

  const updateWrapper = () => {
    wrapper = mount(DtButton, {
      propsData: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      attrs: { ...baseAttrs, ...mockAttrs },
    });

    button = wrapper.find('[data-qa="dt-button"]');
    icon = wrapper.find('[data-qa="dt-button-icon"]');
    label = wrapper.find('[data-qa="dt-button-label"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    mockAttrs = {};
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default props', () => {
      it('Should render the native button', () => {
        expect(wrapper.exists()).toBe(true);
        expect(button.exists()).toBe(true);
      });

      it('Should render primary by default', async () => {
        // Default (no props) button should be d-btn--primary
        expect(button.classes().includes('d-btn--primary')).toBe(true);
      });

      it('Should not render label', async () => {
        expect(label.exists()).toBe(false);
      });

      describe('When button is a circle', () => {
        it('Should have circle class', async () => {
          await wrapper.setProps({
            circle: true,
            importance: 'outlined',
          });

          button = wrapper.find('.base-button__button');

          expect(button.classes().includes('d-btn--circle')).toBe(true);
        });
      });

      describe('When button has kind set to danger', () => {
        it('Should have danger class', async () => {
          await wrapper.setProps({
            kind: 'danger',
          });

          button = wrapper.find('.base-button__button');

          expect(button.classes().includes('d-btn--danger')).toBe(true);
        });
      });

      describe('When button has an invalid kind prop', () => {
        it('should not have danger class', async () => {
          await wrapper.setProps({
            kind: 'bad',
          });

          const expected = ['base-button__button', 'd-btn', 'd-btn--primary'];

          expect(button
            .classes()
            .every(function (value, index) { return value === expected[index]; }))
            .toBe(true);
        });
      });

      describe('When button has importance set to outlined', () => {
        it('Should have outlined class', async () => {
          await wrapper.setProps({
            importance: 'outlined',
          });

          button = wrapper.find('.base-button__button');

          expect(button.classes().includes('d-btn--outlined')).toBe(true);
        });
      });

      describe('When button has an invalid importance prop', () => {
        it('should not have importance class', async () => {
          await wrapper.setProps({
            importance: 'bad',
          });

          const expected = ['base-button__button', 'd-btn', 'd-btn--primary'];

          expect(button
            .classes()
            .every(function (value, index) { return value === expected[index]; }))
            .toBe(true);
        });
      });

      describe('When button has loading set to true', () => {
        it('Should have loading class', async () => {
          await wrapper.setProps({
            loading: true,
          });

          button = wrapper.find('.base-button__button');

          expect(button.classes().includes('d-btn--loading')).toBe(true);
        });
      });

      describe('When button has loading set to false', () => {
        it('should not have loading class', async () => {
          await wrapper.setProps({
            loading: false,
          });

          const expected = ['base-button__button', 'd-btn', 'd-btn--primary'];

          expect(button
            .classes()
            .every(function (value, index) { return value === expected[index]; }))
            .toBe(true);
        });
      });

      describe('When button has active set to true', () => {
        it('Should have active class', async () => {
          await wrapper.setProps({
            active: true,
          });

          button = wrapper.find('.base-button__button');

          expect(button.classes().includes('d-btn--active')).toBe(true);
        });
      });

      describe('When button has active set to false', () => {
        it('Should not have active class', async () => {
          await wrapper.setProps({
            active: false,
          });

          const expected = ['base-button__button', 'd-btn', 'd-btn--primary'];

          expect(button
            .classes()
            .every(function (value, index) { return value === expected[index]; }))
            .toBe(true);
        });
      });

      describe('When button only contains an icon', () => {
        it('should have icon only class', async () => {
          mockSlots = { icon: EmptyComponentFixture };

          updateWrapper();

          button = wrapper.find('.base-button__button');

          expect(button.classes().includes('d-btn--icon-only')).toBe(true);
        });
      });

      describe('When button contains an icon and text', () => {
        it('should not have icon only class', async () => {
          mockSlots = {
            default: 'text',
            icon: EmptyComponentFixture,
          };

          updateWrapper();

          const expected = ['base-button__button', 'd-btn', 'd-btn--primary'];

          expect(button
            .classes()
            .every(function (value, index) { return value === expected[index]; }))
            .toBe(true);
        });
      });

      describe('When size is set to xl', () => {
        it('Class is set to the correct size', async () => {
          await wrapper.setProps({
            size: 'xl',
          });

          button = wrapper.find('.base-button__button');

          expect(button.classes().includes('d-btn--xl')).toBe(true);
        });
      });

      describe('When button has an invalid size prop', () => {
        it('should not have a size class', async () => {
          await wrapper.setProps({
            size: 'extra medium',
          });

          const expected = ['base-button__button', 'd-btn', 'd-btn--primary'];

          expect(button
            .classes()
            .every(function (value, index) { return value === expected[index]; }))
            .toBe(true);
        });
      });

      describe('When link prop is set to true', () => {
        beforeEach(async () => {
          mockProps = { link: true };

          updateWrapper();
        });

        it('d-link class is rendered on button', () => {
          expect(button.classes().includes('d-link')).toBe(true);
        });

        describe('When link kind is invalid', () => {
          it('does not set any link kind class', async () => {
            await wrapper.setProps({
              linkKind: 'fake kind',
            });

            button = wrapper.find('.base-button__button');

            const expected = ['base-button__button', 'd-link'];

            expect(button
              .classes()
              .every(function (value, index) { return value === expected[index]; }))
              .toBe(true);
          });
        });

        describe('When link kind is danger', () => {
          it('sets the correct class', async () => {
            await wrapper.setProps({
              linkKind: 'danger',
            });

            expect(button.classes().includes('d-link--danger')).toBe(true);
          });
        });
      });
    });

    describe('With icon slot populated', () => {
      beforeEach(() => {
        mockSlots = {
          default: 'text',
          icon: EmptyComponentFixture,
        };

        updateWrapper();
      });

      it('Should add appropriate position class to icon when iconPosition is "left"', async () => {
        await wrapper.setProps({ iconPosition: 'left' });

        icon = wrapper.find('.base-button__icon');

        expect(icon.classes().includes('d-btn__icon--left')).toBe(true);
      });

      it('Should add appropriate position class to icon when iconPosition is "right"', async () => {
        await wrapper.setProps({ iconPosition: 'right' });

        icon = wrapper.find('.base-button__icon');

        expect(icon.classes().includes('d-btn__icon--right')).toBe(true);
      });

      it('Should add appropriate classes when iconPosition is "top"', async () => {
        await wrapper.setProps({ iconPosition: 'top' });

        icon = wrapper.find('.base-button__icon');

        expect(icon.classes().includes('d-btn__icon--top')).toBe(true);
        expect(button.classes().includes('d-btn--vertical')).toBe(true);
      });

      it('Should add appropriate classes when iconPosition is "bottom"', async () => {
        await wrapper.setProps({ iconPosition: 'bottom' });

        icon = wrapper.find('.base-button__icon');

        expect(icon.classes().includes('d-btn__icon--bottom')).toBe(true);
        expect(button.classes().includes('d-btn--vertical')).toBe(true);
      });
    });

    describe('When default slot is populated with text', () => {
      it('text should display in the button label', () => {
        mockSlots = { default: 'hello' };

        updateWrapper();

        expect(wrapper.find('.base-button__label').text()).toBe('hello');
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When button is clicked', () => {
      beforeEach(async () => {
        mockAttrs = { onClick: MOCK_BUTTON_STUB };
        mockSlots = { icon: EmptyComponentFixture };

        updateWrapper();

        await button.trigger('click');
      });

      it('Should call listener', async () => {
        expect(MOCK_BUTTON_STUB).toHaveBeenCalled();
      });

      it('Should emit click event', () => {
        expect(wrapper.emitted().click).toBeTruthy();
      });
    });
  });

  describe('Extendability Tests', () => {
    const customClass = 'my-custom-class';

    describe('When an label class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps = { labelClass: customClass };
        mockSlots = { default: 'My Button Label' };

        updateWrapper();

        expect(wrapper.find('.my-custom-class').html()).toBe(label.html());
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When assertiveOnFocus is true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ assertiveOnFocus: true });
      });

      describe('When button is focused', () => {
        it('aria-live should be set to "assertive"', async () => {
          await wrapper.setData({ isInFocus: true });

          expect(wrapper.attributes('aria-live') === 'assertive').toBe(true);
        });
      });

      describe('When button is not in focus', () => {
        it('aria-live is "falsy"', async () => {
          await wrapper.setData({ isInFocus: false });

          expect(wrapper.attributes('aria-live')).toBeFalsy();
        });
      });
    });
  });
});
