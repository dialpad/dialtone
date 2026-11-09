// url=https://www.figma.com/design/npTd3QwkdROTG8ZMrFgAn4/Dialtone-2026?node-id=2455-65504
// source=packages/dialtone-vue/components/Loader/Loader.vue
// component=DtLoader
import figma from 'figma'
const instance = figma.selectedInstance

const size = instance.getEnum('Size', { '100': 100, '200': 200, '300': 300, '400': 400, '500': 500, '600': 600, '700': 700, '800': 800 })

export default {
  example: figma.code`<DtLoader${size !== 500 ? ' :size="' + size + '"' : ''} />`,
  imports: ["import { DtLoader } from '@dialpad/dialtone-vue'"],
  id: 'dt-loader',
  metadata: { nestable: true },
}
