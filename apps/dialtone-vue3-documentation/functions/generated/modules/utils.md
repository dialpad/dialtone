# Module: utils

## Variables

### default

• **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `capitalizeFirstLetter` | (`str`: `string`, `locale`: `string`) => `string` |
| `debounce` | (`func`: `any`, `timeout`: `number`) => `void` |
| `extractVueListeners` | (`attrs`: `any`) => \{ `[k: string]`: `T`;  } |
| `filterFormattedMessages` | (`formattedMessages`: `any`) => `any` |
| `flushPromises` | () => `Promise`\<`any`\> |
| `formatMessages` | (`messages`: `any`) => `any` |
| `getPhoneNumberRegex` | (`minLength`: `number`, `maxLength`: `number`) => `RegExp` |
| `getRandomElement` | (`array`: `any`, `seed`: `string`) => `any` |
| `getRandomInt` | (`max`: `number`) => `number` |
| `getUniqueString` | (`prefix`: `string`) => `string` |
| `getValidationState` | (`formattedMessages`: `any`) => ``null`` \| `string` |
| `hasFormattedMessageOfType` | (`formattedMessages`: `any`, `messageType`: `any`) => `any` |
| `htmlFragment` | (`props`: `any`) => `VNode`\<`RendererNode`, `RendererElement`, \{ `[key: string]`: `any`;  }\> |
| `isEmailAddress` | (`input`: `string`) => `boolean` |
| `isOutOfViewPort` | (`element`: `HTMLElement`) => `Object` |
| `isPhoneNumber` | (`input`: `string` \| `number`) => `boolean` |
| `isURL` | (`input`: `string`) => `boolean` |
| `kebabCaseToPascalCase` | (`string`: `any`) => `string` |
| `linkRegex` | `RegExp` |
| `safeConcatStrings` | (`elements`: `any`[]) => `string` |

#### Defined in

[packages/dialtone-vue3/common/utils.js:392](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L392)

___

### linkRegex

• `Const` **linkRegex**: `RegExp`

#### Defined in

[packages/dialtone-vue3/common/utils.js:330](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L330)

## Functions

### capitalizeFirstLetter

▸ **capitalizeFirstLetter**(`str`, `locale?`): `string`

Locale safe function to capitalize the first letter of a string.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `str` | `string` | `undefined` | the string to capitalize the first letter of |
| `locale` | `string` | `'en-US'` | a string representing the locale to be used. Defaults to 'en-US' |

#### Returns

`string`

The passed in string with the first letter capitalized

#### Defined in

[packages/dialtone-vue3/common/utils.js:388](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L388)

___

### debounce

▸ **debounce**(`func`, `timeout?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `func` | `any` | `undefined` |
| `timeout` | `number` | `300` |

#### Returns

`void`

#### Defined in

[packages/dialtone-vue3/common/utils.js:210](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L210)

___

### extractVueListeners

▸ **extractVueListeners**(`attrs`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `attrs` | `any` |

#### Returns

`Object`

#### Defined in

[packages/dialtone-vue3/common/utils.js:199](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L199)

___

### filterFormattedMessages

▸ **filterFormattedMessages**(`formattedMessages`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `formattedMessages` | `any` |

#### Returns

`any`

#### Defined in

[packages/dialtone-vue3/common/utils.js:96](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L96)

___

### findFirstFocusableNode

▸ **findFirstFocusableNode**(`element`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `any` |

#### Returns

`any`

#### Defined in

[packages/dialtone-vue3/common/utils.js:137](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L137)

___

### flushPromises

▸ **flushPromises**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/dialtone-vue3/common/utils.js:149](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L149)

___

### formatMessages

▸ **formatMessages**(`messages`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `messages` | `any` |

#### Returns

`any`

#### Defined in

[packages/dialtone-vue3/common/utils.js:79](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L79)

___

### getPhoneNumberRegex

▸ **getPhoneNumberRegex**(`minLength?`, `maxLength?`): `RegExp`

Match phone numbers, e.g. "765-8813", "(778) 765-8813" or "+17787658813".

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `minLength` | `number` | `7` |
| `maxLength` | `number` | `15` |

#### Returns

`RegExp`

#### Defined in

[packages/dialtone-vue3/common/utils.js:308](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L308)

___

### getRandomElement

▸ **getRandomElement**(`array`, `seed`): `any`

Returns a random element from array

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `array` | `any` | the array to return a random element from |
| `seed` | `string` | use a string to seed the randomization, so it returns the same element each time based on that string. |

#### Returns

`any`

- the random element

#### Defined in

[packages/dialtone-vue3/common/utils.js:37](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L37)

___

### getRandomInt

▸ **getRandomInt**(`max`): `number`

Generate a random integer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `max` | `number` | max range of integer to generate |

#### Returns

`number`

randomly generated integer between 0 and max

#### Defined in

[packages/dialtone-vue3/common/utils.js:75](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L75)

___

### getUniqueString

▸ **getUniqueString**(`prefix?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `prefix` | `string` | `DEFAULT_PREFIX` |

#### Returns

`string`

#### Defined in

[packages/dialtone-vue3/common/utils.js:26](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L26)

___

### getValidationState

▸ **getValidationState**(`formattedMessages`): ``null`` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `formattedMessages` | `any` |

#### Returns

``null`` \| `string`

#### Defined in

[packages/dialtone-vue3/common/utils.js:111](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L111)

___

### hasFormattedMessageOfType

▸ **hasFormattedMessageOfType**(`formattedMessages`, `messageType`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `formattedMessages` | `any` |
| `messageType` | `any` |

#### Returns

`any`

#### Defined in

[packages/dialtone-vue3/common/utils.js:129](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L129)

___

### hasSlotContent

▸ **hasSlotContent**(`slot`, `slotProps?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `slot` | `any` |
| `slotProps` | `Object` |

#### Returns

`any`

#### Defined in

[packages/dialtone-vue3/common/utils.js:160](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L160)

___

### htmlFragment

▸ **htmlFragment**(`props`): `VNode`\<`RendererNode`, `RendererElement`, \{ `[key: string]`: `any`;  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `any` |

#### Returns

`VNode`\<`RendererNode`, `RendererElement`, \{ `[key: string]`: `any`;  }\>

#### Defined in

[packages/dialtone-vue3/common/utils.js:145](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L145)

___

### isEmailAddress

▸ **isEmailAddress**(`input`): `boolean`

Check if a string is an email address. Validates only exact matches.

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/dialtone-vue3/common/utils.js:367](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L367)

___

### isOutOfViewPort

▸ **isOutOfViewPort**(`element`): `Object`

Checks if the element is out of the viewport
https://gomakethings.com/how-to-check-if-any-part-of-an-element-is-out-of-the-viewport-with-vanilla-js/

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `element` | `HTMLElement` | The element to check |

#### Returns

`Object`

A set of booleans for each side of the element

#### Defined in

[packages/dialtone-vue3/common/utils.js:222](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L222)

___

### isPhoneNumber

▸ **isPhoneNumber**(`input`): `boolean`

Check if a string is a phone number. Validates only exact matches.

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `string` \| `number` |

#### Returns

`boolean`

#### Defined in

[packages/dialtone-vue3/common/utils.js:345](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L345)

___

### isURL

▸ **isURL**(`input`): `boolean`

Check if a string is an URL. Validates only exact matches.

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/dialtone-vue3/common/utils.js:356](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L356)

___

### javaHashCode

▸ **javaHashCode**(`str`): `number`

Returns a hash code for a string.
(Compatible to Java's String.hashCode())
We use this algo to be in sync with android.

The hash code for a string object is computed as
    s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
using number arithmetic, where s[i] is the i th character
of the given string, n is the length of the string,
and ^ indicates exponentiation.
(The hash value of the empty string is zero.)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | a string |

#### Returns

`number`

a hash code value for the given string.

#### Defined in

[packages/dialtone-vue3/common/utils.js:61](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L61)

___

### kebabCaseToPascalCase

▸ **kebabCaseToPascalCase**(`string`): `string`

Transform a string from kebab-case to PascalCase

#### Parameters

| Name | Type |
| :------ | :------ |
| `string` | `any` |

#### Returns

`string`

#### Defined in

[packages/dialtone-vue3/common/utils.js:181](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L181)

___

### pascalCaseToKebabCase

▸ **pascalCaseToKebabCase**(`string`): `string`

Transform a string from PascalCase to kebab-case

#### Parameters

| Name | Type |
| :------ | :------ |
| `string` | `any` |

#### Returns

`string`

#### Defined in

[packages/dialtone-vue3/common/utils.js:193](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L193)

___

### safeConcatStrings

▸ **safeConcatStrings**(`elements`): `string`

Concatenate a string removing null or undefined elements
avoiding parsing them as string with template strings

#### Parameters

| Name | Type |
| :------ | :------ |
| `elements` | `any`[] |

#### Returns

`string`

#### Defined in

[packages/dialtone-vue3/common/utils.js:378](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/utils.js#L378)
