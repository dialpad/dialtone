<template>
  <dt-text
    kind="label"
    :size="100"
    tone="secondary"
    class="d-input__label-text d-c-default"
  >
    <slot />
  </dt-text>
  <dt-dropdown
    navigation-type="arrow-keys"
    placement="bottom-start"
    content-width="anchor"
    max-height="400px"
    @opened="onOpened"
  >
    <template #anchor="{ attrs }">
      <dt-button
        v-bind="attrs"
        importance="outlined"
        kind="muted"
        :size="100"
        :disabled="disabled"
        class="d-w100p"
        label-class="d-jc-space-between d-fw-normal"
        leading-class="d-pis-75"
      >
        <template
          v-if="(selectedOption?.resolved && isColor(selectedOption.resolved)) || selectedOption?.previewComponent"
          #leading
        >
          <span
            v-if="selectedOption.resolved && isColor(selectedOption.resolved)"
            class="d-ba d-bc-subtle d-bar-circle"
            :style="swatchStyle(selectedOption.resolved)"
          />
          <component
            v-else
            :is="selectedOption.previewComponent"
            size="200"
            class="d-fc-muted"
          />
        </template>
        {{ selectedLabel }}
        <span aria-hidden="true">&thinsp;<!-- hold the space --></span>
        <dt-text
          v-if="selectedOption?.resolved && !isColor(selectedOption.resolved)"
          v-dt-tooltip="selectedOption.resolved.includes('/') ? 'Font Size / Line Height' : undefined"
          kind="body"
          :size="100"
          tone="muted"
        >
          {{ selectedOption.resolved }}
        </dt-text>
        <template #endIcon="{ iconSize }">
          <dt-icon-chevrons-up-down
            class="d-fc-muted"
            :size="iconSize"
          />
        </template>
      </dt-button>
    </template>
    <template #list="{ close }">
      <dt-box
        v-if="showSearch"
        class="dtc-search-box"
        surface="overlay"
        padding-block-end="50"
        border-width-block-end="100"
        border-color="subtle"
      >
        <dt-input
          ref="searchInput"
          v-model="query"
          type="search"
          :size="100"
          placeholder="Search"
          @keydown="onSearchKeydown($event, close)"
        >
          <template #startIcon="{ iconSize }">
            <dt-icon-search :size="iconSize" />
          </template>
          <template #endIcon="{ clear }">
            <dt-button
              :style="!query.length ? { visibility: 'hidden', pointerEvents: 'none' } : undefined"
              kind="muted"
              importance="clear"
              :size="100"
              circle
              aria-label="Clear search"
              @click="clear"
            >
              <template #startIcon="{ iconSize }">
                <dt-icon-close :size="iconSize" />
              </template>
            </dt-button>
          </template>
        </dt-input>
      </dt-box>
      <div>
        <dt-list-item
          v-for="option in filteredOptions"
          :key="option.value"
          element-type="div"
          role="menuitem"
          navigation-type="arrow-keys"
          :class="{ 'd-o50 d-pe-none': option.disabled, 'd-bgc-moderate-opaque': option.value === value }"
          :aria-disabled="option.disabled || undefined"
          @click="!option.disabled && (onInput(option.value), close())"
        >
          <dt-stack
            direction="row"
            gap="100"
            align="baseline"
            class="d-w100p"
          >
            <span
              v-if="option.resolved && isColor(option.resolved)"
              class="d-ba d-bc-subtle d-bar-circle d-as-center"
              :style="swatchStyle(option.resolved)"
            />
            <span>{{ option.label }}</span>
            <component
              v-if="option.previewComponent"
              :is="option.previewComponent"
              size="200"
              class="d-mis-auto d-as-center d-fc-muted"
            />
            <dt-text
              v-if="option.resolved && !isColor(option.resolved)"
              kind="body"
              :size="100"
              tone="muted"
              class="d-mis-auto"
            >
              {{ option.resolved }}
            </dt-text>
          </dt-stack>
        </dt-list-item>
      </div>
      <dt-text
        v-if="!filteredOptions.length"
        kind="body"
        :size="100"
        tone="muted"
        as="div"
        class="d-px-200 d-py-150 d-ta-center"
      >
        No matches
      </dt-text>
    </template>
  </dt-dropdown>
</template>

<script setup>
import { DtBox, DtButton, DtInput, DtStack, DtText } from '@dialpad/dialtone-vue';
import { DtIconClose, DtIconChevronsUpDown, DtIconSearch } from '@dialpad/dialtone-icons/vue';

import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { resolveTokenValue } from '@/src/lib/tokens';
import { computed, ref } from 'vue';

// Show the in-popover search only for lists long enough to be worth filtering.
const SEARCH_THRESHOLD = 5;

const props = defineProps({
  value: {
    type: undefined,
    required: true,
  },
  defaultValue: {
    type: undefined,
    default: undefined,
  },
  validValues: {
    type: Array,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  generateLabel: {
    type: Function,
    default: (value) => value.toString(),
  },
  tokenCategory: {
    type: String,
    default: undefined,
  },
  propValues: {
    type: Object,
    default: undefined,
  },
  disabledValues: {
    type: Set,
    default: undefined,
  },
  generatePreviewComponent: {
    type: Function,
    default: null,
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

const isColor = (v) => /^(rgb|oklch|#)/.test(v);

const swatchStyle = (color) => ({
  backgroundColor: color,
  inlineSize: 'var(--dt-icon-size-100)',
  blockSize: 'var(--dt-icon-size-100)',
});

function onInput (e) {
  emit(VALUE_UPDATE_EVENT, e === 'null' ? null : e);
}

const options = computed(() => {
  const valueOptions = props.validValues?.map(selection => {
    const optionDisabled = props.disabledValues?.has(String(selection)) ?? false;
    const rawResolved = props.tokenCategory
      ? resolveTokenValue(props.tokenCategory, selection, props.propValues)
      : null;
    // Show color swatches even for disabled options; hide non-color values (misleading for disabled sizes)
    const resolved = optionDisabled && rawResolved && !isColor(rawResolved) ? null : rawResolved;
    const previewComponent = props.generatePreviewComponent?.(selection) ?? null;
    return { value: selection, label: props.generateLabel(selection), resolved, disabled: optionDisabled, previewComponent };
  }) ?? [];

  if (props.defaultValue === null || props.defaultValue === undefined) {
    return [{ value: null, label: '\u2013' }, ...valueOptions];
  }
  return valueOptions;
});

const selectedOption = computed(() => {
  return options.value.find(o => String(o.value) === String(props.value));
});

const selectedLabel = computed(() => selectedOption.value?.label ?? '');

const query = ref('');
const searchInput = ref(null);

const showSearch = computed(() => options.value.length > SEARCH_THRESHOLD);

const filteredOptions = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return options.value;
  return options.value.filter(o => `${o.label} ${o.resolved ?? ''}`.toLowerCase().includes(q));
});

/**
 * Resets and focuses the search field each time the dropdown opens. Runs on
 * `opened` (after the popover has shown and applied its own initial focus to the
 * dialog), and defers a frame so the search field reliably wins focus.
 *
 * @param {boolean} open - Whether the dropdown just opened.
 */
function onOpened (open) {
  if (!open) return;
  query.value = '';
  requestAnimationFrame(() => {
    searchInput.value?.$el?.querySelector('input')?.focus();
  });
}

/**
 * Selects the first enabled match — lets the user filter and press Enter.
 *
 * @param {Function} close - Closes the dropdown.
 */
function selectFirst (close) {
  const first = filteredOptions.value.find(o => !o.disabled);
  if (!first) return;
  onInput(first.value);
  close();
}

/**
 * Handles keys in the search field. Arrow keys propagate to DtDropdown so its
 * highlightIndex stays in sync (avoids the double-keystroke bug). All other
 * keys are stopped to prevent DtDropdown's type-ahead from intercepting typing.
 *
 * @param {KeyboardEvent} e - The keydown event.
 * @param {Function} close - Closes the dropdown.
 */
function onSearchKeydown (e, close) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault(); // no page scroll
    return; // let DtDropdown's navigation handle it
  }
  e.stopPropagation();
  if (e.key === 'Enter') {
    e.preventDefault();
    selectFirst(close);
  } else if (e.key === 'Escape') {
    close();
  }
}
</script>

<script>
/**
 * Control that is used to select any value from a list of values.
 */
export default {
  name: 'DtcControlSelection',
};
</script>

<style scoped>
/*
 * Stick the search box to the top of the popover's scroll container so it
 * stays visible as the user scrolls through the list. z-index: 1 keeps it
 * above list items that slide under it.
 */
.dtc-search-box {
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
}
</style>
