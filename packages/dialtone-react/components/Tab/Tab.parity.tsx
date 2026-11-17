import type { ParityMap } from '../../parity/types';
import { DtTabGroup } from './TabGroup';

// DtTab can't render outside a group, so the tab unit's DOM cases are DtTabGroup's Combinator presets (#1620).
export default { component: DtTabGroup } satisfies ParityMap;
