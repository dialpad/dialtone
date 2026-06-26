import { computed, nextTick, ref, watch } from 'vue';
import { getUniqueString } from '@/src/lib/utils';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';

/**
 * Property that can be used to store persistent data in local storage for a reactive `ref(...)` object.
 *
 * Wraps a `ref(...)` providing read and write functionality that also updates a local storage value.
 * A value will be searched for in local storage based on the 'key' if not found it will use the 'defaultValue'.
 *
 * Uses JSON serialization so values retain their true data types.
 *
 * @param {string} key - The local storage key.
 * @param {*} defaultValue - The default value when value is not in local storage.
 * @returns {WritableComputedRef<*>} The cached ref object.
 */
export function cachedRef (key, defaultValue) {
  const reference = ref(JSON.parse(window.localStorage.getItem(key)) || defaultValue);
  return computed({
    get: () => reference.value,
    set (value) {
      window.localStorage.setItem(key, JSON.stringify(value));
      reference.value = value;
    },
  });
}

/**
 * Property that can be used with `v-model`.
 * Intended to wrap reactive objects such as `ref(...)` and `reactive(...)`.
 *
 * get: Gets the wrapped object
 * set: Invokes a handler with the first parameter being a provided event value
 *   and the second parameter is the wrapped object. Allows vue emit events to
 *   interact with the wrapped object.
 *
 * @param {object} model - The target object to wrap.
 * @param {Function} handler - The handler function, should take an event value and use it to modify the wrapped object.
 * @returns {WritableComputedRef<*>} The computed model object.
 */
export function computedModel (model, handler) {
  return computed({
    get: () => model.value,
    set: (e) => handler(e, model.value),
  });
}

/**
 * Interface for an array of unique 'id' strings where
 * the indexes represent their position in some external iterable.
 *
 * addId: Generate and push 'id' string to array.
 * removeId: Remove 'id' string at index position, returns the 'id' string.
 * getId: Gets the 'id' string at index position, if 'id' string is not existent a new one will be generated.
 *
 * @param {string} prefix - The prefix used to generate unique id values.
 * @returns {{addId: addId, removeId: removeId, getId: getId}} The id map object.
 */
export function idMap (prefix) {
  const map = [];

  function add () {
    const id = getUniqueString(prefix);
    map.push(id);
    return id;
  }

  function remove (index) {
    const [id] = map.splice(index, 1);
    return id;
  }

  function get (index) {
    let id = map[index];
    if (!id) {
      id = getUniqueString(prefix);
      map.splice(index, 0, id);
    }
    return id;
  }

  return {
    addId: add,
    removeId: remove,
    getId: get,
  };
}

/**
 * Shared emptiness and clear-disabled state for clearable controls. Every clearable
 * control (input, segmented, selection) derives "is this empty" and "can the remove
 * button fire" from `value` and the `clearable`/`required`/`disabled` props the same way.
 *
 * @param {object} props - Control props exposing `value`, `clearable`, `required`, `disabled`.
 * @returns {{ isEmpty: import('vue').ComputedRef<boolean>, clearDisabled: import('vue').ComputedRef<boolean> }}
 */
export function useClearableState (props) {
  const isEmpty = computed(() => props.value === null || props.value === undefined || props.value === '');
  const clearDisabled = computed(() => !props.clearable || props.required || props.disabled || isEmpty.value);
  return { isEmpty, clearDisabled };
}

/**
 * Collapse/expand/clear state machine for the text-style input controls (string,
 * number, slot). They behave identically and differ only in how the raw input value
 * is mapped to the emitted value, which the caller supplies via `parse`.
 *
 * The `hasInternalUpdate` flag distinguishes a user edit (which must keep the field
 * expanded even when cleared to empty) from an external reset (which collapses the
 * control). It is load-bearing for input controls: clearing the field to empty would
 * otherwise trip the value watcher's collapse branch while the user is still typing.
 *
 * @param {object} options
 * @param {object} options.props - Control props (`value`, `clearable`, `required`, `disabled`).
 * @param {Function} options.emit - The component's `emit`.
 * @param {Function} [options.parse] - Maps the raw input value to the emitted value.
 * @returns {object} State and handlers for the control template.
 */
export function useClearableInput ({ props, emit, parse = (value) => value }) {
  const { isEmpty, clearDisabled } = useClearableState(props);
  const expanded = ref(false);
  const inputRef = ref(null);
  const hasPendingValue = ref(false);
  const hasInternalUpdate = ref(false);

  const inputValue = computed(() => props.value ?? '');

  function updateValue (rawValue) {
    const value = parse(rawValue);
    expanded.value = true;
    hasInternalUpdate.value = true;
    hasPendingValue.value = value !== null && value !== undefined && value !== '';
    emit(VALUE_UPDATE_EVENT, value);
  }

  async function addValue () {
    expanded.value = true;
    await nextTick();
    inputRef.value?.focus();
  }

  function collapseIfEmpty () {
    if (!isEmpty.value || hasPendingValue.value) return;
    expanded.value = false;
  }

  function clearValue () {
    if (clearDisabled.value) return;
    expanded.value = false;
    hasPendingValue.value = false;
    emit(VALUE_UPDATE_EVENT, null);
  }

  watch(() => props.value, () => {
    hasPendingValue.value = false;
    if (hasInternalUpdate.value) {
      hasInternalUpdate.value = false;
      return;
    }
    if (isEmpty.value) expanded.value = false;
  });

  return { expanded, inputRef, inputValue, isEmpty, updateValue, addValue, collapseIfEmpty, clearValue };
}
