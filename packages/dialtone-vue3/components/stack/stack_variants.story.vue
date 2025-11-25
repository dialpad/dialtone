<template>
  <div>
    <dt-stack
      gap="700"
      class="d-p32"
    >
      <!-- Direction Examples -->
      <section>
        <h3 class="d-headline--xl d-mb8">
          Direction Examples
        </h3>
        <dt-stack
          gap="500"
        >
          <div>
            <h4 class="d-headline--lg d-mb8">
              Column (default)
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="column"
                gap="400"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              Row
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="row"
                gap="400"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              Column Reverse
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="column-reverse"
                gap="400"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              Row Reverse
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="row-reverse"
                gap="400"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>
        </dt-stack>
      </section>

      <!-- Gap Examples -->
      <section>
        <h3 class="d-headline--xl d-mb8">
          Gap Examples
        </h3>
        <dt-stack gap="500">
          <div>
            <h4 class="d-headline--lg d-mb8">
              Gap: 0
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                gap="0"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              Gap: 200
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                gap="200"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              Gap: 400
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                gap="400"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              Gap: 600
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                gap="600"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>
        </dt-stack>
      </section>

      <!-- Align Examples -->
      <section>
        <h3 class="d-headline--xl d-mb8">
          Align Examples (Row Direction)
        </h3>
        <dt-stack gap="500">
          <div>
            <h4 class="d-headline--lg d-mb8">
              Normal (default)
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="row"
                gap="400"
                align="normal"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              Start
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="row"
                gap="400"
                align="start"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              Center
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="row"
                gap="400"
                align="center"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              End
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="row"
                gap="400"
                align="end"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              Stretch
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="row"
                gap="400"
                align="stretch"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              Baseline
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="row"
                gap="400"
                align="baseline"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>
        </dt-stack>
      </section>

      <!-- Justify Examples -->
      <section>
        <h3 class="d-headline--xl d-mb8">
          Justify Examples (Row Direction)
        </h3>
        <dt-stack gap="500">
          <div>
            <h4 class="d-headline--lg d-mb8">
              Start (default)
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="row"
                gap="400"
                justify="start"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              Center
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="row"
                gap="400"
                justify="center"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              End
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="row"
                gap="400"
                justify="end"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              Around
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="row"
                gap="400"
                justify="around"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              Between
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="row"
                gap="400"
                justify="between"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              Evenly
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="row"
                gap="400"
                justify="evenly"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>
        </dt-stack>
      </section>

      <!-- Responsive Examples -->
      <section>
        <h3 class="d-headline--xl d-mb8">
          Responsive Examples
        </h3>
        <p class="d-body--md d-fc-secondary d-mb8">
          Resize your browser to see these examples change at different breakpoints
        </p>
        <dt-stack gap="500">
          <div>
            <h4 class="d-headline--lg d-mb8">
              Responsive Direction (column → row @md)
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                :direction="{ default: 'column', md: 'row' }"
                gap="400"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              Responsive Gap (200 → 400 @md → 600 @lg)
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="row"
                :gap="{ default: '200', md: '400', lg: '600' }"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              Responsive Align (start → center @md → end @lg)
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="row"
                gap="400"
                :align="{ default: 'start', md: 'center', lg: 'end' }"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              Responsive Justify (start → center @md → between @lg)
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                direction="row"
                gap="400"
                :justify="{ default: 'start', md: 'center', lg: 'between' }"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 3
                </dt-stack>
              </dt-stack>
            </div>
          </div>

          <div>
            <h4 class="d-headline--lg d-mb8">
              Combined Responsive (direction + gap + align)
            </h4>
            <div class="d-ba d-bc-default d-p16 d-bar8">
              <dt-stack
                :direction="{ default: 'column', md: 'row' }"
                :gap="{ default: '200', md: '400' }"
                :align="{ default: 'start', md: 'center' }"
              >
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  Stack item 1
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
                  <div>Stack item 2a</div>
                  <div>Stack item 2b</div>
                </dt-stack>
                <dt-stack class="d-bgc-moderate-opaque d-bar8 d-p8">
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
