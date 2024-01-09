<template>
  <dt-hovercard
    :id="$attrs.id"
    :placement="$attrs.placement"
    :content-class="$attrs.contentClass"
    :fallback-placements="$attrs.fallbackPlacements"
    :padding="$attrs.padding"
    :transition="$attrs.transition"
    :offset="$attrs.offset"
    initial-focus-element="none"
    :header-class="$attrs.headerClass"
    :footer-class="$attrs.footerClass"
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
        call-button-tooltip=""
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
            <p class="d-headline-compact-medium">
              Jaqueline Nackos
            </p>
            <p class="d-body-small d-fc-tertiary">
              <span class="d-fc-critical">In a meeting</span> • Working from SF
            </p>
          </dt-stack>
        </dt-stack>
        <dt-stack
          direction="column"
          gap="300"
          class="d-fc-secondary"
        >
          <p>
            Vice President of Sales Enablement Aerolabs
          </p>
          <dt-stack
            direction="row"
            gap="300"
          >
            <dt-icon
              name="clock-4"
              size="200"
            />
            <p class="d-body-small">
              <b>Local Time:</b> 12:32 PM
            </p>
          </dt-stack>
        </dt-stack>
        <dt-stack
          direction="row"
          gap="400"
        >
          <dt-button
            width="var(--dt-size-100-percent)"
            importance="outlined"
            kind="muted"
          >
            Call
          </dt-button>
          <dt-button
            width="var(--dt-size-100-percent)"
            importance="outlined"
            kind="muted"
          >
            Message
          </dt-button>
        </dt-stack>
      </dt-stack>
    </template>
    <template
      v-if="$attrs.headerContent"
      #headerContent
    >
      <span v-html="$attrs.headerContent" />
    </template>
    <template
      v-if="$attrs.footerContent"
      #footerContent
    >
      <span v-html="$attrs.footerContent" />
    </template>
  </dt-hovercard>
</template>

<script setup>
import DtHovercard from './hovercard.vue';
import DtRecipeContactRow from '@/recipes/leftbar/contact_row/contact_row.vue';
import defaultImage from '@/common/assets/avatar2.png';
import DtStack from '../stack/stack.vue';
import DtIcon from '../icon/icon.vue';
import DtButton from '../button/button.vue';
import DtAvatar from '../avatar/avatar.vue';
</script>
