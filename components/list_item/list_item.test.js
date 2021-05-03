import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import ListItem from './list_item.vue';

describe('ListItem tests', function () {
  before(function () {
    this.mount = () => {
      this.wrapper = shallowMount(ListItem, {
        propsData: this.propsData,
      });
      this.vm = this.wrapper.vm;
    };
  });

  beforeEach(function () {
    this.propsData = {};
    this.mount();
  });

  it('exists', function () {
    assert.exists(this.wrapper, 'wrapper exists');
  });
});
