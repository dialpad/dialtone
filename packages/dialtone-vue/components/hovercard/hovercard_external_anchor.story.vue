<!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
<!-- eslint-disable vuejs-accessibility/mouse-events-have-key-events -->
<template>
  <p class="d-body--md">
    Send a message to
    <span
      ref="mentionEl"
      class="d-fw-bold d-fc-primary d-c-pointer"
      @mouseenter="onMentionEnter"
      @mouseleave="onMentionLeave"
    >@Jaqueline Nackos</span>
    to get started.
  </p>

  <dt-hovercard
    :id="$attrs.id"
    ref="hovercard"
    :placement="$attrs.placement"
    :content-class="$attrs.contentClass"
    :fallback-placements="$attrs.fallbackPlacements"
    :padding="$attrs.padding"
    :transition="$attrs.transition"
    :offset="$attrs.offset"
    :header-class="$attrs.headerClass"
    :footer-class="$attrs.footerClass"
    :append-to="$attrs.appendTo"
    :enter-delay="$attrs.enterDelay"
    :leave-delay="$attrs.leaveDelay"
    :external-anchor-element="mentionElement"
    @opened="$attrs.onOpened"
  >
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
  </dt-hovercard>
</template>

<script setup>
import { ref } from 'vue';
import DtHovercard from './hovercard.vue';
import defaultImage from '@/common/assets/avatar2.png';
import DtStack from '../stack/stack.vue';
import DtIcon from '../icon/icon.vue';
import DtButton from '../button/button.vue';
import DtAvatar from '../avatar/avatar.vue';

const hovercard = ref(null);
const mentionEl = ref(null);
const mentionElement = ref(null);

function onMentionEnter () {
  mentionElement.value = mentionEl.value;
  hovercard.value?.show();
}

function onMentionLeave () {
  hovercard.value?.hide();
}
</script>
