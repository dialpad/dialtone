<template>
  <div
    class="d-loader"
    :aria-label="ariaLabel || 'loading'"
    data-qa="dt-loader"
  >
    <svg
      :class="['d-icon', `d-icon--size-${size}`, 'd-loader__icon']"
      data-qa="dt-loader-icon"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        class="d-loader__dot d-loader__dot--1"
        data-qa="dt-loader-dot"
        cx="14.843"
        cy="9.471"
        r="2.410"
      />
      <circle
        class="d-loader__dot d-loader__dot--2"
        data-qa="dt-loader-dot"
        cx="9.156"
        cy="15.199"
        r="2.410"
      />
      <circle
        class="d-loader__dot d-loader__dot--3"
        data-qa="dt-loader-dot"
        cx="15.469"
        cy="15.743"
        r="3.647"
      />
      <circle
        class="d-loader__dot d-loader__dot--4"
        data-qa="dt-loader-dot"
        cx="8.539"
        cy="8.915"
        r="3.647"
      />
    </svg>
  </div>
</template>

<script>
import { ICON_SIZE_MODIFIERS } from '@/components/Icon';
import { ordinalSizeValidator } from '@/common/validators';

export default {
  name: 'DtLoader',

  props: {
    /**
     * The label of the loader as read out by a screen reader.
     * Default is "loading"
     */
    ariaLabel: {
      type: String,
      default: '',
    },

    /**
     * The size of the icon.
     * @values 100, 200, 300, 400, 500, 600, 700, 800
     */
    size: {
      type: [String, Number],
      default: 500,
      validator: ordinalSizeValidator(ICON_SIZE_MODIFIERS),
    },
  },
};
</script>
