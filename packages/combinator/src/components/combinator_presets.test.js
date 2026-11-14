import { mount, shallowMount } from '@vue/test-utils';
import { nextTick, reactive } from 'vue';
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

function mountCombinator (preset, bank = variantBank.DtAvatar) {
  wrapper = shallowMount(DtcCombinator, {
    props: { component: DtAvatar, documentation: avatarDoc, variants: bank, preset },
    global: { stubs: { teleport: false } },
  });
  return wrapper;
}

describe('Combinator preset control', () => {

  describe('preferred initial preset', () => {
    function preferredBank () {
      return {
        ...variantBank.DtAvatar,
        defaults: { ...variantBank.DtAvatar.defaults, metadata: { initialPreset: 'image' } },
      };
    }

    it.each([undefined, '', 'unknown'])('uses the preferred initial preset for %s', preset => {
      mountCombinator(preset, preferredBank());
      expect(wrapper.vm.selectedVariant).toBe('image');
      expect(wrapper.findComponent({ name: 'DtcRenderer' }).props('options').props.imageSrc)
        .toBe('/assets/images/person.png');
      expect(wrapper.emitted('update:preset')).toBeUndefined();
    });

    it('keeps explicit default distinct from the preferred initial preset and resets to the preference', async () => {
      mountCombinator('default', preferredBank());
      expect(wrapper.vm.selectedVariant).toBe('default');
      wrapper.vm.resetOptions();
      await nextTick();
      expect(wrapper.vm.selectedVariant).toBe('image');
      expect(wrapper.emitted('update:preset')).toEqual([['image']]);
    });

    it('retries a requested name after falling back to the preferred initial preset', async () => {
      const bank = reactive(preferredBank());
      mountCombinator('arriving', bank);
      expect(wrapper.vm.selectedVariant).toBe('image');
      bank.arriving = { props: { fullName: { initialValue: 'Arrived' } } };
      await nextTick();
      expect(wrapper.vm.selectedVariant).toBe('arriving');
      expect(wrapper.findComponent({ name: 'DtcRenderer' }).props('options').props.fullName).toBe('Arrived');
      expect(wrapper.emitted('update:preset')).toBeUndefined();
    });

    it('follows preferred metadata changes until an uncontrolled user selection takes ownership', async () => {
      const bank = reactive(preferredBank());
      mountCombinator(undefined, bank);
      wrapper.vm.toggleViewMode();
      bank.defaults.metadata.initialPreset = 'icon avatar';
      await nextTick();
      expect(wrapper.vm.selectedVariant).toBe('icon avatar');
      expect(wrapper.vm.viewMode).toBe('grid');
      wrapper.vm.updateVariant('image');
      await nextTick();
      bank.defaults.metadata.initialPreset = 'default';
      await nextTick();
      expect(wrapper.vm.selectedVariant).toBe('image');
      expect(wrapper.vm.viewMode).toBe('grid');
    });

    it('keeps custom mode when the preferred metadata changes', async () => {
      const bank = reactive(preferredBank());
      mountCombinator(undefined, bank);
      await nextTick();
      wrapper.vm.onComponentEvent('update:fullName', 'Keep this edit');
      await nextTick();
      expect(wrapper.findComponent({ name: 'DtcRenderer' }).props('options').props.fullName).toBe('Keep this edit');
      bank.defaults.metadata.initialPreset = 'icon avatar';
      await nextTick();
      expect(wrapper.vm.selectedVariant).toBe('');
    });

    it.each(['unknown', 'defaults', 'exclusions', ''])('ignores invalid preferred metadata %s', initialPreset => {
      const bank = preferredBank();
      bank.defaults.metadata.initialPreset = initialPreset;
      mountCombinator(undefined, bank);
      expect(wrapper.vm.selectedVariant).toBe('default');
    });
  });

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

  it.each(['replace', 'mutate'])('applies a pending preset when its bank arrives via %s', async mode => {
    const bank = reactive({ default: variantBank.DtAvatar.default });
    mountCombinator('image', bank);
    await nextTick();
    expect(wrapper.vm.selectedVariant).toBe('default');
    bank.extra = {};
    await nextTick();
    expect(wrapper.vm.selectedVariant).toBe('default');
    if (mode === 'replace') await wrapper.setProps({ variants: variantBank.DtAvatar });
    else { bank.image = variantBank.DtAvatar.image; await nextTick(); }
    expect(wrapper.vm.selectedVariant).toBe('image');
    expect(wrapper.findComponent({ name: 'DtcRenderer' }).props('options').props.imageSrc)
      .toBe('/assets/images/person.png');
    expect(wrapper.emitted('update:preset')).toBeUndefined();
  });

  it.each(['replace', 'mutate'])('falls back when the selected preset disappears via %s', async mode => {
    const bank = reactive({ ...variantBank.DtAvatar });
    mountCombinator('image', bank);
    await nextTick();
    if (mode === 'replace') {
      const replacement = { ...bank };
      delete replacement.image;
      await wrapper.setProps({ variants: replacement });
    } else { delete bank.image; await nextTick(); }
    expect(wrapper.vm.selectedVariant).toBe('default');
    expect(wrapper.findComponent({ name: 'DtcRenderer' }).props('options').props.fullName).toBe('Daniel Parker');
    expect(wrapper.emitted('update:preset')).toBeUndefined();
  });

  it('reapplies the requested preset when a removed name returns', async () => {
    const bank = reactive({ ...variantBank.DtAvatar });
    mountCombinator('image', bank);
    await nextTick();
    delete bank.image;
    await nextTick();
    expect(wrapper.vm.selectedVariant).toBe('default');
    bank.image = variantBank.DtAvatar.image;
    await nextTick();
    expect(wrapper.vm.selectedVariant).toBe('image');
    expect(wrapper.findComponent({ name: 'DtcRenderer' }).props('options').props.imageSrc)
      .toBe('/assets/images/person.png');
  });

  it('keeps following the prop after the user reselects its current name', async () => {
    const bank = reactive({ ...variantBank.DtAvatar });
    mountCombinator('image', bank);
    await nextTick();
    wrapper.vm.updateVariant('image');
    await nextTick();
    delete bank.image;
    await nextTick();
    expect(wrapper.vm.selectedVariant).toBe('default');
    bank.image = variantBank.DtAvatar.image;
    await nextTick();
    expect(wrapper.vm.selectedVariant).toBe('image');
    expect(wrapper.emitted('update:preset')).toEqual([['image']]);
  });

  it('preserves spec-sheet view while revalidating a removed and restored preset', async () => {
    const bank = reactive({ ...variantBank.DtAvatar });
    mountCombinator('image', bank);
    await nextTick();
    wrapper.vm.toggleViewMode();
    delete bank.image;
    await nextTick();
    expect(wrapper.vm.selectedVariant).toBe('default');
    expect(wrapper.vm.viewMode).toBe('grid');
    bank.image = variantBank.DtAvatar.image;
    await nextTick();
    expect(wrapper.vm.selectedVariant).toBe('image');
    expect(wrapper.vm.viewMode).toBe('grid');
  });

  it('falls back after an uncontrolled selection is removed without retrying that user selection later', async () => {
    const bank = reactive({ ...variantBank.DtAvatar });
    mountCombinator(undefined, bank);
    wrapper.vm.updateVariant('image');
    await nextTick();
    delete bank.image;
    await nextTick();
    expect(wrapper.vm.selectedVariant).toBe('default');
    bank.image = variantBank.DtAvatar.image;
    await nextTick();
    expect(wrapper.vm.selectedVariant).toBe('default');
    expect(wrapper.emitted('update:preset')).toEqual([['image']]);
  });

  it.each(['replace', 'mutate'])('preserves an uncontrolled selection and spec sheet on unrelated %s', async mode => {
    const bank = reactive({ ...variantBank.DtAvatar });
    mountCombinator(undefined, bank);
    wrapper.vm.updateVariant('image');
    await nextTick();
    wrapper.vm.toggleViewMode();
    if (mode === 'replace') await wrapper.setProps({ variants: { ...bank, extra: {} } });
    else { bank.extra = {}; await nextTick(); }
    expect(wrapper.vm.selectedVariant).toBe('image');
    expect(wrapper.vm.viewMode).toBe('grid');
    expect(wrapper.emitted('update:preset')).toEqual([['image']]);
  });

  it.each(['default', 'selection', 'edit'])(
    'keeps a later user %s instead of retrying an unavailable preset', async action => {
      const bank = reactive({
        default: variantBank.DtAvatar.default,
        'with presence': variantBank.DtAvatar['with presence'],
      });
      mountCombinator('image', bank);
      await nextTick();
      if (action === 'default') wrapper.vm.resetOptions();
      else if (action === 'selection') wrapper.vm.updateVariant('with presence');
      else wrapper.vm.onComponentEvent('update:fullName', 'Edited name');
      await nextTick();
      bank.image = variantBank.DtAvatar.image;
      await nextTick();
      expect(wrapper.vm.selectedVariant).toBe({ default: 'default', selection: 'with presence', edit: '' }[action]);
      if (action === 'edit') {
        expect(wrapper.findComponent({ name: 'DtcRenderer' }).props('options').props.fullName).toBe('Edited name');
      }
    },
  );

  it('uses the newest preset prop when a previously requested name arrives', async () => {
    const bank = reactive({ default: variantBank.DtAvatar.default });
    mountCombinator('image', bank);
    await wrapper.setProps({ preset: 'with presence' });
    bank.image = variantBank.DtAvatar.image;
    await nextTick();
    expect(wrapper.vm.selectedVariant).toBe('default');
    bank['with presence'] = variantBank.DtAvatar['with presence'];
    await nextTick();
    expect(wrapper.vm.selectedVariant).toBe('with presence');
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

  it('keeps an initially empty preset at default when the bank changes', async () => {
    const bank = reactive({ ...variantBank.DtAvatar });
    mountCombinator('', bank);
    await nextTick();
    bank.extra = {};
    await nextTick();
    expect(wrapper.vm.selectedVariant).toBe('default');
    expect(wrapper.emitted('update:preset')).toBeUndefined();
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

  it('marks an editable code-panel slot change as custom', async () => {
    wrapper = mount(DtcCombinator, {
      attachTo: document.body,
      props: {
        component: DtButton,
        documentation: buttonDoc,
        variants: variantBank.DtButton,
        preset: 'render as warning link text',
      },
      global: { stubs: { DtcOptionBar: true }, directives: { 'dt-scrollbar': {} } },
    });
    await nextTick();
    const slot = wrapper.findAllComponents({ name: 'DtcCodeEditorSlot' })
      .find(component => component.props('name') === 'default');
    const input = slot.find('[contenteditable]');
    input.element.textContent = 'Edited label';
    await input.trigger('input');
    expect(wrapper.vm.selectedVariant).toBe('');
    expect(wrapper.emitted('update:preset')).toEqual([['']]);
    expect(wrapper.findComponent({ name: 'DtcRenderer' }).text()).toContain('Edited label');
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
