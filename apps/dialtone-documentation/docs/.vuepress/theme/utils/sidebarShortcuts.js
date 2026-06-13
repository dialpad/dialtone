const nonTextInputTypes = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'hidden',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
]);

const characterInputSelector = [
  '[role="combobox"]',
  '[role="searchbox"]',
  '[role="spinbutton"]',
  '[role="textbox"]',
  'select',
  'textarea',
].join(',');

export function isSidebarSearchShortcut (event) {
  return isPlainSlashShortcut(event) || isCommandKShortcut(event);
}

export function canReceiveCharacterInput (element) {
  if (!isElementLike(element)) return false;
  if (element.isContentEditable || element.closest(characterInputSelector)) return true;
  if (!element.matches('input')) return false;

  const inputType = element.getAttribute('type')?.toLowerCase() || 'text';
  return !nonTextInputTypes.has(inputType);
}

function isPlainSlashShortcut (event) {
  return event.key === '/' &&
    !event.defaultPrevented &&
    !event.isComposing &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey;
}

function isCommandKShortcut (event) {
  return event.key?.toLowerCase() === 'k' &&
    !event.defaultPrevented &&
    !event.isComposing &&
    !event.altKey &&
    !event.ctrlKey &&
    event.metaKey &&
    !event.shiftKey;
}

function isElementLike (element) {
  return Boolean(
    element &&
    typeof element.closest === 'function' &&
    typeof element.matches === 'function',
  );
}
