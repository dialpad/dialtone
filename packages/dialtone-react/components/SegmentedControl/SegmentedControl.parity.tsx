import type { ParityMap } from '../../parity/types';
import { DtSegmentedControl } from './SegmentedControl';

// v-model → `value` / `onValueChange` (conventions › Vue → React).
export default {
  component: DtSegmentedControl,
  props: { modelValue: 'value', 'onUpdate:modelValue': 'onValueChange' },
} satisfies ParityMap;
