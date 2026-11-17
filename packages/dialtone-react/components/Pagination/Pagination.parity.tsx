import type { ParityMap } from '../../parity/types';
import { DtPagination } from './Pagination';

// Vue's `aria-label` is a prop (`ariaLabel`), so it reaches the nav through that prop. Vue's `change` event is
// `onPageChange` here: its payload is a page number, not a native change event.
export default {
  component: DtPagination,
  props: { 'aria-label': 'ariaLabel', onChange: 'onPageChange' },
} satisfies ParityMap;
