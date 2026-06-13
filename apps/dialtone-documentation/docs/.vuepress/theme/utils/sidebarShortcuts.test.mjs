import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  canReceiveCharacterInput,
  isSidebarSearchShortcut,
} from './sidebarShortcuts.js';

const keyboardEvent = (overrides = {}) => ({
  key: '',
  defaultPrevented: false,
  isComposing: false,
  altKey: false,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
  ...overrides,
});

const element = ({
  contentEditable = false,
  inputType = null,
  role = null,
} = {}) => ({
  isContentEditable: contentEditable,
  closest (selector) {
    return role && selector.includes(`[role="${role}"]`) ? this : null;
  },
  matches (selector) {
    return selector === 'input' && inputType !== null;
  },
  getAttribute (attribute) {
    return attribute === 'type' ? inputType : null;
  },
});

describe('sidebar shortcut utilities', () => {
  it('recognizes slash and command-k as search shortcuts', () => {
    assert.equal(isSidebarSearchShortcut(keyboardEvent({ key: '/' })), true);
    assert.equal(isSidebarSearchShortcut(keyboardEvent({ key: 'k', metaKey: true })), true);
    assert.equal(isSidebarSearchShortcut(keyboardEvent({ key: 'K', metaKey: true })), true);
  });

  it('ignores modified slash and non-command-k key chords', () => {
    assert.equal(isSidebarSearchShortcut(keyboardEvent({ key: '/', metaKey: true })), false);
    assert.equal(isSidebarSearchShortcut(keyboardEvent({ key: 'k', ctrlKey: true })), false);
    assert.equal(isSidebarSearchShortcut(keyboardEvent({ key: 'k', metaKey: true, shiftKey: true })), false);
    assert.equal(isSidebarSearchShortcut(keyboardEvent({ key: 'k', metaKey: true, defaultPrevented: true })), false);
    assert.equal(isSidebarSearchShortcut(keyboardEvent({ key: 'k', metaKey: true, isComposing: true })), false);
  });

  it('detects elements that can receive character input', () => {
    assert.equal(canReceiveCharacterInput(element({ contentEditable: true })), true);
    assert.equal(canReceiveCharacterInput(element({ role: 'textbox' })), true);
    assert.equal(canReceiveCharacterInput(element({ inputType: 'search' })), true);
    assert.equal(canReceiveCharacterInput(element({ inputType: 'button' })), false);
    assert.equal(canReceiveCharacterInput(null), false);
  });
});
