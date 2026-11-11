import { VALIDATION_MESSAGE_TYPES } from '../../common/constants';
import { simulatePaste } from './clipboard';
import { countVariables, findVariable, variableExists } from './node_traversal';
import { addFormattedValidationMessage, setFormattedValidationMessages } from './validation_messages';

describe('test helpers', () => {
  it('simulatePaste dispatches a paste carrying the content', () => {
    const target = document.createElement('div');
    const onPaste = vi.fn((event: ClipboardEvent) => event.clipboardData?.getData('text/plain'));
    target.addEventListener('paste', onPaste);
    const event = simulatePaste('hello', 'text/plain', target);
    expect(onPaste).toHaveBeenCalledOnce();
    expect(onPaste).toHaveReturnedWith('hello');
    expect(event.cancelable).toBe(true);
  });

  it('node traversal finds variables at any depth', () => {
    const nodes = [{ type: 'paragraph', content: [{ type: 'text' }, { type: 'variable', attrs: { id: 'a' } }] }];
    expect(findVariable(nodes, 'a')).toEqual({ type: 'variable', attrs: { id: 'a' } });
    expect(variableExists(nodes, 'b')).toBe(false);
    expect(countVariables(nodes)).toBe(1);
  });

  it('validation message helpers build formatted messages', () => {
    const messages = setFormattedValidationMessages(VALIDATION_MESSAGE_TYPES.WARNING, 'Careful');
    expect(addFormattedValidationMessage(messages, VALIDATION_MESSAGE_TYPES.INFO, 'Note')).toEqual([
      { message: 'Careful', type: 'warning' },
      { message: 'Note', type: 'info' },
    ]);
  });
});
