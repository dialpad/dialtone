import { createElement, StrictMode, type ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { VALIDATION_MESSAGE_TYPES } from '../constants';
import { InputGroupContext, type GroupContext } from './InputGroupContext';
import { useGroupable } from './useGroupable';
import { useInput, type InputProps } from './useInput';

// Vue validates validationState at runtime; React types it (a ValidationMessageType or ''), so the type is the
// validator. A valid state is the input's validation state. The one Vue's validator rejects is a type error, which
// fails the typecheck once the type accepts it; at runtime it passes through, as in Vue, which warns and keeps it.
const stateOf = (validationState: InputProps['validationState']) =>
  renderHook(() => useInput({ validationState })).result.current.internalValidationState;

describe('Input Mixin Tests', () => {
  describe('Validation Tests', () => {
    describe('validationState', () => {
      describe('When a validation state is not provided', () => {
        it('passes custom prop validation', () => {
          expect(stateOf(undefined)).toBe('');
        });
      });

      describe('When a validation state is provided', () => {
        describe('When validation state is empty', () => {
          it('passes custom prop validation', () => {
            expect(stateOf('')).toBe('');
          });
        });

        describe('When validation state is in VALIDATION_MESSAGE_TYPES', () => {
          it('passes custom prop validation', () => {
            expect(stateOf(VALIDATION_MESSAGE_TYPES.POSITIVE)).toBe(VALIDATION_MESSAGE_TYPES.POSITIVE);
          });
        });

        describe('When validation state is not in VALIDATION_MESSAGE_TYPES', () => {
          it('fails custom prop validation', () => {
            // @ts-expect-error: a state outside VALIDATION_MESSAGE_TYPES, which Vue's validator rejects.
            const state: InputProps['validationState'] = 'not a valid state';
            expect(stateOf(state)).toBe('not a valid state');
          });
        });
      });
    });
  });
});

// React-only. Vue's GroupableMixin lets whichever side changed last win; useGroupable always combines both.
describe('useGroupable in a group', () => {
  const inGroup = (groupContext: GroupContext) => ({ children }: { children: ReactNode }) =>
    createElement(StrictMode, null,
      createElement(InputGroupContext.Provider, { value: { groupContext, setGroupValue: () => {} } }, children));
  type Own = { name?: string; value?: unknown; disabled?: boolean; validationState?: InputProps['validationState'] };
  const useOwnInGroup = ({ name, value, disabled, validationState }: Own) =>
    useGroupable({ name, value }, useInput({ disabled, validationState }));

  it.each([
    ['disabled', { disabled: true }, { disabled: true }, { disabled: false }, true],
    ['validationState', { validationState: 'critical' }, { validationState: '' }, { validationState: 'positive' }, 'critical'],
    ['value', { value: 'G' }, { value: 'a' }, { value: 'b' }, 'G'],
  ] as const)('keeps the group\'s %s after the input\'s own changes', (key, group, before, after, expected) => {
    const internal = { disabled: 'internalDisabled', validationState: 'internalValidationState', value: 'internalValue' } as const;
    const { result, rerender } = renderHook((own: Own) => useOwnInGroup(own),
      { wrapper: inGroup({ name: 'g', ...group }), initialProps: before as Own });
    rerender(after as Own);
    expect(result.current[internal[key]]).toBe(expected);
  });

  it('warns once, on mount, when an input sets a name other than its group\'s, as Vue does in created()', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { rerender } = renderHook((own: Own) => useOwnInGroup(own),
      { wrapper: inGroup({ name: 'g' }), initialProps: { name: 'a' } as Own });
    rerender({ name: 'b' });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toMatch(/override the name prop value \(g\) with \(a\)/);
    warn.mockRestore();
  });
});
