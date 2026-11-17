import type { ParityMap } from '../../parity/types';
import { DtHovercard } from './Hovercard';

// Vue's `aria-label` attribute falls through to DtPopover, which takes it as its ariaLabel prop; the port's prop keeps
// Vue's name.
export default { component: DtHovercard, props: { 'aria-label': 'ariaLabel' } } satisfies ParityMap;
