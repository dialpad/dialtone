<template>
  <div id="elements-button--variants-container">
    <div class="d-mb16">
      <!-- Default -->
      <hs-button>
        Primary
      </hs-button>

      <!-- Outlined -->
      <hs-button importance="outlined">
        Outlined
      </hs-button>

      <!-- Clear -->
      <hs-button importance="clear">
        Clear
      </hs-button>
    </div>
    <div class="d-mb16">
      <!-- Danger -->
      <hs-button kind="danger">
        Danger
      </hs-button>

      <!-- Inverted -->
      <hs-button kind="inverted">
        Inverted
      </hs-button>

      <!-- Disabled -->
      <hs-button disabled>
        Disabled
      </hs-button>
    </div>
    <div class="d-mb16">
      <!-- Extra Small -->
      <hs-button size="xs">
        Extra Small
      </hs-button>

      <!-- Small -->
      <hs-button size="sm">
        Small
      </hs-button>

      <!-- Medium -->
      <hs-button size="md">
        Medium
      </hs-button>

      <!-- Large -->
      <hs-button size="lg">
        Large
      </hs-button>

      <!-- Extra Large -->
      <hs-button size="xl">
        Extra Large
      </hs-button>
    </div>
    <div class="d-mb16">
      <!-- Circle -->
      <hs-button
        importance="outlined"
        circle
      >
        <template #icon>
          <icon-dialpad-glyph />
        </template>
      </hs-button>

      <!-- Icon Left -->
      <hs-button>
        <template #icon>
          <icon-dialpad-glyph />
        </template>
        Icon Left
      </hs-button>

      <!-- Icon Right -->
      <hs-button icon-position="right">
        <template #icon>
          <icon-dialpad-glyph />
        </template>
        Icon Right
      </hs-button>
    </div>
    <div class="d-mb16">
      <!-- Loading -->
      <hs-button loading>
        Button
      </hs-button>
    </div>
    <div class="d-mb16">
      <!-- Link Button -->
      <hs-button link>
        Link Button
      </hs-button>
    </div>
  </div>
</template>

<script>
import HsButton from './button';
import IconDialpadGlyph from '@dialpad/dialtone/lib/dist/vue/icons/IconDialpadGlyph';

export default {
  name: 'ButtonVariants',
  components: { HsButton, IconDialpadGlyph },
};
</script>
