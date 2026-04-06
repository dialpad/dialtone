---
title: Overflow
description: Utilities for controlling how an element handles content that is too large for the container.
keywords: ["scroll", "hidden", "auto", "clip", "scrollbar"]
---

<dt-notice kind="info" class="d-wmx100p d-my-200" hideClose>
  Consider using the custom scrollbar first with the <dt-link to="/components/scrollbar" kind="muted">Scrollbar Directive</dt-link>.
</dt-notice>

## Examples

```vue demo
<!-- @wrapper -->
  <div class="d-d-grid d-g-cols4 d-g-200">
      <div class="d-h-350 d-p-150 d-bar4 d-bgc-moderate d-of-auto">
          <code>.d-of-auto</code>
          <p class="d-w-350">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget.</p>
      </div>
      <div class="d-h-350 d-p-150 d-bar4 d-bgc-moderate d-of-x-auto">
          <code>.d-of-x-auto</code>
          <p class="d-w-350">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget.</p>
      </div>
      <div class="d-h-350 d-p-150 d-bar4 d-bgc-moderate d-of-y-auto">
          <code>.d-of-y-auto</code>
          <p class="d-w-350">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget.</p>
      </div>
      <div class="d-h-350 d-p-150 d-bar4 d-bgc-moderate d-of-hidden">
          <code>.d-of-hidden</code>
          <p class="d-w-350">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget.</p>
      </div>
      <div class="d-h-350 d-p-150 d-bar4 d-bgc-moderate d-of-x-hidden">
          <code>.d-of-x-hidden</code>
          <p class="d-w-350">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget.</p>
      </div>
      <div class="d-h-350 d-p-150 d-bar4 d-bgc-moderate d-of-y-hidden">
          <code>.d-of-y-hidden</code>
          <p class="d-w-350">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget.</p>
      </div>
      <div class="d-h-350 d-p-150 d-bar4 d-bgc-moderate d-of-scroll">
          <code>.d-of-scroll</code>
          <p class="d-w-350">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget.</p>
      </div>
      <div class="d-h-350 d-p-150 d-bar4 d-bgc-moderate d-of-x-scroll">
          <code>.d-of-x-scroll</code>
          <p class="d-w-350">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget.</p>
      </div>
      <div class="d-h-350 d-p-150 d-bar4 d-bgc-moderate d-of-y-scroll">
          <code>.d-of-y-scroll</code>
          <p class="d-w-350">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget.</p>
      </div>
      <div class="d-h-350 d-p-150 d-bar4 d-bgc-moderate d-of-visible">
          <code>.d-of-visible</code>
          <p class="d-w-350">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget.</p>
      </div>
      <div class="d-h-350 d-p-150 d-bar4 d-bgc-moderate d-of-x-visible">
          <code>.d-of-x-visible</code>
          <p class="d-w-350">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget.</p>
      </div>
      <div class="d-h-350 d-p-150 d-bar4 d-bgc-moderate d-of-y-visible">
          <code>.d-of-y-visible</code>
          <p class="d-w-350">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget.</p>
      </div>
      <div class="d-h-350 d-p-150 d-bar4 d-bgc-moderate d-of-unset">
          <code>.d-of-unset</code>
          <p class="d-w-350">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget.</p>
      </div>
  </div>
```

<script setup>
    import overflow from '@data/overflow.json';
    import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';
</script>

## Classes

The `overflow` CSS shorthand property sets the desired behavior for how content is handled when it exceeds the wrapper's bounds in both directions (x-axis and then y-axis).

<clamped-table-wrapper>
  <div>
    <table class="d-table dialtone-doc-table">
        <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-ibs-0">
            <tr>
                <th scope="col" class="d-p-0 d-bbw0 d-w20p"><div class="d-p-200 d-bb d-bbw1">Class</div></th>
                <th scope="col" class="d-p-0 d-bbw0 d-w20p"><div class="d-p-200 d-bb d-bbw1">Output</div></th>
                <th scope="col" class="d-p-0 d-bbw0"><div class="d-p-200 d-bb d-bbw1">Description</div></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="{ class: className, output, description } in overflow">
                <th scope="row" class="d-code--sm d-docsite-code">.d-of-{{ className }}</th>
                <td class="d-code--sm">{{ output }};</td>
                <td>{{ description }}</td>
            </tr>
        </tbody>
    </table>
  </div>
</clamped-table-wrapper>
