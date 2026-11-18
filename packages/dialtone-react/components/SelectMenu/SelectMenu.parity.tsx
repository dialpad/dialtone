import type { ParityMap } from '../../parity/types';
import { DtSelectMenu } from './SelectMenu';

// v-model on a value: modelValue → value (conventions › Vue → React).
export default { component: DtSelectMenu, props: { modelValue: 'value' } } satisfies ParityMap;
