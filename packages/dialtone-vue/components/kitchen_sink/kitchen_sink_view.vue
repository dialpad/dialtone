<!-- eslint-disable vue/no-restricted-class, vue/no-bare-strings-in-template -->
<template>
  <div>
    <div
      v-if="loading"
      class="d-d-flex d-ai-center d-jc-center d-h164"
    >
      <dt-text
        tone="muted"
      >
        Loading {{ itemLabel }}...
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
        gap="400"
      >
        <dt-stack
          class="d-px8"
          gap="400"
          direction="row"
          justify="between"
          align="baseline"
        >
          <dt-text
            as="h1"
            kind="headline"
            size="3xl"
          >
            {{ title }}
          </dt-text>
          <dt-text
            kind="body"
            size="sm"
          >
            <dt-link
              :href="iframeUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <dt-stack
                gap="300"
                direction="row"
              >
                Open in new window
                <dt-icon-external-link size="200" />
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
          <dt-stack
            gap="400"
            direction="row"
            justify="between"
            align="baseline"
          >
            <dt-text
              as="h2"
              kind="headline"
              size="2xl"
            >
              {{ section.name }}
            </dt-text>
            <dt-link
              :href="`/?path=/story/${section.storyId}--default`"
            >
              View Story
            </dt-link>
          </dt-stack>
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

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  itemLabel: {
    type: String,
    required: true,
  },
  iframeUrl: {
    type: String,
    required: true,
  },
  loaders: {
    type: Object,
    required: true,
  },
});

const sections = ref([]);
const loading = ref(true);

function sanitizeId (str) {
  return str.toLowerCase().replace(/[\s/_]+/g, '-');
}

function scrollTo (id) {
  document.getElementById(`ks-${id}`)?.scrollIntoView({ behavior: 'smooth' });
}

function createErrorBoundary (name) {
  return markRaw(defineComponent({
    name: `ErrorBoundary-${name}`,
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

function extractVariants (module, meta, name) {
  const variants = [];

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
    Object.values(props.loaders).map(async (loader) => loader()),
  );

  const loaded = [];

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;

    const module = result.value;
    const meta = module.default;
    if (!meta?.title) continue;

    const name = meta.title.split('/').pop();
    const id = sanitizeId(name);
    const storyId = sanitizeId(meta.title);
    const variants = extractVariants(module, meta, name);

    if (variants.length === 0) continue;

    loaded.push({ id, name, storyId, variants });
  }

  sections.value = loaded.sort((a, b) => a.name.localeCompare(b.name));
  loading.value = false;
});
</script>

<style scoped>
.kitchen-sink__section {
  scroll-margin-block-start: var(--dt-layout-150);
}
</style>
