import type { ParityMap } from '../../parity/types';
import { DtScroller } from './Scroller';

// Same prop and slot names: the default slot (a scope per item) is children, a render prop.
export default { component: DtScroller } satisfies ParityMap;
