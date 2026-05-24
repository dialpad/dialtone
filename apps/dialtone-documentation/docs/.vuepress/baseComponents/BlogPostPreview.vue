<template>
  <dt-link
    :to="`/dialtone/whats-new/posts/${format(posted, 'y-M-d')}`"
    class="d-fc-unset d-d-block d-bar-400 d-td-none"
  >
    <dt-box
      padding="200"
      padding-inline="300"
      surface="defaeult"
      border-radius="450"
      border-width="100"
      border-color="transparent"
      class="h:d-bs-raised h:d-bc-subtle"
    >
      <blog-post
        :author="author"
        :heading="heading"
        :posted="posted"
        :is-preview="true"
        :excerpt="excerpt"
      />
    </dt-box>
  </dt-link>
</template>

<script setup>
import { format } from 'date-fns';
import BlogPost from '@baseComponents/BlogPost.vue';

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
