<template>
  <dt-recipe-contact-centers-row
    :description="$attrs.description"
    :unread-count="$attrs.unreadCount"
    :aria-label="$attrs.ariaLabel"
    :selected="$attrs.selected"
    :show-actions="$attrs.showActions"
    @click="$attrs.click"
    @click-menu="$attrs.clickMenu"
  >
    <template
      v-if="$attrs.end"
      #end
    >
      <span v-html="$attrs.end" />
    </template>
    <template
      v-else
      #end
    >
      <dt-button
        :size="200"
        kind="muted"
        importance="clear"
        class="d-bar-pill d-py-50 d-fc-positive d-to-ellipsis"
      >
        <template #icon>
          <dt-icon-bell-ring size="100" />
        </template>
        <span class="d-truncate d-wmx-200">
          Available
        </span>
      </dt-button>
    </template>
  </dt-recipe-contact-centers-row>
</template>

<script>
import { DtButton } from '@/components/Button';
import DtIconBellRing from '@dialpad/dialtone-icons/vue/bell-ring';
import DtRecipeContactCentersRow from './contact_centers_row.vue';

export default {
  name: 'DtRecipeContactCentersRowDefault',

  components: {
    DtButton,
    DtRecipeContactCentersRow,
    DtIconBellRing,
  },
};
</script>
