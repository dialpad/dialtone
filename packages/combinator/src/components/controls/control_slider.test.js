import { mount } from '@vue/test-utils';
import { DtSlider } from '@dialpad/dialtone-vue';
import DtcControlSlider from './control_slider.vue';
import { ADD_BUTTON_SELECTOR, REMOVE_BUTTON_SELECTOR } from '@/src/lib/test/utils_test';

const sliderConfig = { min: 0, max: 100, step: 1, suffix: '%' };
let wrapper;
const mountControl = (props = {}) => {
  wrapper = mount(DtcControlSlider, {
    props: { value: 66, sliderConfig, label: 'Progress', clearable: false, ...props },
    slots: { default: '<span>Progress heading</span>' },
  });
  return wrapper;
};
afterEach(() => wrapper?.unmount());

describe('slider adapter', () => {
  it('names the input, renders one heading and the default tooltip readout, without mount/sync writes', async () => {
    mountControl();
    expect(wrapper.find('input[type=range]').attributes('aria-label')).toBe('Progress');
    expect(wrapper.findComponent(DtSlider).props('readout')).toBe('tooltip');
    expect(wrapper.text().match(/Progress heading/g)).toHaveLength(1);
    expect(wrapper.text()).toContain('66%');
    expect(wrapper.find('[aria-label="Remove value for Progress"]').element.disabled).toBe(true);
    await wrapper.setProps({ value: 70 });
    expect(wrapper.text()).toContain('70%');
    expect(wrapper.emitted('update:value')).toBeUndefined();
  });

  it('forwards valid numeric updates live and ignores invalid ones', () => {
    mountControl();
    const slider = wrapper.findComponent(DtSlider);
    slider.vm.$emit('update:modelValue', 67);
    slider.vm.$emit('change', 67);
    slider.vm.$emit('update:modelValue', '68');
    slider.vm.$emit('update:modelValue', 68.5);
    expect(wrapper.emitted('update:value')).toEqual([[67]]);
  });

  it('blocks disabled edits', () => {
    mountControl({ disabled: true });
    expect(wrapper.find('input').element.disabled).toBe(true);
    wrapper.findComponent(DtSlider).vm.$emit('update:modelValue', 67);
    expect(wrapper.emitted('update:value')).toBeUndefined();
  });

  const invalidValues = [undefined, 66.5, 101, [66]];
  it.each(invalidValues)('does not mount a normalizing slider for %j', async value => {
    mountControl({ value });
    expect(wrapper.findComponent(DtSlider).exists()).toBe(false);
    expect(wrapper.find('input').exists()).toBe(false);
    expect(wrapper.text()).toContain('Progress heading');
    expect(wrapper.emitted('update:value')).toBeUndefined();
    await wrapper.setProps({ value: 66 });
    expect(wrapper.findComponent(DtSlider).exists()).toBe(true);
    await wrapper.setProps({ value });
    expect(wrapper.findComponent(DtSlider).exists()).toBe(false);
    expect(wrapper.emitted('update:value')).toBeUndefined();
  });

  it('renders the readout without a slider when config is missing', () => {
    mountControl({ sliderConfig: null });
    expect(wrapper.find('input').exists()).toBe(false);
  });
});

describe('optional slider values', () => {
  it('only materializes a value on Add, preserves zero, and removes to undefined', async () => {
    mountControl({ value: undefined, clearable: true, defaultValue: 0 });
    expect(wrapper.findComponent(DtSlider).exists()).toBe(false);
    expect(wrapper.emitted('update:value')).toBeUndefined();
    await wrapper.get(ADD_BUTTON_SELECTOR).trigger('click');
    expect(wrapper.emitted('update:value')).toEqual([[0]]);
    await wrapper.setProps({ value: 0 });
    expect(wrapper.findComponent(DtSlider).exists()).toBe(true);
    await wrapper.get(REMOVE_BUTTON_SELECTOR).trigger('click');
    expect(wrapper.emitted('update:value')).toEqual([[0], [undefined]]);
    await wrapper.setProps({ value: undefined });
    expect(wrapper.find(ADD_BUTTON_SELECTOR).exists()).toBe(true);
  });

  it('uses the grid minimum for explicit Add without a default and blocks unusable activation', async () => {
    mountControl({ value: null, clearable: true, sliderConfig: { min: 1, max: 10, step: 1 } });
    await wrapper.get(ADD_BUTTON_SELECTOR).trigger('click');
    expect(wrapper.emitted('update:value')).toEqual([[1]]);
    await wrapper.setProps({ disabled: true });
    expect(wrapper.get(ADD_BUTTON_SELECTOR).element.disabled).toBe(true);
    await wrapper.setProps({ disabled: false, defaultValue: 1.5 });
    expect(wrapper.get(ADD_BUTTON_SELECTOR).element.disabled).toBe(true);
    expect(wrapper.emitted('update:value')).toEqual([[1]]);
  });
});


it('keeps a single-page range noninteractive without emitting', async () => {
  mountControl({ value: 1, sliderConfig: { min: 1, max: 1, step: 1, suffix: '' } });
  expect(wrapper.findComponent(DtSlider).exists()).toBe(false);
  expect(wrapper.text()).toContain('1');
  await wrapper.setProps({ sliderConfig: { min: 1, max: 10, step: 1, suffix: '' } });
  expect(wrapper.findComponent(DtSlider).exists()).toBe(true);
  await wrapper.setProps({ value: 9, sliderConfig: { min: 1, max: 5, step: 1, suffix: '' } });
  expect(wrapper.findComponent(DtSlider).exists()).toBe(false);
  expect(wrapper.emitted('update:value')).toBeUndefined();
});
