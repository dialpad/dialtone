<template>
  <div>
    <div
      v-if="loading"
      class="d-d-flex d-ai-center d-jc-center d-h164"
    >
      <dt-text
        tone="muted"
      >
        Loading components...
      </dt-text>
    </div>
    <template v-else>
      <dt-stack
        class="
          d-p32
          d-py16
          d-pb8
          d-bgc-secondary
          d-bb
          d-ps-sticky
          d-t0
          d-zi-base1
          d-mtn10
          d-mxn10
          d-bs-card
        "
        gap="300"
      >
        <dt-stack
          class="d-px8"
          gap="400"
          direction="row"
          justify="between"
        >
          <dt-text
            as="h1"
            kind="headline"
            size="3xl"
          >
            Kitchen Sink
            <dt-text
              kind="body"
              size="md"
              tone="muted"
            >
              {{ sections.length }} components
            </dt-text>
          </dt-text>
          <dt-text
            kind="body"
            size="xs"
          >
            <dt-link
              href="/iframe.html?id=kitchen-sink--default&viewMode=story&globals=contrast:default"
              target="_blank"
            >
              <dt-stack
                gap="300"
                direction="row"
              >
                Open in new window
                <dt-icon-external-link size="100" />
              </dt-stack>
            </dt-link>
          </dt-text>
        </dt-stack>
        <div
          v-dt-scrollbar
        >
          <dt-stack
            direction="row"
            gap="400"
            class="d-pb8 d-px8"
          >
            <dt-link
              v-for="section in sections"
              :key="section.id"
              :href="`#ks-${section.id}`"
              @click.prevent="scrollTo(section.id)"
            >
              <dt-text
                kind="body"
                size="sm"
                class="d-ws-nowrap"
              >
                {{ section.name }}
              </dt-text>
            </dt-link>
          </dt-stack>
        </div>
      </dt-stack>
      <dt-stack class="d-px32">
        <dt-stack
          v-for="section in sections"
          :id="`ks-${section.id}`"
          :key="section.id"
          as="section"
          gap="500"
          class="d-py32 kitchen-sink__section"
        >
          <dt-text
            as="h2"
            kind="headline"
            size="2xl"
          >
            {{ section.name }}
          </dt-text>
          <dt-stack
            v-for="variant in section.variants"
            :key="variant.name"
            class="d-ba d-bc-subtle d-p16"
            gap="400"
          >
            <dt-text
              size="xs"
              tone="muted"
              kind="code"
            >
              {{ variant.name }}
            </dt-text>
            <div>
              <component :is="variant.errorBoundary">
                <component :is="variant.component" />
              </component>
            </div>
          </dt-stack>
        </dt-stack>
      </dt-stack>
    </template>
  </div>
</template>

<script setup>
import { ref, h, onErrorCaptured, onMounted, defineComponent, markRaw } from 'vue';
import { DtLink } from '@/components/link';
import { DtStack } from '@/components/stack';
import { DtText } from '@/components/text';
import { DtIconExternalLink } from '@dialpad/dialtone-icons/vue3';

const storyLoaders = import.meta.glob(
  ['../**/*.stories.js', '!../kitchen_sink/**'],
);

const sections = ref([]);
const loading = ref(true);

function scrollTo (id) {
  document.getElementById(`ks-${id}`)?.scrollIntoView({ behavior: 'smooth' });
}

function createErrorBoundary (name) {
  return markRaw(defineComponent({
    name: 'ErrorBoundary',
    setup (_, { slots }) {
      const error = ref(null);
      onErrorCaptured((err) => {
        error.value = err.message || String(err);
        return false;
      });
      return () => {
        if (error.value) {
          return h('div', {
            class: 'd-fc-critical d-fs-200 d-p8 d-px12 d-bgc-critical d-bar4',
          }, `Failed to render ${name}: ${error.value}`);
        }
        return slots.default?.();
      };
    },
  }));
}

function extractVariants (module, meta) {
  const variants = [];
  const name = meta.title.split('/').pop();

  for (const [exportName, exportValue] of Object.entries(module)) {
    if (exportName === 'default') continue;
    if (!exportValue?.render || typeof exportValue.render !== 'function') continue;

    const mergedArgs = { ...meta.args, ...exportValue.args };

    try {
      const componentOptions = exportValue.render(mergedArgs, {
        argTypes: meta.argTypes || {},
      });
      variants.push({
        name: exportName,
        component: markRaw(componentOptions),
        errorBoundary: createErrorBoundary(`${name} / ${exportName}`),
      });
    } catch (e) {
      console.error(`Kitchen Sink: Failed to initialize ${name}/${exportName}:`, e);
    }
  }

  return variants;
}

onMounted(async () => {
  const results = await Promise.allSettled(
    Object.entries(storyLoaders).map(async ([, loader]) => loader()),
  );

  const loaded = [];

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;

    const module = result.value;
    const meta = module.default;
    if (!meta?.title) continue;

    const name = meta.title.split('/').pop();
    const id = name.toLowerCase().replace(/[\s_]+/g, '-');
    const variants = extractVariants(module, meta);

    if (variants.length === 0) continue;

    loaded.push({ id, name, variants });
  }

  sections.value = loaded.sort((a, b) => a.name.localeCompare(b.name));
  loading.value = false;
});
</script>

<style scoped>
.kitchen-sink__nav {
  inset-block-start: 56px;
}

.kitchen-sink__section {
  scroll-margin-top: var(--dt-size-750);
}
[outline] {
  outline: 2px solid orangered;
}
</style>
