<!-- eslint-disable max-lines -->
<template>
  <dt-stack gap="600">
    <dt-stack>
      <p class="d-fw-bold d-mb8">
        Horizontal (default)
      </p>
      <div>
        <dt-segmented-control
          v-model="selectedHorizontal"
          aria-label="Horizontal example"
        >
          <dt-segmented-control-item value="all">
            All
          </dt-segmented-control-item>
          <dt-segmented-control-item value="favorites">
            Favorites
          </dt-segmented-control-item>
          <dt-segmented-control-item value="recent">
            Recent
          </dt-segmented-control-item>
          <dt-segmented-control-item value="groups">
            Groups
          </dt-segmented-control-item>
        </dt-segmented-control>
      </div>
      <p class="d-mb8">
        Horizontal: inline-flex (aka "hug")
      </p>
      <div>
        <dt-segmented-control
          v-model="selectedHorizontal"
          aria-label="Horizontal example"
          class="d-d-inline-flex"
        >
          <dt-segmented-control-item value="all">
            All
          </dt-segmented-control-item>
          <dt-segmented-control-item value="favorites">
            Favorites
          </dt-segmented-control-item>
          <dt-segmented-control-item value="recent">
            Recent
          </dt-segmented-control-item>
          <dt-segmented-control-item value="groups">
            Groups
          </dt-segmented-control-item>
        </dt-segmented-control>
      </div>
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        No divider
      </p>
      <div>
        <dt-segmented-control
          v-model="selectedHorizontal"
          hide-divider
          aria-label="No divider example"
        >
          <dt-segmented-control-item value="all">
            All
          </dt-segmented-control-item>
          <dt-segmented-control-item value="favorites">
            Favorites
          </dt-segmented-control-item>
          <dt-segmented-control-item value="recent">
            Recent
          </dt-segmented-control-item>
          <dt-segmented-control-item value="groups">
            Groups
          </dt-segmented-control-item>
        </dt-segmented-control>
      </div>
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        Borderless
      </p>
      <div>
        <dt-segmented-control
          v-model="selectedHorizontal"
          borderless
          aria-label="Borderless example"
        >
          <dt-segmented-control-item value="all">
            All
          </dt-segmented-control-item>
          <dt-segmented-control-item value="favorites">
            Favorites
          </dt-segmented-control-item>
          <dt-segmented-control-item value="recent">
            Recent
          </dt-segmented-control-item>
          <dt-segmented-control-item value="groups">
            Groups
          </dt-segmented-control-item>
        </dt-segmented-control>
      </div>
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        Spread: evenly
      </p>
      <div>
        <dt-segmented-control
          v-model="selectedSpread"
          spread="evenly"
          aria-label="Spread evenly example"
        >
          <dt-segmented-control-item value="1">
            1
          </dt-segmented-control-item>
          <dt-segmented-control-item value="two">
            Two
          </dt-segmented-control-item>
          <dt-segmented-control-item value="three">
            Three
          </dt-segmented-control-item>
          <dt-segmented-control-item value="four">
            Four long label
          </dt-segmented-control-item>
        </dt-segmented-control>
      </div>
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        With icons
      </p>
      <div>
        <dt-segmented-control
          v-model="selectedIcons"
          aria-label="List spacing"
        >
          <dt-segmented-control-item value="compact">
            <template #startIcon="{ iconSize }">
              <dt-icon-list-spacing-compact :size="iconSize" />
            </template>
            Compact
          </dt-segmented-control-item>
          <dt-segmented-control-item value="regular">
            <template #startIcon="{ iconSize }">
              <dt-icon-list-spacing-regular :size="iconSize" />
            </template>
            Regular
          </dt-segmented-control-item>
          <dt-segmented-control-item value="expanded">
            <template #startIcon="{ iconSize }">
              <dt-icon-list-spacing-expanded :size="iconSize" />
            </template>
            Expanded
          </dt-segmented-control-item>
        </dt-segmented-control>
      </div>
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        Icon only
      </p>
      <div>
        <dt-segmented-control
          v-model="selectedIconOnly"
          aria-label="Appearance mode"
        >
          <dt-segmented-control-item
            value="system"
            label="System"
          >
            <template #startIcon="{ iconSize }">
              <dt-icon-laptop2 :size="iconSize" />
            </template>
          </dt-segmented-control-item>
          <dt-segmented-control-item
            value="light"
            label="Light"
          >
            <template #startIcon="{ iconSize }">
              <dt-icon-sun :size="iconSize" />
            </template>
          </dt-segmented-control-item>
          <dt-segmented-control-item
            value="dark"
            label="Dark"
          >
            <template #startIcon="{ iconSize }">
              <dt-icon-moon :size="iconSize" />
            </template>
          </dt-segmented-control-item>
        </dt-segmented-control>
      </div>
      <p class="d-fw-bold d-mb8">
        Icon only (inline-flex)
      </p>
      <div>
        <dt-segmented-control
          v-model="selectedIconOnly"
          aria-label="Appearance mode"
          class="d-d-inline-flex"
        >
          <dt-segmented-control-item
            value="system"
            label="System"
          >
            <template #startIcon="{ iconSize }">
              <dt-icon-laptop2 :size="iconSize" />
            </template>
          </dt-segmented-control-item>
          <dt-segmented-control-item
            value="light"
            label="Light"
          >
            <template #startIcon="{ iconSize }">
              <dt-icon-sun :size="iconSize" />
            </template>
          </dt-segmented-control-item>
          <dt-segmented-control-item
            value="dark"
            label="Dark"
          >
            <template #startIcon="{ iconSize }">
              <dt-icon-moon :size="iconSize" />
            </template>
          </dt-segmented-control-item>
        </dt-segmented-control>
      </div>
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        With trailing slot
      </p>
      <div>
        <dt-segmented-control
          v-model="selectedTrailing"
          aria-label="Fruit counts"
        >
          <dt-segmented-control-item
            value="apples"
            trailing-class="d-pr8"
          >
            Apples
            <template #trailing>
              <dt-badge kind="count">
                24
              </dt-badge>
            </template>
          </dt-segmented-control-item>
          <dt-segmented-control-item
            value="oranges"
            trailing-class="d-pr8"
          >
            Oranges
            <template #trailing>
              <dt-badge kind="count">
                8
              </dt-badge>
            </template>
          </dt-segmented-control-item>
          <dt-segmented-control-item
            value="bananas"
            trailing-class="d-pr8"
          >
            Bananas
            <template #trailing>
              <dt-badge kind="count">
                15
              </dt-badge>
            </template>
          </dt-segmented-control-item>
        </dt-segmented-control>
      </div>
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        Vertical
      </p>
      <dt-stack
        direction="row"
        gap="400"
        align="start"
      >
        <dt-segmented-control
          v-model="selectedIconOnly"
          aria-label="Appearance mode"
          orientation="vertical"
        >
          <dt-segmented-control-item
            value="system"
            label="System"
          >
            <template #startIcon="{ iconSize }">
              <dt-icon-laptop2 :size="iconSize" />
            </template>
          </dt-segmented-control-item>
          <dt-segmented-control-item
            value="light"
            label="Light"
          >
            <template #startIcon="{ iconSize }">
              <dt-icon-sun :size="iconSize" />
            </template>
          </dt-segmented-control-item>
          <dt-segmented-control-item
            value="dark"
            label="Dark"
          >
            <template #startIcon="{ iconSize }">
              <dt-icon-moon :size="iconSize" />
            </template>
          </dt-segmented-control-item>
        </dt-segmented-control>
        <dt-segmented-control
          v-model="selectedVertical"
          class="d-w164"
          orientation="vertical"
          aria-label="Vertical example"
          size="xs"
        >
          <dt-segmented-control-item value="all">
            All
          </dt-segmented-control-item>
          <dt-segmented-control-item value="favorites">
            Favorites
          </dt-segmented-control-item>
          <dt-segmented-control-item value="recent">
            Recent
          </dt-segmented-control-item>
          <dt-segmented-control-item value="groups">
            Groups
          </dt-segmented-control-item>
        </dt-segmented-control>
      </dt-stack>
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        Sizes
      </p>
      <dt-stack gap="400">
        <div>
          <dt-segmented-control
            v-model="selectedSize"
            size="xs"
            aria-label="Extra small size"
          >
            <dt-segmented-control-item value="option1">
              Option 1
              <template #startIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
              <template #endIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
            </dt-segmented-control-item>
            <dt-segmented-control-item value="option2">
              Option 2
              <template #startIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
              <template #endIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
            </dt-segmented-control-item>
            <dt-segmented-control-item value="option3">
              Option 3
              <template #startIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
              <template #endIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
            </dt-segmented-control-item>
          </dt-segmented-control>
        </div>
        <div>
          <dt-segmented-control
            v-model="selectedSize"
            size="sm"
            aria-label="Small size"
          >
            <dt-segmented-control-item value="option1">
              Option 1
              <template #startIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
              <template #endIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
            </dt-segmented-control-item>
            <dt-segmented-control-item value="option2">
              Option 2
              <template #startIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
              <template #endIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
            </dt-segmented-control-item>
            <dt-segmented-control-item value="option3">
              Option 3
              <template #startIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
              <template #endIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
            </dt-segmented-control-item>
          </dt-segmented-control>
        </div>
        <div>
          <dt-segmented-control
            v-model="selectedSize"
            size="md"
            aria-label="Default size"
          >
            <dt-segmented-control-item value="option1">
              Option 1
              <template #startIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
              <template #endIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
            </dt-segmented-control-item>
            <dt-segmented-control-item value="option2">
              Option 2
              <template #startIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
              <template #endIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
            </dt-segmented-control-item>
            <dt-segmented-control-item value="option3">
              Option 3
              <template #startIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
              <template #endIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
            </dt-segmented-control-item>
          </dt-segmented-control>
        </div>
        <div>
          <dt-segmented-control
            v-model="selectedSize"
            size="lg"
            aria-label="Large size"
          >
            <dt-segmented-control-item value="option1">
              Option 1
              <template #startIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
              <template #endIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
            </dt-segmented-control-item>
            <dt-segmented-control-item value="option2">
              Option 2
              <template #startIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
              <template #endIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
            </dt-segmented-control-item>
            <dt-segmented-control-item value="option3">
              Option 3
              <template #startIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
              <template #endIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
            </dt-segmented-control-item>
          </dt-segmented-control>
        </div>
        <div>
          <dt-segmented-control
            v-model="selectedSize"
            size="xl"
            aria-label="Extra large size"
          >
            <dt-segmented-control-item value="option1">
              Option 1
              <template #startIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
              <template #endIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
            </dt-segmented-control-item>
            <dt-segmented-control-item value="option2">
              Option 2
              <template #startIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
              <template #endIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
            </dt-segmented-control-item>
            <dt-segmented-control-item value="option3">
              Option 3
              <template #startIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
              <template #endIcon="{ iconSize }">
                <dt-icon-box-select :size="iconSize" />
              </template>
            </dt-segmented-control-item>
          </dt-segmented-control>
        </div>
      </dt-stack>
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        Disabled (entire group)
      </p>
      <div>
        <dt-segmented-control
          v-model="selectedDisabled"
          disabled
          aria-label="Disabled group example"
        >
          <dt-segmented-control-item value="all">
            All
          </dt-segmented-control-item>
          <dt-segmented-control-item value="favorites">
            Favorites
          </dt-segmented-control-item>
          <dt-segmented-control-item value="recent">
            Recent
          </dt-segmented-control-item>
          <dt-segmented-control-item value="groups">
            Groups
          </dt-segmented-control-item>
        </dt-segmented-control>
      </div>
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        Individual disabled option
      </p>
      <div>
        <dt-segmented-control
          v-model="selectedIndividualDisabled"
          aria-label="Individual disabled example"
        >
          <dt-segmented-control-item value="all">
            All
          </dt-segmented-control-item>
          <dt-segmented-control-item
            value="favorites"
            disabled
          >
            Favorites
          </dt-segmented-control-item>
          <dt-segmented-control-item value="recent">
            Recent
          </dt-segmented-control-item>
          <dt-segmented-control-item value="groups">
            Groups
          </dt-segmented-control-item>
        </dt-segmented-control>
      </div>
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        Activation mode: auto (selects on focus)
      </p>
      <div>
        <dt-segmented-control
          v-model="selectedAuto"
          activation-mode="auto"
          aria-label="Auto activation example"
        >
          <dt-segmented-control-item value="all">
            All
          </dt-segmented-control-item>
          <dt-segmented-control-item value="favorites">
            Favorites
          </dt-segmented-control-item>
          <dt-segmented-control-item value="recent">
            Recent
          </dt-segmented-control-item>
          <dt-segmented-control-item value="groups">
            Groups
          </dt-segmented-control-item>
        </dt-segmented-control>
      </div>
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        Activation mode: manual (Space/Enter to select)
      </p>
      <div>
        <dt-segmented-control
          v-model="selectedManual"
          activation-mode="manual"
          aria-label="Manual activation example"
        >
          <dt-segmented-control-item value="all">
            All
          </dt-segmented-control-item>
          <dt-segmented-control-item value="favorites">
            Favorites
          </dt-segmented-control-item>
          <dt-segmented-control-item value="recent">
            Recent
          </dt-segmented-control-item>
          <dt-segmented-control-item value="groups">
            Groups
          </dt-segmented-control-item>
        </dt-segmented-control>
      </div>
    </dt-stack>
  </dt-stack>
</template>

<script>
import DtSegmentedControl from './segmented_control.vue';

import DtSegmentedControlItem from './segmented_control_item.vue';
import { DtStack } from '../stack';
import DtBadge from '../badge/badge.vue';

import {
  DtIconListSpacingCompact,
  DtIconListSpacingRegular,
  DtIconListSpacingExpanded,
  DtIconLaptop2,
  DtIconSun,
  DtIconMoon,
  DtIconBoxSelect,
} from '@dialpad/dialtone-icons/vue';

export default {
  name: 'DtSegmentedControlVariants',
  components: {
    DtSegmentedControl,
    DtSegmentedControlItem,
    DtStack,
    DtIconListSpacingCompact,
    DtIconListSpacingRegular,
    DtIconListSpacingExpanded,
    DtIconLaptop2,
    DtIconSun,
    DtIconMoon,
    DtIconBoxSelect,
    DtBadge,
  },

  data () {
    return {
      selectedHorizontal: 'all',
      selectedSpread: '1',
      selectedVertical: 'all',
      selectedIcons: 'compact',
      selectedTrailing: 'apples',
      selectedIconOnly: 'system',
      selectedSize: 'option1',
      selectedDisabled: 'all',
      selectedIndividualDisabled: 'all',
      selectedAuto: 'all',
      selectedManual: 'all',
    };
  },
};
</script>
