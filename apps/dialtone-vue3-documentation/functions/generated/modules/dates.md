# Module: dates

## Functions

### durationInHHMM

▸ **durationInHHMM**(`durationInSeconds`): `string`

Converts a call duration in total number of seconds to a human readable string
such as 'less than a minute' or '4 hours 34 minutes'.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `durationInSeconds` | `number` | The duration of the call in seconds |

#### Returns

`string`

A human readable string representing the duration of the call

#### Defined in

[packages/dialtone-vue3/common/dates.js:74](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/dates.js#L74)

___

### getDateMedium

▸ **getDateMedium**(`date`): `string`

This formats a date to the Dialtone standard medium date format as shown here:
https://dialpad.design/guides/writing-guidelines/#formats-by-length

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | `Date` | A javascript date object |

#### Returns

`string`

A string in the format of 'September 2, 2022'

#### Defined in

[packages/dialtone-vue3/common/dates.js:64](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/dates.js#L64)

___

### relativeDate

▸ **relativeDate**(`date`): `string`

Returns the distance between the passed in date and now in a human readable format, typically used
when showing a history of items in a log such as a feed list.

datefns does not support 'today' and 'yesterday' without showing time so we use Intl for these cases.

examples below to explain
the different potential formats:

If current day:
Today

If previous day:
Yesterday

Older than yesterday, but in the same calendar week:
Monday

Older than the most recent calendar week, but in the same year:
Monday, October 14

older than a calendar year:
October 14, 2022

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | `Date` | The timestamp of the item's date |

#### Returns

`string`

A human readable string representing the distance between the date and now

#### Defined in

[packages/dialtone-vue3/common/dates.js:126](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/dates.js#L126)

___

### setDateLocale

▸ **setDateLocale**(`locale`): `void`

Sets the locale for date-fns. This should be called before any date-fns functions are called.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `locale` | `Locale` | A date-fns locale object |

#### Returns

`void`

#### Defined in

[packages/dialtone-vue3/common/dates.js:54](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/dates.js#L54)
