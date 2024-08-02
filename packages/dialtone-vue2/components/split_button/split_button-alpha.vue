<template>
	<dt-button
	      v-dt-tooltip="alphaTooltipText"
	      data-qa="dt-split-button-alpha"
	      :size="size"
	      :class="[`d-split-btn__alpha d-split-btn__alpha--${size}`]"
	      :active="alphaActive"
	      :aria-label="alphaAriaLabel"
	      :icon-position="alphaIconPosition"
	      :label-class="alphaLabelClass"
	      :loading="alphaLoading"
	      :assertive-on-focus="assertiveOnFocus"
	      :disabled="disabled"
	      :importance="importance"
	      :kind="kind"
	      @click="(e) => handleClick('alpha', e)"
	    >
	      <template #icon>
	        <!-- @slot Alpha (left) button icon slot -->
	        <slot name="alphaIcon" />
	      </template>
	      <!-- @slot Default content slot -->
	      <slot name="default" />
	    </dt-button>
</template>

<script setup lang="ts">
defineProps<{ 
	size: string;
	alphaActive: boolean;
	alphaAriaLabel: string;
	alphaIconPosition: string;
	alphaLabelClass: string | Record<string, any> | unknown[];
	alphaLoading: boolean;
	assertiveOnFocus: boolean;
	disabled: boolean;
	importance: string;
	kind: string;
	vDtTooltip: any;
	alphaTooltipText: string;
	handleClick: (side: any, event: any) => void;
}>()
</script>
