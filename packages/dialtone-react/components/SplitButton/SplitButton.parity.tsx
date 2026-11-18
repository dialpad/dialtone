import type { ParityMap } from '../../parity/types';
import { DtSplitButton } from './SplitButton';

// The `with leading` preset sets the deprecated alphaLeadingClass, which isn't ported: its replacement, which Vue
// resolves it to (`alphaLeadingClass ?? startLeadingClass`), takes the value.
export default {
  component: DtSplitButton,
  props: { alphaLeadingClass: 'startLeadingClass' },
} satisfies ParityMap;
