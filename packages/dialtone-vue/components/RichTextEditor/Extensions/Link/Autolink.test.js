import { tokenize } from 'linkifyjs';
import { isValidLinkStructure } from './Autolink';

function tokenizeAs (word) {
  return tokenize(word).map(t => t.toObject('http'));
}

describe('isValidLinkStructure', () => {
  it('accepts a single link token', () => {
    expect(isValidLinkStructure(tokenizeAs('https://dialpad.design/'))).toBe(true);
  });

  it('accepts a link followed by a single unmatched closing bracket', () => {
    expect(isValidLinkStructure(tokenizeAs('https://dialpad.design/)'))).toBe(true);
  });

  it('accepts a link preceded by a single unmatched opening bracket', () => {
    expect(isValidLinkStructure(tokenizeAs('(https://dialpad.design/'))).toBe(true);
  });

  it('accepts a link symmetrically wrapped in matching brackets', () => {
    expect(isValidLinkStructure(tokenizeAs('(https://dialpad.design/)'))).toBe(true);
  });

  it('accepts a link symmetrically wrapped in matching square brackets', () => {
    expect(isValidLinkStructure(tokenizeAs('[https://dialpad.design/]'))).toBe(true);
  });

  it('rejects invalid trailing content that is not pure punctuation', () => {
    expect(isValidLinkStructure(tokenizeAs('example.com1'))).toBe(false);
  });

  it('rejects a non-link single token', () => {
    expect(isValidLinkStructure(tokenizeAs('(like'))).toBe(false);
  });
});
