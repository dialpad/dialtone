import type { ParityMap } from '../../parity/types';
import { DtRadioGroup } from './RadioGroup';

// v-model → `value` / `onValueChange` (conventions › Vue → React: RadioGroup's value is a string or number).
export default {
  component: DtRadioGroup,
  props: { modelValue: 'value', 'onUpdate:modelValue': 'onValueChange' },
} satisfies ParityMap;
