<template>
  <aside class="lg:d-ps-relative lg:d-w100p d-ps-fixed d-pt32 d-pr12">
    <h2 class="d-headline-eyebrow d-fw-semibold d-px12 d-pb4">
      On this page
    </h2>
    <toc
      :headers="$page.headers"
      :options="options"
    />
  </aside>
</template>

<script setup>
const options = {
  listClass: 'toc-list d-ls-reset',
  itemClass: 'toc-item lg:d-d-flex d-fw-wrap',
  linkTag: 'a',
  linkClass: 'd-btn d-btn--sm d-btn--muted d-fw-normal d-w100p d-jc-flex-start',
  linkActiveClass: 'active-item d-btn--active d-fw-medium',
  linkChildrenActiveClass: 'active-category',
};
</script>
