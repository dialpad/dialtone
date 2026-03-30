<template>
  <dt-stack gap="800">
    <!-- Large -->
    <section>
      <p class="d-label-sm d-fc-tertiary d-mbe-100">
        Large (lg)
      </p>
      <dt-empty-state
        :size="400"
        header-text="Nothing to see here"
        body-text="Lorem ipsum dolor sit amet consectetur. Diam in aliquam arcu elit pulvinar morbi lorem ac neque."
      >
        <template #illustration>
          <dt-illustration name="mind" />
        </template>
        <template #body>
          <div class="d-mbs-100 d-stack d-stack--row d-stack--gap-50">
            <button class="d-btn">
              Cancel
            </button>
            <button class="d-btn d-btn--primary">
              Get started
            </button>
          </div>
        </template>
      </dt-empty-state>
    </section>

    <!-- Medium -->
    <section>
      <p class="d-label-sm d-fc-tertiary d-mbe-100">
        Medium (md)
      </p>
      <dt-empty-state
        :size="300"
        header-text="Nothing to see here"
        body-text="Lorem ipsum dolor sit amet consectetur. Diam in aliquam arcu elit pulvinar morbi lorem ac neque."
      >
        <template #illustration>
          <dt-illustration name="mind" />
        </template>
      </dt-empty-state>
    </section>

    <!-- Small -->
    <section>
      <p class="d-label-sm d-fc-tertiary d-mbe-100">
        Small (sm)
      </p>
      <dt-empty-state
        :size="200"
        header-text="Nothing to see here"
        body-text="Lorem ipsum dolor sit amet consectetur. Diam in aliquam arcu elit pulvinar morbi lorem ac neque."
      >
        <template #icon="{ iconSize }">
          <dt-icon
            name="search"
            :size="iconSize"
          />
        </template>
      </dt-empty-state>
    </section>
  </dt-stack>
</template>

<script setup>
import { DtEmptyState } from './';
import { DtIllustration } from '@/components/illustration';
import { DtIcon } from '@/components/icon';
import { DtStack } from '@/components/stack';
</script>
