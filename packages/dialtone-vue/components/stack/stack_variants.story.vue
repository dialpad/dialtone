<template>
  <div>
    <dt-stack
      gap="800"
      class="d-p-400"
    >
      <!-- Direction Examples -->
      <section>
        <h3 class="d-headline--xl d-mbe-100">
          Direction Examples
        </h3>
        <dt-stack
          gap="200"
        >
          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Column (default)
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="column"
                gap="100"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Row
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="row"
                gap="100"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Column Reverse
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="column-reverse"
                gap="100"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Row Reverse
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="row-reverse"
                gap="100"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>
        </dt-stack>
      </section>

      <!-- Gap Examples -->
      <section>
        <h3 class="d-headline--xl d-mbe-100">
          Gap Examples
        </h3>
        <dt-stack gap="200">
          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Gap: 0
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                gap="0"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Gap: 200
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                gap="25"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Gap: 400
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                gap="100"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Gap: 600
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                gap="400"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>
        </dt-stack>
      </section>

      <!-- Align Examples -->
      <section>
        <h3 class="d-headline--xl d-mbe-100">
          Align Examples (Row Direction)
        </h3>
        <dt-stack gap="200">
          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Default (no align specified - uses CSS implicit: center for row)
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="row"
                gap="100"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Start
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="row"
                gap="100"
                align="start"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Center
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="row"
                gap="100"
                align="center"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              End
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="row"
                gap="100"
                align="end"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Stretch
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="row"
                gap="100"
                align="stretch"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Baseline
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="row"
                gap="100"
                align="baseline"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>
        </dt-stack>
      </section>

      <!-- Justify Examples -->
      <section>
        <h3 class="d-headline--xl d-mbe-100">
          Justify Examples (Row Direction)
        </h3>
        <dt-stack gap="200">
          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Start (default)
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="row"
                gap="100"
                justify="start"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Center
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="row"
                gap="100"
                justify="center"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              End
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="row"
                gap="100"
                justify="end"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              space-around
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="row"
                gap="100"
                justify="space-around"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              space-between
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="row"
                gap="100"
                justify="space-between"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              space-evenly
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="row"
                gap="100"
                justify="space-evenly"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>
        </dt-stack>
      </section>

      <!-- Responsive Examples -->
      <section>
        <h3 class="d-headline--xl d-mbe-100">
          Responsive Examples
        </h3>
        <p class="d-body--md d-fc-secondary d-mbe-100">
          Resize your browser to see these examples change at different breakpoints
        </p>
        <dt-stack gap="200">
          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Responsive Direction (column → row @md)
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                :direction="{ default: 'column', md: 'row' }"
                gap="100"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Responsive Gap (200 → 400 @md → 600 @lg)
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="row"
                :gap="{ default: '200', md: '400', lg: '600' }"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Responsive Align (start → center @md → end @lg)
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="row"
                gap="100"
                :align="{ default: 'start', md: 'center', lg: 'end' }"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Responsive Justify (start → center @md → space-between @lg)
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                direction="row"
                gap="100"
                :justify="{ default: 'start', md: 'center', lg: 'space-between' }"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mbe-100">
              Combined Responsive (direction + gap + align)
            </h4>
            <div class="d-ba d-bc-default d-p-200 d-bar8">
              <dt-stack
                :direction="{ default: 'column', md: 'row' }"
                :gap="{ default: '200', md: '400' }"
                :align="{ default: 'start', md: 'center' }"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p-100">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>
        </dt-stack>
      </section>
    </dt-stack>
  </div>
</template>

<script>
import DtStack from './stack.vue';

export default {
  name: 'StackVariants',
  components: { DtStack },
};
</script>
