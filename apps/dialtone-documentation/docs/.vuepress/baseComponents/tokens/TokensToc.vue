<template>
  <aside class="d-of-auto d-py32 lg:d-ps-relative lg:d-w100p d-ps-fixed dialtone-toc">
    <h2 class="d-headline-eyebrow d-fw-semibold d-fc-secondary d-px12 d-pb4">
      On this page
    </h2>
    <toc
      :headers="headers"
      :options="tocOptions"
    />
  </aside>
</template>

<script setup>
defineProps({
  headers: {
    type: Object,
    required: true,
  },
});

const tocOptions = {
  listClass: 'toc-list d-ls-reset',
  itemClass: 'toc-item lg:d-d-flex d-fw-wrap',
  linkTag: 'a',
  linkClass: 'd-btn d-btn--sm d-btn--muted d-w100p d-jc-flex-start',
  linkActiveClass: 'd-btn--active d-fc-primary',
  linkChildrenActiveClass: '',
};
</script>

<style scoped>
  .dialtone-toc {
    width: var(--dt-size-850);
    height: calc(100vh - var(--dt-size-700));
    top: var(--dt-space-700);
    right: var(--dt-space-730);
    right: 3%;
    z-index: var(--zi-base1);  /* to be on top of the page default toc */
    @media (max-width: 1260px) {
      display: none;
    }
  }
</style>
