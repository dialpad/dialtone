import { paramCase, camelCase } from 'change-case';
import { DEFAULT_SLOT_NAME } from './constants';
import { stringifyDocValue } from './parse';
import { isOmittedBindingValue } from './utils';

/** Same markup used by the clipboard UI and build-time preset delivery. */
export function serializeExampleTemplate ({ info, options, disabledMembers, verbose = false, indentSpaces = 2 }) {
  const pad = ' '.repeat(indentSpaces);
  const name = paramCase(info.displayName);
  const lines = [];

  // Visible bindings (same filter logic as code_editor_tag_attributes)
  const infoBindings = info.bindings.get();
  const optionBindings = options.bindings.get();
  const visibleBindings = Object.entries(optionBindings)
    .map(([bindingName, value]) => {
      const info = infoBindings.find(b => b.name === bindingName);
      return { ...info, name: bindingName, value };
    })
    .filter(member => {
      if (disabledMembers.has(member.name)) return false;
      if (isOmittedBindingValue(member.value)) return false;
      if (verbose) return true;
      return JSON.stringify(member.defaultValue) !== JSON.stringify(member.value);
    });

  // Format each attribute
  const attrLines = visibleBindings.map(member => {
    const v = member.value;
    if (v === true) return pad + member.label;
    const isBind = typeof v !== 'string';
    const prefix = isBind ? ':' : '';
    const str = isBind ? stringifyDocValue(v) : v.toString();
    return pad + prefix + member.label + '="' + str + '"';
  });

  // Visible slots
  const slotEntries = options.slots
    ? Object.entries(options.slots)
      .filter(([slot, value]) => value && !disabledMembers.has(slot))
    : [];

  const hasContent = slotEntries.length > 0;

  // Opening tag
  if (attrLines.length === 0 && !hasContent) {
    lines.push('<' + name + ' />');
  } else if (attrLines.length === 0) {
    lines.push('<' + name + '>');
  } else {
    lines.push('<' + name);
    lines.push(...attrLines);
    lines.push(hasContent ? '>' : '/>');
  }

  // Slot content
  if (hasContent) {
    for (const [slot, value] of slotEntries) {
      if (slot === DEFAULT_SLOT_NAME) {
        lines.push(pad + value);
      } else {
        const slotInfo = info.slots?.find(s => s.name === slot);
        const usedBindings = (slotInfo?.bindings || [])
          .map(b => camelCase(b.name))
          .filter(n => value.includes(n));
        const scope = usedBindings.length > 0
          ? '="{ ' + usedBindings.join(', ') + ' }"'
          : '';
        lines.push(pad + '<template #' + slot + scope + '>');
        lines.push(pad + pad + value);
        lines.push(pad + '</template>');
      }
    }
    lines.push('</' + name + '>');
  }

  return lines.join('\n');
}
