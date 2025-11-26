<template>
  <dt-recipe-contact-centers-row
    :description="$attrs.description"
    :unread-count="$attrs.unreadCount"
    :aria-label="$attrs.ariaLabel"
    :selected="$attrs.selected"
    :hide-actions="$attrs.hideActions"
    @click="$attrs.click"
    @click-menu="$attrs.clickMenu"
  >
    <template
      v-if="$attrs.right"
      #right
    >
      <span v-html="$attrs.right" />
    </template>
    <template
      v-else
      #right
    >
      <dt-button
        size="sm"
        kind="muted"
        importance="clear"
        class="d-bar-pill d-py4 d-fc-critical d-to-ellipsis"
      >
        <template #icon>
          <dt-icon-bell-ring size="100" />
        </template>
        <span class="d-truncate d-wmx128">
          Off duty
        </span>
      </dt-button>
    </template>
    <template #timer>
      <dt-stack
        direction="row"
        justify="between"
        align="center"
        class="d-p8"
        data-migrate-outline
      >
        <div class="d-headline--xl">
          01:15
        </div>
        <dt-button
          size="sm"
          kind="muted"
          importance="outlined"
        >
          I'm back
        </dt-button>
      </dt-stack>
    </template>
  </dt-recipe-contact-centers-row>
</template>

<script>
import { DtButton } from '@/components/button';
import { DtStack } from '@/components/stack';
import DtIconBellRing from '@dialpad/dialtone-icons/vue3/bell-ring';
import DtRecipeContactCentersRow from './contact_centers_row.vue';

export default {
  name: 'DtRecipeContactCentersRowDefault',

  components: {
    DtButton,
    DtRecipeContactCentersRow,
    DtStack,
    DtIconBellRing,
  },
};
</script>
