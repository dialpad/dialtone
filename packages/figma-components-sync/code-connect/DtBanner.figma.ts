// url=https://www.figma.com/design/npTd3QwkdROTG8ZMrFgAn4/Dialtone-2026?node-id=2455-101275
// source=packages/dialtone-vue/components/Banner/Banner.vue
// component=DtBanner
import figma from 'figma'
const instance = figma.selectedInstance

const kind = instance.getEnum('Kind', { base: 'base', critical: 'critical', info: 'info', positive: 'positive', warning: 'warning' })
const important = instance.getEnum('Important', { true: true, false: false })
const header = instance.getEnum('Header', { true: true, false: false })
const showIcon = instance.getEnum('Show Icon', { true: true, false: false })
const showClose = instance.getEnum('Show Close', { true: true, false: false })
const showAction = instance.getEnum('Show Action', { true: true, false: false })

const title = instance.getString('Title')
const label = instance.getString('Label')

const attrs = [
  kind !== 'base' ? 'kind="' + kind + '"' : '',
  important ? 'important' : '',
  header ? 'header-text="' + title + '"' : '',
  showIcon ? '' : ':show-icon="false"',
  showClose ? '' : ':show-close="false"',
].filter(Boolean).join(' ')

const action = showAction ? instance.getSlot('Action (Slot)') : undefined

export default {
  example: figma.code`<DtBanner${attrs ? ' ' + attrs : ''}>
  ${label}${action ? figma.code`
  <template #action>${action}</template>` : ''}
</DtBanner>`,
  imports: ["import { DtBanner } from '@dialpad/dialtone-vue'"],
  id: 'dt-banner',
  metadata: { nestable: true },
}
