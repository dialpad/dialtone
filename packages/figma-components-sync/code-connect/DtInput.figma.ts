// url=https://www.figma.com/design/npTd3QwkdROTG8ZMrFgAn4/Dialtone-2026?node-id=2459-52970
// source=packages/dialtone-vue/components/Input/Input.vue
// component=DtInput
import figma from 'figma'
const instance = figma.selectedInstance

const size = instance.getEnum('Size', { '100': 100, '200': 200, '300': 300, '400': 400, '500': 500 })
// Hover and focus are pseudo-states, so only `disabled` has a prop.
const state = instance.getEnum('State', { default: 'default', hover: 'hover', focus: 'focus', disabled: 'disabled' })
const validation = instance.getEnum('Validation', { none: 'none', critical: 'critical', warning: 'warning', positive: 'positive' })
const showLabel = instance.getEnum('Show Label', { true: true, false: false })
const showDescription = instance.getEnum('Show Description', { true: true, false: false })
const hasStartIcon = instance.getEnum('Start Icon', { true: true, false: false })
const hasEndIcon = instance.getEnum('End Icon', { true: true, false: false })

const label = instance.getString('Label')
const value = instance.getString('Value')
const description = instance.getString('Description')

const attrs = [
  'label="' + label + '"',
  showLabel ? '' : ':show-label="false"',
  showDescription ? 'description="' + description + '"' : '',
  'model-value="' + value + '"',
  size !== 300 ? ':size="' + size + '"' : '',
  state === 'disabled' ? 'disabled' : '',
  validation !== 'none' ? ':messages="[{ message: \'Validation message\', type: \'' + validation + '\' }]"' : '',
].filter(Boolean).join(' ')

const startIcon = hasStartIcon ? instance.getSlot('Start Icon (Slot)') : undefined
const endIcon = hasEndIcon ? instance.getSlot('End Icon (Slot)') : undefined

export default {
  example: figma.code`<DtInput ${attrs}>${startIcon ? figma.code`
  <template #startIcon>${startIcon}</template>` : ''}${endIcon ? figma.code`
  <template #endIcon>${endIcon}</template>` : ''}
</DtInput>`,
  imports: ["import { DtInput } from '@dialpad/dialtone-vue'"],
  id: 'dt-input',
  metadata: { nestable: true },
}
