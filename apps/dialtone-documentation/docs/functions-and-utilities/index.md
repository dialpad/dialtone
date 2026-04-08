---
title: Vue Utilities
description: Consumer-facing directives and utilities exported by Dialtone Vue.
thumb: true
---

## Directives

Behavioral plugins that attach to any element — add keyboard navigation, color modes, tooltips, and more.

<table class="d-table dialtone-doc-table">
  <thead>
    <tr>
      <th>Directive</th>
      <th>Description</th>
      <th class="d-ta-right">Docs</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in directives" :key="item.name" valign="baseline">
      <th scope="row"><dt-text as="code" kind="code" size="100" class="d-docsite-code">{{ item.name }}</dt-text></th>
      <td>{{ item.description }}</td>
      <td class="d-ta-right"><dt-button kind="muted" importance="outlined" size="sm" target="_blank" :href="item.storybook"><template #startIcon="{ iconSize }"><dt-icon name="storybook-color" :size="iconSize" /></template>Storybook</dt-button></td>
    </tr>
  </tbody>
</table>

## Functions

Stateless helpers for formatting and transforming data.

<table class="d-table dialtone-doc-table">
  <thead>
    <tr>
      <th>Function</th>
      <th>Description</th>
      <th class="d-ta-right">Docs</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in functions" :key="item.name" valign="baseline">
      <th scope="row">{{ item.name }}</th>
      <td>{{ item.description }}</td>
      <td class="d-ta-right"><dt-button kind="muted" importance="outlined" size="sm" target="_blank" :href="item.storybook"><template #startIcon="{ iconSize }"><dt-icon name="storybook-color" :size="iconSize" /></template>Storybook</dt-button></td>
    </tr>
  </tbody>
</table>

## Utilities

Foundational modules for rendering optimization and internationalization.

<table class="d-table dialtone-doc-table">
  <thead>
    <tr>
      <th>Utility</th>
      <th>Description</th>
      <th class="d-ta-right">Docs</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in utilities" :key="item.name" valign="baseline">
      <th scope="row">{{ item.name }}</th>
      <td>{{ item.description }}</td>
      <td class="d-ta-right"><dt-button kind="muted" importance="outlined" size="sm" target="_blank" :href="item.storybook"><template #startIcon="{ iconSize }"><dt-icon name="storybook-color" :size="iconSize" /></template>Storybook</dt-button></td>
    </tr>
  </tbody>
</table>

<script setup>
import { directives, functions, utilities } from '@data/vue-utilities.json';
</script>
