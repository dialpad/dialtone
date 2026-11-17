import type { ParityMap } from '../../parity/types';
import { DtImageViewer } from './ImageViewer';

// Vue reads an `aria-label` attribute as the `ariaLabel` prop (it camelizes attribute names that match a prop), so it
// labels the preview button. React doesn't, so the harness passes it as the prop.
export default { component: DtImageViewer, props: { 'aria-label': 'ariaLabel' } } satisfies ParityMap;
