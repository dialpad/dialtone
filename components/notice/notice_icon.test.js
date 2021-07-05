import { assert } from 'chai';
import DtNoticeIcon from './notice_icon';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import IconCamera from '@dialpad/dialtone/lib/dist/vue/icons/IconCamera';

// Constants
const basePropsData = {
  kind: 'warning',
};

const baseSlotsData = {};

describe('DtNoticeIcon tests', function () {
  let wrapper;
  let cameraIcon;
  let baseIcon;
  let warningIcon;
  let propsData;
  let slotsData;

  const _setWrappers = () => {
    wrapper = shallowMount(DtNoticeIcon, {
      propsData: propsData,
      slots: slotsData,
      localVue: this.localVue,
    });
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    cameraIcon = wrapper.findComponent(IconCamera);
    baseIcon = wrapper.find('iconlightbulb-stub');
    warningIcon = wrapper.find('iconwarning-stub');
  };

  before(function () {
    this.localVue = createLocalVue();
  });

  beforeEach(function () {
    propsData = basePropsData;
    slotsData = baseSlotsData;
    _setWrappers();
  });

  describe('Presentation Tests', function () {
    describe('When rendered with default content', function () {
      it('Should render notice icon component', function () {
        assert.isTrue(wrapper.exists());
      });

      it('Should render an icon', function () {
        assert.isTrue(warningIcon.exists());
      });

      it('Should have aria-hidden set to true', function () {
        assert.strictEqual(wrapper.attributes('aria-hidden'), 'true');
      });
    });

    describe('When kind is base', function () {
      beforeEach(async function () {
        await wrapper.setProps({ kind: 'base' });
        _setChildWrappers();
      });

      it('Should render base icon', function () {
        assert.isTrue(baseIcon.exists());
      });
    });

    describe('When custom icon is passed into the slot', function () {
      beforeEach(async function () {
        slotsData = {
          default: IconCamera,
        };
        _setWrappers();
      });

      it('Should render correctly', async function () {
        assert.isTrue(cameraIcon.exists());
      });
    });
  });
});
