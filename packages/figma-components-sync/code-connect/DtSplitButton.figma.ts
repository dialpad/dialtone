// url=https://www.figma.com/design/npTd3QwkdROTG8ZMrFgAn4/Dialtone-2026?node-id=2455-95431
// source=packages/dialtone-vue/components/SplitButton/SplitButton.vue
// component=DtSplitButton
import figma from 'figma'
const instance = figma.selectedInstance

const kind = instance.getEnum('Kind', { default: 'default', muted: 'muted', critical: 'critical', positive: 'positive' })
const importance = instance.getEnum('Importance', { clear: 'clear', outlined: 'outlined', primary: 'primary' })
const size = instance.getEnum('Size', { '100': 100, '200': 200, '300': 300, '400': 400, '500': 500 })
// Hover and focus are pseudo-states, so only `disabled` has a prop.
const state = instance.getEnum('State', { default: 'default', hover: 'hover', focus: 'focus', disabled: 'disabled' })

const label = instance.getString('Label')

const attrs = [
  kind !== 'default' ? 'kind="' + kind + '"' : '',
  importance !== 'primary' ? 'importance="' + importance + '"' : '',
  size !== 300 ? ':size="' + size + '"' : '',
  state === 'disabled' ? 'disabled' : '',
].filter(Boolean).join(' ')

export default {
  example: figma.code`<DtSplitButton${attrs ? ' ' + attrs : ''}>${label}</DtSplitButton>`,
  imports: ["import { DtSplitButton } from '@dialpad/dialtone-vue'"],
  id: 'dt-split-button',
  metadata: { nestable: true },
}
