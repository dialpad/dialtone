<template>
  <div
    id="components-button--variants-container"
    class="d-stack16"
  >
    <div class="d-flow8">
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
    </div>
    <div class="d-flow8">
      <!-- Danger -->
      <dt-button kind="danger">
        Danger
      </dt-button>

      <!-- Inverted -->
      <dt-button kind="inverted">
        Inverted
      </dt-button>

      <!-- Disabled -->
      <dt-button disabled>
        Disabled
      </dt-button>
    </div>
    <div class="d-flow8">
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
    </div>
    <div class="d-flow8">
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
    </div>
    <div class="d-flow8">
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
    </div>
    <div class="d-flow8">
      <!-- Loading -->
      <dt-button loading>
        Button
      </dt-button>
    </div>
    <div class="d-flow8">
      <!-- Link Button -->
      <dt-button link>
        Link Button
      </dt-button>
    </div>
    <div class="d-flow8">
      <!-- Active Button -->
      <dt-button active>
        Active button
      </dt-button>
      <!-- Active Inverted Button -->
      <dt-button
        active
        kind="inverted"
      >
        Active Inverted button
      </dt-button>
      <!-- Active Danger Button -->
      <dt-button
        active
        kind="danger"
      >
        Active Danger button
      </dt-button>
    </div>
  </div>
</template>

<script>
import DtButton from './button.vue';
import { DtIcon } from '@/components/icon';

export default {
  name: 'ButtonVariants',
  components: { DtButton, DtIcon },
};
</script>
