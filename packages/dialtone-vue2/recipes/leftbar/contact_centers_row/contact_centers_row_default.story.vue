<template>
  <!-- <dt-recipe-contact-centers-row
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
  </dt-recipe-contact-centers-row> -->
  <dt-recipe-general-row
    type="ai contact center"
    description="Description"
    :has-unreads="true"
    aria-label="Description"
    unread-count-tooltip="55 unread messages"
    :has-call-button="true"
    call-button-tooltip="Call"
  >
    <template
      #secondaryLabel
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
  </dt-recipe-general-row>
</template>

<script>
import DtIconBellRing from '@dialpad/dialtone-icons/vue2/bell-ring';
import DtRecipeGeneralRow from '../general_row/general_row.vue';
import { DtButton } from '@/components/button';

export default {
  name: 'DtRecipeContactCentersRowDefault',
  components: { DtRecipeGeneralRow, DtButton, DtIconBellRing },
};
</script>
