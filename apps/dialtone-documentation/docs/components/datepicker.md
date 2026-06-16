---
title: Datepicker
thumb: true
description: Datepicker component will provide a calendar to select a date.
status: ready
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-datepicker--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=13998-86
keywords: ["date picker", "calendar", "date selector", "d-datepicker", "DtDatepicker", "dt-datepicker", "date input", "schedule"]
combinator: DtDatepicker
---

## Usage

We recommend to wrap the datepicker in a `dt-popover` component.

It is required to provide the component with proper labels for i18n and accessibility.

The component will return a [Date object](https://www.w3schools.com/js/js_dates.asp) object when a date is selected.

For the `withPopover` variant it is necessary to provide the `initial-focus-element="#prevYearButton"` prop
to the `dt-popover` component.

With this we accomplish the requirement to have the previous year button focused when the datepicker is opened.

## Variants and Examples

### Default

```vue demo
<dt-datepicker></dt-datepicker>
```

### With Popover

```vue demo
<dt-popover
  :open="datepickerOpened"
  initial-focus-element="#prevYearButton"
  padding="none"
  @opened="(open) => { datepickerOpened = open }"
  placement="bottom-start"
>
  <template #anchor>
    <dt-button
      :size="200"
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
```

### With min/max date

Constrain the selectable date range by providing `min-date` and/or `max-date` props. Days outside the range are disabled and navigation buttons are disabled when the target month is fully out of range.

```vue demo
<dt-datepicker
  :selected-date="currentSelectedDate"
  :min-date="minDate"
  :max-date="maxDate"
  @selected-date="currentSelectedDate = $event;"
/>
<!-- @code -->
<script>
const today = new Date();
const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5);
const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15);
</script>
<dt-datepicker
  :selected-date="new Date()"
  :min-date="minDate"
  :max-date="maxDate"
/>
```

## Date Formats

The following functions are available for date formatting.

<div class="d-bgc-secondary d-bar-400 d-p-200">
  <dt-stack
    :direction="{ 'default': 'column', 'md': 'row' }"
    gap="600"
    align="start"
  >
    <dt-stack align="center">
      <dt-datepicker
        :selected-date="currentSelectedDate"
        @selected-date="currentSelectedDate = $event;"
      />
      <dt-text as="p" kind="body" :size="200" tone="tertiary" align="center" wrap="balance">
        {{ currentSelectedDate }}
      </dt-text>
    </dt-stack>
    <table class="d-table d-bt d-fl1">
      <tbody>
        <tr>
          <th class="d-pis-0" scope="row"><dt-text as="code" kind="code" :size="100" class="d-bgc-transparent">formatLong</dt-text></th>
          <td><dt-text kind="body" :size="100">{{ formatLong(currentSelectedDate) }}</dt-text></td>
        </tr>
        <tr>
          <th class="d-pis-0" scope="row"><dt-text as="code" kind="code" :size="100" class="d-bgc-transparent">formatMedium</dt-text></th>
          <td><dt-text kind="body" :size="100">{{ formatMedium(currentSelectedDate) }}</dt-text></td>
        </tr>
        <tr>
          <th class="d-pis-0" scope="row"><dt-text as="code" kind="code" :size="100" class="d-bgc-transparent">formatShort</dt-text></th>
          <td><dt-text kind="body" :size="100">{{ formatShort(currentSelectedDate) }}</dt-text></td>
        </tr>
        <tr>
          <th class="d-pis-0" scope="row"><dt-text as="code" kind="code" :size="100" class="d-bgc-transparent">formatShort (no weekday)</dt-text></th>
          <td><dt-text kind="body" :size="100">{{ formatShort(currentSelectedDate, false) }}</dt-text></td>
        </tr>
        <tr>
          <th class="d-pis-0" scope="row"><dt-text as="code" kind="code" :size="100" class="d-bgc-transparent">formatNoYear</dt-text></th>
          <td><dt-text kind="body" :size="100">{{ formatNoYear(currentSelectedDate) }}</dt-text></td>
        </tr>
        <tr>
          <th class="d-pis-0" scope="row"><dt-text as="code" kind="code" :size="100" class="d-bgc-transparent">formatNoYear (abbreviated)</dt-text></th>
          <td><dt-text kind="body" :size="100">{{ formatNoYear(currentSelectedDate, true) }}</dt-text></td>
        </tr>
        <tr>
          <th class="d-pis-0" scope="row"><dt-text as="code" kind="code" :size="100" class="d-bgc-transparent">formatNumerical</dt-text></th>
          <td><dt-text kind="body" :size="100">{{ formatNumerical(currentSelectedDate) }}</dt-text></td>
        </tr>
      </tbody>
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

## Vue API

<component-vue-api component-name="datepicker"></component-vue-api>
