<template>
  <section>
    <slot name="content-top" />
    <header>
      <dt-stack
        :direction="{ default: 'column', md: 'row' }"
        :gap="{ default: '200', lg: '500' }"
        justify="between"
      >
        <dt-stack direction="row" gap="400">
          <h1
            v-if="$frontmatter.title"
            class="dialtone-page-title"
            v-text="$frontmatter.title"
          />
          <dt-badge
            v-if="$frontmatter.new"
            type="bulletin"
            text="New"
          />
        </dt-stack>
        <dt-stack direction="row" gap="200">
          <dt-button
            v-if="$frontmatter.figma_url"
            :href="$frontmatter.figma_url"
            target="_blank"
            rel="noopener noreferrer"
            kind="muted"
            importance="clear"
          >
            <template #icon>
              <dt-icon-figma size="200" />
            </template>
            Figma
          </dt-button>
          <dt-button
            v-if="$frontmatter.storybook && $frontmatter.storybook !== 'planned'"
            :href="$frontmatter.storybook"
            target="_blank"
            rel="noopener noreferrer"
            kind="muted"
            importance="clear"
          >
            <template #icon>
              <dt-icon-storybook-color size="200" />
            </template>
            Storybook
          </dt-button>
          <dt-button
            v-if="githubUrl || $frontmatter.github_url"
            :href="$frontmatter.github_url || githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            kind="muted"
            importance="clear"
          >
            <template #icon>
              <dt-icon-github size="200" />
            </template>
            GitHub
          </dt-button>
          <span class="d-pl8">
            <dt-split-button
              size="sm"
              importance="outlined"
              kind="muted"
              end-tooltip-text="More options"
              start-aria-label="Copy Markdown"
              @start-clicked="onCopyAsMarkdown()"
            >
              <template #startIcon>
                <dt-icon
                  :name="showCopiedIcon ? 'check' : 'copy'"
                  size="200"
                  :class="{ 'd-fc-success': showCopiedIcon }"
                />
              </template>
              Copy MD
              <template #dropdownList="{ close }">
                <dt-list-item-group>
                  <dt-list-item
                    role="menuitem"
                    navigation-type="arrow-keys"
                    @click="onCopyMarkdownLink(close)"
                  >
                    Copy Markdown link
                  </dt-list-item>
                  <dt-list-item
                    role="menuitem"
                    navigation-type="arrow-keys"
                    @click="onDownloadAll(close)"
                  >
                    Download full docs
                  </dt-list-item>
                </dt-list-item-group>
                <dt-dropdown-separator />
                <dt-list-item-group>
                  <dt-list-item
                    v-if="rawMarkdownUrl"
                    role="menuitem"
                    navigation-type="arrow-keys"
                    @click="onViewAsMarkdown(close)"
                  >
                    Open as Markdown
                  </dt-list-item>
                  <dt-list-item
                    v-if="rawMarkdownUrl"
                    role="menuitem"
                    navigation-type="arrow-keys"
                    @click="openInAiChat(close, 'claude')"
                  >
                    Open in Claude.ai
                  </dt-list-item>
                  <dt-list-item
                    v-if="rawMarkdownUrl"
                    role="menuitem"
                    navigation-type="arrow-keys"
                    @click="openInAiChat(close, 'chatgpt')"
                  >
                    Open in ChatGPT
                  </dt-list-item>
                </dt-list-item-group>
              </template>
            </dt-split-button>
          </span>
        </dt-stack>
      </dt-stack>
      <dt-text
        v-if="$frontmatter.description"
        as="p"
        kind="body"
        tone="tertiary"
        wrap="pretty"
        class="d-mb16 d-fs-300"
      >
        {{ $frontmatter.description }}
      </dt-text>
    </header>
    <slot name="content-bottom" />
  </section>
</template>

<script setup>
import { DtIconStorybookColor, DtIconFigma, DtIconGithub } from '@dialpad/dialtone-icons/vue3';
import { computed, ref } from 'vue';
import { usePageData, withBase } from 'vuepress/client';

const page = usePageData();

const showCopiedIcon = ref(false);
let copiedTimeout;

function showCopiedFeedback () {
  showCopiedIcon.value = true;
  clearTimeout(copiedTimeout);
  copiedTimeout = setTimeout(() => { showCopiedIcon.value = false; }, 2000);
}

async function onCopyMarkdownLink (close) {
  close?.();
  try {
    const url = rawMarkdownUrl.value
      ? window.location.origin + rawMarkdownUrl.value
      : window.location.href;
    await navigator.clipboard.writeText(url);
    showCopiedFeedback();
  } catch (e) {
    console.error('Failed to copy markdown link:', e);
  }
}

function onDownloadAll (close) {
  close?.();
  const url = withBase('/llms-full.txt');
  const date = new Date().toISOString().slice(0, 10);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `dialtone-complete-documentation--${date}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function onCopyAsMarkdown (close) {
  close?.();
  try {
    const res = await fetch(rawMarkdownUrl.value);
    if (!res.ok) {
      console.error(`Failed to fetch markdown: ${res.status} ${res.statusText}`);
      return;
    }
    const text = await res.text();
    await navigator.clipboard.writeText(text);
    showCopiedFeedback();
  } catch (e) {
    console.error('Failed to copy markdown:', e);
  }
}

const SLUG_OVERRIDES = { tabs: 'tab' };
const EXCLUDED_SLUGS = new Set(['scrollbar', 'table']);
const GITHUB_BASE = 'https://github.com/dialpad/dialtone/tree/staging/packages/dialtone-vue/components';

const RAW_SECTIONS = ['/components/', '/foundations/', '/dialtone/', '/ui-kits/', '/utilities/', '/guides/', '/tokens/'];

const rawMarkdownUrl = computed(() => {
  const path = page.value.path;
  if (!RAW_SECTIONS.some(s => path.startsWith(s))) return null;
  if (RAW_SECTIONS.includes(path)) return withBase(`/md${path}index.md`);
  const clean = path.replace(/(?:\/(?:index\.html)?|\.html)$/, '');
  if (!clean) return null;
  return withBase(`/md${clean}.md`);
});

const AI_CHAT_URLS = {
  claude: 'https://claude.ai/new',
  chatgpt: 'https://chatgpt.com/',
};

function openInAiChat (close, service) {
  close?.();
  const rawUrl = window.location.origin + rawMarkdownUrl.value;
  const prompt = `Read ${rawUrl} so I can ask questions about it.`;
  const base = AI_CHAT_URLS[service];
  const url = `${base}?q=${encodeURIComponent(prompt)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function onViewAsMarkdown (close) {
  close?.();
  if (rawMarkdownUrl.value) {
    window.open(rawMarkdownUrl.value, '_blank', 'noopener,noreferrer');
  }
}

const githubUrl = computed(() => {
  const match = page.value.path.match(/^\/components\/([^/.]+)/);
  if (!match) return null;
  const slug = match[1];
  if (EXCLUDED_SLUGS.has(slug)) return null;
  const dir = SLUG_OVERRIDES[slug] ?? slug.replace(/-/g, '_');
  return `${GITHUB_BASE}/${dir}/`;
});
</script>

<!-- TODO: validate that `storybook` and `figma` are URLS -->
