<template>
  <dt-box
    :padding-block-start="viewport.pick({
      default: '200',
      lg: '450',
    })"
    padding-block-end="200"
  >
    <dt-stack gap="100">
      <dt-stack
        v-if="viewport.above('lg')"
        direction="row"
        justify="space-between"
        gap="200"
        class="d-pis-200 d-pie-150"
      >
        <dt-box padding-block-start="50">
          <dt-link
            title="Dialtone homepage"
            :underline="false"
            to="/"
          >
            <dt-illustration name="dialpad-logo" class="d-h-50 d-w-auto" />
          </dt-link>
        </dt-box>
        <dt-stack gap="25" direction="row">
          <dt-button
            v-dt-tooltip="'Storybook'"
            href="https://dialtone.dialpad.com/vue"
            target="_blank"
            rel="noreferrer noopener"
            kind="muted"
            importance="clear"
            aria-label="Open Storybook"
          >
            <template #startIcon="{ iconSize }">
              <dt-icon name="storybook" :size="iconSize" />
            </template>
          </dt-button>
          <dt-button
            v-dt-tooltip="'Github Repository'"
            href="https://github.com/dialpad/dialtone"
            target="_blank"
            rel="noreferrer noopener"
            kind="muted"
            importance="clear"
            aria-label="Open GitHub repository"
          >
            <template #startIcon="{ iconSize }">
              <dt-icon name="github" :size="iconSize" />
            </template>
          </dt-button>
        </dt-stack>
        <!--
        Future Feature: do not remove
        <dt-button
          v-dt-tooltip:bottom="'Toggle Navigation'"
          kind="muted"
          importance="clear"
          aria-label="Toggle Navigation"
        >
          <template #startIcon="{ iconSize }">
            <dt-icon name="sidebar-close" :size="iconSize" />
          </template>
        </dt-button>
        -->
      </dt-stack>
      <dt-box padding-inline="200">
        <dt-input
          ref="inputRef"
          v-model="inputValue"
          aria-label="Search"
          aria-autocomplete="list"
          :aria-controls="resultsId"
          :aria-activedescendant="activeResultId"
          placeholder="Search"
          type="search"
          end-icon-class="d-pie-25"
        >
          <template #startIcon="{ iconSize }">
            <dt-box class="d-d-flex" padding-inline-start="50">
              <dt-icon name="search" :size="iconSize" />
            </dt-box>
          </template>
          <template #endIcon="{ clear }">
            <dt-button
              v-if="inputValue.length !== 0"
              v-dt-tooltip="'Clear search'"
              kind="muted"
              importance="clear"
              :size="100"
              aria-label="Clear search"
              @click="clear"
            >
              <template #startIcon="{ iconSize }">
                <dt-icon name="close" :size="iconSize" />
              </template>
            </dt-button>
            <dt-keyboard-shortcut
              v-else-if="viewport.above('lg')"
              class="d-mie-n75 d-px-100 d-bgc-moderate d-baw0"
              shortcut="∕"
              screen-reader-text="Type / (slash) to focus search field"
            />
          </template>
        </dt-input>
      </dt-box>
    </dt-stack>
  </dt-box>
</template>

<script setup>
import { ref } from 'vue';
import { useViewportBreakpoints } from '../composables/useViewportBreakpoints.js';

// Brand row plus the search field at the top of the sidebar. The field renders at every
// width; the brand/toggle row and the "/" hint are desktop-only. Owns no search state:
// the term is a model, and the parent's filteredItems watch clears the keyboard highlight.
defineProps({
  // id of the results list this field controls, for aria-controls.
  resultsId: {
    type: String,
    required: true,
  },
  // id of the currently highlighted result, for aria-activedescendant.
  activeResultId: {
    type: String,
    default: undefined,
  },
});

const viewport = useViewportBreakpoints();

const inputValue = defineModel({ type: String, required: true });

const inputRef = ref(null);

// The parent focuses the field on the "/" shortcut and after clearing a search.
defineExpose({
  focus: () => inputRef.value?.focus(),
});
</script>
