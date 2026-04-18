<template>
  <dt-link
    :to="`/dialtone/whats-new/posts/${format(posted, 'y-M-d')}`"
    class="d-fc-unset d-d-block d-bar-400 d-td-none"
  >
    <dt-card
      class="d-mbs-200 d-bgc-primary d-bs-none h:d-bs-sm d-bar-400 d-bbw1 h:d-bc-default"
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
