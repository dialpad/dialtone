<template>
  <dt-link
    :to="`/dialtone/whats-new/posts/${format(posted, 'y-M-d')}`"
    class="d-fc-unset d-d-block d-bar-400 d-td-none"
  >
    <dt-card
      class="d-my-100 d-bgc-primary d-p-100 d-py-0 d-bs-none d-bar-500 d-bc-transparent"
      :class="viewport.pick({ xxl: 'h:d-bs-sm h:d-bc-subtle' })"
    >
      <template #content>
        <blog-post
          :author="author"
          :heading="heading"
          :posted="posted"
          :is-preview="true"
          :excerpt="excerpt"
        />
      </template>
    </dt-card>
  </dt-link>
</template>

<script setup>
import { format } from 'date-fns';
import BlogPost from '@baseComponents/BlogPost.vue';
import { useViewportBreakpoints } from '@composables/useViewportBreakpoints.js';

const viewport = useViewportBreakpoints();

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
  excerpt: {
    type: String,
    default: '',
  },
});
</script>
