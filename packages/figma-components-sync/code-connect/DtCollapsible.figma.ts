// url=https://www.figma.com/design/npTd3QwkdROTG8ZMrFgAn4/Dialtone-2026?node-id=2455-82577
// source=packages/dialtone-vue/components/Collapsible/Collapsible.vue
// component=DtCollapsible
import figma from 'figma'
const instance = figma.selectedInstance

const open = instance.getEnum('Open', { true: true, false: false })
const anchorText = instance.getString('Anchor Text')

const content = instance.getSlot('Content (Slot)')

export default {
  example: figma.code`<DtCollapsible anchor-text="${anchorText}"${open ? ' :open="true"' : ''}>${content ? figma.code`
  <template #content>${content}</template>` : ''}
</DtCollapsible>`,
  imports: ["import { DtCollapsible } from '@dialpad/dialtone-vue'"],
  id: 'dt-collapsible',
  metadata: { nestable: true },
}
