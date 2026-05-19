import { mount } from '@vue/test-utils';
import DtButton from './Button.vue';
import EmptyComponentFixture from '@/tests/fixtures/component.vue';
import { BUTTON_ICON_SIZES } from './ButtonConstants';

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
    MOCK_BUTTON_STUB.mockReset();
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



      describe('When button has kind set to critical', () => {
        it('Should have critical class', async () => {
          await wrapper.setProps({
            kind: 'critical',
          });

          button = wrapper.find('.base-button__button');

          expect(button.classes().includes('d-btn--critical')).toBe(true);
        });
      });

      describe('When button has an invalid kind prop', () => {
        it('should not have critical class', async () => {
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
        beforeEach(async () => {
          await wrapper.setProps({ loading: true });
          button = wrapper.find('.base-button__button');
        });

        it('Should have loading class and render a correctly sized loader', () => {
          const loader = wrapper.find('[data-qa="dt-loader"]');

          expect(button.classes().includes('d-btn--loading')).toBe(true);
          expect(loader.exists()).toBe(true);
          expect(loader.attributes('aria-hidden')).toBe('true');
          expect(loader.find('[data-qa="dt-loader-icon"]').classes())
            .toContain(`d-icon--size-${BUTTON_ICON_SIZES.md}`);
        });
      });

      describe('When button has loading set to false', () => {
        it('should not have loading class or loader', async () => {
          await wrapper.setProps({ loading: false });

          expect(button.classes().includes('d-btn--loading')).toBe(false);
          expect(wrapper.find('[data-qa="dt-loader"]').exists()).toBe(false);
        });
      });

      describe('When button is unstyled and loading', () => {
        it('Should not render a loader', async () => {
          await wrapper.setProps({ kind: 'unstyled', loading: true });

          expect(wrapper.find('[data-qa="dt-loader"]').exists()).toBe(false);
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

      describe('When size is numeric', () => {
        it('should apply the correct size class for numeric size 200', async () => {
          await wrapper.setProps({
            size: 200,
          });

          button = wrapper.find('.base-button__button');

          expect(button.classes().includes('d-btn--sm')).toBe(true);
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

        describe('When link kind is critical', () => {
          it('sets the correct class', async () => {
            await wrapper.setProps({
              linkKind: 'critical',
            });

            expect(button.classes().includes('d-link--critical')).toBe(true);
          });
        });

        describe('When linkUnderline is false', () => {
          it('should have no-underline class', async () => {
            await wrapper.setProps({ linkUnderline: false });

            expect(button.classes().includes('d-link--no-underline')).toBe(true);
          });
        });

        describe('When linkUnderline is true (default)', () => {
          it('should not have no-underline class', () => {
            expect(button.classes().includes('d-link--no-underline')).toBe(false);
          });
        });
      });

      describe('When linkUnderline is false and link is not set', () => {
        it('should not have no-underline class', async () => {
          await wrapper.setProps({ linkUnderline: false });

          expect(button.classes().includes('d-link--no-underline')).toBe(false);
        });
      });

      describe('When button has kind set to unstyled', () => {
        it('Should have unstyled class', async () => {
          await wrapper.setProps({
            kind: 'unstyled',
          });

          button = wrapper.find('.base-button__button');

          expect(button.classes().includes('d-btn--unstyled')).toBe(true);
        });
      });

      describe('When button has kind set to default', () => {
        it('Should not have unstyled class', async () => {
          await wrapper.setProps({
            kind: 'default',
          });

          button = wrapper.find('.base-button__button');

          expect(button.classes().includes('d-btn--unstyled')).toBe(false);
        });
      });

      describe('When button has kind set to unstyled with any importance', () => {
        const importances = ['clear', 'outlined', 'primary'];
        importances.forEach(importance => {
          it(`should not render importance class for kind="unstyled" and importance="${importance}"`, async () => {
            await wrapper.setProps({ kind: 'unstyled', importance });
            button = wrapper.find('.base-button__button');
            // Should only have d-btn--unstyled, not any importance class
            expect(button.classes().includes('d-btn--unstyled')).toBe(true);
            expect(button.classes().includes('d-btn--outlined')).toBe(false);
            expect(button.classes().includes('d-btn--primary')).toBe(false);
          });
        });
      });

      describe('When button is unstyled and has icon and label', () => {
        it('Should not have d-btn classes on icon and label', async () => {
          mockSlots = {
            default: 'Button Text',
            icon: EmptyComponentFixture,
          };

          updateWrapper();

          await wrapper.setProps({
            kind: 'unstyled',
          });

          icon = wrapper.find('[data-qa="dt-button-icon"]');
          label = wrapper.find('[data-qa="dt-button-label"]');

          // Icon should have base-button__icon class but not d-btn__icon
          expect(icon.classes().includes('base-button__icon')).toBe(true);
          expect(icon.classes().includes('d-btn__icon')).toBe(false);
          expect(icon.classes().some(cls => cls.startsWith('d-btn__icon--'))).toBe(false);

          // Label should have base-button__label class but not d-btn__label
          expect(label.classes().includes('base-button__label')).toBe(true);
          expect(label.classes().includes('d-btn__label')).toBe(false);
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

    describe('With startIcon slot populated', () => {
      it('Should render the start icon container', () => {
        mockSlots = {
          default: 'text',
          startIcon: EmptyComponentFixture,
        };

        updateWrapper();

        const startIcon = wrapper.find('[data-qa="dt-button-start-icon"]');

        expect(startIcon.exists()).toBe(true);
        expect(startIcon.classes().includes('d-btn__icon')).toBe(true);
        expect(startIcon.classes().includes('d-btn__icon--left')).toBe(true);
      });

      it('Should not render legacy icon slot', () => {
        mockSlots = {
          default: 'text',
          startIcon: EmptyComponentFixture,
        };

        updateWrapper();

        expect(wrapper.find('[data-qa="dt-button-icon"]').exists()).toBe(false);
      });

      it('Should have icon-only class when no label is provided', () => {
        mockSlots = {
          startIcon: EmptyComponentFixture,
        };

        updateWrapper();

        button = wrapper.find('.base-button__button');

        expect(button.classes().includes('d-btn--icon-only')).toBe(true);
      });
    });

    describe('With endIcon slot populated', () => {
      it('Should render the end icon container', () => {
        mockSlots = {
          default: 'text',
          endIcon: EmptyComponentFixture,
        };

        updateWrapper();

        const endIcon = wrapper.find('[data-qa="dt-button-end-icon"]');

        expect(endIcon.exists()).toBe(true);
        expect(endIcon.classes().includes('d-btn__icon')).toBe(true);
        expect(endIcon.classes().includes('d-btn__icon--right')).toBe(true);
      });

      it('Should not render legacy icon slot', () => {
        mockSlots = {
          default: 'text',
          endIcon: EmptyComponentFixture,
        };

        updateWrapper();

        expect(wrapper.find('[data-qa="dt-button-icon"]').exists()).toBe(false);
      });

      it('Should have icon-only class when no label is provided', () => {
        mockSlots = {
          endIcon: EmptyComponentFixture,
        };

        updateWrapper();

        button = wrapper.find('.base-button__button');

        expect(button.classes().includes('d-btn--icon-only')).toBe(true);
      });
    });

    describe('With both startIcon and endIcon slots populated', () => {
      it('Should render both icon containers', () => {
        mockSlots = {
          default: 'text',
          startIcon: EmptyComponentFixture,
          endIcon: EmptyComponentFixture,
        };

        updateWrapper();

        const startIcon = wrapper.find('[data-qa="dt-button-start-icon"]');
        const endIcon = wrapper.find('[data-qa="dt-button-end-icon"]');

        expect(startIcon.exists()).toBe(true);
        expect(endIcon.exists()).toBe(true);
      });

      it('Should suppress legacy icon slot even if provided', () => {
        mockSlots = {
          default: 'text',
          startIcon: EmptyComponentFixture,
          endIcon: EmptyComponentFixture,
          icon: EmptyComponentFixture,
        };

        updateWrapper();

        expect(wrapper.find('[data-qa="dt-button-icon"]').exists()).toBe(false);
      });

      it('Should not apply vertical layout', () => {
        mockSlots = {
          default: 'text',
          startIcon: EmptyComponentFixture,
          endIcon: EmptyComponentFixture,
        };
        mockProps = { iconPosition: 'top' };

        updateWrapper();

        button = wrapper.find('.base-button__button');

        expect(button.classes().includes('d-btn--vertical')).toBe(false);
      });
    });

    describe('With blockStartIcon slot populated', () => {
      it('Should render the block-start icon container', () => {
        mockSlots = {
          default: 'text',
          blockStartIcon: EmptyComponentFixture,
        };

        updateWrapper();

        const blockStartIcon = wrapper.find('[data-qa="dt-button-block-start-icon"]');

        expect(blockStartIcon.exists()).toBe(true);
        expect(blockStartIcon.classes().includes('d-btn__icon')).toBe(true);
        expect(blockStartIcon.classes().includes('d-btn__icon--top')).toBe(true);
      });

      it('Should not render legacy icon slot', () => {
        mockSlots = {
          default: 'text',
          blockStartIcon: EmptyComponentFixture,
        };

        updateWrapper();

        expect(wrapper.find('[data-qa="dt-button-icon"]').exists()).toBe(false);
      });

      it('Should apply vertical layout class', () => {
        mockSlots = {
          default: 'text',
          blockStartIcon: EmptyComponentFixture,
        };

        updateWrapper();

        button = wrapper.find('.base-button__button');

        expect(button.classes().includes('d-btn--vertical')).toBe(true);
      });

      it('Should have icon-only class when no label is provided', () => {
        mockSlots = {
          blockStartIcon: EmptyComponentFixture,
        };

        updateWrapper();

        button = wrapper.find('.base-button__button');

        expect(button.classes().includes('d-btn--icon-only')).toBe(true);
      });
    });

    describe('With blockEndIcon slot populated', () => {
      it('Should render the block-end icon container', () => {
        mockSlots = {
          default: 'text',
          blockEndIcon: EmptyComponentFixture,
        };

        updateWrapper();

        const blockEndIcon = wrapper.find('[data-qa="dt-button-block-end-icon"]');

        expect(blockEndIcon.exists()).toBe(true);
        expect(blockEndIcon.classes().includes('d-btn__icon')).toBe(true);
        expect(blockEndIcon.classes().includes('d-btn__icon--bottom')).toBe(true);
      });

      it('Should not render legacy icon slot', () => {
        mockSlots = {
          default: 'text',
          blockEndIcon: EmptyComponentFixture,
        };

        updateWrapper();

        expect(wrapper.find('[data-qa="dt-button-icon"]').exists()).toBe(false);
      });

      it('Should apply vertical layout class', () => {
        mockSlots = {
          default: 'text',
          blockEndIcon: EmptyComponentFixture,
        };

        updateWrapper();

        button = wrapper.find('.base-button__button');

        expect(button.classes().includes('d-btn--vertical')).toBe(true);
      });

      it('Should have icon-only class when no label is provided', () => {
        mockSlots = {
          blockEndIcon: EmptyComponentFixture,
        };

        updateWrapper();

        button = wrapper.find('.base-button__button');

        expect(button.classes().includes('d-btn--icon-only')).toBe(true);
      });
    });

    describe('With both blockStartIcon and blockEndIcon slots populated', () => {
      it('Should render both icon containers', () => {
        mockSlots = {
          default: 'text',
          blockStartIcon: EmptyComponentFixture,
          blockEndIcon: EmptyComponentFixture,
        };

        updateWrapper();

        const blockStartIcon = wrapper.find('[data-qa="dt-button-block-start-icon"]');
        const blockEndIcon = wrapper.find('[data-qa="dt-button-block-end-icon"]');

        expect(blockStartIcon.exists()).toBe(true);
        expect(blockEndIcon.exists()).toBe(true);
      });

      it('Should suppress legacy icon slot even if provided', () => {
        mockSlots = {
          default: 'text',
          blockStartIcon: EmptyComponentFixture,
          blockEndIcon: EmptyComponentFixture,
          icon: EmptyComponentFixture,
        };

        updateWrapper();

        expect(wrapper.find('[data-qa="dt-button-icon"]').exists()).toBe(false);
      });

      it('Should apply vertical layout class', () => {
        mockSlots = {
          default: 'text',
          blockStartIcon: EmptyComponentFixture,
          blockEndIcon: EmptyComponentFixture,
        };

        updateWrapper();

        button = wrapper.find('.base-button__button');

        expect(button.classes().includes('d-btn--vertical')).toBe(true);
      });
    });

    describe('With icon slot and iconPosition "blockStart"', () => {
      it('Should map "blockStart" to d-btn__icon--top class', () => {
        mockSlots = {
          default: 'text',
          icon: EmptyComponentFixture,
        };
        mockProps = { iconPosition: 'blockStart' };

        updateWrapper();

        icon = wrapper.find('[data-qa="dt-button-icon"]');

        expect(icon.classes().includes('d-btn__icon--top')).toBe(true);
      });
    });

    describe('With icon slot and iconPosition "blockEnd"', () => {
      it('Should map "blockEnd" to d-btn__icon--bottom class', () => {
        mockSlots = {
          default: 'text',
          icon: EmptyComponentFixture,
        };
        mockProps = { iconPosition: 'blockEnd' };

        updateWrapper();

        icon = wrapper.find('[data-qa="dt-button-icon"]');

        expect(icon.classes().includes('d-btn__icon--bottom')).toBe(true);
      });
    });

    describe('With icon slot and iconPosition "start"', () => {
      it('Should map "start" to d-btn__icon--left class', () => {
        mockSlots = {
          default: 'text',
          icon: EmptyComponentFixture,
        };
        mockProps = { iconPosition: 'start' };

        updateWrapper();

        icon = wrapper.find('[data-qa="dt-button-icon"]');

        expect(icon.classes().includes('d-btn__icon--left')).toBe(true);
      });
    });

    describe('With icon slot and iconPosition "end"', () => {
      it('Should map "end" to d-btn__icon--right class', () => {
        mockSlots = {
          default: 'text',
          icon: EmptyComponentFixture,
        };
        mockProps = { iconPosition: 'end' };

        updateWrapper();

        icon = wrapper.find('[data-qa="dt-button-icon"]');

        expect(icon.classes().includes('d-btn__icon--right')).toBe(true);
      });
    });

    describe('When both startIcon and icon slots are provided', () => {
      it('should render startIcon and suppress the deprecated icon slot', () => {
        mockSlots = {
          default: 'Button Text',
          startIcon: '<span>new</span>',
          icon: '<span>old</span>',
        };

        updateWrapper();

        const startIcon = wrapper.find('[data-qa="dt-button-start-icon"]');
        const legacyIcon = wrapper.find('[data-qa="dt-button-icon"]');

        expect(startIcon.exists()).toBe(true);
        expect(startIcon.text()).toContain('new');
        expect(legacyIcon.exists()).toBe(false);
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

  describe('Leading and trailing slots', () => {
    it('should render leading when provided', () => {
      mockSlots = { leading: '<span data-qa="test-leading">L</span>' };

      updateWrapper();

      expect(wrapper.find('[data-qa="test-leading"]').exists()).toBe(true);
    });

    it('should render trailing when provided', () => {
      mockSlots = { trailing: '<span data-qa="test-trailing">T</span>' };

      updateWrapper();

      expect(wrapper.find('[data-qa="test-trailing"]').exists()).toBe(true);
    });

    it('should apply leadingClass to the leading wrapper', () => {
      mockProps = { leadingClass: 'my-leading' };
      mockSlots = { leading: '<span>L</span>' };

      updateWrapper();

      expect(wrapper.find('.d-btn__leading').classes()).toContain('my-leading');
    });

    it('should apply trailingClass to the trailing wrapper', () => {
      mockProps = { trailingClass: 'my-trailing' };
      mockSlots = { trailing: '<span>T</span>' };

      updateWrapper();

      expect(wrapper.find('.d-btn__trailing').classes()).toContain('my-trailing');
    });

    it('should not render leading or trailing by default', () => {
      updateWrapper();

      expect(wrapper.find('[data-qa="test-leading"]').exists()).toBe(false);
      expect(wrapper.find('[data-qa="test-trailing"]').exists()).toBe(false);
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

  describe('Navigation Tests', () => {
    describe('When href is provided', () => {
      beforeEach(() => {
        mockProps = {
          href: 'https://example.com',
          target: '_blank',
          rel: 'noopener noreferrer',
        };

        updateWrapper();

        button = wrapper.find('[data-qa="dt-button"]');
      });

      it('Should render an <a> element', () => {
        expect(button.element.tagName).toBe('A');
      });

      it('Should apply href, target, and rel attributes', () => {
        expect(button.attributes('href')).toBe('https://example.com');
        expect(button.attributes('target')).toBe('_blank');
        expect(button.attributes('rel')).toBe('noopener noreferrer');
      });

      it('Should not apply role="button" (element navigates, native link role is correct)', () => {
        expect(button.attributes('role')).toBeUndefined();
      });
    });

    describe('When to is provided', () => {
      const RouterLinkStub = {
        name: 'RouterLink',
        template: '<a data-qa="dt-button" :href="to"><slot /></a>',
        props: ['to', 'replace'],
      };

      const updateWrapperWithRouter = (props = {}) => {
        wrapper = mount(DtButton, {
          propsData: { ...props },
          global: {
            stubs: {
              RouterLink: RouterLinkStub,
            },
          },
        });

        button = wrapper.find('[data-qa="dt-button"]');
      };

      it('Should render a <router-link> component', () => {
        updateWrapperWithRouter({ to: '/some-route' });

        expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(true);
      });

      it('Should pass to and replace props to <router-link>', () => {
        updateWrapperWithRouter({ to: '/some-route', replace: true });

        expect(wrapper.findComponent(RouterLinkStub).props('to')).toBe('/some-route');
        expect(wrapper.findComponent(RouterLinkStub).props('replace')).toBe(true);
      });

      describe('When both to and href are provided', () => {
        it('Should render <router-link> (to takes precedence)', () => {
          updateWrapperWithRouter({ to: '/some-route', href: 'https://example.com' });

          expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(true);
        });
      });
    });

    describe('Disabled state', () => {
      describe('When <a> is disabled', () => {
        beforeEach(() => {
          mockProps = {
            href: 'https://example.com',
            disabled: true,
          };

          updateWrapper();

          button = wrapper.find('[data-qa="dt-button"]');
        });

        it('Should set aria-disabled="true" and tabindex="-1"', () => {
          expect(button.attributes('aria-disabled')).toBe('true');
          expect(button.attributes('tabindex')).toBe('-1');
        });

        it('Should not render href when disabled', () => {
          expect(button.attributes('href')).toBeUndefined();
        });

        it('Should prevent click', async () => {
          const clickHandler = vi.fn();
          mockAttrs = { onClick: clickHandler };

          updateWrapper();

          button = wrapper.find('[data-qa="dt-button"]');
          await button.trigger('click');

          expect(clickHandler).not.toHaveBeenCalled();
        });
      });

      describe('When <router-link> is disabled', () => {
        it('Should set aria-disabled="true" and tabindex="-1"', () => {
          const RouterLinkStub = {
            name: 'RouterLink',
            template: '<a data-qa="dt-button"><slot /></a>',
            props: ['to', 'replace'],
          };

          wrapper = mount(DtButton, {
            propsData: { to: '/some-route', disabled: true },
            global: {
              stubs: { RouterLink: RouterLinkStub },
            },
          });

          button = wrapper.find('[data-qa="dt-button"]');

          expect(button.attributes('aria-disabled')).toBe('true');
          expect(button.attributes('tabindex')).toBe('-1');
        });
      });

      describe('When <button> is disabled', () => {
        it('Should use native disabled attribute', () => {
          mockProps = { disabled: true };

          updateWrapper();

          button = wrapper.find('[data-qa="dt-button"]');

          expect(button.attributes('disabled')).toBeDefined();
          expect(button.attributes('aria-disabled')).toBeUndefined();
        });
      });
    });

    describe('Keyboard accessibility', () => {
      describe('When <a> receives Space keydown', () => {
        it('Should trigger click', async () => {
          mockProps = { href: 'https://example.com' };

          updateWrapper();

          button = wrapper.find('[data-qa="dt-button"]');
          const clickSpy = vi.fn();
          button.element.addEventListener('click', clickSpy);

          await button.trigger('keydown', { key: ' ' });

          expect(clickSpy).toHaveBeenCalled();
        });
      });

      describe('When disabled <a> receives Space keydown', () => {
        it('Should not trigger click', async () => {
          mockProps = { href: 'https://example.com', disabled: true };

          updateWrapper();

          button = wrapper.find('[data-qa="dt-button"]');
          const clickSpy = vi.fn();
          button.element.addEventListener('click', clickSpy);

          await button.trigger('keydown', { key: ' ' });

          expect(clickSpy).not.toHaveBeenCalled();
        });
      });
    });
  });
});
