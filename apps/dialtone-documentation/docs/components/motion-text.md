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

- **gradient-in**: Characters appear with a colorful gradient highlight reveal
- **fade-in**: Smooth opacity-based character reveal
- **slide-in**: Words slide up from below
- **gradient-sweep**: Static text with an animated gradient sweep (loops automatically)
- **shimmer**: Static text with an animated shimmer effect (loops automatically)
- **none**: Instant text display without animation

<code-example only-show="demo">
  <dt-stack gap="400" align="center">
    <span>
      <dt-button kind="muted" importance="outlined" size="sm" @click="toggleAll">
        <template #startIcon="{ iconSize }">
          <dt-icon name="play" :size="iconSize" />
        </template>
      </dt-button>
    </span>
    <dt-text kind="headline" size="lg">
      <dt-motion-text
        ref="slideInRef"
        text="Slide In Animation"
        animation-mode="slide-in"
        speed="md"
        :auto-start="false"
      />
    </dt-text>
    <dt-text kind="headline" size="lg">
      <dt-motion-text
        ref="fadeInRef"
        text="Fade In Animation"
        animation-mode="fade-in"
        speed="md"
        :auto-start="false"
      />
    </dt-text>
    <dt-text kind="headline" size="lg">
      <dt-motion-text
        ref="gradientInRef"
        text="Gradient In Animation"
        animation-mode="gradient-in"
        speed="md"
        :auto-start="false"
      />
    </dt-text>
  </dt-stack>
</code-example>

### Speed Control

Use t-shirt sizing (sm, md, lg) to control animation speed:

- **sm**: Fast animation
- **md**: Medium animation (default)
- **lg**: Slow animation

<code-example only-show="code">
  <dt-motion-text
    text="Fast animation"
    animation-mode="fade-in"
    speed="sm"
  />
  <dt-motion-text
    text="Medium animation"
    animation-mode="fade-in"
    speed="md"
  />
  <dt-motion-text
    text="Slow animation"
    animation-mode="fade-in"
    speed="lg"
  />
</code-example>

### Manual Control

Take full control of the animation lifecycle:

```vue
<template>
  <div>
    <dt-motion-text
      ref="textRef"
      text="Click to animate"
      :auto-start="false"
      @complete="onComplete"
    />

    <dt-button @click="$refs.textRef.start()">Start</dt-button>
    <dt-button @click="$refs.textRef.pause()">Pause</dt-button>
    <dt-button @click="$refs.textRef.resume()">Resume</dt-button>
    <dt-button @click="$refs.textRef.reset()">Reset</dt-button>
    <dt-button @click="$refs.textRef.skipToEnd()">Skip to End</dt-button>
  </div>
</template>

<script>
export default {
  methods: {
    onComplete() {
      console.log('Animation completed!');
    }
  }
}
</script>
```

### Looping Animation

Perfect for attention-grabbing headers or hero sections:

<code-example only-show="code">
  <dt-motion-text
    text="Continuous animation"
    animation-mode="slide-in"
    :loop="true"
    speed="sm"
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

1. **Choose the right speed**: Use `sm` for short text, `lg` for longer passages
2. **Don't overuse**: Too many animated elements can be distracting
3. **Consider context**: Hero sections work well with `gradient-in`, while body text might be better with `fade-in`
4. **Test with reduced motion**: Always ensure your UI works with animations disabled
5. **Provide screen reader text**: If using emojis or special characters, always include alternative text

<script setup>
import { ref } from 'vue';

const slideInRef = ref(null);
const fadeInRef = ref(null);
const gradientInRef = ref(null);

function toggleAll () {
  for (const r of [slideInRef, fadeInRef, gradientInRef]) {
    if (!r.value) continue;
    r.value.reset();
    r.value.start();
  }
}
</script>
