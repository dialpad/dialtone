<template>
  <div class="d-fd-column d-p24 d-w100p d-of-auto d-stack8">
    <div
      id="components-badge--variants-container"
      class="d-d-flex d-gg8 d-ai-center"
    >
      <dt-badge
        v-for="type in types"
        :key="type.value"
        :text="type.display"
        :type="type.value"
      />
      <dt-badge
        v-for="type in types.slice(0, types.length - 1)"
        :key="`${type.value}-count`"
        text="1"
        :type="type.value"
        kind="count"
      />
    </div>
  </div>
</template>

<script>
import DtBadge from './badge';
import { BADGE_TYPE_MODIFIERS } from './badge_constants';

export default {
  name: 'DtBadgeVariants',

  components: { DtBadge },

  data () {
    return {
      BADGE_TYPE_MODIFIERS,
    };
  },

  computed: {
    types () {
      const typeList = [];
      for (const key in BADGE_TYPE_MODIFIERS) {
        typeList.push({ display: key[0].toUpperCase() + key.slice(1), value: key });
      }
      return typeList;
    },
  },
};
</script>
