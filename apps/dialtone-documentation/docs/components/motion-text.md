---
title: Motion Text
description: A versatile, accessible text animation component with multiple animation modes, full accessibility support, and comprehensive customization options.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-motion-text--default
---

<code-example>
  <dt-text kind="headline" size="2xl">
    <dt-motion-text
      text="Welcome to Dialtone Motion Text"
      animation-mode="shimmer"
      :auto-start="true"
      loop
    />
  </dt-text>
</code-example>

## Usage

The Motion Text component provides beautiful text animations with zero configuration required. Simply pass text and let it animate automatically.

### Animation Modes

The component supports six different animation modes:

<code-example  vueCode='
<dt-text kind="headline" :size="600">
  <dt-motion-text
    text="Welcome to Dialtone Motion Text"
    :animation-mode="{mode}"
  />
</dt-text>
'>
  <dt-stack gap="500" align="center" class="d-hmn84">
    <dt-stack direction="row" gap="400">
      <dt-button
        v-for="mode in animationModes"
        :key="mode"
        :size="100"
        kind="muted"
        importance="outlined"
        @click="playMode(mode)"
      >
        {{ mode }}
      </dt-button>
    </dt-stack>
    <dt-text kind="headline" :size="600">
      <dt-motion-text
        ref="animDemoRef"
        text="Welcome to Dialtone Motion Text"
        :animation-mode="activeMode"
        :speed="300"
      />
    </dt-text>
  </dt-stack>
</code-example>

### Speed Control

<code-example vueCode='
<dt-text kind="headline" :size="600">
  <dt-motion-text
    text="Welcome to Dialtone Motion Text"
    animation-mode="shimmer"
    :speed="{speed}"
    :auto-start="true"
    loop
  />
</dt-text>
'>
  <dt-stack gap="500">
    <dt-segmented-control :size="100" v-model="selected" aria-label="Speed Control">
      <dt-segmented-control-item  v-dt-tooltip="'Near-instant'" value="100" :selected="selected === '100'">100</dt-segmented-control-item>
      <dt-segmented-control-item  v-dt-tooltip="'Fast'" value="200" :selected="selected === '200'">200</dt-segmented-control-item>
      <dt-segmented-control-item  v-dt-tooltip="'Medium (default)'" value="300" :selected="selected === '300'">300</dt-segmented-control-item>
      <dt-segmented-control-item  v-dt-tooltip="'Slow'" value="400" :selected="selected === '400'">400</dt-segmented-control-item>
      <dt-segmented-control-item  v-dt-tooltip="'Very slow'" value="500" :selected="selected === '500'">500</dt-segmented-control-item>
    </dt-segmented-control>
    <dt-text kind="headline" :size="600">
      <dt-motion-text
        text="Welcome to Dialtone Motion Text"
        animation-mode="shimmer"
        :speed="Number(selected)"
        :auto-start="true"
        loop
      />
    </dt-text>
  </dt-stack>
</code-example>

### Manual Control

Take full control of the animation lifecycle:

<code-example vueCode='
<dt-button @click="$refs.textRef.start()">Start</dt-button>
<dt-button @click="$refs.textRef.pause()">Pause</dt-button>
<dt-button @click="$refs.textRef.resume()">Resume</dt-button>
<dt-button @click="$refs.textRef.reset()">Reset</dt-button>
<dt-button @click="$refs.textRef.skipToEnd()">Skip to End</dt-button>
<dt-motion-text
  ref="textRef"
  text="Welcome to Dialtone Motion Text"
  animation-mode="shimmer"
  :auto-start="false"
/>
'>
  <dt-stack gap="500" align="center">
    <dt-stack direction="row" gap="300">
      <dt-button :size="100" kind="muted" importance="outlined" @click="manualDemoRef.start()">Start</dt-button>
      <dt-button :size="100" kind="muted" importance="outlined" @click="manualDemoRef.pause()">Pause</dt-button>
      <dt-button :size="100" kind="muted" importance="outlined" @click="manualDemoRef.resume()">Resume</dt-button>
      <dt-button :size="100" kind="muted" importance="outlined" @click="manualDemoRef.reset()">Reset</dt-button>
      <dt-button :size="100" kind="muted" importance="outlined" @click="manualDemoRef.skipToEnd()">Skip to End</dt-button>
    </dt-stack>
    <dt-text kind="headline" :size="600">
      <dt-motion-text
        ref="manualDemoRef"
        text="Welcome to Dialtone Motion Text"
        animation-mode="shimmer"
        :auto-start="true"
        loop
      />
    </dt-text>
  </dt-stack>
</code-example>

### Looping Animation

Perfect for attention-grabbing headers or hero sections:

<code-example only-show="code">
  <dt-motion-text
    text="Continuous animation"
    animation-mode="slide-in"
    :loop="true"
    :speed="200"
  />
</code-example>

### Using Slots

You can also use the default slot instead of the text prop:

<code-example only-show="code">
  <dt-motion-text animation-mode="fade-in">
    <span>Animated </span>
    <strong>text</strong>
  </dt-motion-text>
</code-example>

## Vue API

<component-vue-api component-name="motiontext" />

## Accessibility

The Motion Text component is built with accessibility as a core principle.

### Reduced Motion Support

Automatically respects the user's `prefers-reduced-motion` system setting. When enabled, animations are skipped and text appears instantly.

```vue
<dt-motion-text
  text="Respects user preferences"
  :respects-reduced-motion="true"
/>
```

### Screen Reader Support

Provide alternative text for screen readers:

```vue
<dt-motion-text
  text="🎉 Congratulations!"
  screen-reader-text="Congratulations"
/>
```

### ARIA Attributes

The component automatically includes proper ARIA attributes:

- `aria-live="polite"` during animation
- `aria-label` when screen reader text is provided
- `aria-hidden` for animated content while animating

## Best Practices

1. **Choose the right speed**: Use `200` for short text, `400` for longer passages
2. **Don't overuse**: Too many animated elements can be distracting
3. **Consider context**: Hero sections work well with `gradient-in`, while body text might be better with `fade-in`
4. **Test with reduced motion**: Always ensure your UI works with animations disabled
5. **Provide screen reader text**: If using emojis or special characters, always include alternative text

<script setup>
import { ref, nextTick } from 'vue';

const animDemoRef = ref(null);
const manualDemoRef = ref(null);
const activeMode = ref('none');
const selected = ref('300');

const animationModes = ['gradient-in', 'fade-in', 'slide-in', 'gradient-sweep', 'shimmer'];

async function playMode (mode) {
  // Force re-render even when clicking the same mode twice
  activeMode.value = '';
  await nextTick();
  activeMode.value = mode;
  await nextTick();
  if (!animDemoRef.value) return;
  animDemoRef.value.reset();
  animDemoRef.value.start();
}
</script>
