import type { ParityMap } from '../../parity/types';
import { DtRichTextEditor } from './RichTextEditor';

// v-model on a value: modelValue → value (conventions › Vue → React).
export default { component: DtRichTextEditor, props: { modelValue: 'value' } } satisfies ParityMap;
