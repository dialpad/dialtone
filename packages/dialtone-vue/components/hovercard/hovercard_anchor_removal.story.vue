<template>
  <div>
    <dt-hovercard
      v-if="showAnchor"
      :placement="$attrs.placement"
      :fallback-placements="$attrs.fallbackPlacements"
      :padding="$attrs.padding"
      :transition="$attrs.transition"
      :offset="$attrs.offset"
      :append-to="$attrs.appendTo"
      @opened="$attrs.onOpened"
    >
      <template #anchor="slotProps">
        <dt-recipe-contact-row
          name="Jaqueline Nackos"
          avatar-presence="busy"
          avatar-seed="JN"
          avatar-alt="Avatar person"
          :avatar-src="defaultImage"
          user-status="Working from SF"
          call-button-tooltip="Call contact"
          v-bind="slotProps"
        />
      </template>
      <template #content>
        <dt-stack
          direction="column"
          gap="400"
        >
          <dt-stack
            direction="row"
            gap="300"
          >
            <dt-avatar
              full-name="Jaqueline Nackos"
              :image-src="defaultImage"
              image-alt="Person avatar"
              seed="JN"
              size="md"
              presence="busy"
            />
            <dt-stack
              direction="column"
              gap="0"
            >
              <p class="d-headline--md-compact">
                Jaqueline Nackos
              </p>
              <p class="d-body--sm d-fc-tertiary">
                <span class="d-fc-critical">In a meeting</span> - Working from SF
              </p>
            </dt-stack>
          </dt-stack>
          <p class="d-fc-secondary">
            Vice President of Sales Enablement Aerolabs
          </p>
          <dt-button
            importance="outlined"
            kind="muted"
            size="sm"
            @click="toggleAnchor"
          >
            Remove anchor
          </dt-button>
        </dt-stack>
      </template>
    </dt-hovercard>
    <p
      v-else
      class="d-body--sm d-fc-tertiary"
    >
      Anchor has been removed from the DOM. The hovercard should have closed.
    </p>
    <dt-button
      v-if="!showAnchor"
      importance="outlined"
      kind="muted"
      class="d-mt16"
      @click="toggleAnchor"
    >
      Restore anchor
    </dt-button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DtHovercard from './hovercard.vue';
import DtRecipeContactRow from '@/recipes/leftbar/contact_row/contact_row.vue';
import defaultImage from '@/common/assets/avatar2.png';
import DtStack from '../stack/stack.vue';
import DtAvatar from '../avatar/avatar.vue';
import DtButton from '../button/button.vue';

const showAnchor = ref(true);

function toggleAnchor () {
  showAnchor.value = !showAnchor.value;
}
</script>
