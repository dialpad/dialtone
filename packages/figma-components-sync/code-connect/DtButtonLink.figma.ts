// url=https://www.figma.com/design/npTd3QwkdROTG8ZMrFgAn4/Dialtone-2026?node-id=2455-82551
// source=packages/dialtone-vue/components/Button/Button.vue
// component=DtButton
import figma from 'figma'
const instance = figma.selectedInstance

// DtButton in link mode (`link`): its own look, with `linkKind` and `linkUnderline` in place of
// `kind` and `importance`.
const size = instance.getEnum('Size', { '100': 100, '200': 200, '300': 300, '400': 400, '500': 500 })
const state = instance.getEnum('State', { default: 'default', hover: 'hover', active: 'active', focus: 'focus', disabled: 'disabled' })
const loading = instance.getEnum('Loading', { true: true, false: false })
const linkKind = instance.getEnum('Link Kind', {
  default: 'default', critical: 'critical', warning: 'warning', positive: 'positive', info: 'info', muted: 'muted', mention: 'mention',
})
const underline = instance.getEnum('Link Underline', { true: true, false: false })

const label = instance.getString('Label')

const attrs = [
  'link',
  linkKind !== 'default' ? 'link-kind="' + linkKind + '"' : '',
  underline ? '' : ':link-underline="false"',
  size !== 300 ? ':size="' + size + '"' : '',
  state === 'active' ? 'active' : '',
  state === 'disabled' ? 'disabled' : '',
  loading ? 'loading' : '',
].filter(Boolean).join(' ')

export default {
  example: figma.code`<DtButton ${attrs}>${label}</DtButton>`,
  imports: ["import { DtButton } from '@dialpad/dialtone-vue'"],
  id: 'dt-button-link',
  metadata: { nestable: true },
}
