---
title: Datepicker
thumb: true
image: assets/images/components/datepicker.png
description: Datepicker component will provide a calendar to select a date.
status: beta
storybook: https://vue.dialpad.design/?path=/story/components-datepicker--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT8-Component-Library?type=design&node-id=13998-87&mode=design&t=k5q7YXo32w6HoOmK-11
---

<code-well-header>
  <dt-datepicker
    change-to-label="Change to"
    prev-month-label="Previous month"
    next-month-label="Next month"
    prev-year-label="Previous year"
    next-year-label="Next year"
    select-day-label="Select day"
  />
</code-well-header>

```html
<dt-datepicker
    change-to-label="Change to"
    prev-month-label="Previous month"
    next-month-label="Next month"
    prev-year-label="Previous year"
    next-year-label="Next year"
    select-day-label="Select day"
    :selected-date="new Date()"
  />
```

## Vue API

<component-vue-api component-name="datepicker" />
