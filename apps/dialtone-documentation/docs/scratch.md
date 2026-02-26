---
layout: Blank
---

<!-- Just an empty utilitarian page to explore some in a completely blank context -->

<script setup>
import { ref } from 'vue';
const borderless = ref(false);
</script>

<div class="d-p32">
  <dt-toggle v-model="borderless">
    Borderless
  </dt-toggle>
</div>

<dt-stack direction="row">
  <dt-stack gap="500" class="d-p32">
    <dt-text
      as="h3"
      kind="code"
      size="md"
      tone="muted"
      align="start"
    >
      default
    </dt-text>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary" size="xs">Button</dt-button>
      <dt-tab-group :borderless="borderless" size="xs">
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary" size="sm">Button</dt-button>
      <dt-tab-group :borderless="borderless" size="sm">
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary">Button</dt-button>
      <dt-tab-group :borderless="borderless">
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary" size="lg">Button</dt-button>
      <dt-tab-group :borderless="borderless" size="lg">
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary" size="xl">Button</dt-button>
      <dt-tab-group :borderless="borderless" size="xl">
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="500" class="d-p32">
    <dt-text
      as="h3"
      kind="code"
      size="md"
      tone="muted"
      align="start"
    >
      default+outlined
    </dt-text>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary" size="xs">Button</dt-button>
      <dt-tab-group :borderless="borderless" size="xs" outlined>
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary" size="sm">Button</dt-button>
      <dt-tab-group :borderless="borderless" size="sm" outlined>
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary">Button</dt-button>
      <dt-tab-group :borderless="borderless" outlined>
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary" size="lg">Button</dt-button>
      <dt-tab-group :borderless="borderless" size="lg" outlined>
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary" size="xl">Button</dt-button>
      <dt-tab-group :borderless="borderless" size="xl" outlined>
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="500" class="d-p32">
    <dt-text
      as="h3"
      kind="code"
      size="md"
      tone="muted"
      align="start"
    >
      muted
    </dt-text>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary" size="xs">Button</dt-button>
      <dt-tab-group :borderless="borderless" size="xs" kind="muted">
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary" size="sm">Button</dt-button>
      <dt-tab-group :borderless="borderless" size="sm" kind="muted">
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary">Button</dt-button>
      <dt-tab-group :borderless="borderless" kind="muted">
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary" size="lg">Button</dt-button>
      <dt-tab-group :borderless="borderless" size="lg" kind="muted">
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary" size="xl">Button</dt-button>
      <dt-tab-group :borderless="borderless" size="xl" kind="muted">
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="500" class="d-p32">
    <dt-text
      as="h3"
      kind="code"
      size="md"
      tone="muted"
      align="start"
    >
      muted+outlined
    </dt-text>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary" size="xs">Button</dt-button>
      <dt-tab-group :borderless="borderless" size="xs" kind="muted" outlined>
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary" size="sm">Button</dt-button>
      <dt-tab-group :borderless="borderless" size="sm" kind="muted" outlined>
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary">Button</dt-button>
      <dt-tab-group :borderless="borderless" kind="muted" outlined>
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary" size="lg">Button</dt-button>
      <dt-tab-group :borderless="borderless" size="lg" kind="muted" outlined>
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary" size="xl">Button</dt-button>
      <dt-tab-group :borderless="borderless" size="xl" kind="muted" outlined>
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            First
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            Second
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            Third
          </dt-tab>
          <dt-tab id="asdf" panel-id="asdf" disabled>
            Disabled
          </dt-tab>
        </template>
        <div>
          <dt-tab-panel id="2" tab-id="1" tabPanelClass="d-p8">
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3" tabPanelClass="d-p8">
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5" tabPanelClass="d-p8">
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
  </dt-stack>
</dt-stack>
