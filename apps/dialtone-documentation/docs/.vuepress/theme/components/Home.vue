<!-- eslint-disable max-len -->
<template>
  <section class="hero">
    <dt-stack
      direction="row"
      justify="between"
      align="center"
      class="hero__inner-wrapper d-mx-auto d-wmx1340 d-pl24 d-pr32"
    >
      <dt-stack justify="center" class="hero__content">
        <dt-text as="h1" kind="headline" size="3xl" strength="normal" class="d-mb12">
          Improve your UI's reception with Dialtone
        </dt-text>
        <dt-text as="p" kind="body" size="lg" tone="secondary" class="d-mb16">
          Documented styles, components, and utility classes to help you quickly design and build unified experiences across Dialpad experiences.
        </dt-text>
        <dt-stack direction="row" justify="start" class="d-mb32">
          <a
            class="d-td-unset d-d-inline-flex"
            href="https://github.com/dialpad/dialtone"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt="Dialtone version number"
              src="https://img.shields.io/npm/v/@dialpad/dialtone?color=F5F0FF&label=Dialtone"
            >
          </a>
        </dt-stack>
        <dt-stack direction="row" justify="center" gap="500">
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
              Get Started
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
              What's New?
            </dt-button>
          </router-link>
        </dt-stack>
      </dt-stack>
      <svg-loader class="hero__image d-w50p" name="home-billboard" />
    </dt-stack>
  </section>
  <section class="links d-bt d-bb d-bc-subtle d-bgc-secondary">
    <div class="d-d-grid d-gg16 d-g-cols12 d-wmx1340 d-mx-auto">
      <dt-stack gap="400" class="link d-gc3 d-px32 d-ta-center">
        <router-link class="d-fc-primary h:d-td-underline d-td-none d-bar8 d-pt4" to="/design/">
          <dt-stack gap="600">
            <svg-loader class="d-h96" name="home-design-language" />
            <dt-text as="h2" kind="headline" size="2xl" strength="normal">
              Design Language
            </dt-text>
          </dt-stack>
        </router-link>
        <dt-text as="p" tone="secondary">
          Foundational color, iconography, and spacing guidelines
        </dt-text>
        <dt-stack gap="300">
          <router-link class="d-link" to="/design/">
            Browse Design Guidelines
          </router-link>
        </dt-stack>
      </dt-stack>
      <dt-stack gap="400" class="link d-gc3 d-px32 d-ta-center">
        <router-link class="d-fc-primary h:d-td-underline d-td-none d-bar8 d-pt4" to="/components/">
          <dt-stack gap="600">
            <svg-loader class="d-h96" name="home-components" />
            <dt-text as="h2" kind="headline" size="2xl" strength="normal">
              Component
            </dt-text>
          </dt-stack>
        </router-link>
        <dt-text as="p" tone="secondary">
          Presentational UI components offered in CSS and Vue
        </dt-text>
        <dt-stack gap="300">
          <router-link class="d-link" to="/components/">
            Browse CSS Components
          </router-link>
          <a class="d-link" href="https://dialtone.dialpad.com/vue/index.html?path=/docs/welcome--docs" target="_blank" rel="noopener noreferrer">
            Browse Vue Components
          </a>
        </dt-stack>
      </dt-stack>
      <dt-stack gap="400" class="link d-gc3 d-px32 d-ta-center">
        <router-link class="d-fc-primary h:d-td-underline d-td-none d-bar8 d-pt4" to="/utilities/">
          <dt-stack gap="600">
            <svg-loader class="d-h96" name="home-utilities" />
            <dt-text as="h2" kind="headline" size="2xl" strength="normal">
              Utilities
            </dt-text>
          </dt-stack>
        </router-link>
        <dt-text as="p" tone="secondary">
          A utility-first CSS framework for building user interfaces.
        </dt-text>
        <dt-stack gap="300">
          <router-link class="d-link" to="/utilities/">
            Browse Utility Classes
          </router-link>
        </dt-stack>
      </dt-stack>
      <dt-stack gap="400" class="link d-gc3 d-px32 d-ta-center">
        <router-link class="d-fc-primary h:d-td-underline d-td-none d-bar8 d-pt4" to="/guides/">
          <dt-stack gap="600">
            <svg-loader class="d-h96" name="home-guides" />
            <dt-text as="h2" kind="headline" size="2xl" strength="normal">
              Guides
            </dt-text>
          </dt-stack>
        </router-link>
        <dt-text as="p" tone="secondary">
          Reference guidelines for Accessibility, Writing, and more
        </dt-text>
        <dt-stack gap="300">
          <router-link class="d-link" to="/guides/getting-started/">
            Getting Started
          </router-link>
          <router-link class="d-link" to="/guides/content/">
            Writing Guidelines
          </router-link>
          <router-link class="d-link" to="/guides/accessibility/">
            Accessibility
          </router-link>
        </dt-stack>
      </dt-stack>
    </div>
  </section>
  <section class="d-py64 d-ta-center">
    <dt-stack direction="row" gap="500" align="center" class="d-fc-secondary d-px48 d-mx-auto d-d-inline-flex">
      <dt-text as="h3" kind="headline" size="lg" strength="semibold">
        Don't see something? Want to contribute?
      </dt-text>
      <a
        class="d-btn d-btn--muted d-btn--outlined d-btn--lg"
        href="https://dialpad.atlassian.net/servicedesk/customer/portal/123/create/465"
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
