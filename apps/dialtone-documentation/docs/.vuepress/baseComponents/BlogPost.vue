<!-- eslint-disable max-len -->
<template>
  <article class="blog-post">
    <dt-stack as="section" gap="400">
      <component
        :is="isPreview ? 'h2' : 'h1'"
        class="d-d-flex d-g8"
        :class="isPreview ? 'd-docsite--header-3 d-mt0' : 'dialtone-page-title'"
      >
        <div>
          {{ heading }}
        </div>
        <copy-button
          v-if="!isPreview"
          :text="blogLink"
          aria-label="Copy post link"
        />
      </component>
      <dt-stack as="section" direction="row" gap="400">
        <dt-avatar
          size="md"
          :seed="author"
          :full-name="author"
        />
        <dt-stack>
          <dt-text size="sm" kind="label" tone="secondary" density="200">
            {{ author }}
          </dt-text>
          <dt-text as="time" size="sm" kind="body" tone="tertiary">
            {{ format(posted, 'MMMM do, y') }}
          </dt-text>
        </dt-stack>
      </dt-stack>
      <dt-text
        v-if="excerpt"
        as="p"
        :size="isPreview ? 'md' : 'lg'"
        kind="body"
        tone="tertiary"
        class="d-mt8"
        :class="isPreview ? '' : 'd-bb d-bc-subtle d-pb24'"
        wrap="pretty"
      >
        {{ excerpt }}
      </dt-text>
      <div v-if="$slots.default" class="blog-post-content">
        <slot />
      </div>
    </dt-stack>
  </article>
</template>

<script setup>
import { format } from 'date-fns';
import { computed } from 'vue';
import CopyButton from './CopyButton.vue';

defineProps({
  posted: {
    type: Date,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isPreview: {
    type: Boolean,
    default: false,
  },
  excerpt: {
    type: String,
    default: '',
  },
});

const blogLink = computed(() => {
  return window.location.href;
});
</script>

<style lang="less">
.blog-post-content {
  .d-docsite--header-2:first-of-type {
    margin-top: var(--dt-size-500);
  }
}
</style>
