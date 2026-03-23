import { mount } from '@vue/test-utils';
import { h } from 'vue';
import DtSegmentedControl from './segmented_control.vue';
import DtSegmentedControlItem from './segmented_control_item.vue';
import {
  SEGMENTED_CONTROL_SIZES,
  SEGMENTED_CONTROL_ORIENTATIONS,
  SEGMENTED_CONTROL_ACTIVATION_MODES,
  SEGMENTED_CONTROL_SPREADS,
} from './segmented_control_constants';

const ITEMS = [
  { value: 'all', text: 'All' },
  { value: 'favorites', text: 'Favorites' },
  { value: 'recent', text: 'Recent' },
];

const defaultSlot = (overrides = []) => () => ITEMS.map((item, i) => {
  const itemOverrides = overrides[i] || {};
  return h(DtSegmentedControlItem, {
    value: item.value,
    ...itemOverrides,
  }, () => item.text);
});

const baseProps = {
  modelValue: 'all',
  ariaLabel: 'Test segmented control',
};

describe('DtSegmentedControl Tests', () => {
  let wrapper;

  const _setWrapper = (props = {}, slots = {}) => {
    wrapper = mount(DtSegmentedControl, {
      props: { ...baseProps, ...props },
      slots: { default: slots.default || defaultSlot() },
      attachTo: document.body,
    });
  };

  afterEach(() => {
    wrapper?.unmount();
  });

  describe('Presentation Tests', () => {
    it('renders all items', () => {
      _setWrapper();

      const items = wrapper.findAll('[data-qa="dt-segmented-control-item"]');
      expect(items.length).toBe(ITEMS.length);
    });

    it('applies active class to selected item', () => {
      _setWrapper({ modelValue: 'favorites' });

      const items = wrapper.findAll('[data-qa="dt-segmented-control-item"]');
      expect(items[1].classes()).toContain('d-btn--active');
    });

    it('disables all items when disabled prop is true', () => {
      _setWrapper({ disabled: true });

      const items = wrapper.findAll('[data-qa="dt-segmented-control-item"]');
      items.forEach(item => {
        expect(item.attributes('disabled')).toBeDefined();
      });
    });
  });

  describe('Interactivity Tests', () => {
    it('emits update:modelValue on child click', async () => {
      _setWrapper();

      const items = wrapper.findAll('[data-qa="dt-segmented-control-item"]');
      await items[2].trigger('click');

      expect(wrapper.emitted('update:modelValue')[0]).toEqual(['recent']);
    });

    it('does not emit when group is disabled', async () => {
      _setWrapper({ disabled: true });

      const items = wrapper.findAll('[data-qa="dt-segmented-control-item"]');
      await items[1].trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('emits on Enter key', async () => {
      _setWrapper();

      const items = wrapper.findAll('[data-qa="dt-segmented-control-item"]');
      await items[2].trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('update:modelValue')[0]).toEqual(['recent']);
    });

    it('emits on arrow nav when activationMode is auto', async () => {
      _setWrapper({ activationMode: 'auto' });

      const items = wrapper.findAll('[data-qa="dt-segmented-control-item"]');
      await items[0].trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('update:modelValue')[0]).toEqual(['favorites']);
    });

    it('does not emit on arrow nav when activationMode is manual', async () => {
      _setWrapper({ activationMode: 'manual' });

      const items = wrapper.findAll('[data-qa="dt-segmented-control-item"]');
      await items[0].trigger('keydown', { key: 'ArrowRight' });

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

    it('items have role="radio" and aria-checked', () => {
      _setWrapper({ modelValue: 'favorites' });

      const items = wrapper.findAll('[data-qa="dt-segmented-control-item"]');
      expect(items[0].attributes('role')).toBe('radio');
      expect(items[0].attributes('aria-checked')).toBe('false');
      expect(items[1].attributes('aria-checked')).toBe('true');
    });

    it('selected item has tabindex 0, others have -1', () => {
      _setWrapper({ modelValue: 'favorites' });

      const items = wrapper.findAll('[data-qa="dt-segmented-control-item"]');
      expect(items[0].attributes('tabindex')).toBe('-1');
      expect(items[1].attributes('tabindex')).toBe('0');
      expect(items[2].attributes('tabindex')).toBe('-1');
    });

    it('sets aria-disabled on disabled items', () => {
      const slot = () => [
        h(DtSegmentedControlItem, { value: 'a' }, () => 'A'),
        h(DtSegmentedControlItem, { value: 'b', disabled: true }, () => 'B'),
        h(DtSegmentedControlItem, { value: 'c' }, () => 'C'),
      ];
      _setWrapper({ modelValue: 'a' }, { default: slot });

      const items = wrapper.findAll('[data-qa="dt-segmented-control-item"]');
      expect(items[1].attributes('aria-disabled')).toBe('true');
    });
  });

  describe('Change Event Tests', () => {
    it('emits change event on child click', async () => {
      _setWrapper();

      const items = wrapper.findAll('[data-qa="dt-segmented-control-item"]');
      await items[2].trigger('click');

      expect(wrapper.emitted('change')[0]).toEqual(['recent']);
    });

    it('does not emit change when group is disabled', async () => {
      _setWrapper({ disabled: true });

      const items = wrapper.findAll('[data-qa="dt-segmented-control-item"]');
      await items[1].trigger('click');

      expect(wrapper.emitted('change')).toBeUndefined();
    });
  });

  describe('Before-Change Event Tests', () => {
    it('emits before-change on child click', async () => {
      _setWrapper();

      const items = wrapper.findAll('[data-qa="dt-segmented-control-item"]');
      await items[1].trigger('click');

      expect(wrapper.emitted('before-change')).toBeDefined();
    });

    it('prevents selection when before-change is cancelled', async () => {
      const onBeforeChange = vi.fn((event) => {
        event.preventDefault();
      });
      _setWrapper({ onBeforeChange });

      const items = wrapper.findAll('[data-qa="dt-segmented-control-item"]');
      await items[1].trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('Item Click/Focus Event Tests', () => {
    it('emits click event on item', async () => {
      _setWrapper();

      const itemComponents = wrapper.findAllComponents(DtSegmentedControlItem);
      await wrapper.findAll('[data-qa="dt-segmented-control-item"]')[1].trigger('click');

      expect(itemComponents[1].emitted('click')).toBeDefined();
    });

    it('emits focus event on item', async () => {
      _setWrapper();

      const itemComponents = wrapper.findAllComponents(DtSegmentedControlItem);
      await wrapper.findAll('[data-qa="dt-segmented-control-item"]')[1].trigger('focus');

      expect(itemComponents[1].emitted('focus')).toBeDefined();
    });
  });

  describe('Id Prop Tests', () => {
    it('auto-generates an id when not provided', () => {
      _setWrapper();

      expect(wrapper.find('[role="radiogroup"]').attributes('id')).toBeDefined();
    });

    it('uses provided id', () => {
      _setWrapper({ id: 'my-segmented-control' });

      expect(wrapper.find('[role="radiogroup"]').attributes('id')).toBe('my-segmented-control');
    });
  });

  describe('Data-QA Tests', () => {
    it('has data-qa on the container', () => {
      _setWrapper();

      expect(wrapper.find('[data-qa="dt-segmented-control"]').exists()).toBe(true);
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

    it('validates spread prop', () => {
      const validator = DtSegmentedControl.props.spread.validator;
      expect(validator(SEGMENTED_CONTROL_SPREADS[0])).toBe(true);
      expect(validator('INVALID')).toBe(false);
    });
  });
});
