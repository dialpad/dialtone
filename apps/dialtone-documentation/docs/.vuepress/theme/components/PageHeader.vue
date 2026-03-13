<template>
  <section>
    <slot name="content-top" />
    <header>
      <div class="d-stack d-stack--row d-stack--gap-500 d-jc-space-between">
        <div class="d-stack d-stack--row d-stack--gap-400">
          <h1
            v-if="$frontmatter.title"
            class="dialtone-page-title"
            v-text="$frontmatter.title"
          />
          <span
            v-if="$frontmatter.new"
            class="d-badge d-badge--bulletin"
          >New</span>
        </div>
        <span class="d-stack d-stack--row d-stack--gap-300">
          <dt-button
            v-if="$frontmatter.storybook && $frontmatter.storybook !== 'planned'"
            :href="$frontmatter.storybook"
            target="_blank"
            rel="noopener noreferrer"
            kind="muted"
            importance="clear"
          >
            <template #icon="{ iconSize }">
              <dt-icon-storybook-color :size="iconSize" />
            </template>
            Storybook
          </dt-button>
          <dt-button
            v-if="$frontmatter.figma_url"
            :href="$frontmatter.figma_url"
            target="_blank"
            rel="noopener noreferrer"
            kind="muted"
            importance="clear"
          >
            <template #icon="{ iconSize }">
              <dt-icon-figma :size="iconSize" />
            </template>
            Figma
          </dt-button>
        </span>
      </div>
      <p
        v-if="$frontmatter.description"
        class="dialtone-intro"
        v-html="$frontmatter.description"
      />
    </header>
    <slot name="content-bottom" />
    <div
      v-if="$page.path.startsWith('/components') && !$frontmatter.no_preview"
      id="preview-header"
      class="d-docsite--preview-header"
    >
      <h2 class="d-vi-visible-sr">
        Preview
      </h2>
    </div>
  </section>
</template>

<script setup>
import { DtIconStorybookColor, DtIconFigma } from '@dialpad/dialtone-icons/vue3';
</script>

<!-- TODO: validate that `storybook` and `figma` are URLS -->
