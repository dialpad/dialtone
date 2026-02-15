<template>
  <div id="components-button--variants-container">
    <dt-stack
      gap="500"
    >
      <dt-stack
        direction="row"
        gap="400"
      >
        <!-- Unstyled -->
        <dt-button kind="unstyled">
          Unstyled
        </dt-button>
      </dt-stack>
      <dt-stack
        direction="row"
        gap="400"
      >
        <!-- Default -->
        <dt-button>
          Primary
        </dt-button>
        <!-- Outlined -->
        <dt-button importance="outlined">
          Outlined
        </dt-button>
        <!-- Clear -->
        <dt-button importance="clear">
          Clear
        </dt-button>
      </dt-stack>
      <dt-stack
        direction="row"
        gap="400"
      >
        <!-- Danger -->
        <dt-button kind="danger">
          Danger
        </dt-button>
        <!-- Positive -->
        <dt-button kind="positive">
          Positive
        </dt-button>
        <!-- Inverted -->
        <dt-button kind="inverted">
          Inverted
        </dt-button>
        <!-- Disabled -->
        <dt-button disabled>
          Disabled
        </dt-button>
      </dt-stack>
      <dt-stack
        direction="row"
        gap="400"
      >
        <!-- Muted clear -->
        <dt-button
          kind="muted"
          importance="clear"
        >
          Muted clear
        </dt-button>
        <!-- Muted outline -->
        <dt-button
          kind="muted"
          importance="outlined"
        >
          Muted Outlined
        </dt-button>
      </dt-stack>
      <dt-stack
        direction="row"
        gap="400"
      >
        <!-- Extra Small -->
        <dt-button size="xs">
          Extra Small
        </dt-button>
        <!-- Small -->
        <dt-button size="sm">
          Small
        </dt-button>
        <!-- Medium -->
        <dt-button size="md">
          Medium
        </dt-button>
        <!-- Large -->
        <dt-button size="lg">
          Large
        </dt-button>
        <!-- Extra Large -->
        <dt-button size="xl">
          Extra Large
        </dt-button>
      </dt-stack>
      <dt-stack
        direction="row"
        gap="400"
      >
        <!-- Circle -->
        <dt-button
          importance="outlined"
          circle
          aria-label="Icon only"
        >
          <template #icon="{ iconSize }">
            <dt-icon
              name="download"
              :size="iconSize"
            />
          </template>
        </dt-button>
        <!-- Icon Only -->
        <dt-button aria-label="Icon only">
          <template #icon="{ iconSize }">
            <dt-icon
              name="download"
              :size="iconSize"
            />
          </template>
        </dt-button>
        <!-- Icon Left -->
        <dt-button>
          <template #icon="{ iconSize }">
            <dt-icon
              name="download"
              :size="iconSize"
            />
          </template>
          Icon Left
        </dt-button>
        <!-- Icon Right -->
        <dt-button icon-position="right">
          <template #icon="{ iconSize }">
            <dt-icon
              name="download"
              :size="iconSize"
            />
          </template>
          Icon Right
        </dt-button>
        <!-- Icon Top -->
        <dt-button icon-position="top">
          <template #icon="{ iconSize }">
            <dt-icon
              name="download"
              :size="iconSize"
            />
          </template>
          Icon Top
        </dt-button>
        <!-- Icon Bottom -->
        <dt-button icon-position="bottom">
          <template #icon="{ iconSize }">
            <dt-icon
              name="download"
              :size="iconSize"
            />
          </template>
          Icon Bottom
        </dt-button>
      </dt-stack>
      <dt-stack
        direction="row"
        gap="400"
      >
        <!-- Loading -->
        <dt-button loading>
          Button
        </dt-button>
      </dt-stack>
      <dt-stack
        direction="row"
        gap="400"
      >
        <!-- Link Button -->
        <dt-button link>
          Link Button
        </dt-button>
      </dt-stack>
      <dt-stack
        direction="row"
        gap="400"
      >
        <!-- Navigation: href (renders <a>) -->
        <dt-button
          href="https://dialtone.dialpad.com"
          target="_blank"
          rel="noopener noreferrer"
          icon-position="right"
          size="sm"
          importance="outlined"
          kind="muted"
        >
          <template #icon="{ iconSize }">
            <dt-icon
              name="external-link"
              :size="iconSize"
            />
          </template>
          External Link
        </dt-button>
        (via <code>href</code> prop)
      </dt-stack>
    </dt-stack>
  </div>
</template>

<script>
import DtButton from './button.vue';
import { DtStack } from '@/components/stack';
import { DtIcon } from '@/components/icon';

export default {
  name: 'ButtonVariants',
  components: { DtButton, DtIcon, DtStack },
};
</script>
