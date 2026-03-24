---
title: Datepicker
thumb: true
image: assets/images/components/datepicker.png
description: Datepicker component will provide a calendar to select a date.
status: beta
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-datepicker--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=13998-86
keywords: ["date picker", "calendar", "date selector", "d-datepicker", "DtDatepicker", "dt-datepicker", "date input", "schedule"]
---

<code-well-header>
  <dt-datepicker></dt-datepicker>
</code-well-header>

## Usage

We recommend to wrap the datepicker in a `dt-popover` component.

It is required to provide the component with proper labels for i18n and accessibility.

The component will return a [Date object](https://www.w3schools.com/js/js_dates.asp) object when a date is selected.

For the `withPopover` variant it is necessary to provide the `initial-focus-element="#prevYearButton"` prop
to the `dt-popover` component.

With this we accomplish the requirement to have the previous year button focused when the datepicker is opened.

## Variants and Examples

### Default

<code-well-header>
  <dt-datepicker></dt-datepicker>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-stack d-stack--gap-100 d-datepicker">
  <div class="d-datepicker__hd">
    <div class="d-stack d-stack--row d-stack--gap-50 d-datepicker__month-year">
      <nav class="d-stack d-stack--row d-stack--gap-25 d-datepicker__nav">
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
      <nav class="d-stack d-stack--row d-stack--gap-25 d-datepicker__nav">
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
<dt-datepicker :selected-date="new Date()"></dt-datepicker>
'
showHtmlWarning />

### With Popover

<code-well-header>
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
        <template #startIcon>
          <dt-icon
            name="calendar"
            size="300"
          />
        </template>
      </dt-button>
    </template>
    <template #content>
      <dt-datepicker></dt-datepicker>
    </template>
  </dt-popover>
</code-well-header>

<code-example-tabs
htmlCode='
<div data-qa="dt-popover-content" class="d-popover__content">
  <div class="d-stack d-stack--gap-100 d-datepicker">
    <div class="d-datepicker__hd">
      <div class="d-stack d-stack--row d-stack--gap-50 d-datepicker__month-year">
        <nav class="d-stack d-stack--row d-stack--gap-25 d-datepicker__nav">
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
        <nav class="d-stack d-stack--row d-stack--gap-25 d-datepicker__nav">
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
      <template #startIcon>
        <dt-icon
          name="calendar"
          size="300"
        />
      </template>
    </dt-button>
  </template>
  <template #content>
    <dt-datepicker></dt-datepicker>
  </template>
</dt-popover>
'
/>

### With min/max date

Constrain the selectable date range by providing `min-date` and/or `max-date` props. Days outside the range are disabled and navigation buttons are disabled when the target month is fully out of range.

<code-well-header>
  <dt-datepicker
    :selected-date="currentSelectedDate"
    :min-date="minDate"
    :max-date="maxDate"
    @selected-date="currentSelectedDate = $event;"
  />
</code-well-header>

<code-example-tabs
vueCode='
<script setup>
const today = new Date();
const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5);
const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15);
</script>

<dt-datepicker
  :selected-date="new Date()"
  :min-date="minDate"
  :max-date="maxDate"
/>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="datepicker"></component-vue-api>

## Date Formats

The following functions are available for date formatting.

<div class="d-bgc-secondary d-bar8 d-p16">
  <dt-stack
    :direction="{ 'default': 'column', 'md': 'row' }"
    gap="400"
    align="start"
  >
    <dt-stack align="center">
      <dt-datepicker
        :selected-date="currentSelectedDate"
        @selected-date="currentSelectedDate = $event;"
      />
      <dt-text as="p" kind="body" size="sm" tone="tertiary" align="center" wrap="balance">
        {{ currentSelectedDate }}
      </dt-text>
    </dt-stack>
    <table class="d-table d-bt d-fl1">
      <tr>
        <th class="d-pl0" scope="row"><dt-text as="code" kind="code" size="xs" class="d-bgc-transparent">formatLong</dt-text></th>
        <td><dt-text kind="body" size="xs">{{ formatLong(currentSelectedDate) }}</dt-text></td>
      </tr>
      <tr>
        <th class="d-pl0" scope="row"><dt-text as="code" kind="code" size="xs" class="d-bgc-transparent">formatMedium</dt-text></th>
        <td><dt-text kind="body" size="xs">{{ formatMedium(currentSelectedDate) }}</dt-text></td>
      </tr>
      <tr>
        <th class="d-pl0" scope="row"><dt-text as="code" kind="code" size="xs" class="d-bgc-transparent">formatShort</dt-text></th>
        <td><dt-text kind="body" size="xs">{{ formatShort(currentSelectedDate) }}</dt-text></td>
      </tr>
      <tr>
        <th class="d-pl0" scope="row"><dt-text as="code" kind="code" size="xs" class="d-bgc-transparent">formatShort (no weekday)</dt-text></th>
        <td><dt-text kind="body" size="xs">{{ formatShort(currentSelectedDate, false) }}</dt-text></td>
      </tr>
      <tr>
        <th class="d-pl0" scope="row"><dt-text as="code" kind="code" size="xs" class="d-bgc-transparent">formatNoYear</dt-text></th>
        <td><dt-text kind="body" size="xs">{{ formatNoYear(currentSelectedDate) }}</dt-text></td>
      </tr>
      <tr>
        <th class="d-pl0" scope="row"><dt-text as="code" kind="code" size="xs" class="d-bgc-transparent">formatNoYear (abbreviated)</dt-text></th>
        <td><dt-text kind="body" size="xs">{{ formatNoYear(currentSelectedDate, true) }}</dt-text></td>
      </tr>
      <tr>
        <th class="d-pl0" scope="row"><dt-text as="code" kind="code" size="xs" class="d-bgc-transparent">formatNumerical</dt-text></th>
        <td><dt-text kind="body" size="xs">{{ formatNumerical(currentSelectedDate) }}</dt-text></td>
      </tr>
    </table>
  </dt-stack>
</div>

<!-- TODO: Autogenerate the docs from JSDocs in packages/dialtone-vue/components/datepicker/formatUtils.js -->
### formatLong

**formatLong**(`date`, `locale`): `string`

Formats a date into a long format using the specified locale.

#### Parameters

| Name | Type | Description                                                   |
| :------ | :------ |:--------------------------------------------------------------|
| `date` | `Date` | The date to format                                            |
| `locale` | `string` | The locale to use for formatting. Defaults to Dialtone preferred locale. |

#### Returns

`string`

The formatted date string.

### formatMedium

**formatMedium**(`date`, `locale`): `string`

Formats the given date in medium format.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | `Date` | The date to format |
| `locale` | `string` | The locale to use for formatting. Defaults to Dialtone preferred locale. |

#### Returns

`string`

The formatted date string.

### formatShort

**formatShort**(`date`, `locale`, `showWeekday`= true): `string`

Formats a date into a short string representation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | `Date` | The date to format |
| `locale` | `string` | The locale to use for formatting. Defaults to Dialtone preferred locale. |
| `showWeekday` | `boolean` | Whether to include the weekday in the formatted string. Defaults to true. |

#### Returns

`string`

The formatted date string.

### formatNoYear

**formatNoYear**(`date`, `locale`, `abbreviated`= false): `string`

Formats a date without the year.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | `Date` | The date to format |
| `locale` | `string` | The locale to use for formatting. Defaults to Dialtone preferred locale. |
| `abbreviated` | `boolean` | Whether to use abbreviated month names. Defaults to false. |

#### Returns

`string`

The formatted date without the year.

### formatNumerical

**formatNumerical**(`date`, `locale`): `string`

Formats a date into a numerical string representation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | `Date` | The date to format |
| `locale` | `string` | The locale to use for formatting. Defaults to Dialtone preferred locale. |

#### Returns

`string`

The formatted numerical date string.

## Accessibility

Keyboard navigation with arrow and tab keys for datepicker component.

- It will switch between `month-year-picker` and `calendar` with `TAB`.
- It will move around all calendar days with `arrow-keys`.
- It will jump from `month-year-picker` to `calendar` with `DOWN` arrow key.
- It will jump to `month-year-picker` when there are no more days at the bottom or top of the calendar.
- It will change year or month with `ENTER` or `SPACE` (native event)
- It will select day with `ENTER` or `SPACE` (native event)
- It will start with focus on previous-year on mounted. Screen reader announcement:

  ```text
  In `month-year-picker`:

  - Change to previous year, 2022
  - Change to previous month, july
  - Change to next month, september
  - Change to next year, 2024

  In `calendar`:

  - Select day 20 July 2023
  ```

<script setup>
import { ref, inject } from 'vue';

const dialtoneUtils = inject('dialtoneUtils');
const { formatLong, formatMedium, formatShort, formatNoYear, formatNumerical } = dialtoneUtils;

const currentSelectedDate = ref(new Date());
const datepickerOpened = ref(false);

const today = new Date();
const minDate = ref(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5));
const maxDate = ref(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15));

const toggleDatepicker = () => {
  datepickerOpened.value = !datepickerOpened.value;
};

</script>
