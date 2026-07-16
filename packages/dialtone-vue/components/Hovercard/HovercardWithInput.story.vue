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
    :open="$attrs.open"
    :enter-delay="$attrs.enterDelay"
    :leave-delay="$attrs.leaveDelay"
    @opened="$attrs.onOpened"
  >
    <template #anchor="slotProps">
      <dt-avatar
        full-name="Jaqueline Nackos"
        :image-src="defaultImage"
        image-alt="Avatar person"
        seed="JN"
        presence="busy"
        avatar-class="d-c-pointer"
        v-bind="slotProps"
      />
    </template>
    <template #content>
      <dt-stack
        direction="column"
        gap="100"
      >
        <dt-stack
          direction="row"
          gap="50"
        >
          <dt-avatar
            full-name="Jaqueline Nackos"
            :image-src="defaultImage"
            image-alt="Person avatar"
            seed="JN"
            :size="300"
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
              <span class="d-fc-critical">In a meeting</span> • Working from SF
            </p>
          </dt-stack>
        </dt-stack>
        <dt-stack
          direction="column"
          gap="50"
          class="d-fc-secondary"
        >
          <p>
            Vice President of Sales Enablement Aerolabs
          </p>
          <dt-stack
            direction="row"
            gap="50"
          >
            <dt-icon
              name="clock-4"
              size="200"
            />
            <p class="d-body--sm">
              <b>Local Time:</b> 12:32 PM
            </p>
          </dt-stack>
        </dt-stack>
        <dt-stack
          direction="row"
          gap="100"
        >
          <dt-button
            width="var(--dt-layout-100-percent)"
            importance="outlined"
            kind="muted"
          >
            Call
          </dt-button>
          <dt-button
            width="var(--dt-layout-100-percent)"
            importance="outlined"
            kind="muted"
          >
            Message
          </dt-button>
        </dt-stack>
        <dt-input
          v-model="inputValue"
          placeholder="Quick message"
          :size="300"
          width="var(--dt-layout-100-percent)"
        />
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
import DtHovercard from './Hovercard.vue';
import defaultImage from '@/common/assets/avatar2.png';
import DtStack from '../Stack/Stack.vue';
import DtIcon from '../Icon/Icon.vue';
import DtButton from '../Button/Button.vue';
import DtAvatar from '../Avatar/Avatar.vue';
import DtInput from '../Input/Input.vue';
</script>
