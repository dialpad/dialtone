import { createLocalVue, shallowMount } from '@vue/test-utils';
import { assert } from 'chai';
import sinon from 'sinon';
import DtButton from './button.vue';
import EmptyComponentFixture from '../../tests/fixtures/component.vue';

describe('Dialtone Vue Button tests', function () {
  let wrapper;
  let button;
  let icon;

  let buttonStub;
  let listeners;
  let propsData;

  const _setElements = function () {
    button = wrapper.find('[data-qa="dt-button"]');
    icon = wrapper.find('[data-qa="dt-button-icon"]');
  };

  const _assertButtonDefaultClasses = function () {
    const expected = ['base-button__button', 'd-btn', 'd-btn--primary'];
    assert.isTrue(button.classes().every(function (value, index) { return value === expected[index]; }));
  };

  before(function () {
    this.localVue = createLocalVue();
  });

  describe('Presentation Tests', function () {
    describe('When rendered with default props', function () {
      beforeEach(function () {
        propsData = {};
        wrapper = shallowMount(DtButton, { propsData, localVue: this.localVue });
        _setElements();
      });

      it('Should render the native button', function () {
        assert.exists(wrapper, 'wrapper exists');
        assert.isTrue(button.exists(), '<button> native html must be rendered');
      });

      it('Should render primary by default', async function () {
        // Default (no props) button should be d-btn--primary
        assert.isTrue(button.classes().includes('d-btn--primary'));
      });

      describe('When button is a circle', function () {
        beforeEach(async function () {
          // Test that main class is populated with input props
          const props = {
            circle: true,
          };
          await wrapper.setProps(props);
        });

        it('Should have circle class', async function () {
          button = wrapper.find('.base-button__button');
          assert.isTrue(button.classes().includes('d-btn--circle'));
        });
      });

      describe('When button has kind set to danger', function () {
        beforeEach(async function () {
          // Test that main class is populated with input props
          const props = {
            kind: 'danger',
          };
          await wrapper.setProps(props);
        });

        it('Should have danger class', async function () {
          button = wrapper.find('.base-button__button');
          assert.isTrue(button.classes().includes('d-btn--danger'));
        });
      });

      describe('When button has an invalid kind prop', function () {
        beforeEach(async function () {
          const props = {
            kind: 'bad',
          };
          await wrapper.setProps(props);
        });

        it('should not have danger class', async function () {
          _assertButtonDefaultClasses();
        });
      });

      describe('When button has importance set to outlined', function () {
        beforeEach(async function () {
          // Test that main class is populated with input props
          const props = {
            importance: 'outlined',
          };
          await wrapper.setProps(props);
        });

        it('Should have outlined class', async function () {
          button = wrapper.find('.base-button__button');
          assert.isTrue(button.classes().includes('d-btn--outlined'));
        });
      });

      describe('When button has an invalid importance prop', function () {
        beforeEach(async function () {
          const props = {
            importance: 'bad',
          };
          await wrapper.setProps(props);
        });

        it('should not have importance class', async function () {
          _assertButtonDefaultClasses();
        });
      });

      describe('When button has loading set to true', function () {
        beforeEach(async function () {
          // Test that main class is populated with input props
          const props = {
            loading: true,
          };
          await wrapper.setProps(props);
        });

        it('Should have loading class', async function () {
          button = wrapper.find('.base-button__button');
          assert.isTrue(button.classes().includes('d-btn--loading'));
        });
      });

      describe('When button has loading set to false', function () {
        beforeEach(async function () {
          const props = {
            loading: false,
          };
          await wrapper.setProps(props);
        });

        it('should not have loading class', async function () {
          _assertButtonDefaultClasses();
        });
      });

      describe('When size is set to xl', function () {
        beforeEach(async function () {
          // Test that main class is populated with input props
          const props = {
            size: 'xl',
          };
          await wrapper.setProps(props);
        });

        it('Class is set to the correct size', async function () {
          button = wrapper.find('.base-button__button');
          assert.isTrue(button.classes().includes('d-btn--xl'));
        });
      });

      describe('When button has an invalid size prop', function () {
        beforeEach(async function () {
          const props = {
            size: 'extra medium',
          };
          await wrapper.setProps(props);
        });

        it('should not have a size class', async function () {
          _assertButtonDefaultClasses();
        });
      });

      describe('When link prop is set to true', function () {
        beforeEach(async function () {
          const props = {
            link: true,
          };
          await wrapper.setProps(props);
        });

        it('d-link class is rendered on button', function () {
          assert.isTrue(button.classes().includes('d-link'));
        });

        describe('When link kind is invalid', function () {
          beforeEach(async function () {
            const props = {
              linkKind: 'fake kind',
            };
            await wrapper.setProps(props);
          });

          it('does not set any link kind class', function () {
            button = wrapper.find('.base-button__button');
            const expected = ['base-button__button', 'd-link'];
            assert.isTrue(button.classes().every(function (value, index) { return value === expected[index]; }));
          });
        });

        describe('When link kind is danger', function () {
          beforeEach(async function () {
            const props = {
              linkKind: 'danger',
            };
            await wrapper.setProps(props);
          });

          it('sets the correct class', function () {
            assert.isTrue(button.classes().includes('d-link--danger'));
          });
        });
      });
    });

    describe('With icon slot populated', function () {
      beforeEach(function () {
        propsData = {};
        wrapper = shallowMount(DtButton, {
          propsData,
          slots: {
            icon: EmptyComponentFixture,
          },
          localVue: this.localVue,
        });
        _setElements();
      });

      it('Should add appropriate position class to icon when iconPosition is "left"', async function () {
        await wrapper.setProps({ iconPosition: 'left' });
        icon = wrapper.find('.base-button__icon');
        assert.isTrue(icon.classes().includes('d-btn__icon--left'));
      });

      it('Should add appropriate position class to icon when iconPosition is "right"', async function () {
        await wrapper.setProps({ iconPosition: 'right' });
        icon = wrapper.find('.base-button__icon');
        assert.isTrue(icon.classes().includes('d-btn__icon--right'));
      });
    });

    describe('When default slot is populated with text', function () {
      beforeEach(function () {
        propsData = {};
        wrapper = shallowMount(DtButton, {
          propsData,
          slots: {
            default: 'hello',
          },
          localVue: this.localVue,
        });
        _setElements();
      });

      it('text should display in the button label', function () {
        assert.strictEqual(wrapper.find('.base-button__label').text(), 'hello');
      });
    });
  });

  describe('Interactivity Tests', function () {
    beforeEach(function () {
      buttonStub = sinon.stub();
      listeners = { click: buttonStub };
      propsData = {};
      wrapper = shallowMount(DtButton, {
        listeners,
        propsData,
        slots: {
          icon: EmptyComponentFixture,
        },
        localVue: this.localVue,
      });
      _setElements();
    });

    describe('When button is clicked', function () {
      beforeEach(async function () {
        await button.trigger('click');
      });

      it('Should call listener', async function () {
        assert.isTrue(buttonStub.called);
      });

      it('Should emit click event', function () {
        assert.equal(wrapper.emitted().click);
      });
    });
  });

  describe('Accessibility Tests', function () {
    beforeEach(function () {
      wrapper = shallowMount(DtButton, {
        listeners,
        propsData,
        localVue: this.localVue,
      });
      _setElements();
    });

    describe('When assertiveOnFocus is true', function () {
      beforeEach(async function () {
        await wrapper.setProps({ assertiveOnFocus: true });
      });

      describe('When button is focused', function () {
        beforeEach(async function () {
          await wrapper.setData({ isInFocus: true });
        });

        it('aria-live should be set to "assertive"', async function () {
          assert.isTrue(wrapper.attributes('aria-live') === 'assertive');
        });
      });

      describe('When button is not in focus', function () {
        beforeEach(async function () {
          await wrapper.setData({ isInFocus: false });
        });

        it('aria-live is falsy"', async function () {
          assert.isNotOk(wrapper.attributes('aria-live'));
        });
      });
    });
  });
});
