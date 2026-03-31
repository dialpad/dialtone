---
title: Scroller
description: A virtualized list that renders only what's visible, so large datasets scroll without slowing down the page.
status: beta
thumb: true
image: assets/images/components/scroller.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-scroller--default
---

<!-- <component-combinator component-name="DtScroller" /> -->

## Usage

You have a long list and need it to stay fast. Think of it like lazy loading for list items: instead of loading every item on the page at once, it will render only those currently visible. Scroll down, old items are removed from the DOM, new ones take their place. A list of 10,000 items performs the same as a list of 10.

If your list is short or already renders quickly without it, you don't need this component.

- **Fixed height** (default): All items must be the same height. Provide `:item-size` in pixels. Scroll position is calculated with simple math — best performance for uniform lists (contacts, search results, menu items).

- **Variable height** (`dynamic`): Items can grow to fit their content. Provide `:min-item-size` as an initial estimate; the component measures each item with ResizeObserver after render and adjusts accordingly. Use for content-driven layouts like chat threads or feeds.

The rule of thumb: if every item in your list is the same height, use fixed. If heights depend on the content inside, use `dynamic`.

## Variants

### Fixed height items

Use when all items share a known, uniform height. Set `:item-size` to that height in pixels.

<code-example>
  <div class="d-w-400" data-demo-wrapper>
    <dt-scroller
      :items="[
        { id: 1, name: 'James Cooper' }, { id: 2, name: 'Sarah Mitchell' }, { id: 3, name: 'Tyler Brooks' },
        { id: 4, name: 'Emma Davidson' }, { id: 5, name: 'Connor Hayes' }, { id: 6, name: 'Rachel Foster' },
        { id: 7, name: 'Brandon Williams' }, { id: 8, name: 'Megan Clark' }, { id: 9, name: 'Sofia Reyes' },
        { id: 10, name: 'Diego Herrera' }, { id: 11, name: 'Valentina Cruz' }, { id: 12, name: 'Mateo Vargas' },
        { id: 13, name: 'Lucia Mendoza' }, { id: 14, name: 'Carlos Romero' }, { id: 15, name: 'Isabella Flores' },
        { id: 16, name: 'Alejandro Vega' }, { id: 17, name: 'Lucas Dubois' }, { id: 18, name: 'Camille Rousseau' },
        { id: 19, name: 'Julien Moreau' }, { id: 20, name: 'Claire Bernard' }, { id: 21, name: 'Antoine Laurent' },
        { id: 22, name: 'Isabelle Lefevre' }, { id: 23, name: 'Pierre Dumont' }, { id: 24, name: 'Margot Girard' },
        { id: 25, name: 'Tobias Fischer' }, { id: 26, name: 'Lena Hoffmann' }, { id: 27, name: 'Klaus Weber' },
        { id: 28, name: 'Mia Becker' }, { id: 29, name: 'Hans Braun' }, { id: 30, name: 'Anna Müller' },
        { id: 31, name: 'Felix Wagner' }, { id: 32, name: 'Sophie Richter' }, { id: 33, name: 'Ezra Cohen' },
        { id: 34, name: 'Rachel Levy' }, { id: 35, name: 'Noah Goldstein' }, { id: 36, name: 'Miriam Shapiro' },
        { id: 37, name: 'Aaron Berkowitz' }, { id: 38, name: 'Leah Rosenberg' }, { id: 39, name: 'David Katz' },
        { id: 40, name: 'Hannah Stein' }, { id: 41, name: 'Samuel Weiss' }, { id: 42, name: 'Omar Hassan' },
        { id: 43, name: 'Fatima Al-Rashid' }, { id: 44, name: 'Layla Mansouri' }, { id: 45, name: 'Tariq Al-Farsi' },
        { id: 46, name: 'Amira El-Amin' }, { id: 47, name: 'Zaid Khalil' }, { id: 48, name: 'Nour Abboud' },
        { id: 49, name: 'Yusuf Al-Sayed' }, { id: 50, name: 'Dina Qureshi' },
      ]"
      :item-size="32"
      :scroller-height="200"
      list-tag="div"
      item-tag="div"
      direction="vertical"
      class="d-ba d-bar8 d-p-50"
      >
      <template #default="{ item }">
        <dt-text class="d-px-50">{{ item.name }}</dt-text>
      </template>
    </dt-scroller>
  </div>
</code-example>

### Variable height items

Use when item heights depend on their content. Set `dynamic="true"` and `:min-item-size` to the smallest expected item height — the component measures actual sizes after render.

<code-example>
  <div class="d-w-400" data-demo-wrapper>
    <dt-scroller
      :items="[
        { id: 'J.C.', message: 'Lorem ipsum dolor sit amet' },
        { id: 'S.M.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
        { id: 'T.B.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl' },
        { id: 'E.D.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
        { id: 'C.H.', message: 'Lorem ipsum dolor sit amet' },
        { id: 'R.F.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl' },
        { id: 'B.W.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
        { id: 'S.R.', message: 'Lorem ipsum dolor sit amet' },
        { id: 'D.H.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
        { id: 'V.C.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl' },
        { id: 'M.V.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
        { id: 'L.M.', message: 'Lorem ipsum dolor sit amet' },
        { id: 'C.R.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl' },
        { id: 'I.F.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
        { id: 'L.D.', message: 'Lorem ipsum dolor sit amet' },
        { id: 'C.R.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
        { id: 'J.M.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl' },
        { id: 'C.B.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
        { id: 'A.L.', message: 'Lorem ipsum dolor sit amet' },
        { id: 'I.L.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl' },
        { id: 'P.D.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
        { id: 'T.F.', message: 'Lorem ipsum dolor sit amet' },
        { id: 'L.H.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
        { id: 'K.W.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl' },
        { id: 'M.B.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
        { id: 'H.B.', message: 'Lorem ipsum dolor sit amet' },
        { id: 'A.M.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl' },
        { id: 'F.W.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
        { id: 'E.C.', message: 'Lorem ipsum dolor sit amet' },
        { id: 'R.L.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
        { id: 'N.G.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl' },
        { id: 'M.S.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
        { id: 'A.B.', message: 'Lorem ipsum dolor sit amet' },
        { id: 'L.R.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl' },
        { id: 'D.K.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
        { id: 'O.H.', message: 'Lorem ipsum dolor sit amet' },
        { id: 'F.A.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
        { id: 'L.M.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl' },
        { id: 'T.A.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
        { id: 'A.E.', message: 'Lorem ipsum dolor sit amet' },
        { id: 'Z.K.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl' },
        { id: 'N.A.', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
      ]"
      :min-item-size="54"
      :scroller-height="300"
      list-tag="div"
      item-tag="div"
      direction="vertical"
      :dynamic="true"
      class="d-ba d-bar8 d-p-50"
    >
      <template #default="{ item }">
        <dt-stack gap="100" direction="row" align="start" class="d-p-50">
          <dt-avatar :size="300" :full-name="item.id" />
          <dt-stack>
            <dt-text kind="headline" :size="200" tone="secondary">{{ item.id }}</dt-text>
            <dt-text kind="body" :size="200" tone="primary">{{ item.message }}</dt-text>
          </dt-stack>
        </dt-stack>
      </template>
    </dt-scroller>
  </div>
</code-example>

### Direction

Defaults to `vertical`. Set to `horizontal` for a horizontal scroller.

<code-example>
  <div class="d-w-400" data-demo-wrapper>
    <dt-scroller
      :items="[
        { id: 1, name: 'JC' }, { id: 2, name: 'SM' }, { id: 3, name: 'TB' },
        { id: 4, name: 'ED' }, { id: 5, name: 'CH' }, { id: 6, name: 'RF' },
        { id: 7, name: 'BW' }, { id: 8, name: 'MC' }, { id: 9, name: 'SR' },
        { id: 10, name: 'DH' }, { id: 11, name: 'VC' }, { id: 12, name: 'MV' },
        { id: 13, name: 'LM' }, { id: 14, name: 'CR' }, { id: 15, name: 'IF' },
        { id: 16, name: 'AV' }, { id: 17, name: 'LD' }, { id: 18, name: 'CR' },
        { id: 19, name: 'JM' }, { id: 20, name: 'CB' }, { id: 21, name: 'AL' },
        { id: 22, name: 'IL' }, { id: 23, name: 'PD' }, { id: 24, name: 'MG' },
        { id: 25, name: 'TF' }, { id: 26, name: 'LH' }, { id: 27, name: 'KW' },
        { id: 28, name: 'MB' }, { id: 29, name: 'HB' }, { id: 30, name: 'AM' },
        { id: 31, name: 'FW' }, { id: 32, name: 'SR' }, { id: 33, name: 'EC' },
        { id: 34, name: 'RL' }, { id: 35, name: 'NG' }, { id: 36, name: 'MS' },
        { id: 37, name: 'AB' }, { id: 38, name: 'LR' }, { id: 39, name: 'DK' },
        { id: 40, name: 'HS' }, { id: 41, name: 'SW' }, { id: 42, name: 'OH' },
        { id: 43, name: 'FA' }, { id: 44, name: 'LM' }, { id: 45, name: 'TA' },
        { id: 46, name: 'AE' }, { id: 47, name: 'ZK' }, { id: 48, name: 'NA' },
        { id: 49, name: 'YA' }, { id: 50, name: 'DQ' },
      ]"
      :item-size="50"
      :scroller-height="56"
      list-tag="div"
      item-tag="div"
      direction="horizontal"
      class="d-ba d-bar8 d-p-50"
      >
      <template #default="{ item }">
        <dt-stack class="d-p-150 d-ba h:d-bgc-secondary d-bc-subtle d-bar4 d-c-default" align="center" justify="center"><dt-text kind="code">{{ item.name }}</dt-text></dt-stack>
      </template>
    </dt-scroller>
  </div>
</code-example>

## Vue API

<component-vue-api component-name="scroller" />
