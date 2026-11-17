import type { ParityMap } from '../../parity/types';
import { DtChip } from './Chip';

// Vue's `aria-label` is a prop (`ariaLabel`), so it reaches the inner element, not the root.
export default { component: DtChip, props: { 'aria-label': 'ariaLabel' } } satisfies ParityMap;
