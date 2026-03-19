import { mount } from '@vue/test-utils';
import DtSegmentedControl from './segmented_control.vue';
import {
  SEGMENTED_CONTROL_SIZES,
  SEGMENTED_CONTROL_ORIENTATIONS,
  SEGMENTED_CONTROL_ACTIVATION_MODES,
} from './segmented_control_constants';

const baseOptions = [
  { value: 'all', label: 'All' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'recent', label: 'Recent' },
  { value: 'groups', label: 'Groups' },
];

const baseProps = {
  modelValue: 'all',
  options: baseOptions,
  ariaLabel: 'Test segmented control',
};

describe('DtSegmentedControl Tests', () => {
  let wrapper;

  const _setWrapper = (props = {}, attrs = {}, slots = {}) => {
    wrapper = mount(DtSegmentedControl, {
      props: { ...baseProps, ...props },
      attrs: { ...attrs },
      slots: { ...slots },
    });
  };

  afterEach(() => {
    wrapper?.unmount();
  });

  describe('Presentation Tests', () => {
    it('renders all options', () => {
      _setWrapper();

      const buttons = wrapper.findAll('[data-qa="dt-segmented-control__option"]');
      expect(buttons.length).toBe(baseOptions.length);
    });

    it('applies active class to selected option', () => {
      _setWrapper({ modelValue: 'favorites' });

      const buttons = wrapper.findAll('[data-qa="dt-segmented-control__option"]');
      expect(buttons[1].classes()).toContain('d-btn--active');
    });

    it('disables all buttons when disabled prop is true', () => {
      _setWrapper({ disabled: true });

      const buttons = wrapper.findAll('[data-qa="dt-segmented-control__option"]');
      buttons.forEach(button => {
        expect(button.attributes('disabled')).toBeDefined();
      });
    });
  });

  describe('Interactivity Tests', () => {
    it('emits update:modelValue on click', async () => {
      _setWrapper();

      const buttons = wrapper.findAll('[data-qa="dt-segmented-control__option"]');
      await buttons[2].trigger('click');

      expect(wrapper.emitted('update:modelValue')[0]).toEqual(['recent']);
    });

    it('does not emit on click when disabled', async () => {
      _setWrapper({ disabled: true });

      const buttons = wrapper.findAll('[data-qa="dt-segmented-control__option"]');
      await buttons[1].trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('emits on Enter key', async () => {
      _setWrapper();

      const buttons = wrapper.findAll('[data-qa="dt-segmented-control__option"]');
      await buttons[2].trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('update:modelValue')[0]).toEqual(['recent']);
    });

    it('emits on arrow nav when activationMode is auto', async () => {
      _setWrapper({ activationMode: 'auto' });

      const buttons = wrapper.findAll('[data-qa="dt-segmented-control__option"]');
      await buttons[0].trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('update:modelValue')[0]).toEqual(['favorites']);
    });

    it('does not emit on arrow nav when activationMode is manual', async () => {
      _setWrapper({ activationMode: 'manual' });

      const buttons = wrapper.findAll('[data-qa="dt-segmented-control__option"]');
      await buttons[0].trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('Accessibility Tests', () => {
    it('has role="radiogroup" with aria-label on container', () => {
      _setWrapper({ ariaLabel: 'My control' });

      const container = wrapper.find('[role="radiogroup"]');
      expect(container.exists()).toBe(true);
      expect(container.attributes('aria-label')).toBe('My control');
    });

    it('sets role="radio" and aria-checked on each option', () => {
      _setWrapper({ modelValue: 'favorites' });

      const buttons = wrapper.findAll('[data-qa="dt-segmented-control__option"]');
      expect(buttons[0].attributes('role')).toBe('radio');
      expect(buttons[0].attributes('aria-checked')).toBe('false');
      expect(buttons[1].attributes('aria-checked')).toBe('true');
    });

    it('selected item has tabindex 0, others have -1', () => {
      _setWrapper({ modelValue: 'favorites' });

      const buttons = wrapper.findAll('[data-qa="dt-segmented-control__option"]');
      expect(buttons[0].attributes('tabindex')).toBe('-1');
      expect(buttons[1].attributes('tabindex')).toBe('0');
      expect(buttons[2].attributes('tabindex')).toBe('-1');
      expect(buttons[3].attributes('tabindex')).toBe('-1');
    });

    it('sets aria-disabled on disabled options', () => {
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B', disabled: true },
        { value: 'c', label: 'C' },
      ];
      _setWrapper({ options, modelValue: 'a' });

      const buttons = wrapper.findAll('[data-qa="dt-segmented-control__option"]');
      expect(buttons[1].attributes('aria-disabled')).toBe('true');
    });
  });

  describe('Validation Tests', () => {
    it('validates size prop', () => {
      const validator = DtSegmentedControl.props.size.validator;
      expect(validator(SEGMENTED_CONTROL_SIZES[0])).toBe(true);
      expect(validator('INVALID')).toBe(false);
    });

    it('validates orientation prop', () => {
      const validator = DtSegmentedControl.props.orientation.validator;
      expect(validator(SEGMENTED_CONTROL_ORIENTATIONS[0])).toBe(true);
      expect(validator('INVALID')).toBe(false);
    });

    it('validates activationMode prop', () => {
      const validator = DtSegmentedControl.props.activationMode.validator;
      expect(validator(SEGMENTED_CONTROL_ACTIVATION_MODES[0])).toBe(true);
      expect(validator('INVALID')).toBe(false);
    });
  });
});
