// dialtone-vue's simulatePaste (tests/setupTests.js). tests/setup.ts installs the same ClipboardEvent and
// DataTransfer stand-ins Vue's setup does, so a paste carries its clipboard data on both sides.

/** Dispatches a paste of `content` as `type` on `dispatchElement`, and returns the event. */
export function simulatePaste (content: string, type = 'text/plain', dispatchElement: EventTarget): ClipboardEvent {
  const clipboardData = new DataTransfer();
  clipboardData.setData(type, content);
  const pasteEvent = new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true });
  dispatchElement.dispatchEvent(pasteEvent);
  return pasteEvent;
}
