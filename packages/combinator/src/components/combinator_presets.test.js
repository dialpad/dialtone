import { mount, shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { DtAvatar, DtButton, DtCheckbox, DtCheckboxGroup, DtRichTextEditor } from '@dialpad/dialtone-vue';
import DtcCombinator from './combinator.vue';
import allDocs from '@/node_modules/@dialpad/dialtone-vue/dist/component-documentation.json';
import variants from '@/src/variants/variants';

const variantBank = variants();
const avatarDoc = allDocs.find(doc => doc.displayName === 'DtAvatar');
const buttonDoc = allDocs.find(doc => doc.displayName === 'DtButton');
let wrapper;

afterEach(() => {
  wrapper?.unmount();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

function mountCombinator (preset) {
  wrapper = shallowMount(DtcCombinator, {
    props: { component: DtAvatar, documentation: avatarDoc, variants: variantBank.DtAvatar, preset },
    global: { stubs: { teleport: false } },
  });
  return wrapper;
}

describe('Combinator preset control', () => {
  it('loads a named preset into the preview and controls on mount', () => {
    mountCombinator('image');
    expect(wrapper.vm.selectedVariant).toBe('image');
    expect(wrapper.findComponent({ name: 'DtcRenderer' }).props('options').props.imageSrc)
      .toBe('/assets/images/person.png');
    expect(wrapper.emitted('update:preset')).toBeUndefined();
  });

  it.each(['unknown', 'defaults', 'exclusions'])('falls back to default for %s', (preset) => {
    mountCombinator(preset);
    expect(wrapper.vm.selectedVariant).toBe('default');
    expect(wrapper.findComponent({ name: 'DtcRenderer' }).props('options').props.fullName)
      .toBe('Daniel Parker');
  });

  it('applies a changed preset prop and returns from the spec sheet to single view', async () => {
    mountCombinator('image');
    wrapper.vm.toggleViewMode();
    await wrapper.setProps({ preset: 'with presence' });
    expect(wrapper.vm.selectedVariant).toBe('with presence');
    expect(wrapper.vm.viewMode).toBe('single');
    expect(wrapper.findComponent({ name: 'DtcRenderer' }).props('options').props.presence).toBe('busy');
  });

  it('reports dropdown and spec sheet selections', async () => {
    mountCombinator('default');
    wrapper.vm.updateVariant('image');
    await nextTick();
    wrapper.vm.onSelectVariant('with presence');
    expect(wrapper.emitted('update:preset')).toEqual([['image'], ['with presence']]);
  });

  it('validates the requested preset again when the component changes', async () => {
    mountCombinator('with presence');
    await wrapper.setProps({ component: DtButton, documentation: buttonDoc, variants: variantBank.DtButton });
    expect(wrapper.vm.selectedVariant).toBe('default');
  });

  it('preserves spec-sheet view when an uncontrolled host changes components', async () => {
    mountCombinator();
    wrapper.vm.toggleViewMode();
    await wrapper.setProps({ component: DtButton, documentation: buttonDoc, variants: variantBank.DtButton });
    expect(wrapper.vm.viewMode).toBe('grid');
    expect(wrapper.vm.selectedVariant).toBe('default');
  });

  it('uses default at mount for an empty preset, then preserves custom edits through a prop echo', async () => {
    mountCombinator('');
    expect(wrapper.vm.selectedVariant).toBe('default');
    await nextTick();
    wrapper.vm.onComponentEvent('update:fullName', 'Edited Name');
    await wrapper.setProps({ preset: '' });
    expect(wrapper.vm.selectedVariant).toBe('');
    expect(wrapper.findComponent({ name: 'DtcRenderer' }).props('options').props.fullName).toBe('Edited Name');
  });

  it('ignores unchanged model echoes and unsupported update events', async () => {
    mountCombinator('image');
    await nextTick();
    wrapper.vm.onComponentEvent('update:fullName', 'Daniel Parker');
    wrapper.vm.onComponentEvent('update:unsupported', 'ignored');
    expect(wrapper.vm.selectedVariant).toBe('image');
    expect(wrapper.emitted('update:preset')).toBeUndefined();
  });

  it('ignores an equal object echo while still tracking an object value change', async () => {
    mountCombinator('with presence, no icon');
    await nextTick();
    wrapper.vm.onComponentEvent('update:presenceProps', { showIcon: false });
    expect(wrapper.vm.selectedVariant).toBe('with presence, no icon');
    expect(wrapper.emitted('update:preset')).toBeUndefined();
    wrapper.vm.onComponentEvent('update:presenceProps', { showIcon: true });
    expect(wrapper.vm.selectedVariant).toBe('');
    expect(wrapper.emitted('update:preset')).toEqual([['']]);
  });

  it('tracks a real CheckboxGroup push while ignoring an unchanged array echo', async () => {
    let group;
    const observedGroup = {
      ...DtCheckboxGroup,
      mounted () { group = this; },
    };
    wrapper = mount(DtcCombinator, {
      attachTo: document.body,
      props: {
        component: observedGroup,
        documentation: allDocs.find(doc => doc.displayName === 'DtCheckboxGroup'),
        library: { DtCheckbox },
        variants: variantBank.DtCheckboxGroup,
        preset: 'with validation',
      },
      global: { stubs: { DtcOptionBar: true, DtcCodePanel: true } },
    });
    await nextTick();
    const value = group.modelValue;
    group.$emit('update:modelValue', value);
    await nextTick();
    expect(wrapper.vm.selectedVariant).toBe('with validation');
    expect(wrapper.emitted('update:preset')).toBeUndefined();

    const checkbox = wrapper.findAll('input[type="checkbox"]').find(input => !input.element.checked);
    expect(checkbox).toBeDefined();
    await checkbox.setValue(true);
    expect(group.modelValue).toBe(value);
    expect(value).toHaveLength(1);
    expect(wrapper.vm.selectedVariant).toBe('');
    expect(wrapper.emitted('update:preset')).toEqual([['']]);

    wrapper.vm.updateVariant('with validation');
    await nextTick();
    expect(group.modelValue).toEqual([]);
    const restoredCheckbox = wrapper.find('input[type="checkbox"]');
    expect(restoredCheckbox.element.checked).toBe(false);
    await restoredCheckbox.setValue(true);
    expect(wrapper.vm.selectedVariant).toBe('');
    await restoredCheckbox.setValue(false);
    expect(group.modelValue).toEqual([]);
    expect(wrapper.vm.selectedVariant).toBe('');
    wrapper.vm.resetOptions();
    await nextTick();
    expect(wrapper.vm.selectedVariant).toBe('default');
    expect(group.modelValue).toEqual([]);
    const resetCheckbox = wrapper.find('input[type="checkbox"]');
    await resetCheckbox.setValue(true);
    expect(wrapper.vm.selectedVariant).toBe('');
  });

  it('keeps the editor preset through its create event and tracks later edits', async () => {
    const richTextDoc = allDocs.find(doc => doc.displayName === 'DtRichTextEditor');
    let editor;
    const createEcho = vi.spyOn(DtRichTextEditor.methods, 'triggerInputChangeEvents');
    const observedEditor = {
      ...DtRichTextEditor,
      mounted () {
        DtRichTextEditor.mounted.call(this);
        editor = this;
      },
    };
    wrapper = mount(DtcCombinator, {
      attachTo: document.body,
      props: {
        component: observedEditor,
        documentation: richTextDoc,
        variants: variantBank.DtRichTextEditor,
      },
      global: { stubs: { DtcOptionBar: true, DtcCodePanel: true } },
    });
    await vi.waitFor(() => expect(editor?.editor.isInitialized).toBe(true));
    expect(createEcho).toHaveBeenCalled();
    expect(wrapper.vm.selectedVariant).toBe('default');
    expect(wrapper.emitted('update:preset')).toBeUndefined();

    editor.editor.commands.insertContent('Edited text');
    await nextTick();
    expect(wrapper.vm.selectedVariant).toBe('');
    expect(wrapper.emitted('update:preset')).toEqual([['']]);
  });
});
