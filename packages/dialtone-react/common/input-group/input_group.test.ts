import { createElement, StrictMode, useLayoutEffect, type ReactNode } from 'react';
import { act, render as renderRTL, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { InputGroupContext, useInputGroupContext } from '../input/InputGroupContext';
import { useInputGroup, type InputGroupProps } from './useInputGroup';

// Vue validates `messages` at runtime; React types it (strings and messages), so the type is the validator. Valid
// messages are the group's formatted messages. The one Vue's validator rejects is a type error, which fails the
// typecheck once the type accepts it; at runtime it passes through, as in Vue, which warns and keeps it.
const formattedOf = (messages: InputGroupProps['messages']) =>
  renderHook(() => useInputGroup({ name: 'group', legend: 'Legend', messages })).result.current.formattedMessages;

describe('Input Group Mixin Tests', () => {
  describe('Validation Tests', () => {
    describe('messages', () => {
      it('passes custom prop validation', () => {
        expect(formattedOf(['Error'])).toEqual([{ message: 'Error', type: 'critical' }]);
      });

      describe('When the provided messages are numeric', () => {
        it('fails custom prop validation', () => {
          // @ts-expect-error: numeric messages, which Vue's validator rejects.
          const messages: InputGroupProps['messages'] = [123];
          expect(formattedOf(messages)).toEqual([123]);
        });
      });
    });
  });
});

// React-only: what the mixin provides, and its mounted() warning.
describe('useInputGroup', () => {
  const render = (initialProps: InputGroupProps, attrs?: { ariaLabel?: string }) =>
    renderHook((props: InputGroupProps) => {
      const state = useInputGroup(props, attrs);
      return { state, injected: useInputGroupContext() };
    }, { initialProps, wrapper: StrictMode });

  const provided = (props: InputGroupProps) => {
    const hook = renderHook((p: InputGroupProps) => useInputGroup(p), { initialProps: props, wrapper: StrictMode });
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(InputGroupContext.Provider, { value: hook.result.current.contextValue }, children);
    return { hook, injected: renderHook(() => useInputGroupContext(), { wrapper }) };
  };

  it('provides the name, disabled and validation state under Vue\'s groupContext keys', () => {
    const { injected } = provided({
      name: 'g', legend: 'L', disabled: true, messages: ['Bad', { message: 'Ok', type: 'positive' }],
    });
    expect(injected.result.current.groupContext).toEqual({
      name: 'g', disabled: true, validationState: 'critical', value: null,
    });
  });

  it('follows disabled and the messages when they change', () => {
    const { hook } = provided({ name: 'g', legend: 'L' });
    expect(hook.result.current.contextValue.groupContext).toMatchObject({ disabled: false, validationState: null });
    hook.rerender({ name: 'g', legend: 'L', disabled: true, messages: [{ message: 'Warn', type: 'warning' }] });
    expect(hook.result.current.contextValue.groupContext).toMatchObject({ disabled: true, validationState: 'warning' });
  });

  it('keeps the name it had on first render, as Vue\'s provideObj does', () => {
    const { hook } = provided({ name: 'first', legend: 'L' });
    hook.rerender({ name: 'second', legend: 'L' });
    expect(hook.result.current.contextValue.groupContext.name).toBe('first');
  });

  it('sets the value and calls onValueChange when an input reports one, when uncontrolled', () => {
    const onValueChange = vi.fn();
    const { result } = render({ name: 'g', legend: 'L', defaultValue: 'a', onValueChange });
    expect(result.current.state.contextValue.groupContext.value).toBe('a');
    act(() => result.current.state.setGroupValue('b'));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('b');
    expect(result.current.state.internalValue).toBe('b');
    expect(result.current.state.contextValue.groupContext.value).toBe('b');
  });

  it('follows value when controlled, and only reports a change', () => {
    const onValueChange = vi.fn();
    const { result, rerender } = render({ name: 'g', legend: 'L', value: 'a', onValueChange });
    act(() => result.current.state.setGroupValue('b'));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('b');
    expect(result.current.state.internalValue).toBe('a');
    rerender({ name: 'g', legend: 'L', value: 'c', onValueChange });
    expect(result.current.state.contextValue.groupContext.value).toBe('c');
  });

  it('keeps setGroupValue and the context stable when onValueChange changes, and calls the latest handler', () => {
    const first = vi.fn();
    const second = vi.fn();
    const messages = ['Bad'];
    const { result, rerender } = render({ name: 'g', legend: 'L', value: 'a', messages, onValueChange: first });
    const { setGroupValue, contextValue } = result.current.state;
    rerender({ name: 'g', legend: 'L', value: 'a', messages, onValueChange: second });
    expect(result.current.state.setGroupValue).toBe(setGroupValue);
    expect(result.current.state.contextValue).toBe(contextValue);
    act(() => result.current.state.setGroupValue('b'));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledExactlyOnceWith('b');
  });

  it('calls the new handler when an input reports a value from a layout effect in the render that replaced it', () => {
    const first = vi.fn();
    const second = vi.fn();
    // Inputs are children of the group, so their layout effects run before any effect of the group's own component.
    const Input = ({ report }: { report: boolean }) => {
      const { setGroupValue } = useInputGroupContext();
      useLayoutEffect(() => {
        if (report) setGroupValue('b');
      }, [report, setGroupValue]);
      return null;
    };
    const Group = ({ onValueChange, report }: { onValueChange: () => void; report: boolean }) => {
      const { contextValue } = useInputGroup({ name: 'g', legend: 'L', value: 'a', onValueChange });
      return createElement(InputGroupContext.Provider, { value: contextValue }, createElement(Input, { report }));
    };
    const { rerender } = renderRTL(createElement(Group, { onValueChange: first, report: false }));
    rerender(createElement(Group, { onValueChange: second, report: true }));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledExactlyOnceWith('b');
  });

  it('uses the id it was given, or else a generated one', () => {
    expect(render({ name: 'g', legend: 'L', id: 'mine' }).result.current.state.id).toBe('mine');
    expect(render({ name: 'g', legend: 'L' }).result.current.state.id).not.toBe('');
  });

  describe('When there is no legend', () => {
    const warning = 'It is expected that an aria-label is provided when there is no legend.';

    it('warns once, on mount, when there is no aria-label either', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { rerender } = render({ name: 'g' });
      rerender({ name: 'h' });
      expect(warn).toHaveBeenCalledExactlyOnceWith(warning);
      warn.mockRestore();
    });

    it('does not warn with an aria-label', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      render({ name: 'g' }, { ariaLabel: 'Group' });
      expect(warn).not.toHaveBeenCalled();
      warn.mockRestore();
    });

    it('does not warn with a legend', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      render({ name: 'g', legend: 'Legend' });
      expect(warn).not.toHaveBeenCalled();
      warn.mockRestore();
    });
  });
});
