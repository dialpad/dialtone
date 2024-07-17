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

## Usage

We recommend to wrap the datepicker in a `dt-popover` component.

It is required to provide the component with proper labels for i18n and accessibility.

The component will return a [Date object](https://www.w3schools.com/js/js_dates.asp) object when a date is selected.

For the `withPopover` variant it is necessary to provide the `initial-focus-element="#prevYearButton"` prop
to the `dt-popover` component.

With this we accomplish the requirement to have the previous year button focused when the datepicker is opened.

## Variants and examples

### Default

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

### With popover

<code-well-header>
  <dt-popover
    ref="example-popover"
    :open="datepickerOpened"
    initial-focus-element="#prevYearButton"
    padding="none"
    @opened="(open) => { datepickerOpened = open }"
    placement="bottom-start"
  >
    <template #anchor>
      <dt-button
        size="sm"
        circle
        importance="clear"
        aria-label="Open datepicker"
        @click="toggleDatepicker"
      >
        <template #icon>
          <dt-icon
            name="calendar"
            size="300"
          />
        </template>
      </dt-button>
    </template>
    <template #content>
      <dt-datepicker
        :locale="locale"
        :prev-month-label="prevMonthLabel"
        :next-month-label="nextMonthLabel"
        :prev-year-label="prevYearLabel"
        :next-year-label="nextYearLabel"
        :select-day-label="selectDayLabel"
        :change-to-label="changeToLabel"
      />
    </template>
  </dt-popover>
</code-well-header>

<code-example-tabs
htmlCode='
<div data-qa="dt-popover-content" class="d-popover__content">
  <div class="d-stack d-stack--gap-400 d-datepicker">
    <div class="d-datepicker__hd">
      <div class="d-stack d-stack--row d-stack--gap-300 d-datepicker__month-year">
        <nav class="d-stack d-stack--row d-stack--gap-200 d-datepicker__nav">
          <div>
            <span>
              <button
                class="base-button__button d-btn d-btn--muted d-btn--xs d-btn--circle d-datepicker__nav-btn"
                type="button"
                aria-label="Change to Previous year 2023"
              >
                <span class="d-btn__label base-button__label">
                  <svg>...</svg>
                </span>
              </button>
            </span>
          </div>
          <div>
            <span>
              <button
                class="base-button__button d-btn d-btn--muted d-btn--xs d-btn--circle d-datepicker__nav-btn"
                type="button"
                aria-label="Change to Previous month June"
              >
                <span class="d-btn__label base-button__label">
                  <svg>...</svg>
                </span>
              </button>
            </span>
          </div>
        </nav>
        <div class="d-datepicker__month-year-title">July 2024</div>
        <nav class="d-stack d-stack--row d-stack--gap-200 d-datepicker__nav">
          <div>
            <span>
              <button
                class="base-button__button d-btn d-btn--muted d-btn--xs d-btn--circle d-datepicker__nav-btn"
                type="button"
                aria-label="Change to Next month August"
              >
                <span class="d-btn__label base-button__label">
                  <svg>...</svg>
                </span>
              </button>
            </span>
          </div>
          <div>
            <span>
              <button
                class="base-button__button d-btn d-btn--muted d-btn--xs d-btn--circle d-datepicker__nav-btn"
                type="button"
                aria-label="Change to Next year 2025"
              >
                <span class="d-btn__label base-button__label">
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
            <th scope="col" class="d-datepicker__cell d-datepicker__cell--header">
              <span class="d-datepicker__weekday" title="Su" aria-label="Su">
                Su
              </span>
            </th>
            <th scope="col" class="d-datepicker__cell d-datepicker__cell--header">
              <span class="d-datepicker__weekday" title="Mo" aria-label="Mo">
                Mo
              </span>
            </th>
            <th scope="col" class="d-datepicker__cell d-datepicker__cell--header">
              <span class="d-datepicker__weekday" title="Tu" aria-label="Tu">
                Tu
              </span>
            </th>
            <th scope="col" class="d-datepicker__cell d-datepicker__cell--header">
              <span class="d-datepicker__weekday" title="We" aria-label="We">
                We
              </span>
            </th>
            <th scope="col" class="d-datepicker__cell d-datepicker__cell--header">
              <span class="d-datepicker__weekday" title="Th" aria-label="Th">
                Th
              </span>
            </th>
            <th scope="col" class="d-datepicker__cell d-datepicker__cell--header">
              <span class="d-datepicker__weekday" title="Fr" aria-label="Fr">
                Fr
              </span>
            </th>
            <th scope="col" class="d-datepicker__cell d-datepicker__cell--header">
              <span class="d-datepicker__weekday" title="Sa" aria-label="Sa">
                Sa
              </span>
            </th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</div>
'
vueCode='
<dt-popover
  :open="datepickerOpened"
  initial-focus-element="#prevYearButton"
  padding="none"
  @opened="(open) => { datepickerOpened = open }"
  placement="bottom-start"
>
  <template #anchor>
    <dt-button
      size="sm"
      circle
      importance="clear"
      aria-label="Open datepicker"
      @click="toggleDatepicker"
    >
      <template #icon>
        <dt-icon
          name="calendar"
          size="300"
        />
      </template>
    </dt-button>
  </template>
  <template #content>
    <dt-datepicker
      change-to-label="Change to"
      prev-month-label="Previous month"
      next-month-label="Next month"
      prev-year-label="Previous year"
      next-year-label="Next year"
      select-day-label="Select day"
    />
  </template>
</dt-popover>
'
/>

## Vue API

<component-vue-api component-name="datepicker" />

## Accessibility

Keyboard navigation with arrow and tab keys for datepicker component.

It will switch between `month-year-picker` and `calendar` with `TAB`.

It will move around all calendar days with `arrow-keys`.

It will jump from `month-year-picker` to `calendar` with `DOWN` arrow key.

It will jump to `month-year-picker` when there is no more days at the bottom or top of the calendar.

It will change year or month with `ENTER` or `SPACE` (native event)

It will select day with `ENTER` or `SPACE` (native event)

It will start with focus on previous-year on mounted

Screen reader will say

In `month-year-picker`:

- Change to previous year, 2022
- Change to previous month, july
- Change to next month, september
- Change to next year, 2024

In `calendar`:

- Select day 20 July 2023

## Date formats

We are providing the following functions to format dates:

<!-- TODO: Autogenerate this docs from jsdocs in packages/dialtone-vue2/components/datepicker/formatUtils.js -->
### formatLong

▸ **formatLong**(`date`, `locale` = 'default'): `string`

Formats a date into a long format using the specified locale.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | `Date` | The date to format |
| `locale` | `string` | The locale to use for formatting. Defaults to 'default'. |

#### Returns

`string`

The formatted date string.

___

### formatMedium

▸ **formatMedium**(`date`, `locale` = 'default'): `string`

Formats the given date in medium format.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | `Date` | The date to format |
| `locale` | `string` | The locale to use for formatting. Defaults to 'default'. |

#### Returns

`string`

The formatted date string.

___

### formatShort

▸ **formatShort**(`date`, `locale` = 'default', `showWeekday`= true): `string`

Formats a date into a short string representation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | `Date` | The date to format |
| `locale` | `string` | The locale to use for formatting. Defaults to 'default'. |
| `showWeekday` | `boolean` | Whether to include the weekday in the formatted string. Defaults to true. |

#### Returns

`string`

The formatted date string.

___

### formatNoYear

▸ **formatNoYear**(`date`, `locale` = 'default', `abbreviated`= false): `string`

Formats a date without the year.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | `Date` | The date to format |
| `locale` | `string` | The locale to use for formatting. Defaults to 'default'. |
| `abbreviated` | `boolean` | Whether to use abbreviated month names. Defaults to false. |

#### Returns

`string`

The formatted date without the year.

___

### formatNumerical

▸ **formatNumerical**(`date`, `locale` = 'default'): `string`

Formats a date into a numerical string representation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | `Date` | The date to format |
| `locale` | `string` | The locale to use for formatting. Defaults to 'default'. |

#### Returns

`string`

The formatted numerical date string.

### Examples

<div>
  <p>
    Selected date: {{ currentSelectedDate }}
  </p>
  <br>
  <br>
  <table class="d-table">
    <tr>
      <th>Format</th>
      <th>Result</th>
    </tr>
    <tr>
      <td>formatLong</td>
      <td>{{ formatLong(currentSelectedDate, locale) }}</td>
    </tr>
    <tr>
      <td>formatMedium</td>
      <td>{{ formatMedium(currentSelectedDate, locale) }}</td>
    </tr>
    <tr>
      <td>formatShort</td>
      <td>{{ formatShort(currentSelectedDate, locale) }}</td>
    </tr>
    <tr>
      <td>formatShort (no weekday)</td>
      <td>{{ formatShort(currentSelectedDate, locale, false) }}</td>
    </tr>
    <tr>
      <td>formatNoYear</td>
      <td>{{ formatNoYear(currentSelectedDate, locale) }}</td>
    </tr>
    <tr>
      <td>formatNoYear (abbreviated)</td>
      <td>{{ formatNoYear(currentSelectedDate, locale, true) }}</td>
    </tr>
    <tr>
      <td>formatNumerical</td>
      <td>{{ formatNumerical(currentSelectedDate, locale) }}</td>
    </tr>
  </table>
  <br>
  <br>
  <dt-datepicker
    :locale="locale"
    :prev-month-label="prevMonthLabel"
    :next-month-label="nextMonthLabel"
    :prev-year-label="prevYearLabel"
    :next-year-label="nextYearLabel"
    :select-day-label="selectDayLabel"
    :change-to-label="changeToLabel"
    :selected-date="currentSelectedDate"
    @selected-date="currentSelectedDate = $event;"
  />
</div>

<script setup>
import { formatLong, formatMedium, formatShort, formatNoYear, formatNumerical } from '@dialpad/dialtone-vue';
import { ref } from 'vue';
const locale = 'en-US';
const changeToLabel = 'Change to';
const prevMonthLabel = 'Previous month';
const nextMonthLabel = 'Next month';
const prevYearLabel = 'Previous year';
const nextYearLabel = 'Next year';
const selectDayLabel = 'Select day';

const currentSelectedDate = ref(new Date());
</script>
