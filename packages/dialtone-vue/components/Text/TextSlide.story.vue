<template>
  <dt-stack
    gap="400"
    class="d-p-400"
  >
    <dt-text
      as="p"
      tone="secondary"
    >
      Hover a row or Tab to it to slide its label; leave or press Esc to snap it back. Pick the mode in
      the slide control. With reduced motion on, the label jumps to its end; the last row also shows
      the full label in a tooltip, so it can be read without motion.
    </dt-text>
    <ul
      v-for="group in groups"
      :key="group.qa"
      role="menu"
      :aria-label="group.qa"
      :dir="group.dir"
      class="d-w-350"
      :data-qa="group.qa"
    >
      <dt-list-item
        v-for="label in group.labels"
        :key="label"
        role="menuitem"
        navigation-type="tab"
      >
        <dt-text :slide="$attrs.slide">
          {{ label }}
        </dt-text>
      </dt-list-item>
    </ul>
    <ul
      role="menu"
      aria-label="slide-tooltip"
      class="d-w-350"
      data-qa="slide-tooltip"
    >
      <dt-list-item
        v-dt-tooltip="tooltipLabel"
        role="menuitem"
        navigation-type="tab"
      >
        <dt-text :slide="$attrs.slide">
          {{ tooltipLabel }}
        </dt-text>
      </dt-list-item>
    </ul>
  </dt-stack>
</template>

<script>
import { DtText } from './index';
import { DtStack } from '../Stack';
import { DtListItem } from '../ListItem';

export default {
  name: 'DtTextSlide',
  components: { DtText, DtStack, DtListItem },
  inheritAttrs: false,

  data() {
    return {
      tooltipLabel: 'Warehouse dock handset shared between three shifts',
      groups: [
        {
          qa: 'slide-menu',
          labels: [
            'Front desk reception phone, second floor east wing',
            'Conference room Aurora with ceiling microphone array',
            'Short label',
          ],
        },
        {
          qa: 'slide-rtl',
          dir: 'rtl',
          labels: ['قائمة انتظار دعم العملاء لمنطقة الشمال الغربي للمحيط الهادئ والمناطق المجاورة'],
        },
      ],
    };
  },
};
</script>
