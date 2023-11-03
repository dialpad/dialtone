<template>
  <div class="d-fd-column d-of-auto d-stack8">
    <div
      id="components-badge--variants-container"
      class="d-d-flex d-gg8 d-ai-center d-ff-row-wrap"
    >
      <dt-badge
        v-for="t in types"
        :key="t.value"
        :text="t.display"
        :type="t.value"
      />
      <dt-badge
        v-for="t in types.slice(0, types.length - 1)"
        :key="`${t.value}-count`"
        text="1"
        :type="t.value"
        kind="count"
      />
      <dt-badge
        v-for="decoration in Object.keys(BADGE_DECORATION_MODIFIERS)"
        :key="decoration"
        :decoration="decoration"
        :text="getDecorationText(decoration)"
        type="default"
        kind="label"
      />
    </div>
  </div>
</template>

<script>
import DtBadge from './badge.vue';
import { BADGE_TYPE_MODIFIERS, BADGE_DECORATION_MODIFIERS } from './badge_constants';

export default {
  name: 'DtBadgeVariants',

  components: { DtBadge },

  data () {
    return {
      BADGE_TYPE_MODIFIERS,
      BADGE_DECORATION_MODIFIERS,
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

  methods: {
    getDecorationText (val) {
      return val.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
    },
  },
};
</script>
