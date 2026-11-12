import type { ParityMap } from '../../parity/types';
import { DtRadio } from './Radio';

// Radio's v-model: modelValue (a boolean, whether the radio is checked) → checked, and its `update:modelValue` event,
// which carries the radio's value, → the native onChange (the value is in `event.target.value`).
export default {
  component: DtRadio,
  props: { modelValue: 'checked', 'onUpdate:modelValue': 'onChange' },
} satisfies ParityMap;
