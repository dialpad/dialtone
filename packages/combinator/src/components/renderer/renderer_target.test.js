import DtcRendererTarget from './renderer_target.vue';

import { expect } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { mount } from '@vue/test-utils';

const RootClassFixture = defineComponent({
  name: 'RootClassFixture',
  template: '<div class="fixture-root" data-qa="fixture-root"><slot /></div>',
});

describe('renderer_target.vue test', function () {
  it('Should pass native class bindings to the rendered component root', async function () {
    const wrapper = mount(DtcRendererTarget, {
      attachTo: document.body,
      props: {
        component: RootClassFixture,
        bindings: {
          class: 'd-w50p',
        },
        events: [],
        disabledMembers: new Set(),
      },
    });

    await nextTick();
    await nextTick();

    expect(wrapper.find('[data-qa="fixture-root"]').classes()).toContain('d-w50p');

    wrapper.unmount();
  });
});
