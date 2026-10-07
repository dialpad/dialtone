---
title: Motion Text
description: Word-by-word text animation for reveal, gradient, and shimmer moments.
keywords: ["animated text", "loading text", "gradient text", "shimmer", "slide in", "animation", "DtMotionText", "dt-motion-text"]
status: new
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-motion-text--default
combinator: DtMotionText
---

```vue demo
<dt-text kind="headline" :size="600">
  <dt-motion-text
    text="Welcome to Dialtone Motion Text"
    animation-mode="slide-in-gradient"
    loop
  />
</dt-text>
```

## Usage

`DtMotionText` animates text word by word. Pass `text` and the effect plays as soon as the component mounts, using `gradient-in` unless you set `animation-mode`.

Every effect except `shimmer` works on whole words, never individual characters. Words animate in reading order, each starting a moment after the one before it. `shimmer` instead sweeps one dimmed band left to right across the whole text, so it reads well even on a single word. The gradient effects place one continuous purple-to-orange gradient behind all of the words, so each word shows its own slice of the same sweep rather than a gradient of its own. The gradient is the `--dt-color-gradient-orange-red-magenta-purple` token, a horizontal span of the Ai gradient used by Ai surfaces and borders.

### Animation Modes

| Mode | Effect |
| --- | --- |
| `gradient-in` (default) | Each word fades in showing its slice of the gradient, then its text color fades in over it. |
| `fade-in` | Each word fades in. |
| `slide-in` | Each word fades in while rising into place. |
| `slide-in-gradient` | The `slide-in` motion combined with the `gradient-in` color reveal. |
| `gradient-sweep` | Text starts solid. Each word fades to the gradient, holds, then fades back to its text color. |
| `shimmer` | A dimmed band sweeps left to right across the whole text. |

Select a mode to play it. **Loop** is on, so each effect keeps repeating; turn it off to watch a single play.

```vue demo
<dt-stack gap="400" align="center" class="d-hmn84">
  <dt-stack direction="row" gap="100" class="d-fw-wrap d-jc-center">
    <dt-button
      v-for="mode in animationModes"
      :key="mode"
      :size="100"
      kind="muted"
      importance="outlined"
      :active="mode === activeMode"
      @click="playMode(mode)"
    >
      {{ mode }}
    </dt-button>
  </dt-stack>
  <dt-toggle v-model="loopModes" :size="200" @update:model-value="playMode(activeMode)">Loop</dt-toggle>
  <dt-text kind="headline" :size="600">
    <dt-motion-text
      :key="modeDemoKey"
      text="The AI platform for customer experience"
      :animation-mode="activeMode"
      :loop="loopModes"
    />
  </dt-text>
</dt-stack>
<!-- @code -->
<dt-text kind="headline" :size="600">
  <dt-motion-text
    text="The AI platform for customer experience"
    animation-mode="{mode}"
  />
</dt-text>
```

### Speed Control

`speed` scales every timing in the effect proportionally. The default, `300`, plays each effect at its designed timing. Lower values are faster and higher values are slower: `100` runs at 0.3× the designed timing, `200` at 0.6×, `400` at 1.5×, and `500` at 2.1×.

```vue demo
<dt-stack gap="200">
  <dt-segmented-control :size="100" v-model="selected" aria-label="Speed Control">
    <dt-segmented-control-item v-dt-tooltip="'Fastest (0.3×)'" value="100" :selected="selected === '100'">100</dt-segmented-control-item>
    <dt-segmented-control-item v-dt-tooltip="'Fast (0.6×)'" value="200" :selected="selected === '200'">200</dt-segmented-control-item>
    <dt-segmented-control-item v-dt-tooltip="'Designed timing (default)'" value="300" :selected="selected === '300'">300</dt-segmented-control-item>
    <dt-segmented-control-item v-dt-tooltip="'Slow (1.5×)'" value="400" :selected="selected === '400'">400</dt-segmented-control-item>
    <dt-segmented-control-item v-dt-tooltip="'Slowest (2.1×)'" value="500" :selected="selected === '500'">500</dt-segmented-control-item>
  </dt-segmented-control>
  <dt-text kind="headline" :size="600">
    <dt-motion-text
      :key="selected"
      text="Welcome to Dialtone Motion Text"
      animation-mode="shimmer"
      :speed="Number(selected)"
      loop
    />
  </dt-text>
</dt-stack>
<!-- @code -->
<dt-text kind="headline" :size="600">
  <dt-motion-text
    text="Welcome to Dialtone Motion Text"
    animation-mode="shimmer"
    :speed="{speed}"
    loop
  />
</dt-text>
```

### Manual Control

Set `:auto-start="false"` to start the effect on your own trigger, then drive it with the `start()`, `pause()`, `resume()`, `reset()`, and `skipToEnd()` methods. Switching `auto-start` to `true` later also starts the effect.

Until `start()` is called, the reveal modes (`gradient-in`, `fade-in`, `slide-in`, and `slide-in-gradient`) keep the text hidden, while `gradient-sweep` and `shimmer` show the text at rest. `reset()` returns every word to that starting frame, and `skipToEnd()` shows the text at rest immediately.

```vue demo
<dt-stack gap="200" align="center">
  <dt-stack direction="row" gap="100" class="d-fw-wrap d-jc-center">
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
      animation-mode="slide-in-gradient"
      :auto-start="false"
      loop
    />
  </dt-text>
</dt-stack>
<!-- @code -->
<dt-button @click="$refs.textRef.start()">Start</dt-button>
<dt-button @click="$refs.textRef.pause()">Pause</dt-button>
<dt-button @click="$refs.textRef.resume()">Resume</dt-button>
<dt-button @click="$refs.textRef.reset()">Reset</dt-button>
<dt-button @click="$refs.textRef.skipToEnd()">Skip to End</dt-button>
<dt-motion-text
  ref="textRef"
  text="Welcome to Dialtone Motion Text"
  animation-mode="slide-in-gradient"
  :auto-start="false"
  loop
/>
```

### Looping Animation

Set `loop` to repeat the effect continuously. When a cycle finishes, the text holds at rest for a moment, then every word resets together and the cycle plays again. The hold is fixed, so the length of each cycle depends on how many words there are. For a six-word line at speed `300`, the reveal modes repeat every 2 seconds and `gradient-sweep` every 2.65 seconds. `shimmer` repeats back to back every 3 seconds, whatever the length of the text.

Each cycle emits `start` when it begins and `complete` when its last word settles.

> [!WARNING] Give users a way to stop looping text
> Motion that repeats for more than five seconds alongside other content needs a pause or stop control ([WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)). Wire a control to `pause()` and `resume()` or `skipToEnd()`, or stop looping once the state it represents ends.

```vue code-only
<dt-motion-text
  text="Thinking through your request"
  animation-mode="gradient-sweep"
  loop
/>
```

### Using Slots

You can pass the text through the default slot instead of the `text` prop.

- `shimmer` renders the slot as-is, so markup such as `<strong>` and live updates, like streamed text or a changing name, are kept.
- The word-by-word modes read the slot once as plain text and split it into words, so markup inside the slot isn't preserved.

Whitespace between words, including line breaks, is kept, so `white-space: pre-wrap` on the component still applies.

```vue code-only
<dt-motion-text animation-mode="shimmer" loop>
  <strong>{{ userName }}</strong> is typing...
</dt-motion-text>
```

## Accessibility

### Reduced Motion Support

By default, `DtMotionText` follows the user's `prefers-reduced-motion` system setting. When reduced motion is requested, the text renders at rest with no movement or gradient, and the `start` and `complete` events still fire.

Set `:respects-reduced-motion="false"` only when the motion itself carries meaning. The effect then plays even when the user has asked for reduced motion.

```vue code-only
<dt-motion-text
  text="Plays regardless of the reduced motion setting"
  :respects-reduced-motion="false"
/>
```

### Screen Reader Support

Each word is real text separated by real spaces, so screen readers read the sentence as written. When the visible text isn't a good spoken equivalent, such as text with emoji or symbols, provide `screen-reader-text`:

```vue code-only
<dt-motion-text
  text="🎉 Congratulations!"
  screen-reader-text="Congratulations"
/>
```

### ARIA Attributes

`DtMotionText` sets these attributes automatically:

- `aria-live="polite"` while the effect is animating, and `aria-live="off"` otherwise.
- Without `screen-reader-text`, the animated words stay available to assistive technology at all times, including while they animate.
- With `screen-reader-text`, the component adds an `aria-label` and a visually hidden copy of that text, and marks the animated words `aria-hidden="true"`.

## Best Practices

1. **Match the effect to the moment**: Use `slide-in-gradient` or `gradient-in` for hero and headline moments, `fade-in` or `slide-in` for quieter reveals, and a looping `gradient-sweep` or `shimmer` for thinking and loading states.
2. **Use gradient effects on headline-size text**: The lightest gradient stops fall below 4.5:1 contrast on light surfaces and the darkest below 3:1 on dark surfaces, so reserve `gradient-in`, `slide-in-gradient`, and `gradient-sweep` for large text.
3. **Keep the text short**: Every word adds to the stagger, so long passages take longer to finish. Reserve effects for headlines and short phrases.
4. **Start with the default speed**: `300` is the designed timing. Use `200` when the effect needs to finish quickly, and `400` or `500` for slower, more deliberate moments.
5. **Don't overuse**: Too many animated elements on one screen compete for attention.
6. **Test with reduced motion**: Make sure your UI still reads well when the text renders at rest.
7. **Provide screen reader text**: If the text includes emoji or special characters, include a spoken alternative.

<script setup>
import { ref } from 'vue';
import { MOTION_TEXT_ANIMATION_MODES } from '@dialpad/dialtone-vue';

const animationModes = MOTION_TEXT_ANIMATION_MODES;
const activeMode = ref('gradient-in');
const loopModes = ref(true);
const modeDemoKey = ref(0);
const manualDemoRef = ref(null);
const selected = ref('300');

// Remounting replays the effect from its first frame, even when the same mode is selected again
function playMode (mode) {
  activeMode.value = mode;
  modeDemoKey.value++;
}
</script>

## Vue API

<component-vue-api component-name="motiontext" />
