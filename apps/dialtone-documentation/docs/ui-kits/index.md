---
title: Dialpad UI Kits
description: Domain-specific components built with Dialtone.
keywords: ["product patterns", "application patterns", "templates", "domain components"]
status: new
github_url: https://github.com/dialpad/dialpad-uikits
prev: false
next:
  text: What are UI Kits?
  link: /ui-kits/what-are-ui-kits/
---

<DtBox class="d-d-grid d-g-300 md:d-g-cols3 d-mbe-400">
  <DtLink
    to="/ui-kits/what-are-ui-kits/"
    tone="muted"
    :underline="false"
    class="d-d-block d-bar-400 h:d-td-none"
  >
    <DtStack direction="row" gap="200">
      <DtBox
        :padding="viewport.pick({ default: '100', md: '200' })"
        border-width="100"
        border-color="subtle"
        border-radius="400"
        surface="secondary"
      >
        <DtStack>
          <DtIcon class="d-fc-tertiary" name="file-text" :size="viewport.pick({ default: '300', md: '500' })" />
        </DtStack>
      </DtBox>
      <DtStack>
        <DtText as="h3" kind="headline" size="200">What are UI Kits?</DtText>
        <DtText as="p" kind="body" size="200" wrap="pretty">Domain-specific components built with Dialtone.</DtText>
      </DtStack>
    </DtStack>
  </DtLink>

  <DtLink
    to="/ui-kits/where-to-start/"
    tone="muted"
    :underline="false"
    class="d-d-block d-bar-400 h:d-td-none"
  >
    <DtStack direction="row" gap="200">
      <DtBox
        :padding="viewport.pick({ default: '100', md: '200' })"
        border-width="100"
        border-color="subtle"
        border-radius="400"
        surface="secondary"
      >
        <DtStack>
          <DtIcon class="d-fc-tertiary" name="file-text" :size="viewport.pick({ default: '300', md: '500' })" />
        </DtStack>
      </DtBox>
      <DtStack>
        <DtText as="h3" kind="headline" size="200">Where to Start</DtText>
        <DtText as="p" kind="body" size="200" wrap="pretty">Adding a UI Kit component to your project.</DtText>
      </DtStack>
    </DtStack>
  </DtLink>

  <DtLink
    to="/ui-kits/how-to-contribute/"
    tone="muted"
    :underline="false"
    class="d-d-block d-bar-400 h:d-td-none"
  >
    <DtStack direction="row" gap="200">
      <DtBox
        :padding="viewport.pick({ default: '100', md: '200' })"
        border-width="100"
        border-color="subtle"
        border-radius="400"
        surface="secondary"
      >
        <DtStack>
          <DtIcon class="d-fc-tertiary" name="file-text" :size="viewport.pick({ default: '300', md: '500' })" />
        </DtStack>
      </DtBox>
      <DtStack>
        <DtText as="h3" kind="headline" size="200">How to Contribute</DtText>
        <DtText as="p" kind="body" size="200" wrap="pretty">How to propose, build, and contribute Dialpad UI Kits.</DtText>
      </DtStack>
    </DtStack>
  </DtLink>
</DtBox>

| UI Kit | Description |
| --- | --- |
| [ChatKit](https://uikits.dialpad.com/chatkit/) | Components for conversation feeds and chatbots. Includes message rows, composers, action sheets, and more. |
| [FormKit](https://uikits.dialpad.com/formkit/) | Fieldsets for settings and admin pages. Includes text inputs, textareas, and repeating multi-field variants. |
| [CallbarKit](https://uikits.dialpad.com/callbarkit/) | Specialized building blocks for meeting and telephony controls. Includes callbar buttons, banners, and timers. |
| [NavigationKit](https://uikits.dialpad.com/navigationkit/) | Components appearing in the application shell (top and left navigation). Houses contact rows, unread pills, and menu buttons. |
| [WorkflowKit](https://uikits.dialpad.com/workflowkit/) | Visual workflow builder components. Currently used for card-based steps in the IVR Workflow configuration. |
| AnalyticsKit (Planned) | Data visualization widgets for dashboards. Features dynamic charts, data tables, and metric summaries. |

<script setup>
import { useViewportBreakpoints } from '@composables/useViewportBreakpoints.js';

const viewport = useViewportBreakpoints();
</script>
