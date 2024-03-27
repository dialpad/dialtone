---
title: Datepicker
thumb: true
image: assets/images/components/datepicker.png
description: Datepicker component will provide a calendar to select a date.
status: beta
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-datepicker--default
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

<code-example-tabs
htmlCode='
<div class="d-stack d-stack--gap-400 d-datepicker">
  <div class="d-datepicker__hd">
    <div class="d-stack d-stack--row d-stack--gap-300 d-datepicker__month-year">
      <nav class="d-stack d-stack--row d-stack--gap-200 d-datepicker__nav">
        <div data-qa="dt-tooltip-container">
          <span data-qa="dt-tooltip-anchor">
            <button class="base-button__button d-btn d-btn--muted d-btn--xs d-btn--circle d-datepicker__nav-btn" data-qa="dt-button" type="button" aria-label="Change to Previous year 2023" id="prevYearButton">
              <span data-qa="dt-button-label" class="d-btn__label base-button__label">
                <svg>...</svg>
              </span>
            </button>
          </span>
        </div>
        <div data-qa="dt-tooltip-container">
          <span data-qa="dt-tooltip-anchor">
            <button class="base-button__button d-btn d-btn--muted d-btn--xs d-btn--circle d-datepicker__nav-btn" data-qa="dt-button" type="button" aria-label="Change to Previous month February" id="prevMonthButton">
              <span data-qa="dt-button-label" class="d-btn__label base-button__label">
                <svg>...</svg>
              </span>
            </button>
          </span>
        </div>
      </nav>
      <div id="calendar-heading" class="d-datepicker__month-year-title">March 2024</div>
      <nav class="d-stack d-stack--row d-stack--gap-200 d-datepicker__nav">
        <div data-qa="dt-tooltip-container">
          <span data-qa="dt-tooltip-anchor">
            <button class="base-button__button d-btn d-btn--muted d-btn--xs d-btn--circle d-datepicker__nav-btn" data-qa="dt-button" type="button" aria-label="Change to Next month April" id="nextMonthButton">
              <span data-qa="dt-button-label" class="d-btn__label base-button__label">
                <svg>...</svg>
              </span>
            </button>
          </span>
        </div>
        <div data-qa="dt-tooltip-container">
          <span data-qa="dt-tooltip-anchor">
            <button class="base-button__button d-btn d-btn--muted d-btn--xs d-btn--circle d-datepicker__nav-btn" data-qa="dt-button" type="button" aria-label="Change to Next year 2025" id="nextYearButton">
              <span data-qa="dt-button-label" class="d-btn__label base-button__label">
                <svg>...</svg>
              </span>
            </button>
          </span>
        </div>
      </nav>
    </div>
  </div>
  <div class="d-datepicker__bd">
    <table class="d-datepicker__calendar" aria-labelledby="calendar-heading">
      <thead>
        <tr>
          <th scope="col" class="d-datepicker__cell d-datepicker__cell--header"><span class="d-datepicker__weekday" title="Su" aria-label="Su">Su</span></th>
          <th scope="col" class="d-datepicker__cell d-datepicker__cell--header"><span class="d-datepicker__weekday" title="Mo" aria-label="Mo">Mo</span></th>
          ...
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="d-datepicker__cell" role="listbox">
            <button class="base-button__button d-btn d-btn--sm d-btn--circle d-datepicker__day d-datepicker__day--disabled" data-qa="dt-button" type="button" disabled="" aria-label="Select day 25 February 2024" aria-selected="false" role="option">
              <span data-qa="dt-button-label" class="d-btn__label base-button__label">25</span>
            </button>
          </td>
          <td class="d-datepicker__cell" role="listbox">
            <button class="base-button__button d-btn d-btn--sm d-btn--circle d-datepicker__day d-datepicker__day--disabled" data-qa="dt-button" type="button" disabled="" aria-label="Select day 26 February 2024" aria-selected="false" role="option">
              <span data-qa="dt-button-label" class="d-btn__label base-button__label">26</span>
            </button>
          </td>
          <td class="d-datepicker__cell" role="listbox">
            <button class="base-button__button d-btn d-btn--sm d-btn--circle d-datepicker__day d-datepicker__day--disabled" data-qa="dt-button" type="button" disabled="" aria-label="Select day 27 February 2024" aria-selected="false" role="option">
              <span data-qa="dt-button-label" class="d-btn__label base-button__label">27</span>
            </button>
          </td>
          <td class="d-datepicker__cell" role="listbox">
            <button class="base-button__button d-btn d-btn--sm d-btn--circle d-datepicker__day d-datepicker__day--disabled" data-qa="dt-button" type="button" disabled="" aria-label="Select day 28 February 2024" aria-selected="false" role="option">
              <span data-qa="dt-button-label" class="d-btn__label base-button__label">28</span>
            </button>
          </td>
          <td class="d-datepicker__cell" role="listbox">
            <button class="base-button__button d-btn d-btn--sm d-btn--circle d-datepicker__day d-datepicker__day--disabled" data-qa="dt-button" type="button" disabled="" aria-label="Select day 29 February 2024" aria-selected="false" role="option">
              <span data-qa="dt-button-label" class="d-btn__label base-button__label">29</span>
            </button>
          </td>
          <td class="d-datepicker__cell" role="listbox">
            <button class="base-button__button d-btn d-btn--sm d-btn--circle d-datepicker__day" data-qa="dt-button" type="button" aria-label="Select day 1 March 2024" aria-selected="false" role="option">
              <span data-qa="dt-button-label" class="d-btn__label base-button__label">1</span>
            </button>
          </td>
          <td class="d-datepicker__cell" role="listbox">
            <button class="base-button__button d-btn d-btn--sm d-btn--circle d-datepicker__day" data-qa="dt-button" type="button" aria-label="Select day 2 March 2024" aria-selected="false" role="option">
              <span data-qa="dt-button-label" class="d-btn__label base-button__label">2</span>
            </button>
          </td>
        </tr>
        <tr>
          <td class="d-datepicker__cell" role="listbox">
            <button class="base-button__button d-btn d-btn--sm d-btn--circle d-datepicker__day" data-qa="dt-button" type="button" aria-label="Select day 3 March 2024" aria-selected="false" role="option">
              <span data-qa="dt-button-label" class="d-btn__label base-button__label">3</span>
            </button>
          </td>
          <td class="d-datepicker__cell" role="listbox">
            <button class="base-button__button d-btn d-btn--sm d-btn--circle d-datepicker__day" data-qa="dt-button" type="button" aria-label="Select day 4 March 2024" aria-selected="false" role="option">
              <span data-qa="dt-button-label" class="d-btn__label base-button__label">4</span>
            </button>
          </td>
          <td class="d-datepicker__cell" role="listbox">
            <button class="base-button__button d-btn d-btn--sm d-btn--circle d-datepicker__day" data-qa="dt-button" type="button" aria-label="Select day 5 March 2024" aria-selected="false" role="option">
              <span data-qa="dt-button-label" class="d-btn__label base-button__label">5</span>
            </button>
          </td>
          ...
        </tr>
        <tr>
          ...
        </tr>
        ...
      </tbody>
    </table>
  </div>
</div>
'
vueCode='
<dt-datepicker
  change-to-label="Change to"
  prev-month-label="Previous month"
  next-month-label="Next month"
  prev-year-label="Previous year"
  next-year-label="Next year"
  select-day-label="Select day"
  :selected-date="new Date()"
/>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="datepicker" />
