<!-- eslint-disable max-len -->
<template>
  <section class="hero">
    <dt-stack
      direction="row"
      justify="between"
      align="center"
      class="hero__inner-wrapper d-mx-auto d-wmx1340 d-pl-300 d-pr-400"
    >
      <dt-stack justify="center" class="hero__content">
        <dt-text as="h1" kind="headline" size="2xl" class="d-mb-150 d-ff-marketing">
          Improve your UI's reception with Dialtone
        </dt-text>
        <dt-text as="p" kind="body" size="md" density="400" tone="secondary" class="d-mb-200">
          Documented styles, components, and utility classes to help you quickly design and build unified experiences
          across Dialpad experiences.
        </dt-text>
        <dt-stack direction="row" justify="start" class="d-mb-400">
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
        <dt-stack direction="row" justify="center" gap="200">
          <dt-button
            to="/guides/getting-started/"
            size="lg"
            @click="sendAnalyticsEvent()"
          >
            Get Started
          </dt-button>
          <dt-button
            to="/about/whats-new/"
            size="lg"
            importance="outlined"
          >
            What's New?
          </dt-button>
        </dt-stack>
      </dt-stack>
      <svg-loader class="hero__image d-w50p" name="home-billboard" />
    </dt-stack>
  </section>
  <section class="links d-bt d-bb d-bc-subtle d-bgc-secondary">
    <div class="d-d-grid d-g-200 d-g-cols12 d-wmx1340 d-mx-auto">
      <dt-stack gap="100" class="link d-body--md d-gc3 d-px-400 d-ta-center">
        <router-link class="d-fc-primary h:d-td-underline d-td-none d-bar8 d-pt-50" to="/design/">
          <dt-stack gap="100">
            <svg-loader class="d-h-150" name="home-design-language" />
            <dt-text as="h2" kind="headline" size="xl" class="d-ff-marketing">
              Design Language
            </dt-text>
          </dt-stack>
        </router-link>
        <dt-text as="p" kind="body" size="md" density="200" tone="secondary">
          Foundational color, iconography, and spacing guidelines
        </dt-text>
        <dt-stack gap="50">
          <dt-link to="/design/">
            Browse Design Guidelines
          </dt-link>
        </dt-stack>
      </dt-stack>
      <dt-stack gap="100" class="link d-body--md d-gc3 d-px-400 d-ta-center">
        <router-link class="d-fc-primary h:d-td-underline d-td-none d-bar8 d-pt-50" to="/components/">
          <dt-stack gap="100">
            <svg-loader class="d-h-150" name="home-components" />
            <dt-text as="h2" kind="headline" size="xl" class="d-ff-marketing">
              Components
            </dt-text>
          </dt-stack>
        </router-link>
        <dt-text as="p" kind="body" size="md" density="200" tone="secondary">
          Presentational UI components offered in CSS and Vue
        </dt-text>
        <dt-stack gap="50">
          <dt-link to="/components/">
            Browse CSS Components
          </dt-link>
          <dt-link href="https://dialtone.dialpad.com/vue/index.html?path=/docs/welcome--docs" target="_blank" rel="noopener noreferrer">
            Browse Vue Components
          </dt-link>
        </dt-stack>
      </dt-stack>
      <dt-stack gap="100" class="link d-body--md d-gc3 d-px-400 d-ta-center">
        <router-link class="d-fc-primary h:d-td-underline d-td-none d-bar8 d-pt-50" to="/utilities/">
          <dt-stack gap="100">
            <svg-loader class="d-h-150" name="home-utilities" />
            <dt-text as="h2" kind="headline" size="xl" class="d-ff-marketing">
              Utilities
            </dt-text>
          </dt-stack>
        </router-link>
        <dt-text as="p" kind="body" size="md" density="200" tone="secondary">
          A utility-first CSS framework for building user interfaces.
        </dt-text>
        <dt-stack gap="50">
          <dt-link to="/utilities/">
            Browse Utility Classes
          </dt-link>
        </dt-stack>
      </dt-stack>
      <dt-stack gap="100" class="link d-body--md d-gc3 d-px-400 d-ta-center">
        <router-link class="d-fc-primary h:d-td-underline d-td-none d-bar8 d-pt-50" to="/guides/">
          <dt-stack gap="100">
            <svg-loader class="d-h-150" name="home-guides" />
            <dt-text as="h2" kind="headline" size="xl" class="d-ff-marketing">
              Guides
            </dt-text>
          </dt-stack>
        </router-link>
        <dt-text as="p" kind="body" size="md" density="200" tone="secondary">
          Reference guidelines for Accessibility, Writing, and more
        </dt-text>
        <dt-stack gap="50">
          <dt-link to="/guides/getting-started/">
            Getting Started
          </dt-link>
          <dt-link to="/guides/content/">
            Writing Guidelines
          </dt-link>
          <dt-link to="/guides/accessibility/">
            Accessibility
          </dt-link>
        </dt-stack>
      </dt-stack>
    </div>
  </section>
  <section class="d-py-800 d-ta-center">
    <dt-stack direction="row" gap="200" align="center" class="d-fc-secondary d-px-600 d-mx-auto d-d-inline-flex">
      <dt-text as="h2" kind="headline" size="lg" strength="semibold">
        Don't see something? Want to contribute?
      </dt-text>
      <dt-button
        href="https://dialpad.atlassian.net/servicedesk/customer/portal/123/create/465"
        target="_blank"
        rel="noopener noreferrer"
        kind="muted"
        importance="outlined"
        size="lg"
      >
        Make a request
      </dt-button>
      <dt-button
        href="https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=1&pid=12508"
        target="_blank"
        rel="noopener noreferrer"
        kind="muted"
        importance="outlined"
        size="lg"
      >
        Report a bug
      </dt-button>
    </dt-stack>
  </section>
</template>

<script setup>
function sendAnalyticsEvent () {
  if (!window.gtag) return;
  window.gtag('event', 'click', { event_name: 'get_started_button_clicked' });
}
</script>
