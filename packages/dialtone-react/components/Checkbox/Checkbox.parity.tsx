import type { ParityMap } from '../../parity/types';
import { DtCheckbox } from './Checkbox';

// v-model on a boolean, where the component also has a `value` prop: modelValue → checked (conventions › Vue → React).
export default { component: DtCheckbox, props: { modelValue: 'checked' } } satisfies ParityMap;
