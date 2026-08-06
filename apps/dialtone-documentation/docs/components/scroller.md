---
title: Scroller
description: A scroller component that allows blazing fast scrolling of any amount of data.
status: beta
thumb: true
image: assets/images/components/scroller.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-scroller--default
---

#### Default Scroller

<code-well-header>
 <dt-scroller
      style="
      margin: 20px 0;
      border: 1px solid red;"
      :items="[
              {
                id: 1,
                name: `User 1`,
              },
              {
                id: 2,
                name: `User 2`,
              },
              {
                id: 3,
                name: `User 3`,
              },
              {
                id: 4,
                name: `User 4`,
              },
              {
                id: 5,
                name: `User 5`,
              },
              {
                id: 6,
                name: `User 6`,
              },
              {
                id: 7,
                name: `User 7`,
              },
              {
                id: 8,
                name: `User 8`,
              },
              {
                id: 9,
                name: `User 9`,
              },
              {
                id: 10,
                name: `User 10`,
              },
              {
                id: 11,
                name: `User 11`,
              },
              {
                id: 12,
                name: `User 12`,
              },
              {
                id: 13,
                name: `User 13`,
              },
              {
                id: 14,
                name: `User 14`,
              },
              {
                id: 15,
                name: `User 15`,
              }
          ]"
      :item-size="32"
      :scroller-height="200"
      :scroller-width="200"
      list-tag="div"
      item-tag="div"
      direction="vertical"
      >
      <template #default="{ item }">
              <div style="
                height: 25px;
                padding: 0 12px;
                display: flex;
                align-items: center;
                border-bottom: 1px solid #eee;
              ">
                {{ item.name }}
              </div>
      </template>
</dt-scroller>
</code-well-header>

<br>

```html
<dt-scroller
 :items="items"
 :item-size="32"
 :scroller-height="200"
 :scroller-width="300"
 >
 <template #default="{ item }">
   <div class="user">
     {{ item.name }}
   </div>
 </template>
</dt-scroller>
```

#### Dynamic Scroller

<code-well-header>
 <dt-scroller
      :items="[
              {
                id: 1,
                message: 'lorem ipsum dolor sit amet',
              },
              {
                id: 2,
                message: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam',
              },
              {
                id: 3,
                message: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl',
              },
              {
                id: 4,
                message: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor,nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam',
              },
              {
                id: 5,
                message: 'lorem ipsum dolor sit amet',
              },
              {
                id: 6,
                message: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl',
              },
              {
                id: 7,
                message: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor,nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam',
              },
          ]"
      :min-item-size="54"
      :scroller-height="300"
      :scroller-width="500"
      :dynamic="true"
      style="
        margin: 20px 0;
        border: 1px solid red;"
    >
      <template #default="{ item }">
        <div style="
            padding: 0 12px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #eee;"
        >
          User {{ item.id}} <br />
          {{ item.message }}
        </div>
      </template>
    </dt-scroller>
</code-well-header>

<br>

```html
<dt-scroller
 :items="dynamicItems"
 :min-item-size="54"
 :scroller-height="300"
 :scroller-width="500"
 :dynamic="true"
 >
 <template #default="{ item }">
   <div class="avatar">
     {{ item.id }}
     <img
      :key="item.avatar"
      :src="item.avatar"
      alt="avatar"
      class="image"
     >
  </div>
  <div class="text">
     {{ item.message }}
  </div>
 </template>
</dt-scroller>
```

#### Infinite Scroll

Use the `after` slot for a loading indicator that scrolls with the list, and `scroll-end` to fetch
the next page. `scroll-end` fires when the last item enters the rendered view pool — one `buffer`
length before the viewport floor — so the fetch starts before the user runs out of content.

`scroll-start` is the mirror image, for prepending older items.

The scroller recomputes its rendered window on mount and on scroll. It does not watch
`items`, so after you append a page call `updateItems()` on the component ref — otherwise
the new rows will not appear until the next scroll.

Assign a new array rather than mutating the existing one in place. The scroller itself does not
mind either way, but watching `items` by reference is the usual way a wrapper component triggers
the `updateItems()` call for you, and a reference watcher never sees an in-place `push`.

```html
<dt-scroller
 ref="scroller"
 :items="items"
 :item-size="32"
 :buffer="400"
 :scroller-height="200"
 @scroll-end="fetchNextPage"
 >
 <template #default="{ item }">
   <div class="user">
     {{ item.name }}
   </div>
 </template>
 <template #after>
   <dt-loader v-if="isFetching" />
 </template>
</dt-scroller>
```

```js
async function fetchNextPage () {
  if (isFetching.value) return;
  isFetching.value = true;
  try {
    const page = await fetchMore();
    items.value = [...items.value, ...page];
    await nextTick();
    scroller.value.updateItems();
  } finally {
    isFetching.value = false;
  }
}
```

The `empty` slot renders unconditionally whenever it is provided, so guard its contents with
your own `v-if` if it should only appear once the list is confirmed empty.

## Vue API

<component-vue-api component-name="scroller" />
