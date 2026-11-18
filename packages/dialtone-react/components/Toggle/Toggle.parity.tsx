import type { ParityMap } from '../../parity/types';
import { DtToggle } from './Toggle';

// v-model on a boolean, where the component also has a `value` attribute: modelValue → checked (conventions › Vue →
// React). `class` is Vue's root class: className here (the DOM parity test maps the attribute itself; the story
// parity needs the rename for the stories' `class` arg).
export default { component: DtToggle, props: { modelValue: 'checked', class: 'className' } } satisfies ParityMap;
