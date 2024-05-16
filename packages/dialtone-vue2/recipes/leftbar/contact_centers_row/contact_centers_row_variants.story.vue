<template>
  <dt-stack gap="600">
    <div>
      <h3 class="d-mb8">
        Ai Contact Centers leftbar
      </h3>
      <dt-recipe-contact-centers-row
        description="Ai Contact Centers"
        menu-button-aria-label="Menu button"
      >
        <template #right>
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
            aria-label="Available"
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
    </div>
    <div>
      <h3 class="d-mb8">
        Ai Contact Centers selected
      </h3>
      <dt-recipe-contact-centers-row
        description="Ai Contact Centers"
        menu-button-aria-label="Menu button"
        selected
      >
        <template #right>
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
            aria-label="Available"
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
    </div>
    <div>
      <h3 class="d-mb8">
        Ai Contact Centers with unread messages
      </h3>
      <dt-recipe-contact-centers-row
        description="Ai Contact Centers"
        menu-button-aria-label="Menu button"
        unread-count="7"
        unread-count-tooltip="7 unread messages"
      >
        <template #right>
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
            aria-label="Available"
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
    </div>
    <div>
      <h3 class="d-mb8">
        Ai Contact Centers selected with unread messages
      </h3>
      <dt-recipe-contact-centers-row
        description="Ai Contact Centers"
        menu-button-aria-label="Menu button"
        selected
        unread-count="7"
      >
        <template #right>
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
            aria-label="Available"
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
    </div>
  </dt-stack>
</template>

<script>
import DtRecipeContactCentersRow from './contact_centers_row.vue';
import { DtStack } from '@/components/stack';
import { DtButton } from '@/components/button';
import DtIconBellRing from '@dialpad/dialtone-icons/vue2/bell-ring';

export default {
  name: 'DtRecipeContactCentersRowVariants',
  components: { DtRecipeContactCentersRow, DtStack, DtButton, DtIconBellRing },
};
</script>
