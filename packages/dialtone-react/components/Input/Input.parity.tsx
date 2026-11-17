import type { ParityMap } from '../../parity/types';
import { DtInput } from './Input';

// v-model on a value: modelValue → value (conventions › Vue → React).
export default { component: DtInput, props: { modelValue: 'value' } } satisfies ParityMap;
