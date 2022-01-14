<template>
  <div
    data-qa="dt-popover-header"
    :class="[
      'd-d-flex',
      'd-ai-flex-start',
      'd-fs16',
      'd-fw-bold',
      'd-of-auto',
      'd-hmn48',
      'd-w100p',
      'd-pl12',
      'd-pr8',
      'd-py6',
      'd-bb',
      'd-baw1',
      'd-bc-black-075',
      {
        'd-bs-card': hasBoxShadow,
        'd-jc-space-between': isTitleVisible,
        'd-jc-flex-end': !isTitleVisible,
      },
      headerClass,
    ]"
  >
    <div
      v-if="isTitleVisible"
      data-qa="dt-popover-title"
      class="d-to-ellipsis d-pt6"
    >
      <slot name="title">
        {{ title }}
      </slot>
    </div>
    <div
      v-if="areHeaderButtonsVisible"
      class="d-pl6 d-d-flex d-ws-nowrap"
    >
      <slot name="headerActions" />
      <dt-button
        v-if="showCloseButton"
        ref="popover__close-button"
        class="d-p6 d-bc-transparent"
        importance="outlined"
        kind="muted"
        circle
        :aria-label="closeButtonProps.ariaLabel"
        v-bind="closeButtonProps"
        @click="$emit('close')"
      >
        <template #icon>
          <icon-close
            class="d-svg--size20"
          />
        </template>
      </dt-button>
    </div>
  </div>
</template>

<script>
import DtButton from '../button/button';
import IconClose from '@dialpad/dialtone/lib/dist/vue/icons/IconClose';
export default {
  name: 'PopoverHeader',
  components: {
    DtButton,
    IconClose,
  },

  props: {
    /**
     * Additional class name for the content wrapper element.
     */
    headerClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Determines title for popover header.
     * If provided prop is not null, corresponding holder div will be rendered
     */
    title: {
      type: String,
      default: null,
    },

    /**
     * Determines visibility for close button
     */
    showCloseButton: {
      type: Boolean,
      default: false,
    },

    /**
     * A set of props to be passed into the popover's header close button.
     * Requires an 'ariaLabel' property.
     */
    closeButtonProps: {
      type: Object,
      required: true,
    },

    /**
     * Determines fixed / sticky styles for popover header
     */
    hasBoxShadow: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isTitleVisible () {
      return this.$slots.title || this.title !== null;
    },

    areHeaderButtonsVisible () {
      return this.$slots.headerActions || this.showCloseButton;
    },
  },

  methods: {
    focusCloseButton () {
      const closeButton = this.$refs['popover__close-button']?.$el;
      closeButton?.focus();
    },
  },
};
</script>
