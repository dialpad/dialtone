import type { ParityMap } from '../../parity/types';
import { DtCollapsible } from './Collapsible';

// Vue camelizes the `aria-label` attribute into its `ariaLabel` prop.
export default { component: DtCollapsible, props: { 'aria-label': 'ariaLabel' } } satisfies ParityMap;
