<!-- eslint-disable max-len -->
<template>
  <article class="blog-post">
    <section class="d-stack16">
      <component
        :is="isPreview ? 'h2' : 'h1'"
        class="d-d-flex"
        :class="isPreview ? 'd-docsite--header-3 d-mt0' : 'dialtone-page-title'"
      >
        <div class=" d-fl1">
          {{ heading }}
        </div>
        <copy-button
          v-if="!isPreview"
          :text="blogLink"
          aria-label="Copy post link"
        />
      </component>
      <div class="d-d-flex d-ai-center">
        <section class="d-d-flex">
          <dt-avatar
            size="lg"
            color="purple-200"
            :seed="author"
            avatar-class="d-mr16"
          >
            {{ initials }}
          </dt-avatar>
          <div class="d-d-grid d-g-cols1">
            <div class="d-fw-semibold d-fc-secondary">
              {{ author }}
            </div>
            <time class="d-fc-tertiary">
              {{ format(posted, 'MMMM do, y') }}
            </time>
          </div>
        </section>
      </div>
      <div class="blog-post-content">
        <slot />
      </div>
    </section>
  </article>
</template>

<script setup>
import { format } from 'date-fns';
import { computed } from 'vue';
import CopyButton from './CopyButton.vue';

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
});

const initials = computed(() => {
  // get first and last initials from author name.
  const words = props.author.split(' ');
  if (words.length === 0) return '';
  if (words.length > 1) {
    return words[0][0] + words[words.length - 1][0];
  } else {
    return words[0][0];
  }
});
const blogLink = computed(() => {
  return window.location.href;
});
</script>
