---
title: List item
description: A list item is an element that can be used to represent individual items in a list.
status: planned
thumb: true
image: assets/images/components/list-item.png
storybook: https://vue.dialpad.design/?path=/story/components-list-item--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=10732%3A69390
---

<code-well-header class="d-d-block">
  <ul>
    <dt-list-item navigationType="tab">
      <template #left>
        <dt-icon name="check" />
      </template>
      <span />
      <template #subtitle>
        <span />{subtitle}
      </template>
      <template #bottom>
        {bottom}
      </template>
      <template #right>
        <dt-icon name="external-link" />
      </template>
    </dt-list-item>
  </ul>
</code-well-header>

## Vue API

<component-vue-api component-name="listitem" />
