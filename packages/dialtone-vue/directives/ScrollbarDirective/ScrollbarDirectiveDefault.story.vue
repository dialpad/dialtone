<template>
  <dt-stack
    gap="200"
    class="d-p-100"
  >
    <div>
      <p class="d-label--md-compact d-mbe-100">
        Default (auto-hide on leave)
      </p>
      <div
        v-dt-scrollbar
        class="d-h-250 d-w-400 d-bar-400 d-bc-default d-ba"
      >
        <div class="d-p-200">
          <p
            v-for="i in 20"
            :key="i"
            class="d-body--md"
          >
            Scrollable content line {{ i }}
          </p>
        </div>
      </div>
    </div>
    <div>
      <p class="d-label--md-compact d-mbe-100">
        Never auto-hide
      </p>
      <div
        v-dt-scrollbar:never
        class="d-h-250 d-w-400 d-bar-400 d-bc-default d-ba"
      >
        <div class="d-p-200">
          <p
            v-for="i in 20"
            :key="i"
            class="d-body--md"
          >
            Scrollable content line {{ i }}
          </p>
        </div>
      </div>
    </div>
    <div>
      <p class="d-label--md-compact d-mbe-100">
        Auto-hide on scroll
      </p>
      <div
        v-dt-scrollbar:scroll
        class="d-h-250 d-w-400 d-bar-400 d-bc-default d-ba"
      >
        <div class="d-p-200">
          <p
            v-for="i in 20"
            :key="i"
            class="d-body--md"
          >
            Scrollable content line {{ i }}
          </p>
        </div>
      </div>
    </div>
  </dt-stack>
</template>

<script>
import DtStack from '@/components/stack/stack.vue';
export default {
  name: 'DtScrollbarDirectiveDefault',
  components: { DtStack },
};
</script>
