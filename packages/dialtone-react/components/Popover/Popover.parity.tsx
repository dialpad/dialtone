import type { ParityMap } from '../../parity/types';
import { DtPopover } from './Popover';

// Vue normalizes the `aria-label` attribute into its ariaLabel prop; React's prop keeps Vue's name.
export default { component: DtPopover, props: { 'aria-label': 'ariaLabel' } } satisfies ParityMap;
