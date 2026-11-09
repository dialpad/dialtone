// url=https://www.figma.com/design/npTd3QwkdROTG8ZMrFgAn4/Dialtone-2026?node-id=2455-79260
// source=packages/dialtone-vue/components/Button/Button.vue
// component=DtButton
import figma from 'figma'
const instance = figma.selectedInstance

// DtButton with its icon above or below the label (the `blockStartIcon` and `blockEndIcon` slots).
const kind = instance.getEnum('Kind', { default: 'default', muted: 'muted', critical: 'critical', positive: 'positive' })
const importance = instance.getEnum('Importance', { clear: 'clear', outlined: 'outlined', primary: 'primary' })
const size = instance.getEnum('Size', { '100': 100, '200': 200, '300': 300, '400': 400, '500': 500 })
const state = instance.getEnum('State', { default: 'default', hover: 'hover', active: 'active', focus: 'focus', disabled: 'disabled' })
const blockIcon = instance.getEnum('Block Icon', { blockStart: 'blockStart', blockEnd: 'blockEnd' })

const label = instance.getString('Label')

const attrs = [
  kind !== 'default' ? 'kind="' + kind + '"' : '',
  importance !== 'primary' ? 'importance="' + importance + '"' : '',
  size !== 300 ? ':size="' + size + '"' : '',
  state === 'active' ? 'active' : '',
  state === 'disabled' ? 'disabled' : '',
].filter(Boolean).join(' ')

const iconSnippet = (swapped) => {
  if (!swapped || swapped.type !== 'INSTANCE') return undefined
  const result = swapped.executeTemplate()
  const name = result.metadata && result.metadata.props && result.metadata.props.component
  return name ? figma.code`<${name} :size="iconSize" />` : result.example
}
const start = blockIcon === 'blockStart' ? iconSnippet(instance.getInstanceSwap('Block Start Icon Choice')) : undefined
const end = blockIcon === 'blockEnd' ? iconSnippet(instance.getInstanceSwap('Block End Icon Choice')) : undefined

export default {
  example: figma.code`<DtButton${attrs ? ' ' + attrs : ''}>${start ? figma.code`
  <template #blockStartIcon="{ iconSize }">${start}</template>` : ''}
  ${label}${end ? figma.code`
  <template #blockEndIcon="{ iconSize }">${end}</template>` : ''}
</DtButton>`,
  imports: ["import { DtButton } from '@dialpad/dialtone-vue'"],
  id: 'dt-button-stacked',
  metadata: { nestable: true },
}
