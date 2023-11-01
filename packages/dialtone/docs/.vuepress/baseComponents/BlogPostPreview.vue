<template>
  <router-link
    v-slot="{ navigate }"
    :to="`/about/whats-new/posts/${format(posted, 'y-M-d')}`"
    custom
  >
    <dt-link
      class="d-fc-unset d-d-block d-bar8 d-td-none"
      href="`/about/whats-new/posts/${format(posted, 'y-M-d')}`"
      @click="(e) => { navigate(e); }"
    >
      <dt-card
        class="d-mt16 d-bgc-primary d-bs-none h:d-bs-sm d-ba d-bar8 d-bbw1 d-bc-default"
      >
        <template #content>
          <blog-post
            :author="author"
            :heading="heading"
            :posted="posted"
            :is-preview="true"
          >
            <slot />
          </blog-post>
        </template>
      </dt-card>
    </dt-link>
  </router-link>
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
});
</script>
