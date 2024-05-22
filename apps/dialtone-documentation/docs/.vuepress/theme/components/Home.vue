<!-- eslint-disable max-len -->
<template>
  <section class="hero">
    <div class="hero__inner-wrapper d-d-flex d-jc-space-between d-mx-auto d-wmx1340 d-pl32 d-pr32 d-ai-center">
      <div class="hero__content d-d-flex d-fd-column d-jc-center">
        <h1 class="d-headline--xxl d-mb12">
          Improve your UI's reception with Dialtone
        </h1>
        <p class="d-fs-300 d-lh-400 d-mb16 d-fc-secondary">
          Documented styles, components, and utility classes to help you quickly design and build unified experiences
          across Dialpad experiences.
        </p>
        <div class="d-mb32 d-d-flex d-jc-center d-flow8">
          <a
            class="d-td-unset d-d-inline-flex"
            href="https://github.com/dialpad/dialtone/"
          >
            <img
              alt="Dialtone CSS version number"
              src="https://img.shields.io/github/package-json/v/dialpad/dialtone?color=D3BCFF&label=CSS"
            >
          </a>
          <a
            class="d-td-unset d-d-inline-flex"
            href="https://github.com/dialpad/dialtone-vue"
          >
            <img
              alt="Dialtone Vue version number"
              src="https://img.shields.io/github/package-json/v/dialpad/dialtone-vue?color=D3BCFF&label=Vue"
            >
          </a>
          <a
            class="d-td-unset d-d-inline-flex"
            href="https://github.com/dialpad/dialtone-vue/tree/vue3"
          >
            <img
              alt="Dialtone Vue version number"
              src="https://img.shields.io/github/package-json/v/dialpad/dialtone-vue/vue3?color=D3BCFF&label=Vue 3"
            >
          </a>
        </div>
        <div class="d-d-flex d-jc-center d-flow16">
          <router-link
            v-slot="{ navigate }"
            to="/guides/getting-started/"
            custom
          >
            <dt-button
              role="link"
              size="lg"
              @click="(e) => { sendAnalyticsEvent(); navigate(e); }"
              @keypress.enter="(e) => { sendAnalyticsEvent(); navigate(e); }"
            >
              Get started
            </dt-button>
          </router-link>
          <router-link
            v-slot="{ navigate }"
            to="/about/whats-new/"
            custom
          >
            <dt-button
              role="link"
              size="lg"
              importance="outlined"
              @click="(e) => { navigate(e); }"
              @keypress.enter="(e) => { navigate(e); }"
            >
              What's new?
            </dt-button>
          </router-link>
        </div>
      </div>
      <svg-loader class="hero__image d-w50p" name="home-billboard" />
    </div>
  </section>
  <section class="links d-bt d-bb d-bc-subtle d-bgc-secondary">
    <div class="d-d-grid d-gg16 d-g-cols12 d-wmx1340 d-mx-auto">
      <dt-stack gap="400" class="link d-body--md d-gc3 d-px32 d-ta-center">
        <router-link class="d-fc-primary h:d-fc-purple-400 h:d-td-underline d-td-none d-bar8 d-pt4" to="/design/">
          <dt-stack gap="600">
            <svg-loader class="d-h96" name="home-design-language" />
            <h2 class="d-headline--xl">
              Design language
            </h2>
          </dt-stack>
        </router-link>
        <p class="d-body--md-compact d-fc-secondary">
          Foundational color, iconography, and spacing guidelines
        </p>
        <dt-stack gap="300">
          <router-link class="d-link" to="/design/">
            Browse design guidelines
          </router-link>
        </dt-stack>
      </dt-stack>
      <dt-stack gap="400" class="link d-body--md d-gc3 d-px32 d-ta-center">
        <router-link class="d-fc-primary h:d-fc-purple-400 h:d-td-underline d-td-none d-bar8 d-pt4" to="/components/">
          <dt-stack gap="600">
            <svg-loader class="d-h96" name="home-components" />
            <h2 class="d-headline--xl">
              Components
            </h2>
          </dt-stack>
        </router-link>
        <p class="d-body--md-compact d-fc-secondary">
          Presentational UI components offered in CSS and Vue
        </p>
        <dt-stack gap="300">
          <router-link class="d-link" to="/components/">
            Browse CSS components
          </router-link>
          <a class="d-link" href="https://dialtone.dialpad.com/vue" target="_blank" rel="noopener noreferrer">
            Browse Vue 2 components
          </a>
          <a class="d-link" href="https://dialtone.dialpad.com/vue3" target="_blank" rel="noopener noreferrer">
            Browse Vue 3 components
          </a>
        </dt-stack>
      </dt-stack>
      <dt-stack gap="400" class="link d-body--md d-gc3 d-px32 d-ta-center">
        <router-link class="d-fc-primary h:d-fc-purple-400 h:d-td-underline d-td-none d-bar8 d-pt4" to="/utilities/">
          <dt-stack gap="600">
            <svg-loader class="d-h96" name="home-utilities" />
            <h2 class="d-headline--xl">
              Utilities
            </h2>
          </dt-stack>
        </router-link>
        <p class="d-body--md-compact d-fc-secondary">
          A utility-first CSS framework for building user interfaces.
        </p>
        <dt-stack gap="300">
          <router-link class="d-link" to="/utilities/">
            Browse utility classes
          </router-link>
        </dt-stack>
      </dt-stack>
      <dt-stack gap="400" class="link d-body--md d-gc3 d-px32 d-ta-center">
        <router-link class="d-fc-primary h:d-fc-purple-400 h:d-td-underline d-td-none d-bar8 d-pt4" to="/guides/">
          <dt-stack gap="600">
            <svg-loader class="d-h96" name="home-guides" />
            <h2 class="d-headline--xl">
              Guides
            </h2>
          </dt-stack>
        </router-link>
        <p class="d-body--md-compact d-fc-secondary">
          Reference guidelines for Accessibility, Writing, and more
        </p>
        <dt-stack gap="300">
          <router-link class="d-link" to="/guides/getting-started/">
            Getting started
          </router-link>
          <router-link class="d-link" to="/guides/content/">
            Writing guidelines
          </router-link>
          <router-link class="d-link" to="/guides/accessibility/">
            Accessibility
          </router-link>
        </dt-stack>
      </dt-stack>
    </div>
  </section>
  <section class="d-py64 d-ta-center">
    <dt-stack direction="row" gap="500" class="d-fc-secondary d-px48 d-mx-auto d-d-inline-flex d-ai-center">
      <h2 class="d-headline--lg d-fw-semibold">
        Don't see something? Want to contribute?
      </h2>
      <a
        class="d-btn d-btn--muted d-btn--outlined d-btn--lg"
        href="https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=10975&pid=12508"
        target="_blank"
        rel="noopener noreferrer"
      >
        Make a request
      </a>
      <a
        class="d-btn d-btn--muted d-btn--outlined d-btn--lg"
        href="https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=1&pid=12508"
        target="_blank"
        rel="noopener noreferrer"
      >
        Report a bug
      </a>
    </dt-stack>
  </section>
</template>

<script setup>
function sendAnalyticsEvent () {
  if (!window.gtag) return;
  window.gtag('event', 'click', { event_name: 'get_started_button_clicked' });
}
</script>
