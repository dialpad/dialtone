import type { ParityMap, SlotContent } from '../../parity/types';
import { DtDropdown } from './Dropdown';

// Vue's anchor slot outlet is `<slot ref="anchor" v-bind="attrs">`, so its scope carries `ref: 'anchor'` beside the
// attrs. A string ref means nothing in React, so the port's scope is the attrs alone; the key is added back here so
// the scope still matches Vue's.
const withAnchorRef = (content: SlotContent): [string, unknown] => [
  'anchor',
  typeof content === 'function'
    ? (attrs: Record<string, unknown>) => content({ ref: 'anchor', ...attrs })
    : content,
];

// Vue normalizes the `aria-label` attribute into DtPopover's ariaLabel prop; React's prop keeps Vue's name.
export default {
  component: DtDropdown,
  props: { 'aria-label': 'ariaLabel' },
  slots: { anchor: withAnchorRef },
} satisfies ParityMap;
