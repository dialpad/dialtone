---
title: What's New
description: Updates, progress and planning for all things Dialtone.
---

<BlogPostPreview v-for="post in $page.blogPosts.sort(sortHandler)" :key="post.posted" :author="post.author" :heading="post.heading" :posted="parse(post.posted, 'y-M-d', new Date())">
  <span v-html="post.firstParagraph"></span>
</BlogPostPreview>

<script setup>
import BlogPostPreview from '@baseComponents/BlogPostPreview.vue';
import { parse, compareDesc } from 'date-fns';

const sortHandler = function (a, b) {
  const aDate = parse(a.posted, 'y-M-d', new Date());
  const bDate = parse(b.posted, 'y-M-d', new Date());
  return compareDesc(aDate, bDate);
}
</script>
