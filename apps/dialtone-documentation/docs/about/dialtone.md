---
title: About Dialtone
description: Dialtone is Dialpad's Design System that unites product teams around a common visual language.
---

## Release notes

<div class="d-d-grid d-gg16 d-g-cols2 md:d-g-cols1">
  <div>
    <dt-stack class="d-ai-center" direction="row" gap="400">
      <h3 class="d-docsite--header-3">Dialtone</h3>
      <a
        class="d-d-inline-flex d-pt12"
        href="https://github.com/dialpad/dialtone/"
      >
        <img
          alt="Dialtone CSS version number"
          src="https://img.shields.io/github/package-json/v/dialpad/dialtone?color=D3BCFF&label=CSS"
        />
      </a>
    </dt-stack>
    <dialtone-changelog />
  </div>
  <div>
    <dt-stack class="d-ai-center" direction="row" gap="400">
      <h3 class="d-docsite--header-3">Dialtone-vue</h3>
      <a
        class="d-d-inline-flex d-pt12"
        href="https://github.com/dialpad/dialtone-vue"
      >
        <img
          alt="Dialtone Vue version number"
          src="https://img.shields.io/github/package-json/v/dialpad/dialtone-vue/vue3?color=D3BCFF&label=Vue"
        >
      </a>
    </dt-stack>
    <dialtone-changelog project="DialtoneVue" />
  </div>
</div>

## Components

Components are reusable building blocks that support a specific interaction or UI need. These components can be reused across Dialpad products and projects
ensuring UI consistency and cohesion while helping teams deliver high-quality features faster.

Dialtone provides two options to use the components: CSS and Vue.

### Vue components (recommended)

Use [Vue components](https://vue.dialpad.design/) in the case your project supports Vue since these components are built conforming to [WCAG AA Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/glance/)
and with usability and performance in mind.

### CSS components

If Vue isn't supported in your application, you can use the [CSS components](../components/avatar.md) in your project, but you'll be responsible
for writing the correct markup, managing DOM elements and events, and making it [accessible for all users](../getting-started/accessibility/fundamentals.md).

See more about [components usage](../getting-started/usage.md/#components).

### Previous Version

[Dialtone 6](https://dialpad.design/version6/) remains viewable, though is no longer being maintained. [Reach out](#contact-us) to the Dialtone team if you have any questions.

## Intake

### Contributions

Read about [how to contribute to Dialtone](../about/contributing.md).

### Request a feature

If your design isn't supported by any existing component, or the component you want to use isn't flexible enough to use in your design,
please request a feature by [filling out this form](https://forms.monday.com/forms/8a9a6ff69d7e9f95caee029c2806e2c1?r=use1).

### Report a bug

Please refer to [CONTRIBUTING.md](https://github.com/dialpad/dialtone/blob/staging/.github/CONTRIBUTING.md#bug-report)
for reporting any issue.

## Contact Us

- [#dialtone](https://dialpad.slack.com/messages/dialtone/) Slack channel
- [dialtone@dialpad.com](mailto:dialtone@dialpad.com)

<script setup>
  import DialtoneChangelog from '@views/DialtoneChangelog.vue';
</script>
