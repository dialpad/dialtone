---
layout: Blank
---

<!-- Just an empty utilitarian page to explore some in a completely blank context -->

<script setup>
import { ref } from 'vue';
const borderless = ref(false);
const outlined = ref(false);
const muted = ref(false);
const showIcon = ref(false);
const size = ref('md');
const selectOnFocus = ref(false);
</script>

<dt-stack class="d-p32" gap="600">
  <dt-stack gap="500">
    <dt-text as="h1" kind="headline" size="xl">
      Tabs
    </dt-text>
    <dt-text as="p" kind="body" size="lg">
      Just straight up refactor to use DtButton instead of custom markup/style. Use mix of DtButton variants depending on `active`.
    </dt-text>
    <dt-stack gap="500" direction="row">
      <dt-checkbox v-model="borderless">
        Borderless
      </dt-checkbox>
      <dt-checkbox v-model="outlined">
        Outlined
      </dt-checkbox>
      <dt-checkbox v-model="muted">
        Muted
      </dt-checkbox>
      <dt-checkbox v-model="showIcon">
        Show Icon
      </dt-checkbox>
      <dt-checkbox v-model="selectOnFocus">
        Select on focus
      </dt-checkbox>
      <dt-select-menu
        :options="[
          { value: 'xs', label: 'xs' },
          { value: 'sm', label: 'sm' },
          { value: 'md', label: 'md (default)' },
          { value: 'lg', label: 'lg' },
          { value: 'xl', label: 'xl' },
        ]"
        :model-value="size"
        @change="size = $event"
      />
    </dt-stack>
  </dt-stack>
  <dt-stack gap="500">
    <dt-stack direction="row" align="start">
      <dt-button hidden kind="default" importance="primary">Button</dt-button>
      <dt-tab-group :borderless="borderless" :kind="muted ? 'muted' : 'default'" :outlined="outlined" :size="size" :activation-mode="selectOnFocus ? 'auto' : 'manual'">
        <template #tabs>
          <dt-tab id="1" panel-id="2" selected>
            <template v-if="showIcon" #icon="{ iconSize }">
              <dt-icon name="sun" :size="iconSize" />
            </template>
            Argentina
          </dt-tab>
          <dt-tab id="3" panel-id="4">
            <template v-if="showIcon" #icon="{ iconSize }">
              <dt-icon name="keypad" :size="iconSize" />
            </template>
            United States
          </dt-tab>
          <dt-tab id="5" panel-id="6">
            <template v-if="showIcon" #icon="{ iconSize }">
              <dt-icon name="moon" :size="iconSize" />
            </template>
            United Kingdom
          </dt-tab>
          <dt-tab id="7" panel-id="8">
            <template v-if="showIcon" #icon="{ iconSize }">
              <dt-icon name="mic" :size="iconSize" />
            </template>
            India
          </dt-tab>
          <dt-tab id="9" panel-id="10" disabled>
            <template v-if="showIcon" #icon="{ iconSize }">
              <dt-icon name="grid" :size="iconSize" />
            </template>
            Canada
          </dt-tab>
        </template>
        <div class="d-py8">
          <dt-tab-panel id="2" tab-id="1">
            <dt-stack gap="400">
              <dt-text as="p" kind="body" size="md">Argentina stretches from subtropical forests in the north to glacial landscapes in the south, encompassing the towering Andes mountains and the vast Pampas grasslands in between.</dt-text>
              <dt-text as="p" kind="body" size="md">Its cities blend European architectural influences with a vibrant local character, while rural traditions of horsemanship and cattle ranching continue to shape the national identity.</dt-text>
              <dt-text as="p" kind="body" size="md">The country is celebrated for its contributions to tango, wine production, and a culinary culture built around shared meals and regional flavors.</dt-text>
            </dt-stack>
          </dt-tab-panel>
          <dt-tab-panel id="4" tab-id="3">
            <dt-stack gap="400">
              <dt-text as="p" kind="body" size="md">The United States spans a broad continental range, from Atlantic coastlines and Appalachian ridges to Great Plains, Rocky Mountain summits, and Pacific shores beyond.</dt-text>
              <dt-text as="p" kind="body" size="md">Major metropolitan areas serve as centers for finance, technology, and the arts, while smaller communities maintain distinct regional customs, dialects, and culinary traditions.</dt-text>
              <dt-text as="p" kind="body" size="md">The nation's history of immigration has produced a diverse cultural fabric, with influences from virtually every corner of the globe woven into daily life.</dt-text>
            </dt-stack>
          </dt-tab-panel>
          <dt-tab-panel id="6" tab-id="5">
            <dt-stack gap="400">
              <dt-text as="p" kind="body" size="md">The United Kingdom comprises England, Scotland, Wales, and Northern Ireland, each with distinct landscapes ranging from chalk cliffs and moors to highland lochs and green valleys.</dt-text>
              <dt-text as="p" kind="body" size="md">Its cities layer centuries of history alongside modern architecture, with institutions in education, finance, and governance that have influenced systems around the world.</dt-text>
              <dt-text as="p" kind="body" size="md">A strong tradition in literature, theater, and music continues to thrive, supported by public institutions and a widespread culture of creative expression.</dt-text>
            </dt-stack>
          </dt-tab-panel>
          <dt-tab-panel id="8" tab-id="7">
            <dt-stack gap="400">
              <dt-text as="p" kind="body" size="md">India extends from the Himalayan ranges in the north through fertile river plains to tropical coastlines in the south, supporting an extraordinary range of ecosystems and climates.</dt-text>
              <dt-text as="p" kind="body" size="md">Hundreds of languages and traditions coexist across its states and territories, producing one of the most culturally varied societies on earth with deep historical roots.</dt-text>
              <dt-text as="p" kind="body" size="md">A growing technology sector and expanding urban centers complement longstanding agricultural and artisan economies that continue to sustain millions of people.</dt-text>
            </dt-stack>
          </dt-tab-panel>
          <dt-tab-panel id="10" tab-id="9">
            <dt-stack gap="400">
              <dt-text as="p" kind="body" size="md">Canada stretches from the Atlantic to the Pacific and northward into the Arctic, encompassing boreal forests, prairies, mountain ranges, and thousands of lakes and waterways.</dt-text>
              <dt-text as="p" kind="body" size="md">Its cities are known for cultural diversity and livability, while vast rural and wilderness areas support forestry, mining, and agriculture across multiple climate zones.</dt-text>
              <dt-text as="p" kind="body" size="md">Official bilingualism in English and French reflects a history shaped by Indigenous peoples, European settlement, and ongoing immigration from around the world.</dt-text>
            </dt-stack>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
  </dt-stack>
</dt-stack>
