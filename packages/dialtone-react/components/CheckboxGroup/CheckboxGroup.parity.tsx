import type { ParityMap } from '../../parity/types';
import { DtCheckboxGroup } from './CheckboxGroup';

// v-model → `value` / `onValueChange` (conventions › Vue → React: CheckboxGroup's value is an array).
export default {
  component: DtCheckboxGroup,
  props: { modelValue: 'value', 'onUpdate:modelValue': 'onValueChange' },
} satisfies ParityMap;
