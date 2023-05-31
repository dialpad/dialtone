Emoji's with multiple skin tone modifiers will only be shown in their default form, as we don't support all the emojis.
We also don't support the regional / modifier and emojis-skin-tones set of emojis.
Since our component doesn't handle all the emojis, we need to extract the emojis from the json file.


To accomplish the task, and get only the necessary and useful emojis we need to do the following steps:

First we will split the emojis by category.

```
/**
 * Sort emojis by category
 * This function expect an object which contains all the emojis objects
 * @param {Object} emojiJson - The emoji json object
 * @returns {Object} - The emojis sorted by category
  */
function sortEmojisByCategory (emojiJson) {
  return Object.keys(emojiJson).reduce((acc, emojiId) => {
    const emoji = emojiJson[emojiId];
    const category = emoji.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ ...emoji, unicode_character: emojiId });
    return acc;
  }, {});
}
```

With this function we split the emoji json in categories of each set of emojis.
Now we can remove the regional, modifier and emojis-skin-tones set of emojis.

At this moment we will have these set of emojis.

1. Activity
2. Flags
3. Food
4. Nature
5. Objects
6. People
7. Symbols
8. Travel


From this set of emojis we need to know.
* Which set of emojis have skin tone modifiers. 
Because we need to split them into (-default, -light, -medium-light, -medium, -medium-dark, -dark)

* Which set of emojis have multiple skin tone modifiers.
Because we need to remove those emojis.

  
We will start with the Activity set of emojis.

First we will remove all the multiple skin tone emojis.

```
const emojisWithoutMultipleSkinToneEmojis = ref([]);

function removeMultipleSkinToneEmojis () {
  const excludedRegex = /_tone[1-5]_tone[1-5]/;
  emojisWithoutMultipleSkinToneEmojis.value = emojis.objects.filter(obj => !excludedRegex.test(obj.shortname));
}
```

Secondly, we will get only the emojis without skin tone modifier.

```
const filterEmojisBySkinTone = computed(() => {
  const excludedStrings = ['_tone1', '_tone2', '_tone3', '_tone4', '_tone5'];
  return emojis.objects.filter(obj => {
    return excludedStrings.some(str => obj.shortname.includes(str));
  });
});
```

At this point we will have the emojis of Activity without multiple skin tone modifier and without the emojis with skin tone modifier.

Note: Inside the result of this array we will have the DEFAULT emojis (the yellow ones).

## We achieve our first .json we will use in the emoji picker component, and in this case is the activity-default.json.

---

Now we need to get the -light, -medium-light, -medium, -medium-dark, -dark emojis.

To do this we will do the following.

Since the emojis have a skin tone modifier like '_tone1/2/3/4/5' in the name, this allows us to filter it.
We will use this function to extract the emojis with only one skin tone modifier.

From the emojisWithoutMultipleSkinToneEmojis array (which we obtain after running our removeMultipleSkinToneEmojis function),
we will get the emojis with only one skin tone modifier.
For this, we will re-use the filterEmojisBySkinTone to get only those with '_tone1'.

```
const filterEmojisBySkinTone = computed(() => {
  const excludedStrings = ['_tone2', '_tone3', '_tone4', '_tone5'];// as you can see I remove '_tone1'
  return emojis.objects.filter(obj => {
    return excludedStrings.some(str => obj.shortname.includes(str));
  });
});
```

Now we have the defaults emojis (the yellow ones), the emojis which doesn't have skin tone modifier and the emojis with only one skin tone modifier (_tone1).
So we need to remove the defaults emojis.
For this we will use the getDefaultSkinToneEmojis function.

```
/**
 * Get default skin tone emojis
 * This function will remove the skin tone modifier from the shortname
 * It is necessary to provide the function with a list of emojis with only one skin tone
 * The utility of this function is to find which emojis can be affected by a skin tone modifier.
 * This is useful if we want to remove default skin tone emojis from a list of emojis if a skin tone is selected.
 * @param {Array} list - The list of emojis to filter
 * @param {String} skinTone - The skin tone to remove from the shortname
 * @returns {Array} - The emoji list without skin tone
  */
function getDefaultSkinToneEmojis (list, skinTone = '_tone1') {
  defaultSkinToneEmojis.value = list.map((emoji) => {
    return { ...emoji, shortname: emoji.shortname.replace(skinTone, '') };
  });
}
```

Now we have defaultSkinToneEmojis array which contain all the default emojis, so we can remove them using the removeDefaultSkinToneEmojis function.

```
const emojiListWithoutDefaultSkinTone = ref([]);

/**
 * Remove default skin tone emojis
 * This function will remove the default skin tone emojis from a list of emojis
 * @param {Array} emojis - The list of emojis to filter
 * @param {Array} emojisToRemove - The list of emojis to remove
 * @returns {Array} - The emoji list without default skin tone emojis
 */
function removeDefaultSkinToneEmojis (emojis, emojisToRemove) {
  emojiListWithoutDefaultSkinTone.value = emojis.filter((emoji) => {
    return !emojisToRemove.some((emojiToRemove) => emojiToRemove.shortname === emoji.shortname);
  });
}
```  

And the final result of this is the activity-light.json (_tone1)

We will repeat the same steps for the rest of the sets of emojis.
activity-medium-light.json (_tone2), activity-medium.json (_tone3), activity-medium-dark.json (_tone4), activity-dark.json (_tone5).

You will see, there are some emojis which are not affected by the skin tone modifier.
These are: 
1. Flags
2. Food
3. Nature
4. Symbols
5. Travel











