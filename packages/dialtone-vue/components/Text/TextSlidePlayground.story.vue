<template>
  <div
    class="d-p-400"
    :style="tuningStyles"
  >
    <dt-stack gap="400">
      <dt-text
        as="p"
        variant="body-md"
        tone="secondary"
      >
        Hover or focus (Tab, arrow keys) a row to slide its label. Leaving or pressing Esc snaps it
        back. In the menu, pointing at a row also focuses it, as in Dialtone's dropdown menus, so one
        row slides at a time. Reduced motion follows the OS setting (macOS: Accessibility > Display > Reduce motion):
        the label jumps to the end and stays.
      </dt-text>

      <section
        class="d-bar-300 d-ba d-bc-default d-p-300"
        data-qa="slide-controls"
      >
        <dt-stack gap="300">
          <label class="d-d-flex d-ai-center d-gg200">
            <span class="d-w128">Mode</span>
            <select
              v-model="mode"
              data-qa="slide-mode"
            >
              <option value="once">once</option>
              <option value="bounce">bounce</option>
              <option value="loop">loop</option>
            </select>
          </label>
          <label class="d-d-flex d-ai-center d-gg200">
            <span class="d-w128">Easing</span>
            <select
              v-model="easing"
              data-qa="slide-easing"
            >
              <option
                v-for="option in easingOptions"
                :key="option.key"
                :value="option.key"
              >
                {{ option.label }}
              </option>
            </select>
            <dt-text
              variant="body-sm"
              tone="muted"
            >
              loop always moves steadily
            </dt-text>
          </label>
          <label
            v-for="slider in sliders"
            :key="slider.key"
            class="d-d-flex d-ai-center d-gg200"
          >
            <span class="d-w128">{{ slider.label }}</span>
            <input
              v-model.number="values[slider.key]"
              type="range"
              :min="slider.min"
              :max="slider.max"
              :step="slider.step"
              :data-qa="`slide-${slider.key}`"
            >
            <dt-text variant="body-sm">{{ values[slider.key] }}{{ slider.unit }}</dt-text>
          </label>
          <label class="d-d-flex d-ai-center d-gg200">
            <input
              v-model="useDefaultHold"
              type="checkbox"
            >
            <span>Use the mode's default hold (bounce 1 s, loop 5 s)</span>
          </label>
          <dt-text
            as="code"
            variant="code-sm"
            tone="muted"
            data-qa="slide-readout"
          >
            {{ readout }}
          </dt-text>
        </dt-stack>
      </section>

      <section>
        <dt-text
          as="h3"
          variant="headline-sm"
        >
          1. Menu (arrow keys or Tab between items)
        </dt-text>
        <div
          role="menu"
          tabindex="-1"
          class="d-ba d-bc-default d-bar-300 d-p-100"
          :style="{ inlineSize: `${values.width}px` }"
          data-qa="slide-menu"
          @keydown="onMenuKeydown"
        >
          <button
            v-for="name in devices"
            :key="name"
            type="button"
            role="menuitem"
            @pointerenter="$event.currentTarget.focus()"
            class="slide-row d-d-flex d-ai-center d-w100p d-p-200 d-bar-200"
            data-qa="slide-menuitem"
          >
            <dt-text
              as="div"
              variant="label-md"
              :slide="mode"
              class="d-fl-grow1 slide-label"
            >
              {{ name }}
            </dt-text>
          </button>
        </div>
      </section>

      <section>
        <dt-text
          as="h3"
          variant="headline-sm"
        >
          2. Sidebar-like row (link with an icon)
        </dt-text>
        <div
          class="d-ba d-bc-default d-bar-300 d-p-100"
          :style="{ inlineSize: `${values.width}px` }"
        >
          <a
            href="#"
            class="slide-row d-d-flex d-ai-center d-gg200 d-p-200 d-bar-200"
            data-qa="slide-sidebar"
            @click.prevent
          >
            <dt-icon-phone
              size="300"
              class="d-fl-shrink0"
            />
            <dt-text
              as="div"
              variant="label-md"
              :slide="mode"
              class="d-fl-grow1 slide-label"
            >
              Customer support queue for the Pacific Northwest region
            </dt-text>
          </a>
        </div>
      </section>

      <section>
        <dt-text
          as="h3"
          variant="headline-sm"
        >
          3. Plain text, nothing focusable around it
        </dt-text>
        <div
          class="d-ba d-bc-default d-bar-300 d-p-200"
          :style="{ inlineSize: `${values.width}px` }"
        >
          <dt-text
            as="div"
            variant="body-md"
            :slide="mode"
            data-qa="slide-plain"
          >
            A long line of plain text that has no interactive element around it at all
          </dt-text>
        </div>
        <dt-text
          variant="body-sm"
          tone="muted"
        >
          Hover only. The keyboard cannot reach this, by design.
        </dt-text>
      </section>

      <section>
        <dt-text
          as="h3"
          variant="headline-sm"
        >
          4. Arabic, right to left, inside a button
        </dt-text>
        <div
          dir="rtl"
          class="d-ba d-bc-default d-bar-300 d-p-100"
          :style="{ inlineSize: `${values.width}px` }"
        >
          <button
            type="button"
            class="slide-row d-d-flex d-ai-center d-gg200 d-w100p d-p-200 d-bar-200"
            data-qa="slide-rtl"
          >
            <dt-text
              as="div"
              variant="label-md"
              :slide="mode"
              class="d-fl-grow1 slide-label"
            >
              قائمة انتظار دعم العملاء لمنطقة الشمال الغربي للمحيط الهادئ والمناطق المجاورة
            </dt-text>
          </button>
        </div>
      </section>

      <section>
        <dt-text
          as="h3"
          variant="headline-sm"
        >
          5. Text that fits (never moves)
        </dt-text>
        <div
          class="d-ba d-bc-default d-bar-300 d-p-100"
          :style="{ inlineSize: `${values.width}px` }"
        >
          <button
            type="button"
            class="slide-row d-d-flex d-ai-center d-w100p d-p-200 d-bar-200"
            data-qa="slide-fits"
          >
            <dt-text
              as="div"
              variant="label-md"
              :slide="mode"
              class="d-fl-grow1 slide-label"
            >
              Short label
            </dt-text>
          </button>
        </div>
      </section>
    </dt-stack>
  </div>
</template>

<script>
import { DtText } from './index';
import { DtStack } from '../stack';
import { DtIconPhone } from '@dialpad/dialtone-icons/vue';

const EASING_OPTIONS = [
  { key: 'today', label: 'Sidebar row today', value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
  { key: 'out', label: 'Dialtone out', value: 'var(--ttf-out)' },
  { key: 'ease', label: 'Dialtone ease', value: 'var(--ttf-ease)' },
  { key: 'in-out', label: 'Dialtone in-out', value: 'var(--ttf-in-out)' },
  { key: 'out-quint', label: 'Dialtone out-quint', value: 'var(--ttf-out-quint)' },
  { key: 'steady', label: 'Steady', value: 'linear' },
];

export default {
  name: 'DtTextSlidePlayground',
  components: { DtText, DtStack, DtIconPhone },

  data() {
    return {
      mode: 'once',
      easing: 'today',
      easingOptions: EASING_OPTIONS,
      useDefaultHold: true,
      values: {
        speed: 40,
        delay: 500,
        hold: 1000,
        fade: 8,
        gap: 24,
        width: 220,
      },
      sliders: [
        { key: 'speed', label: 'Speed', min: 20, max: 120, step: 5, unit: ' px/s' },
        { key: 'delay', label: 'Delay', min: 0, max: 1000, step: 50, unit: ' ms' },
        { key: 'hold', label: 'Hold', min: 0, max: 6000, step: 250, unit: ' ms' },
        { key: 'fade', label: 'Fade size', min: 0, max: 32, step: 1, unit: ' px' },
        { key: 'gap', label: 'Gap (loop)', min: 8, max: 64, step: 4, unit: ' px' },
        { key: 'width', label: 'Box width', min: 120, max: 320, step: 10, unit: ' px' },
      ],
      devices: [
        'Front desk reception phone, second floor east wing',
        'Conference room Aurora with ceiling microphone array',
        'Warehouse dock handset (shared between three shifts)',
      ],
    };
  },

  computed: {
    tuningStyles() {
      const styles = {
        '--dt-text-slide-speed': this.values.speed,
        '--dt-text-slide-delay': `${this.values.delay}ms`,
        '--dt-text-slide-easing': EASING_OPTIONS.find((option) => option.key === this.easing).value,
        '--dt-text-slide-fade-size': `${this.values.fade}px`,
        '--dt-text-slide-gap': `${this.values.gap}px`,
      };
      if (!this.useDefaultHold) {
        styles['--dt-text-slide-hold'] = `${this.values.hold}ms`;
      }
      return styles;
    },

    readout() {
      return Object.entries(this.tuningStyles).map(([k, v]) => `${k}: ${v}`).join('; ');
    },
  },

  methods: {
    // minimal roving focus so arrow keys move between the menu items
    onMenuKeydown(event) {
      const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const items = [...event.currentTarget.querySelectorAll('[role="menuitem"]')];
      const next = items[(items.indexOf(document.activeElement) + step + items.length) % items.length];
      next?.focus();
    },
  },
};
</script>

<style scoped>
.slide-label {
  min-inline-size: 0;
}

.slide-row {
  border: 0;
  background: transparent;
  color: inherit;
  text-align: start;
  text-decoration: none;
  cursor: pointer;
}

.slide-row:hover,
.slide-row:focus-visible {
  background: var(--dt-color-surface-secondary);
}
</style>
