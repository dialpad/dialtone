# Module: emoji

## Variables

### customEmojiAssetUrl

• **customEmojiAssetUrl**: ``null``

#### Defined in

[packages/dialtone-vue3/common/emoji.js:6](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L6)

___

### defaultEmojiAssetUrl

• `Const` **defaultEmojiAssetUrl**: `string`

#### Defined in

[packages/dialtone-vue3/common/emoji.js:5](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L5)

___

### emojiFileExtensionLarge

• **emojiFileExtensionLarge**: `string` = `'.png'`

#### Defined in

[packages/dialtone-vue3/common/emoji.js:14](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L14)

___

### emojiFileExtensionSmall

• **emojiFileExtensionSmall**: `string` = `'.png'`

#### Defined in

[packages/dialtone-vue3/common/emoji.js:10](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L10)

___

### emojiImageUrlLarge

• **emojiImageUrlLarge**: `string` = `defaultEmojiAssetUrl`

#### Defined in

[packages/dialtone-vue3/common/emoji.js:13](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L13)

___

### emojiImageUrlSmall

• **emojiImageUrlSmall**: `string` = `defaultEmojiAssetUrl`

#### Defined in

[packages/dialtone-vue3/common/emoji.js:9](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L9)

___

### emojiJson

• `Const` **emojiJson**: `Object` = `emojisIndexed`

#### Defined in

[packages/dialtone-vue3/common/emoji.js:16](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L16)

___

### emojiVersion

• `Const` **emojiVersion**: ``"6.6"``

#### Defined in

[packages/dialtone-vue3/common/emoji.js:4](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L4)

## Functions

### codeToEmojiData

▸ **codeToEmojiData**(`code`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `any` |

#### Returns

`any`

#### Defined in

[packages/dialtone-vue3/common/emoji.js:169](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L169)

___

### filterValidShortCodes

▸ **filterValidShortCodes**(`shortcodes`): `Set`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `shortcodes` | `any` |

#### Returns

`Set`\<`any`\>

#### Defined in

[packages/dialtone-vue3/common/emoji.js:190](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L190)

___

### findEmojis

▸ **findEmojis**(`textContent`): `Set`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `textContent` | `any` |

#### Returns

`Set`\<`any`\>

#### Defined in

[packages/dialtone-vue3/common/emoji.js:198](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L198)

___

### findShortCodes

▸ **findShortCodes**(`textContent`): `Set`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `textContent` | `any` |

#### Returns

`Set`\<`any`\>

#### Defined in

[packages/dialtone-vue3/common/emoji.js:185](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L185)

___

### getEmojiData

▸ **getEmojiData**(): `Object`

#### Returns

`Object`

#### Defined in

[packages/dialtone-vue3/common/emoji.js:18](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L18)

___

### setCustomEmojiJson

▸ **setCustomEmojiJson**(`json`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `any` |

#### Returns

`void`

#### Defined in

[packages/dialtone-vue3/common/emoji.js:42](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L42)

___

### setCustomEmojiUrl

▸ **setCustomEmojiUrl**(`url`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `any` |

#### Returns

`void`

#### Defined in

[packages/dialtone-vue3/common/emoji.js:38](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L38)

___

### setEmojiAssetUrlLarge

▸ **setEmojiAssetUrlLarge**(`url`, `fileExtension?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `url` | `any` | `undefined` |
| `fileExtension` | `string` | `'.svg'` |

#### Returns

`void`

#### Defined in

[packages/dialtone-vue3/common/emoji.js:30](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L30)

___

### setEmojiAssetUrlSmall

▸ **setEmojiAssetUrlSmall**(`url`, `fileExtension?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `url` | `any` | `undefined` |
| `fileExtension` | `string` | `'.png'` |

#### Returns

`void`

#### Defined in

[packages/dialtone-vue3/common/emoji.js:22](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L22)

___

### shortcodeToEmojiData

▸ **shortcodeToEmojiData**(`shortcode`): `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `shortcode` | `any` |

#### Returns

`undefined`

#### Defined in

[packages/dialtone-vue3/common/emoji.js:114](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L114)

___

### stringToUnicode

▸ **stringToUnicode**(`str`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `any` |

#### Returns

`string`

#### Defined in

[packages/dialtone-vue3/common/emoji.js:159](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L159)

___

### unicodeToString

▸ **unicodeToString**(`emoji`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `emoji` | `any` |

#### Returns

`string`

#### Defined in

[packages/dialtone-vue3/common/emoji.js:145](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L145)

___

### validateCustomEmojiJson

▸ **validateCustomEmojiJson**(`json`): `void`

Validate custom emoji json

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `any` |

#### Returns

`void`

#### Defined in

[packages/dialtone-vue3/common/emoji.js:49](https://github.com/dialpad/dialtone/blob/dfa2bbbaafb/packages/dialtone-vue3/common/emoji.js#L49)
