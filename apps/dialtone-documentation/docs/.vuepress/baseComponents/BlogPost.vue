<!-- eslint-disable max-len -->
<template>
  <article class="blog-post">
    <dt-stack as="section" gap="100">
      <component
        :is="isPreview ? 'h2' : 'h1'"
        class="d-d-flex d-g-100"
        :class="isPreview ? 'd-docsite--header-3 d-mbs-0' : 'dialtone-page-title d-mbs-100'"
      >
        <div>
          {{ heading }}
        </div>
        <div>
          <copy-button
            v-if="!isPreview"
            :text="blogLink"
            aria-label="Copy link"
          />
        </div>
      </component>
      <dt-stack as="section" direction="row" gap="150">
        <dt-avatar
          :size="300"
          :seed="author"
          :full-name="author"
          :image-src="avatarSrc"
          :image-alt="`${author} avatar`"
        />
        <dt-stack>
          <dt-text :size="200" kind="label" tone="secondary" density="200">
            {{ author }}
          </dt-text>
          <dt-text as="time" :size="200" kind="body" tone="tertiary">
            {{ format(posted, 'MMMM do, y') }}
          </dt-text>
        </dt-stack>
      </dt-stack>
      <dt-text
        v-if="excerpt"
        as="p"
        :size="isPreview ? 300 : 400"
        kind="body"
        tone="tertiary"
        class="d-mbs-100"
        :class="isPreview ? '' : 'd-bb d-bc-subtle d-pbe-300'"
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
import { authorAvatarUrl } from './authorHandles.js';

const props = defineProps({
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

const avatarSrc = computed(() => authorAvatarUrl(props.author));

const blogLink = computed(() => {
  return typeof window !== 'undefined' ? window.location.href : '';
});
</script>

<style lang="less">
.blog-post-content {
  .d-docsite--header-2:first-of-type {
    margin-block-start: var(--dt-spacing-200);
  }
  > table:not([class]) {
    color: var(--dt-color-foreground-tertiary);
    border-collapse: collapse;
    margin: var(--dt-spacing-200) 0;
    inline-size: 100%;
    font: var(--dt-text-body-sm);

    :where(th) {
      font: var(--dt-text-label-xs);
      color: var(--dt-color-foreground-secondary);
      line-height: var(--dt-font-line-height-100);
    }


    :where(th, td) {
      text-align: start;
      border-block-end: var(--dt-size-border-100) solid var(--dt-color-border-default);
      padding: var(--dt-spacing-200);
      vertical-align: baseline;
    }

    :where(thead th) {
      border-block-end-width: var(--dt-size-border-200);
    }

    :where(tbody tr:last-of-type) :where(td, th) {
      border-block-end: none;
    }

    :where(code, kbd) {
      background-color: var(--dt-color-background-default);
      color: var(--dt-color-foreground-info-strong);
      font: var(--dt-text-code-xs);
      font-size: 85%;
    }
  }
}
</style>
