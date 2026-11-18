import type { ParityMap } from '../../parity/types';
import { DtRootLayout } from './RootLayout';

// Vue's default slot is `children`; its story arg is named `default`.
export default { component: DtRootLayout, props: { default: 'children' } } satisfies ParityMap;
