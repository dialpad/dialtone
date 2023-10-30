---
title: Datepicker
thumb: true
image: assets/images/components/datepicker.png
description: Datepicker component will provide a calendar to select a date.
status: beta
storybook: https://vue.dialpad.design/?path=/story/components-datepicker--default
figma: planned
---
<code-well-header>
  <dt-datepicker
    prev-month-label="Previous month"
    next-month-label="Next month"
    prev-year-label="Previous year"
    next-year-label="Next year"
  />
</code-well-header>

```html
<dt-datepicker
    prev-month-label="Previous month"
    next-month-label="Next month"
    prev-year-label="Previous year"
    next-year-label="Next year"
    :selected-date="new Date()"
  />
```

## Vue API

<component-vue-api component-name="datepicker" />
