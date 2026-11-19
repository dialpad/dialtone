import type { ParityMap } from '../../parity/types';
import { DtSlider } from './Slider';

// v-model on a value: modelValue → value (conventions › Vue → React). Vue's `change` event carries the value, not a
// native event, so it doesn't keep the native name: it's onValueCommit, as in Radix's slider. The label slot and the
// label prop are one `label` prop.
export default {
  component: DtSlider,
  props: { modelValue: 'value', onChange: 'onValueCommit' },
  slots: { label: 'label' },
} satisfies ParityMap;
