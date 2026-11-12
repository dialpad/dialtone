import type { ParityMap } from '../../parity/types';
import { DtRadio } from './Radio';

// Radio's v-model: modelValue (a boolean, whether the radio is checked) → checked, and its `update:modelValue` event,
// which carries the radio's value, → onValueChange (not onCheckedChange, which would suggest a boolean).
export default {
  component: DtRadio,
  props: { modelValue: 'checked', 'onUpdate:modelValue': 'onValueChange' },
} satisfies ParityMap;
