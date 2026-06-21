---
title: Dialtone Design System
description: Dialpad's design system for building consistent, accessible product experiences
keywords: ["design system", "components", "css utilities", "design tokens", "content guidelines", "vue utilities", "ui kits", "downloads"]
---

<DtBox class="d-box d-box--bc-default d-d-grid d-g-300 md:d-g-cols3 d-mbe-400">
  <DtLink to="/dialtone/whats-new/" :underline="false" class="d-d-block d-fc-secondary h:d-td-none h:d-fc-primary">
    <DtStack direction="row" gap="150">
      <DtBox padding="200" border-width="100" border-color="subtle" border-radius="400" surface="secondary" class="d-d-inline-flex">
        <DtStack>
          <dt-icon name="megaphone" size="500" />
        </DtStack>
      </DtBox>
      <DtStack>
        <dt-text as="h3" kind="headline" size="200">What's New</dt-text>
        <dt-text as="p" kind="body" size="200">Updates, progress and planning for all things Dialtone.</dt-text>
      </DtStack>
    </DtStack>
  </DtLink>
  <DtLink to="/guides/migration/" :underline="false" class="d-d-block d-fc-secondary h:d-td-none h:d-fc-primary">
    <DtStack direction="row" gap="150">
      <DtBox padding="200" border-width="100" border-color="subtle" border-radius="400" surface="secondary" class="d-d-inline-flex">
        <DtStack>
          <dt-icon name="list-checks" size="500" />
        </DtStack>
      </DtBox>
      <DtStack>
        <dt-text as="h3" kind="headline" size="200">Migration Guide</dt-text>
        <dt-text as="p" kind="body" size="200">Codemods and Linting for Dialtone Next</dt-text>
      </DtStack>
    </DtStack>
  </DtLink>
  <DtLink to="/guides/getting-started/" :underline="false" class="d-d-block d-fc-secondary h:d-td-none h:d-fc-primary">
    <DtStack direction="row" gap="150">
      <DtBox padding="200" border-width="100" border-color="subtle" border-radius="400" surface="secondary" class="d-d-inline-flex">
        <DtStack>
          <dt-icon name="file-text" size="500" />
        </DtStack>
      </DtBox>
      <DtStack>
        <dt-text as="h3" kind="headline" size="200">Getting Started</dt-text>
        <dt-text as="p" kind="body" size="200">Quick start guidelines for using Dialtone in your project.</dt-text>
      </DtStack>
    </DtStack>
  </DtLink>
</DtBox>

<overview :pages="$page.overviewPages" />
