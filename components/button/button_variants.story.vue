<template>
  <div id="components-button--variants-container">
    <div class="d-mb16">
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
    <div class="d-mb16">
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
    <div class="d-mb16">
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
    <div class="d-mb16">
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
    <div class="d-mb16">
      <!-- Circle -->
      <dt-button
        importance="outlined"
        circle
      >
        <template #icon>
          <icon-dialpad-glyph />
        </template>
      </dt-button>

      <!-- Icon Only -->
      <dt-button>
        <template #icon>
          <icon-dialpad-glyph />
        </template>
      </dt-button>

      <!-- Icon Left -->
      <dt-button>
        <template #icon>
          <icon-dialpad-glyph />
        </template>
        Icon Left
      </dt-button>

      <!-- Icon Right -->
      <dt-button icon-position="right">
        <template #icon>
          <icon-dialpad-glyph />
        </template>
        Icon Right
      </dt-button>
    </div>
    <div class="d-mb16">
      <!-- Loading -->
      <dt-button loading>
        Button
      </dt-button>
    </div>
    <div class="d-mb16">
      <!-- Link Button -->
      <dt-button link>
        Link Button
      </dt-button>
    </div>
  </div>
</template>

<script>
import DtButton from './button';
import IconDialpadGlyph from '@dialpad/dialtone/lib/dist/vue/icons/IconDialpadGlyph';

export default {
  name: 'ButtonVariants',
  components: { DtButton, IconDialpadGlyph },
};
</script>
