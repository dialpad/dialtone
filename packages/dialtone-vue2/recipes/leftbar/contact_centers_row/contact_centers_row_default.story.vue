<template>
  <dt-recipe-contact-centers-row
    :description="$attrs.description"
    :unread-count="$attrs.unreadCount"
    :aria-label="$attrs.ariaLabel"
    :menu-button-aria-label="$attrs.menuButtonAriaLabel"
    :selected="$attrs.selected"
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
        importance="clear"
        kind="muted"
        :class="[
          'leftbar-call-centers-duty-status__button',
          'd-bar-pill',
          'd-py4',
          'd-fc-success',
        ]"
        class="d-to-ellipsis"
        size="sm"
        data-qa="leftbar-call-centers-duty-value"
        @click.stop
      >
        <template #icon>
          <dt-icon-bell-ring size="100" />
        </template>
        <span class="d-truncate d-wmx128">
          Available
        </span>
      </dt-button>
    </template>
  </dt-recipe-contact-centers-row>
</template>

<script>
import { DtButton } from '@/components/button';
import DtIconBellRing from '@dialpad/dialtone-icons/vue2/bell-ring';
import DtRecipeContactCentersRow from './contact_centers_row.vue';

export default {
  name: 'DtRecipeContactCentersRowDefault',
  components: { DtRecipeContactCentersRow, DtButton, DtIconBellRing },
};
</script>
