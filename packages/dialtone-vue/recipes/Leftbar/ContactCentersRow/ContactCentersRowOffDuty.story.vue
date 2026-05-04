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
        class="d-bar-pill d-py-50 d-fc-critical d-to-ellipsis"
      >
        <template #icon>
          <dt-icon-bell-ring size="100" />
        </template>
        <span class="d-truncate d-wmx-200">
          Off duty
        </span>
      </dt-button>
    </template>
    <template #timer>
      <dt-stack
        direction="row"
        justify="between"
        align="center"
        class="d-p-100"
      >
        <div class="d-headline--xl">
          01:15
        </div>
        <dt-button
          :size="200"
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
import { DtButton } from '@/components/Button';
import { DtStack } from '@/components/Stack';
import DtIconBellRing from '@dialpad/dialtone-icons/vue/bell-ring';
import DtRecipeContactCentersRow from './ContactCentersRow.vue';

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
