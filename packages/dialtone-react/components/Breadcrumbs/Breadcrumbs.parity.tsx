import type { ParityMap } from '../../parity/types';
import { DtBreadcrumbs } from './Breadcrumbs';

// Vue's `aria-label` is a prop (`ariaLabel`), so it reaches the nav through that prop.
export default { component: DtBreadcrumbs, props: { 'aria-label': 'ariaLabel' } } satisfies ParityMap;
