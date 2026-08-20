<template>
  <dt-box
    padding-block-start="450"
    padding-block-end="100"
  >
    <dt-stack gap="100">
      <dt-stack
        direction="row"
        justify="space-between"
        gap="200"
        class="d-pis-150 d-pie-100"
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
      </dt-stack>
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
        @update:model-value="highlightIndex = -1"
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
            class="d-mie-n75 d-px-100 d-bgc-moderate d-baw0"
            shortcut="∕"
            screen-reader-text="Type / (slash) to focus search field"
          />
        </template>
      </dt-input>
    </dt-stack>
  </dt-box>
</template>

<script setup>
import { ref } from 'vue';

// Brand row plus the search field at the top of the sidebar. Owns no search state —
// the term is a model, and clearing the keyboard highlight is the parent's job.
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

const inputValue = defineModel({ type: String, required: true });

const inputRef = ref(null);

// The parent focuses the field on the "/" shortcut and after clearing a search.
defineExpose({
  focus: () => inputRef.value?.focus(),
});
</script>
