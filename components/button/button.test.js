import { shallowMount } from '@vue/test-utils';
import DtButton from './button.vue';
import EmptyComponentFixture from '../../tests/fixtures/component.vue';
import { itBehavesLikeAppliesClassToChild } from '../../tests/shared_examples/extendability';

describe('DtButton Tests', () => {
  let wrapper;
  let button;
  let icon;
  let label;

  let buttonStub;
  let attrs;
  let props;

  const _setElements = function () {
    button = wrapper.find('[data-qa="dt-button"]');
    icon = wrapper.find('[data-qa="dt-button-icon"]');
    label = wrapper.find('[data-qa="dt-button-label"]');
  };

  const _assertButtonDefaultClasses = function () {
    const expected = ['base-button__button', 'd-btn', 'd-btn--primary'];
    expect(
      button.classes().every(function (value, index) { return value === expected[index]; }),
    ).toBe(true);
  };

  describe('Presentation Tests', () => {
    describe('When rendered with default props', () => {
      beforeEach(() => {
        props = {};
        wrapper = shallowMount(DtButton, { props });
        _setElements();
      });

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
        beforeEach(async () => {
          // Test that main class is populated with input props
          const props = {
            circle: true,
            importance: 'outlined',
          };
          await wrapper.setProps(props);
        });

        it('Should have circle class', async () => {
          button = wrapper.find('.base-button__button');
          expect(button.classes().includes('d-btn--circle')).toBe(true);
        });
      });

      describe('When button has kind set to danger', () => {
        beforeEach(async () => {
          // Test that main class is populated with input props
          const props = {
            kind: 'danger',
          };
          await wrapper.setProps(props);
        });

        it('Should have danger class', async () => {
          button = wrapper.find('.base-button__button');
          expect(button.classes().includes('d-btn--danger')).toBe(true);
        });
      });

      describe('When button has an invalid kind prop', () => {
        beforeEach(async () => {
          const props = {
            kind: 'bad',
          };
          await wrapper.setProps(props);
        });

        it('should not have danger class', async () => {
          _assertButtonDefaultClasses();
        });
      });

      describe('When button has importance set to outlined', () => {
        beforeEach(async () => {
          // Test that main class is populated with input props
          const props = {
            importance: 'outlined',
          };
          await wrapper.setProps(props);
        });

        it('Should have outlined class', async () => {
          button = wrapper.find('.base-button__button');
          expect(button.classes().includes('d-btn--outlined')).toBe(true);
        });
      });

      describe('When button has an invalid importance prop', () => {
        beforeEach(async () => {
          const props = {
            importance: 'bad',
          };
          await wrapper.setProps(props);
        });

        it('should not have importance class', async () => {
          _assertButtonDefaultClasses();
        });
      });

      describe('When button has loading set to true', () => {
        beforeEach(async () => {
          // Test that main class is populated with input props
          const props = {
            loading: true,
          };
          await wrapper.setProps(props);
        });

        it('Should have loading class', async () => {
          button = wrapper.find('.base-button__button');
          expect(button.classes().includes('d-btn--loading')).toBe(true);
        });
      });

      describe('When button has loading set to false', () => {
        beforeEach(async () => {
          const props = {
            loading: false,
          };
          await wrapper.setProps(props);
        });

        it('should not have loading class', async () => {
          _assertButtonDefaultClasses();
        });
      });

      describe('When button has active set to true', () => {
        beforeEach(async () => {
          // Test that main class is populated with input props
          const props = {
            active: true,
          };
          await wrapper.setProps(props);
        });

        it('Should have active class', async () => {
          button = wrapper.find('.base-button__button');
          expect(button.classes().includes('d-btn--active')).toBe(true);
        });
      });

      describe('When button has active set to false', () => {
        beforeEach(async () => {
          // Test that main class is populated with input props
          const props = {
            active: false,
          };
          await wrapper.setProps(props);
        });

        it('Should not have active class', async () => {
          _assertButtonDefaultClasses();
        });
      });

      describe('When button only contains an icon', () => {
        beforeEach(() => {
          props = {};
          wrapper = shallowMount(DtButton, {
            props,
            slots: {
              icon: EmptyComponentFixture,
            },
          });
          _setElements();
        });

        it('should have icon only class', async () => {
          button = wrapper.find('.base-button__button');
          expect(button.classes().includes('d-btn--icon-only')).toBe(true);
        });
      });

      describe('When button contains an icon and text', () => {
        beforeEach(() => {
          props = {};
          wrapper = shallowMount(DtButton, {
            props,
            slots: {
              default: 'text',
              icon: EmptyComponentFixture,
            },
          });
          _setElements();
        });

        it('should not have icon only class', async () => {
          _assertButtonDefaultClasses();
        });
      });

      describe('When size is set to xl', () => {
        beforeEach(async () => {
          // Test that main class is populated with input props
          const props = {
            size: 'xl',
          };
          await wrapper.setProps(props);
        });

        it('Class is set to the correct size', async () => {
          button = wrapper.find('.base-button__button');
          expect(button.classes().includes('d-btn--xl')).toBe(true);
        });
      });

      describe('When button has an invalid size prop', () => {
        beforeEach(async () => {
          const props = {
            size: 'extra medium',
          };
          await wrapper.setProps(props);
        });

        it('should not have a size class', async () => {
          _assertButtonDefaultClasses();
        });
      });

      describe('When link prop is set to true', () => {
        beforeEach(async () => {
          const props = {
            link: true,
          };
          await wrapper.setProps(props);
        });

        it('d-link class is rendered on button', () => {
          expect(button.classes().includes('d-link')).toBe(true);
        });

        describe('When link kind is invalid', () => {
          beforeEach(async () => {
            const props = {
              linkKind: 'fake kind',
            };
            await wrapper.setProps(props);
          });

          it('does not set any link kind class', () => {
            button = wrapper.find('.base-button__button');
            const expected = ['base-button__button', 'd-link'];
            expect(
              button.classes().every(function (value, index) { return value === expected[index]; }),
            ).toBe(true);
          });
        });

        describe('When link kind is danger', () => {
          beforeEach(async () => {
            const props = {
              linkKind: 'danger',
            };
            await wrapper.setProps(props);
          });

          it('sets the correct class', () => {
            expect(button.classes().includes('d-link--danger')).toBe(true);
          });
        });
      });
    });

    describe('With icon slot populated', () => {
      beforeEach(() => {
        props = {};
        wrapper = shallowMount(DtButton, {
          props,
          slots: {
            default: 'text',
            icon: EmptyComponentFixture,
          },
        });
        _setElements();
      });

      it(
        'Should add appropriate position class to icon when iconPosition is "left"',
        async () => {
          await wrapper.setProps({ iconPosition: 'left' });
          icon = wrapper.find('.base-button__icon');
          expect(icon.classes().includes('d-btn__icon--left')).toBe(true);
        },
      );

      it(
        'Should add appropriate position class to icon when iconPosition is "right"',
        async () => {
          await wrapper.setProps({ iconPosition: 'right' });
          icon = wrapper.find('.base-button__icon');
          expect(icon.classes().includes('d-btn__icon--right')).toBe(true);
        },
      );

      it(
        'Should add appropriate classes when iconPosition is "top"',
        async () => {
          await wrapper.setProps({ iconPosition: 'top' });
          icon = wrapper.find('.base-button__icon');
          expect(icon.classes().includes('d-btn__icon--top')).toBe(true);
          expect(button.classes().includes('d-btn--vertical')).toBe(true);
        },
      );

      it(
        'Should add appropriate classes when iconPosition is "bottom"',
        async () => {
          await wrapper.setProps({ iconPosition: 'bottom' });
          icon = wrapper.find('.base-button__icon');
          expect(icon.classes().includes('d-btn__icon--bottom')).toBe(true);
          expect(button.classes().includes('d-btn--vertical')).toBe(true);
        },
      );
    });

    describe('When default slot is populated with text', () => {
      beforeEach(() => {
        props = {};
        wrapper = shallowMount(DtButton, {
          props,
          slots: {
            default: 'hello',
          },
        });
        _setElements();
      });

      it('text should display in the button label', () => {
        expect(wrapper.find('.base-button__label').text()).toBe('hello');
      });
    });
  });

  describe('Interactivity Tests', () => {
    beforeEach(() => {
      buttonStub = jest.fn();
      attrs = { onClick: buttonStub };
      props = {};
      wrapper = shallowMount(DtButton, {
        attrs,
        props,
        slots: {
          icon: EmptyComponentFixture,
        },
      });
      _setElements();
    });

    describe('When button is clicked', () => {
      beforeEach(async () => {
        await button.trigger('click');
      });

      it('Should call listener', async () => {
        expect(buttonStub).toHaveBeenCalled();
      });

      it('Should emit click event', () => {
        expect(wrapper.emitted().click).toBeTruthy();
      });
    });
  });

  describe('Extendability Tests', () => {
    const customClass = 'my-custom-class';

    describe('When an label class is provided', () => {
      beforeEach(() => {
        props = {
          labelClass: customClass,
        };
        wrapper = shallowMount(DtButton, {
          props,
          slots: { default: 'My Button Label' },
        });
        _setElements();
      });

      it('should apply custom class to child', () => {
        itBehavesLikeAppliesClassToChild(wrapper, '.my-custom-class', label);
      });
    });
  });

  describe('Accessibility Tests', () => {
    beforeEach(() => {
      wrapper = shallowMount(DtButton, {
        attrs,
        props,
      });
      _setElements();
    });

    describe('When assertiveOnFocus is true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ assertiveOnFocus: true });
      });

      describe('When button is focused', () => {
        beforeEach(async () => {
          await wrapper.setData({ isInFocus: true });
        });

        it('aria-live should be set to "assertive"', async () => {
          expect(wrapper.attributes('aria-live') === 'assertive').toBe(true);
        });
      });

      describe('When button is not in focus', () => {
        beforeEach(async () => {
          await wrapper.setData({ isInFocus: false });
        });

        it('aria-live is "falsy"', async () => {
          expect(wrapper.attributes('aria-live')).toBeFalsy();
        });
      });
    });
  });
});
