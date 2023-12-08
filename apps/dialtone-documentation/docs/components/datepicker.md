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
  <div class="d-bgc-red-300 d-p32 d-fw-bold d-fs-400 d-fc-primary-inverted">
    <div class="d-fs-500 d-fc-gold-200">⚠️⚠️⚠️⚠️⚠️ TODO ⚠️⚠️⚠️⚠️</div>
    <div class="d-fs-300">in the service of <a href="https://dialpad.atlassian.net/browse/DLT-1379" target="_parent">DLT-1379</a> and <a href="https://dialpad.atlassian.net/browse/DLT-1392" target="_parent">DLT-1392</a></div>
    <hr>
    <div class="d-lh-300">Update the Vue component to use this HTML structure.</div>
    <div class="d-fs-300">In addition to cleaner semantics, it has several a11y-oriented updates</div>
    <div class="d-fs-300">Ask Francis if any questions.</div>
  </div>

  <div class="d-fs-300 d-fw-bold d-fc-critical">Update <code class="d-fc-critical">datepicker.vue</code>, <code class="d-fc-critical">month-year-picker.vue</code>, and <code class="d-fc-critical">calendar.vue</code>...</div>
  <dt-datepicker
    prev-month-label="Previous month"
    next-month-label="Next month"
    prev-year-label="Previous year"
    next-year-label="Next year"
  />
  <div class="d-fs-300 d-fw-bold d-fc-critical">..with the below...</div>
  <dt-stack class="d-datepicker" gap="400">
    <div class="d-datepicker__hd">
      <dt-stack direction="row" class="d-datepicker__header" gap="300">
        <dt-stack as="nav" direction="row" gap="200" class="d-datepicker__nav">
          <dt-tooltip message="Previous year" placement="top">
            <template #anchor>
              <dt-button size="xs" importance="clear" class="d-btn--icon-only d-btn--muted d-bar-circle d-datepicker__nav-btn" aria-label="Go to previous year, September 2022">
                <dt-icon name="chevrons-left" size="300" />
              </dt-button>
            </template>
          </dt-tooltip>
          <dt-tooltip message="Previous month" placement="top">
            <template #anchor>
              <dt-button size="xs" importance="clear" class="d-btn--icon-only d-btn--muted d-bar-circle d-datepicker__nav-btn" aria-label="Go to previous month, August">
                <dt-icon name="chevron-left" size="300" />
              </dt-button>
            </template>
          </dt-tooltip>
        </dt-stack>
        <div class="d-headline-eyebrow d-datepicker__header-title" id="calendar-heading">September 2023</div>
        <dt-stack as="nav" direction="row" gap="200" class="d-datepicker__nav">
          <dt-tooltip message="Next month" placement="top">
            <template #anchor>
              <dt-button size="xs" importance="clear" class="d-btn--icon-only d-btn--muted d-bar-circle d-datepicker__nav-btn" aria-label="Go to next month, October">
                <dt-icon name="chevron-right" size="300" />
              </dt-button>
            </template>
          </dt-tooltip>
          <dt-tooltip message="Next year" placement="top">
            <template #anchor>
              <dt-button size="xs" importance="clear" class="d-btn--icon-only d-btn--muted d-bar-circle d-datepicker__nav-btn" aria-label="Go to previous year, September 2024">
                <dt-icon name="chevrons-right" size="300" />
              </dt-button>
            </template>
          </dt-tooltip>
        </dt-stack>
      </dt-stack>
    </div>
    <div class="d-datepicker__bd">
      <table class="d-datepicker__calendar" aria-labelledby="calendar-heading">
        <thead>
          <tr>
            <th scope="col" class="d-datepicker__cell d-datepicker__cell--header"><span class="d-datepicker__weekday" title="Sunday" aria-label="Sunday">SU</span></th>
            <th scope="col" class="d-datepicker__cell d-datepicker__cell--header"><span class="d-datepicker__weekday" title="Monday" aria-label="Monday">MO</span></th>
            <th scope="col" class="d-datepicker__cell d-datepicker__cell--header"><span class="d-datepicker__weekday" title="Tuesday" aria-label="Tuesday">TU</span></th>
            <th scope="col" class="d-datepicker__cell d-datepicker__cell--header"><span class="d-datepicker__weekday" title="Wednesday" aria-label="Wednesday">WE</span></th>
            <th scope="col" class="d-datepicker__cell d-datepicker__cell--header"><span class="d-datepicker__weekday" title="Thursday" aria-label="Thursday">TH</span></th>
            <th scope="col" class="d-datepicker__cell d-datepicker__cell--header"><span class="d-datepicker__weekday" title="Friday" aria-label="Friday">FR</span></th>
            <th scope="col" class="d-datepicker__cell d-datepicker__cell--header"><span class="d-datepicker__weekday" title="Saturday" aria-label="Saturday">SA</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day d-datepicker__day--disabled" :circle="true" size="sm" importance="clear" disabled aria-label="Sunday, August 31, 2023">31</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Monday, September 1, 2023">1</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Tuesday, September 2, 2023">2</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Wednesday, September 3, 2023">3</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day d-datepicker__day--selected" :circle="true" size="sm" importance="clear" aria-selected="true" aria-label="Select Thursday, September 4, 2023">4</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Friday, September 5, 2023">5</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Saturday, September 6, 2023">6</dt-button></td>
          </tr>
          <tr>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Sunday, September 7, 2023">7</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Monday, September 8, 2023">8</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Tuesday, September 9, 2023">9</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Wednesday, September 10, 2023">10</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Thursday, September 11, 2023">11</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Friday, September 12, 2023">12</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Saturday, September 13, 2023">13</dt-button></td>
          </tr>
          <tr>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Sunday, September 14, 2023">14</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Monday, September 15, 2023">15</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Tuesday, September 16, 2023">16</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Wednesday, September 17, 2023">17</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Thursday, September 18, 2023">18</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Friday, September 19, 2023">19</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Saturday, September 20, 2023">20</dt-button></td>
          </tr>
          <tr>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Sunday, September 21, 2023">21</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Monday, September 22, 2023">22</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Tuesday, September 23, 2023">23</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Wednesday, September 24, 2023">24</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Thursday, September 25, 2023">25</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Friday, September 26, 2023">26</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Saturday, September 27, 2023">27</dt-button></td>
          </tr>
          <tr>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Sunday, September 28, 2023">28</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Monday, September 29, 2023">29</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day" :circle="true" size="sm" importance="clear" aria-selected="false" aria-label="Select Tuesday, September 30, 2023">30</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day d-datepicker__day--disabled" :circle="true" size="sm" importance="clear" disabled aria-label="Wednesday, October 1, 2023">1</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day d-datepicker__day--disabled" :circle="true" size="sm" importance="clear" disabled aria-label="Thursday, October 2, 2023">2</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day d-datepicker__day--disabled" :circle="true" size="sm" importance="clear" disabled aria-label="Friday, October 3, 2023">3</dt-button></td>
            <td class="d-datepicker__cell"><dt-button class="d-datepicker__day d-datepicker__day--disabled" :circle="true" size="sm" importance="clear" disabled aria-label="Saturday, October 4, 2023">4</dt-button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </dt-stack>
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
