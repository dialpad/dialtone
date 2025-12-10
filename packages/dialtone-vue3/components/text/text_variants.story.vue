<template>
  <dt-stack gap="500">
    <section>
      <dt-text
        as="h3"
        kind="label"
        size="md"
        class="d-bb"
        tone="muted"
      >
        Headline
      </dt-text>
      <dt-stack gap="300">
        <dt-text
          v-for="size in headlineSizes"
          :key="`headline-${size}`"
          kind="headline"
          :size="size"
        >
          {{ `Headline ${size}` }}
        </dt-text>
        <dt-text
          v-for="size in headlineSizes"
          :key="`headline-${size}`"
          kind="headline"
          :size="size"
          density="compact"
          strength="soft"
        >
          {{ `Headline ${size}` }} compact soft
        </dt-text>
        <dt-text
          kind="headline"
          size="lg"
          strength="soft"
        >
          Headline soft
        </dt-text>
        <dt-text
          kind="headline"
          size="lg"
          density="compact"
        >
          Headline compact
        </dt-text>
        <dt-text
          kind="headline"
          size="lg"
          density="compact"
          strength="soft"
        >
          Headline compact soft
        </dt-text>
      </dt-stack>
    </section>
    <section>
      <dt-text
        as="h3"
        kind="label"
        size="md"
        class="d-bb"
        tone="muted"
      >
        Body
      </dt-text>
      <dt-stack gap="300">
        <dt-text
          kind="body"
          size="sm"
        >
          Body sm
        </dt-text>
        <dt-text
          kind="body"
          size="sm"
          density="compact"
        >
          Body sm compact
        </dt-text>
        <dt-text
          kind="body"
          size="md"
        >
          Body md
        </dt-text>
        <dt-text
          kind="body"
          size="md"
          density="compact"
        >
          Body md compact
        </dt-text>
      </dt-stack>
    </section>
    <section>
      <dt-text
        as="h3"
        kind="label"
        size="md"
        class="d-bb"
        tone="muted"
      >
        Label
      </dt-text>
      <dt-stack gap="300">
        <dt-text
          kind="label"
          size="md"
          strength="plain"
        >
          Label md plain
        </dt-text>
        <dt-text
          kind="label"
          size="sm"
        >
          Label sm
        </dt-text>
        <dt-text
          kind="label"
          size="md"
          density="compact"
        >
          Label md compact
        </dt-text>
        <dt-text
          kind="label"
          size="sm"
          density="compact"
        >
          Label sm compact
        </dt-text>
      </dt-stack>
    </section>
    <section>
      <dt-text
        as="h3"
        kind="label"
        size="md"
        class="d-bb"
        tone="muted"
      >
        Helper
      </dt-text>
      <dt-stack gap="300">
        <dt-text
          kind="helper"
          size="sm"
        >
          Helper sm
        </dt-text>
        <dt-text
          kind="helper"
          size="md"
        >
          Helper md
        </dt-text>
        <dt-text
          kind="helper"
          size="sm"
          density="compact"
        >
          Helper sm compact
        </dt-text>
        <dt-text
          kind="helper"
          size="md"
          density="compact"
        >
          Helper md compact
        </dt-text>
      </dt-stack>
    </section>
    <section>
      <dt-text
        as="h3"
        kind="label"
        size="md"
        class="d-bb"
        tone="muted"
      >
        Code
      </dt-text>
      <dt-stack gap="300">
        <dt-text
          kind="code"
          size="sm"
        >
          Code sm
        </dt-text>
        <dt-text
          kind="code"
          size="md"
        >
          Code md
        </dt-text>
      </dt-stack>
    </section>
    <section>
      <dt-text
        as="h3"
        kind="label"
        size="md"
        class="d-bb"
        tone="muted"
      >
        Behavior Examples
      </dt-text>
      <dt-stack gap="400">
        <dt-stack gap="300">
          <dt-text
            kind="label"
            size="sm"
            tone="muted"
          >
            Truncate & Clamp
          </dt-text>
          <dt-text
            v-for="example in truncationExamples"
            :key="example.key"
            as="div"
            v-bind="example.props"
          >
            {{ example.copy }}
          </dt-text>
        </dt-stack>
        <dt-stack gap="300">
          <dt-text
            kind="label"
            size="sm"
            tone="muted"
          >
            Tone & Numeric
          </dt-text>
          <dt-stack
            direction="row"
            class="d-p4 d-bar4"
            gap="300"
          >
            <dt-text
              v-for="toneExample in toneExamples"
              :key="toneExample.key"
              v-bind="toneExample.props"
            >
              {{ toneExample.copy }}
            </dt-text>
          </dt-stack>
          <dt-stack
            direction="row"
            class="d-bgc-primary-inverted d-p4 d-bar4"
            gap="300"
          >
            <dt-text
              v-for="tone in invertedToneExamples"
              :key="tone"
              :tone="tone"
            >
              {{ tone }}
            </dt-text>
          </dt-stack>
        </dt-stack>
        <dt-stack gap="300">
          <dt-text
            kind="label"
            size="sm"
            tone="muted"
          >
            Alignment
          </dt-text>
          <dt-text
            v-for="alignExample in alignExamples"
            :key="alignExample.align"
            as="div"
            class="d-ba d-bc-subtle d-bas-dashed d-px8 d-py4"
            :align="alignExample.align"
          >
            {{ alignExample.copy }}
          </dt-text>
        </dt-stack>
        <dt-stack gap="300">
          <dt-text
            kind="label"
            size="sm"
            tone="muted"
          >
            Wrap
          </dt-text>
          <dt-stack
            direction="row"
            gap="400"
            class="d-fw-wrap"
          >
            <div
              v-for="wrapExample in wrapExamples"
              :key="wrapExample.wrap"
              class="d-w128 d-ba d-bc-subtle d-bas-dashed d-p8"
            >
              <dt-text
                kind="headline"
                size="md"
                :wrap="wrapExample.wrap"
              >
                {{ wrapExample.copy }}
              </dt-text>
              <dt-text
                kind="helper"
                size="sm"
                tone="muted"
              >
                wrap="{{ wrapExample.wrap }}"
              </dt-text>
            </div>
          </dt-stack>
        </dt-stack>
        <dt-stack gap="300">
          <dt-text
            kind="label"
            size="sm"
            tone="muted"
          >
            Trim
          </dt-text>
          <dt-stack
            direction="row"
            gap="400"
          >
            <div
              v-for="trimExample in trimExamples"
              :key="trimExample.trim"
              class="d-ba d-bc-subtle d-bas-dashed"
            >
              <dt-text
                kind="headline"
                size="lg"
                :trim="trimExample.trim"
                class="d-bgc-gold-200"
              >
                {{ trimExample.copy }}
              </dt-text>
              <dt-text
                kind="helper"
                size="sm"
                tone="muted"
                class="d-px8"
              >
                trim="{{ trimExample.trim }}"
              </dt-text>
            </div>
          </dt-stack>
        </dt-stack>
      </dt-stack>
    </section>
  </dt-stack>
</template>

<script>
import { DtStack } from '../stack';
import { DtText } from './index';
import { TEXT_SIZE_MODIFIERS } from './text_constants';

export default {
  name: 'DtTextVariants',
  components: { DtStack, DtText },

  computed: {
    headlineSizes () {
      return TEXT_SIZE_MODIFIERS.headline;
    },

    truncationExamples () {
      return [
        {
          key: 'truncate',
          props: { truncate: true, class: 'd-w24' },
          copy: 'Single-line truncate keeps ellipsis within inline-block contexts.',
        },
        {
          key: 'max-lines',
          props: { maxLines: 3, class: 'd-w48' },
          copy: 'Clamp multi-line content to three lines for summary views.',
        },
      ];
    },

    toneExamples () {
      return [
        { key: 'tone-success', props: { kind: 'body', tone: 'success' }, copy: 'Success tone' },
        { key: 'numeric-critical', props: { kind: 'body', tone: 'critical', numeric: true }, copy: '00123456789' },
      ];
    },

    invertedToneExamples () {
      return ['tertiary-inverted', 'muted-inverted', 'critical-inverted'];
    },

    alignExamples () {
      return [
        { align: 'start', copy: 'Start aligned text follows the left edge in LTR contexts.' },
        { align: 'center', copy: 'Center aligned text works well for callouts.' },
        { align: 'end', copy: 'End aligned text pairs nicely with numeric values.' },
        { align: 'justify', copy: 'Justified text distributes words evenly across the width.' },
      ];
    },

    wrapExamples () {
      return [
        { wrap: 'wrap', copy: 'Default wrapping behavior for text content' },
        { wrap: 'nowrap', copy: 'No wrapping allowed here' },
        { wrap: 'balance', copy: 'Balanced lines for better visual appeal' },
        { wrap: 'pretty', copy: 'Pretty wrap avoids orphans and widows' },
      ];
    },

    trimExamples () {
      return [
        { trim: 'start', copy: 'Trim Start' },
        { trim: 'end', copy: 'Trim End' },
        { trim: 'both', copy: 'Trim Both' },
      ];
    },
  },
};
</script>
