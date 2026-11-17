import type { ParityMap } from '../../parity/types';
import { DtInputGroup } from './InputGroup';

// InputGroup's `update:modelValue` event → the `onValueChange` callback. Its `value` prop is `value` in React too.
export default {
  component: DtInputGroup,
  props: { 'onUpdate:modelValue': 'onValueChange' },
} satisfies ParityMap;
