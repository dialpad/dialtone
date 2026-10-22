<template>
  <dt-stack
    id="components-badge--variants-container"
    gap="400"
  >
    <dt-stack
      v-for="(group, groupName) in BADGE_GROUPS"
      :key="groupName"
      gap="200"
    >
      <h3>{{ groupName }}</h3>
      <dt-stack
        v-for="variant in group.variants"
        :key="variant"
        direction="row"
        gap="100"
        align="center"
        class="d-ff-row-wrap"
      >
        <dt-badge
          v-for="emphasis in group.emphasis"
          :key="`${variant}-${emphasis}`"
          :kind="groupName"
          :variant="variant"
          :emphasis="emphasis"
          :label="getLabel(groupName, variant, emphasis)"
        />
      </dt-stack>
    </dt-stack>
    <dt-stack
      direction="row"
      gap="100"
      align="center"
      class="d-ff-row-wrap"
    >
      <dt-badge
        v-for="decoration in Object.keys(BADGE_DECORATION_MODIFIERS)"
        :key="decoration"
        kind="status"
        variant="neutral"
        :decoration="decoration"
        :label="getDecorationText(decoration)"
      />
    </dt-stack>
  </dt-stack>
</template>

<script>
import DtBadge from './Badge.vue';
import { DtStack } from '@/components/Stack';
import { BADGE_GROUPS, BADGE_DECORATION_MODIFIERS } from './BadgeConstants';

export default {
  name: 'DtBadgeVariants',

  components: { DtBadge, DtStack },

  data () {
    return {
      BADGE_GROUPS,
      BADGE_DECORATION_MODIFIERS,
    };
  },

  methods: {
    getLabel (group, variant, emphasis) {
      if (group === 'counter') return '9';
      return `${variant} ${emphasis}`;
    },

    getDecorationText (val) {
      return val.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
    },
  },
};
</script>
