<template>
  <dt-popover
    :open="modelValue"
    :modal="true"
    :content-width="null"
    :show-close-button="true"
    placement="right"
    :fallback-placements="['left', 'auto']"
    dialog-class="d-w100vw dialtone-icon-popover"
    padding="large"
    @opened="emitOpened"
  >
    <template #anchor>
      <dt-button
        class="dialtone-icon-grid__item"
        icon-position="top"
        importance="clear"
        kind="muted"
        :active="modelValue"
      >
        <template #icon>
          <dt-icon
            :name="iconName"
            size="600"
            class="d-mb8"
          />
        </template>
        <span
          class="dialtone-icon-card__subtitle d-tt-capitalize d-fc-tertiary"
          v-text="name"
        />
      </dt-button>
    </template>
    <template #headerContent>
      <div class="d-d-flex d-fd-row d-ai-center d-plc-space-between">
        <span
          class="d-tt-capitalize d-fc-primary"
          v-text="name"
        />
        <copy-button
          class="d-ml8"
          :text="shareIcon"
          aria-label="Copy link"
        />
      </div>
    </template>
    <template #content>
      <icon-popover-content
        :icon-name="iconName"
        :keywords="keywords"
        :category="category"
      />
    </template>
  </dt-popover>
</template>

<script setup>
import { computed } from 'vue';
import IconPopoverContent from './IconPopoverContent.vue';
import CopyButton from './CopyButton.vue';
const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  iconName: { type: String, required: true },
  keywords: { type: Array, default: () => [] },
  category: { type: String, required: true },
  modelValue: { type: Boolean, default: false },
});
const name = props.iconName.replaceAll('-', ' ');
const emitOpened = (open) => {
  emits('update:modelValue', open);
  if (!open) {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('icon_name')) {
      queryParams.delete('icon_name');
      history.pushState(null, null, `?${queryParams.toString()}${window.location.hash}`);
    }
  }
};

const shareIcon = computed(() => `${window.location.origin}${window.location.pathname}?icon_name=${props.iconName}`);
</script>

<style scoped lang="less">
  .code-example {
    user-select: all;
  }
</style>
