---
title: Illustrations
storybook: https://dialtone.dialpad.com/vue/index.html?path=/story/components-illustration--default
figma_url: https://www.figma.com/design/dzGQjTcbUfviiqGvwsD9VV/DT9-Spot-Illustrations?node-id=1181-1068
download_url: https://drive.google.com/drive/folders/16nm2aD9cB7gjtmQ7QLDNjvtQto9yqAkY?usp=drive_link
thumb: true
keywords: ["artwork", "graphics", "images"]
---

<dt-stack gap="600" class="d-mbs-600">
  <div class="d-d-grid d-g-600 d-g-cols1 md:d-g-cols3 d-ai-center">
    <div>
      <p class="d-docsite--paragraph">Illustrations pair with inline text in <dt-link to="/components/empty-state">empty states</dt-link>, onboarding, and announcements. Spot illustrations also support marketing value propositions and features.</p>
    </div>
    <div class="d-gc2">
      <figure>
        <img class="d-d-block d-w100p d-bar-500" src="/assets/images/illustrations--billboard.png" alt="">
      </figure>
    </div>
  </div>
</dt-stack>

<icons illustration kind="spot" size="large" :excluded-icons="excludedIllustrations"></icons>

<script setup>
// Temporarily exclude illustrations from being shown on the docsite
const excludedIllustrations = [
  'mind',
  'blank-space',
  'vector-vortex',
  'atomic-pathway',
  'black-hole',
  'orbital-harmony',
];
</script>
