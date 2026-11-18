import type { ParityMap } from '../../parity/types';
import { DtFilterPill } from './FilterPill';

// Vue's v-model (modelValue) is React's controlled `value`.
export default {
  component: DtFilterPill,
  props: { modelValue: 'value' },
} satisfies ParityMap;
