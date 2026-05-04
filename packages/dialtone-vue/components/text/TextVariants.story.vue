<!-- eslint-disable max-lines -->
<template>
  <div>
    <dt-stack
      gap="500"
      class="d-p-400"
    >
      <!-- Kind Examples -->
      <section>
        <dt-text
          as="h2"
          kind="headline"
          :size="600"
        >
          Kind Examples
        </dt-text>
        <dt-stack gap="200">
          <div>
            <dt-text
              as="h3"
              kind="headline"
              :size="500"
            >
              Headline
            </dt-text>
            <div class="d-ba d-bc-default d-p-200 d-bar-400">
              <dt-stack
                gap="100"
                direction="row"
                align="baseline"
              >
                <dt-text
                  v-for="size in headlineSizes"
                  :key="`headline-${size}`"
                  kind="headline"
                  :size="size"
                >
                  Headline {{ size }}
                </dt-text>
              </dt-stack>
            </div>
          </div>

          <div>
            <dt-text
              as="h3"
              kind="headline"
              :size="500"
            >
              Body
            </dt-text>
            <div class="d-ba d-bc-default d-p-200 d-bar-400">
              <dt-stack
                gap="100"
                direction="row"
                align="baseline"
              >
                <dt-text
                  v-for="size in bodySizes"
                  :key="`body-${size}`"
                  kind="body"
                  :size="size"
                >
                  Body {{ size }}
                </dt-text>
              </dt-stack>
            </div>
          </div>

          <div>
            <dt-text
              as="h3"
              kind="headline"
              :size="500"
            >
              Label
            </dt-text>
            <div class="d-ba d-bc-default d-p-200 d-bar-400">
              <dt-stack
                gap="100"
                direction="row"
                align="baseline"
              >
                <dt-text
                  v-for="size in labelSizes"
                  :key="`label-${size}`"
                  kind="label"
                  :size="size"
                >
                  Label {{ size }}
                </dt-text>
              </dt-stack>
            </div>
          </div>

          <div>
            <dt-text
              as="h3"
              kind="headline"
              :size="500"
            >
              Code
            </dt-text>
            <div class="d-ba d-bc-default d-p-200 d-bar-400">
              <dt-stack
                gap="100"
                direction="row"
                align="baseline"
              >
                <dt-text
                  v-for="size in codeSizes"
                  :key="`code-${size}`"
                  kind="code"
                  :size="size"
                >
                  Code {{ size }}
                </dt-text>
              </dt-stack>
            </div>
          </div>
        </dt-stack>
      </section>

      <!-- Strength Examples -->
      <section>
        <dt-text
          as="h2"
          kind="headline"
          :size="600"
        >
          Strength Examples
        </dt-text>
        <dt-stack gap="200">
          <div>
            <dt-text
              as="h3"
              kind="headline"
              :size="500"
            >
              Font Weight Modifiers
            </dt-text>
            <div class="d-ba d-bc-default d-p-200 d-bar-400">
              <dt-stack
                direction="row"
                gap="200"
                align="baseline"
              >
                <dt-text
                  v-for="item in strengthExamples"
                  :key="item.strength"
                  kind="headline"
                  :size="600"
                  :strength="item.strength"
                >
                  {{ item.copy }}
                </dt-text>
              </dt-stack>
            </div>
          </div>
        </dt-stack>
      </section>

      <!-- Density Examples -->
      <section>
        <dt-text
          as="h2"
          kind="headline"
          :size="600"
        >
          Density Examples
        </dt-text>
        <dt-stack gap="200">
          <div>
            <dt-text
              as="h3"
              kind="headline"
              :size="500"
            >
              Line Height Modifiers
            </dt-text>
            <div class="d-ba d-bc-default d-p-200 d-bar-400">
              <dt-stack
                gap="100"
                direction="row"
                align="baseline"
              >
                <dt-text
                  v-for="item in densityExamples"
                  :key="item.density"
                  kind="body"
                  as="p"
                  :density="item.density"
                  class="d-bgc-moderate-opaque"
                  truncate
                >
                  {{ item.density }} — {{ item.copy }}
                </dt-text>
              </dt-stack>
            </div>
          </div>
        </dt-stack>
      </section>

      <!-- Tone Examples -->
      <section>
        <dt-text
          as="h2"
          kind="headline"
          :size="600"
        >
          Tone Examples
        </dt-text>
        <dt-stack gap="200">
          <div>
            <div class="d-ba d-bc-default d-p-200 d-bar-400">
              <dt-stack
                direction="row"
                gap="100"
                class="d-fw-wrap"
              >
                <dt-text
                  v-for="item in toneExamples"
                  :key="item.key"
                  v-bind="item.props"
                >
                  {{ item.copy }}
                </dt-text>
              </dt-stack>
            </div>
          </div>
        </dt-stack>
      </section>

      <!-- Alignment Examples -->
      <section>
        <dt-text
          as="h2"
          kind="headline"
          :size="600"
        >
          Alignment Examples
        </dt-text>
        <dt-stack gap="200">
          <div
            v-for="item in alignExamples"
            :key="item.align"
          >
            <dt-text
              as="h4"
              kind="headline"
              :size="400"
            >
              {{ item.align.charAt(0).toUpperCase() + item.align.slice(1) }}
            </dt-text>
            <div class="d-ba d-bc-default d-p-200 d-bar-400">
              <dt-text
                as="div"
                :align="item.align"
              >
                {{ item.copy }}
              </dt-text>
            </div>
          </div>
        </dt-stack>
      </section>

      <!-- Truncation Examples -->
      <section>
        <dt-text
          as="h2"
          kind="headline"
          :size="600"
        >
          Truncation Examples
        </dt-text>
        <dt-stack gap="200">
          <div>
            <dt-text
              as="h3"
              kind="headline"
              :size="500"
            >
              Single Line (truncate)
            </dt-text>
            <div class="d-ba d-bc-default d-p-200 d-bar-400">
              <dt-text
                as="p"
                truncate
              >
                Single-line truncate keeps ellipsis within inline-block contexts.
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Tenetur dolore placeat deleniti, corporis in expedita!
                Sapiente voluptatem ad expedita, deserunt quisquam quasi, est
                perferendis impedit fuga nobis ducimus odio in! Animi eaque ex
                aliquam adipisci aspernatur cum nemo? Placeat asperiores, ex
                labore similique porro alias cum unde perferendis repudiandae.
                Sit aut qui alias necessitatibus?
              </dt-text>
            </div>
          </div>

          <div>
            <dt-text
              as="h3"
              kind="headline"
              :size="500"
            >
              Multi Line (maxLines)
            </dt-text>
            <dt-stack
              class="d-ba d-bc-default d-p-200 d-bar-400"
              gap="200"
            >
              <dt-text
                as="div"
                :max-lines="4"
                class="d-w-400"
              >
                <strong>4 lines:</strong> Clamp multi-line content to three lines for summary views.
                This text will be truncated after three lines with an ellipsis
                indicating there is more content available. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Tenetur dolore placeat
                deleniti, corporis in expedita! Sapiente voluptatem ad expedita,
                deserunt quisquam quasi, est perferendis impedit fuga nobis ducimus
                odio in! Animi eaque ex aliquam adipisci aspernatur cum nemo?
                Placeat asperiores, ex labore similique porro alias cum unde
                perferendis repudiandae. Sit aut qui alias necessitatibus?
              </dt-text>
              <dt-text
                as="div"
                :max-lines="3"
                class="d-w-400"
              >
                <strong>3 lines:</strong> Clamp multi-line content to three lines for summary views.
                This text will be truncated after three lines with an ellipsis
                indicating there is more content available. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Tenetur dolore placeat
                deleniti, corporis in expedita! Sapiente voluptatem ad expedita,
                deserunt quisquam quasi, est perferendis impedit fuga nobis ducimus
                odio in! Animi eaque ex aliquam adipisci aspernatur cum nemo?
                Placeat asperiores, ex labore similique porro alias cum unde
                perferendis repudiandae. Sit aut qui alias necessitatibus?
              </dt-text>
              <dt-text
                as="div"
                :max-lines="2"
                class="d-w-400"
              >
                <strong>2 lines:</strong> Clamp multi-line content to three lines for summary views.
                This text will be truncated after three lines with an ellipsis
                indicating there is more content available. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Tenetur dolore placeat
                deleniti, corporis in expedita! Sapiente voluptatem ad expedita,
                deserunt quisquam quasi, est perferendis impedit fuga nobis ducimus
                odio in! Animi eaque ex aliquam adipisci aspernatur cum nemo?
                Placeat asperiores, ex labore similique porro alias cum unde
                perferendis repudiandae. Sit aut qui alias necessitatibus?
              </dt-text>
            </dt-stack>
          </div>
        </dt-stack>
      </section>

      <!-- Wrap Examples -->
      <section>
        <dt-text
          as="h2"
          kind="headline"
          :size="600"
        >
          Wrap Examples
        </dt-text>
        <dt-stack gap="200">
          <div
            v-for="item in wrapExamples"
            :key="item.wrap"
          >
            <dt-text
              as="h4"
              kind="headline"
              :size="400"
            >
              {{ item.wrap.charAt(0).toUpperCase() + item.wrap.slice(1) }}
            </dt-text>
            <div class="d-ba d-bc-default d-of-hidden d-p-200 d-bar-400">
              <dt-text
                kind="headline"
                :size="300"
                :wrap="item.wrap"
              >
                {{ item.copy }}
              </dt-text>
            </div>
          </div>
        </dt-stack>
      </section>

      <!-- Trim Examples -->
      <section>
        <dt-text
          as="h2"
          kind="headline"
          :size="600"
        >
          Trim Examples
        </dt-text>
        <dt-text
          as="p"
          kind="body"
          tone="muted"
        >
          Text box trim removes extra space above/below text for tighter layouts
        </dt-text>
        <dt-stack
          gap="200"
          direction="row"
          class="d-ba d-bc-default d-p-200 d-bar-400"
        >
          <template
            v-for="item in textBoxTrimExamples"
            :key="item.textBoxTrim"
          >
            <dt-text
              kind="headline"
              :size="700"
              :text-box-trim="item.textBoxTrim"
              class="d-bgc-moderate-opaque"
            >
              {{ item.copy }}
            </dt-text>
          </template>
        </dt-stack>
      </section>

      <!-- Numeric Examples -->
      <section>
        <dt-text
          as="h2"
          kind="headline"
          :size="600"
        >
          Numeric Examples
        </dt-text>
        <dt-stack gap="200">
          <div>
            <dt-text
              as="h3"
              kind="headline"
              :size="500"
            >
              Tabular Figures
            </dt-text>
            <div class="d-ba d-bc-default d-p-200 d-bar-400">
              <dt-stack gap="50">
                <dt-text numeric>
                  00123456789 (numeric)
                </dt-text>
                <dt-text>
                  00123456789 (default)
                </dt-text>
              </dt-stack>
            </div>
          </div>
        </dt-stack>
      </section>
    </dt-stack>
  </div>
</template>

<script>
import { DtStack } from '../stack';
import { DtText } from './index';
import { TEXT_SIZE_MODIFIERS } from './TextConstants';

export default {
  name: 'DtTextVariants',
  components: { DtStack, DtText },

  computed: {
    headlineSizes () {
      return TEXT_SIZE_MODIFIERS.headline;
    },

    bodySizes () {
      return TEXT_SIZE_MODIFIERS.body;
    },

    labelSizes () {
      return TEXT_SIZE_MODIFIERS.label;
    },

    codeSizes () {
      return TEXT_SIZE_MODIFIERS.code;
    },

    strengthExamples () {
      return [
        { strength: 'bold', copy: 'Bold' },
        { strength: 'semibold', copy: 'Semibold' },
        { strength: 'medium', copy: 'Medium' },
        { strength: 'normal', copy: 'Normal' },
      ];
    },

    densityExamples () {
      return [
        { density: 100, copy: 'Lorem ipsume dolor sit amet gemino quis consectuar.' },
        { density: 200, copy: 'Lorem ipsume dolor sit amet gemino quis consectuar.' },
        { density: 300, copy: 'Lorem ipsume dolor sit amet gemino quis consectuar.' },
        { density: 400, copy: 'Lorem ipsume dolor sit amet gemino quis consectuar.' },
        { density: 500, copy: 'Lorem ipsume dolor sit amet gemino quis consectuar.' },
        { density: 600, copy: 'Lorem ipsume dolor sit amet gemino quis consectuar.' },
      ];
    },

    toneExamples () {
      return [
        { key: 'default', props: { kind: 'body' }, copy: 'Default tone' },
        { key: 'muted', props: { kind: 'body', tone: 'muted' }, copy: 'Muted tone' },
        { key: 'positive', props: { kind: 'body', tone: 'positive' }, copy: 'Positive tone' },
        { key: 'warning', props: { kind: 'body', tone: 'warning' }, copy: 'Warning tone' },
        { key: 'critical', props: { kind: 'body', tone: 'critical' }, copy: 'Critical tone' },
        { key: 'info', props: { kind: 'body', tone: 'info' }, copy: 'Info tone' },
        { key: 'info-strong', props: { kind: 'body', tone: 'info-strong' }, copy: 'Info strong tone' },
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
        { align: 'justify', copy: 'Justified text distributes words evenly across the full width of the container.' },
      ];
    },

    wrapExamples () {
      return [
        { wrap: 'wrap', copy: 'Default wrapping behavior for text content. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dolore placeat deleniti, corporis in expedita! Sapiente voluptatem ad expedita, deserunt quisquam quasi, est perferendis impedit fuga nobis ducimus odio in! Animi eaque ex aliquam adipisci aspernatur cum nemo? Placeat asperiores, ex labore similique porro alias cum unde perferendis repudiandae. Sit aut qui alias necessitatibus? Ex voluptates corrupti adipisci unde eos? Quos id cupiditate enim ducimus nihil quidem corporis molestiae! Quod accusamus eveniet dolores ut possimus fugit, doloribus ipsam officiis?' },
        { wrap: 'nowrap', copy: 'No wrapping allowed here. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dolore placeat deleniti, corporis in expedita! Sapiente voluptatem ad expedita, deserunt quisquam quasi, est perferendis impedit fuga nobis ducimus odio in! Animi eaque ex aliquam adipisci aspernatur cum nemo? Placeat asperiores, ex labore similique porro alias cum unde perferendis repudiandae. Sit aut qui alias necessitatibus? Ex voluptates corrupti adipisci unde eos? Quos id cupiditate enim ducimus nihil quidem corporis molestiae! Quod accusamus eveniet dolores ut possimus fugit, doloribus ipsam officiis?' },
        { wrap: 'balance', copy: 'Balanced lines for better visual appeal. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dolore placeat deleniti, corporis in expedita! Sapiente voluptatem ad expedita, deserunt quisquam quasi, est perferendis impedit fuga nobis ducimus odio in! Animi eaque ex aliquam adipisci aspernatur cum nemo? Placeat asperiores, ex labore similique porro alias cum unde perferendis repudiandae. Sit aut qui alias necessitatibus? Ex voluptates corrupti adipisci unde eos? Quos id cupiditate enim ducimus nihil quidem corporis molestiae! Quod accusamus eveniet dolores ut possimus fugit, doloribus ipsam officiis?' },
        { wrap: 'pretty', copy: 'Pretty wrap avoids orphans and widows. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dolore placeat deleniti, corporis in expedita! Sapiente voluptatem ad expedita, deserunt quisquam quasi, est perferendis impedit fuga nobis ducimus odio in! Animi eaque ex aliquam adipisci aspernatur cum nemo? Placeat asperiores, ex labore similique porro alias cum unde perferendis repudiandae. Sit aut qui alias necessitatibus? Ex voluptates corrupti adipisci unde eos? Quos id cupiditate enim ducimus nihil quidem corporis molestiae! Quod accusamus eveniet dolores ut possimus fugit, doloribus ipsam officiis?' },
      ];
    },

    textBoxTrimExamples () {
      return [
        { textBoxTrim: 'start', copy: 'Trim Start' },
        { textBoxTrim: 'end', copy: 'Trim End' },
        { textBoxTrim: 'both', copy: 'Trim Both' },
      ];
    },
  },
};
</script>
