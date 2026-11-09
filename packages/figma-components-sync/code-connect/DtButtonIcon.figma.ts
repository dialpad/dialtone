// url=https://www.figma.com/design/npTd3QwkdROTG8ZMrFgAn4/Dialtone-2026?node-id=2455-75409
// source=packages/dialtone-vue/components/Button/Button.vue
// component=DtButton
import figma from 'figma'
const instance = figma.selectedInstance

// The circular, icon-only DtButton. Only what differs from the defaults is written.
const kind = instance.getEnum('Kind', { default: 'default', muted: 'muted', critical: 'critical', positive: 'positive' })
const importance = instance.getEnum('Importance', { clear: 'clear', outlined: 'outlined', primary: 'primary' })
const size = instance.getEnum('Size', { '100': 100, '200': 200, '300': 300, '400': 400, '500': 500 })
const state = instance.getEnum('State', { default: 'default', hover: 'hover', active: 'active', focus: 'focus', disabled: 'disabled' })
const loading = instance.getEnum('Loading', { true: true, false: false })

const attrs = [
  'circle',
  kind !== 'default' ? 'kind="' + kind + '"' : '',
  importance !== 'primary' ? 'importance="' + importance + '"' : '',
  size !== 300 ? ':size="' + size + '"' : '',
  state === 'active' ? 'active' : '',
  state === 'disabled' ? 'disabled' : '',
  loading ? 'loading' : '',
].filter(Boolean).join(' ')

const iconSnippet = (swapped) => {
  if (!swapped || swapped.type !== 'INSTANCE') return undefined
  const result = swapped.executeTemplate()
  const name = result.metadata && result.metadata.props && result.metadata.props.component
  return name ? figma.code`<${name} :size="iconSize" />` : result.example
}
const icon = iconSnippet(instance.getInstanceSwap('Start Icon Choice'))

export default {
  example: figma.code`<DtButton ${attrs}>${icon ? figma.code`
  <template #startIcon="{ iconSize }">${icon}</template>` : ''}
</DtButton>`,
  imports: ["import { DtButton } from '@dialpad/dialtone-vue'"],
  id: 'dt-button-icon',
  metadata: { nestable: true },
}
