<template>
  <div
    v-if="item.status === 'planned'"
    class="d-btn d-w100p d-jc-flex-start d-ta-left d-fw-normal d-fc-muted h:d-bgc-transparent d-c-default"
    :class="{
      'd-pis-400': presentation === 'promoted' && depth === 1,
      'd-pis-600': presentation !== 'promoted' && depth === 1,
      'd-pis-800': depth === 2,
    }"
  >
    <dt-stack as="span" direction="row" justify="space-between" class="d-w100p">
      {{ item.text }}
      <dt-badge v-bind="getBadge(item.status)" class="d-mis-50" />
    </dt-stack>
  </div>
  <dt-button
    v-else
    :id="id"
    ref="buttonRef"
    v-bind="collapsibleAttrs"
    :to="!collapsible && !isExternal ? item.link || undefined : undefined"
    :href="!collapsible && isExternal ? item.link : undefined"
    :target="!collapsible && isExternal ? '_blank' : undefined"
    :rel="!collapsible && isExternal ? 'noopener noreferrer' : undefined"
    :active="active"
    importance="clear"
    kind="muted"
    :label-class="[
      'd-jc-flex-start d-ta-left d-fw-normal d-tw-pretty',
      { 'd-pis-50': presentation === 'promoted' && depth === 0 },
    ]"
    :size="presentation === 'promoted' ? '300' : depth === 0 ? 'lg' : undefined"
    :class="[
      'd-w100p dialtone-shell-btn',
      {
        'd-headline--eyebrow d-fw-semibold d-bgc-transparent d-c-default': !item.link,
        'd-pie-200': collapsible && depth === 1,
        'd-pis-350': presentation === 'promoted' && depth === 1,
        'd-pis-600': presentation !== 'promoted' && depth === 1,
        'd-pis-800': depth === 2,
        'd-mbs-25': firstNestedChild,
      },
    ]"
    @click="$emit('click', $event)"
  >
    <dt-icon
      v-if="presentation !== 'promoted' && depth === 0 && item.icon"
      :name="item.icon"
      size="400"
      class="d-mie-150 d-fc-muted"
    />
    <dt-stack
      v-if="getBadge(item.status)"
      as="span"
      direction="row"
      justify="space-between"
      class="d-w100p"
    >
      {{ item.text }}
      <dt-badge
        v-bind="getBadge(item.status)"
        class="d-mis-50"
        :class="{ 'd-mie-300': !collapsible && depth === 0 }"
      />
    </dt-stack>
    <template v-else>
      {{ item.text }}
    </template>
    <template v-if="collapsible" #endIcon="{ iconSize }">
      <dt-box v-if="presentation === 'promoted'" padding-inline-end="75" class="d-d-flex">
        <dt-icon
          :name="open ? 'chevron-up' : 'chevron-down'"
          :size="iconSize"
        />
      </dt-box>
      <dt-icon
        v-else
        :name="open ? 'chevron-up' : 'chevron-down'"
        :size="iconSize"
      />
    </template>
  </dt-button>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { isExternalUrl } from '../utils/isExternalUrl';

const STATUS_BADGES = {
  beta: { type: 'info', text: 'Beta' },
  new: { type: 'bulletin', text: 'New' },
  planned: { text: 'Planned' },
};
const getBadge = (status) => STATUS_BADGES[status];

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  item: {
    type: Object,
    required: true,
  },
  depth: {
    type: Number,
    default: 0,
  },
  presentation: {
    type: String,
    default: 'primary',
  },
  active: {
    type: Boolean,
    default: false,
  },
  highlighted: {
    type: Boolean,
    default: false,
  },
  collapsible: {
    type: Boolean,
    default: false,
  },
  collapsibleAttrs: {
    type: Object,
    default: () => ({}),
  },
  open: {
    type: Boolean,
    default: false,
  },
  firstNestedChild: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['click']);

const buttonRef = ref(null);
const isExternal = computed(() => isExternalUrl(props.item.link));

watch(() => props.highlighted, (highlighted) => {
  if (!highlighted) return;

  const element = buttonRef.value?.$el || buttonRef.value;
  element?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'nearest',
  });
}, { flush: 'post' });
</script>
