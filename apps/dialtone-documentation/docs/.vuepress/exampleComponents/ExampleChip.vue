<template>
  <span class="d-chip">
    <component
      :is="interactive ? 'button' : 'span'"
      :type="interactive ? 'button' : undefined"
      :class="['d-chip__label', {
        'd-w102': truncate,
        [`d-chip__label--${size}`]: size,
      }]"
    >
      <span
        v-if="withAvatar"
        class="d-avatar"
      >
        <div class="d-avatar__canvas">
          <img
            class="d-avatar__image"
            :src="$withBase('/assets/images/person.png')"
            alt="Person avatar image"
          >
        </div>
      </span>
      <span
        v-if="withIcon"
        class="d-chip__icon"
      >
        <dt-icon
          name="phone"
          size="200"
        />
      </span>
      <span :class="{ 'd-truncate': truncate }">{{ label }}</span>
    </component>
    <button
      v-if="!hideCloseBtn"
      aria-label="close"
      :class="['d-chip__close', { [`d-chip__close--${size}`]: size }]"
    >
      <span
        ref="closeBtn"
        class="d-btn__icon"
      >
        <dt-icon
          name="close"
          size="200"
        />
      </span>
    </button>
  </span>
</template>

<script setup>
import { ref } from 'vue';

const closeBtn = ref(null);

defineProps({
  label: { type: String, default: '' },
  hideCloseBtn: { type: Boolean, default: false },
  withIcon: { type: Boolean, default: false },
  withAvatar: { type: Boolean, default: false },
  interactive: { type: Boolean, default: true },
  truncate: { type: Boolean, default: false },
  size: { type: String, default: null },
});
</script>
