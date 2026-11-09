// url=https://www.figma.com/design/npTd3QwkdROTG8ZMrFgAn4/Dialtone-2026?node-id=2455-72933
// source=packages/dialtone-vue/components/Button/Button.vue
// component=DtButton
import figma from 'figma'
const instance = figma.selectedInstance

// Only what differs from DtButton's own defaults is written, so the snippet reads like the code a
// person would write: kind="default", importance="primary" and :size="300" are left out.
const kind = instance.getEnum('Kind', { default: 'default', muted: 'muted', critical: 'critical', positive: 'positive' })
const importance = instance.getEnum('Importance', { clear: 'clear', outlined: 'outlined', primary: 'primary' })
const size = instance.getEnum('Size', { '100': 100, '200': 200, '300': 300, '400': 400, '500': 500 })
// State is the one axis that is not a prop: hover and focus are pseudo-states, so only `active` and
// `disabled` have anything to write.
const state = instance.getEnum('State', { default: 'default', hover: 'hover', active: 'active', focus: 'focus', disabled: 'disabled' })
const loading = instance.getEnum('Loading', { true: true, false: false })

const label = instance.getString('Label')

// Plain strings, so the attributes can be joined and no blank line is left where one is omitted.
const attrs = [
  kind !== 'default' ? 'kind="' + kind + '"' : '',
  importance !== 'primary' ? 'importance="' + importance + '"' : '',
  size !== 300 ? ':size="' + size + '"' : '',
  state === 'active' ? 'active' : '',
  state === 'disabled' ? 'disabled' : '',
  loading ? 'loading' : '',
].filter(Boolean).join(' ')

const startIcon = instance.getBoolean('Start Icon') ? instance.getInstanceSwap('Start Icon Choice') : null
const endIcon = instance.getBoolean('End Icon') ? instance.getInstanceSwap('End Icon Choice') : null
// The icon's own template (code-connect-icons.mjs) says which DtIcon component it is. DtButton hands its
// slot the size the icon should have, so that is written here, where the icon is used.
const iconSnippet = (swapped) => {
  if (!swapped || swapped.type !== 'INSTANCE') return undefined
  const result = swapped.executeTemplate()
  const name = result.metadata && result.metadata.props && result.metadata.props.component
  return name ? figma.code`<${name} :size="iconSize" />` : result.example
}
const startIconCode = iconSnippet(startIcon)
const endIconCode = iconSnippet(endIcon)

// `leading` and `trailing` are native slots that always hold a spacer, and getSlot() only hands back a
// reference to the slot, so it cannot say whether anything was dropped in. Something was when there is
// text or an instance anywhere under it.
const slotHasContent = (name) => instance.findLayers((n) => n.type === 'TEXT' || n.type === 'INSTANCE', { path: [name] }).length > 0
const leading = slotHasContent('Leading (Slot)') ? instance.getSlot('Leading (Slot)') : undefined
const trailing = slotHasContent('Trailing (Slot)') ? instance.getSlot('Trailing (Slot)') : undefined

export default {
  example: figma.code`<DtButton${attrs ? ' ' + attrs : ''}>${leading ? figma.code`
  <template #leading>${leading}</template>` : ''}${startIconCode ? figma.code`
  <template #startIcon="{ iconSize }">${startIconCode}</template>` : ''}
  ${label}${endIconCode ? figma.code`
  <template #endIcon="{ iconSize }">${endIconCode}</template>` : ''}${trailing ? figma.code`
  <template #trailing>${trailing}</template>` : ''}
</DtButton>`,
  imports: ["import { DtButton } from '@dialpad/dialtone-vue'"],
  id: 'dt-button',
  metadata: { nestable: true },
}
