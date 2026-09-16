import { mount } from '@vue/test-utils';
import DtItemLayout from './ItemLayout.vue';

const baseSlots = {};

let mockSlots = {};
let mockProps = {};

describe('DtItemLayout tests', () => {
  let wrapper;
  let leftWrapper;
  let rightWrapper;
  let subtitleWrapper;
  let bottomWrapper;

  const updateWrapper = () => {
    wrapper = mount(DtItemLayout, {
      props: { ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
    });

    leftWrapper = wrapper.find('[data-qa="dt-item-layout-left-wrapper"]');
    rightWrapper = wrapper.find('[data-qa="dt-item-layout-right-wrapper"]');
    subtitleWrapper = wrapper.find('[data-qa="dt-item-layout-subtitle-wrapper"]');
    bottomWrapper = wrapper.find('[data-qa="dt-item-layout-bottom-wrapper"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockSlots = {};
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    describe('When none of the slot contents are provided', () => {
      it('should not render the start slot wrapper', () => {
        expect(leftWrapper.exists()).toBe(false);
      });

      it('should not render the end slot wrapper', () => {
        expect(rightWrapper.exists()).toBe(false);
      });

      it('should not render the subtitle slot wrapper', () => {
        expect(subtitleWrapper.exists()).toBe(false);
      });

      it('should not render the bottom slot wrapper', () => {
        expect(bottomWrapper.exists()).toBe(false);
      });
    });

    describe('When start content is provided', () => {
      beforeEach(() => {
        mockSlots = { start: 'start content' };

        updateWrapper();
      });

      it('should render the slot wrapper', () => {
        expect(leftWrapper.exists()).toBe(true);
      });

      it('should render the provided content', () => {
        expect(wrapper.text().includes('start content')).toBe(true);
      });
    });

    describe('When end content is provided', () => {
      beforeEach(() => {
        mockSlots = { end: 'end content' };

        updateWrapper();
      });

      it('should render the slot wrapper', () => {
        expect(rightWrapper.exists()).toBe(true);
      });

      it('should render the provided content', () => {
        expect(wrapper.text().includes('end content')).toBe(true);
      });
    });

    describe('When subtitle content is provided', () => {
      beforeEach(() => {
        mockSlots = { subtitle: 'subtitle' };

        updateWrapper();
      });

      it('should render the slot wrapper', () => {
        expect(subtitleWrapper.exists()).toBe(true);
      });

      it('should render the provided content', () => {
        expect(wrapper.text().includes('subtitle')).toBe(true);
      });
    });

    describe('When bottom content is provided', () => {
      beforeEach(() => {
        mockSlots = { bottom: 'bottom' };

        updateWrapper();
      });

      it('should render the slot wrapper', () => {
        expect(bottomWrapper.exists()).toBe(true);
      });

      it('should render the provided content', () => {
        expect(wrapper.text().includes('bottom')).toBe(true);
      });
    });

    describe('When blockEnd content is provided', () => {
      beforeEach(() => {
        mockSlots = { blockEnd: 'block end content' };

        updateWrapper();
      });

      it('should render the slot wrapper', () => {
        expect(bottomWrapper.exists()).toBe(true);
      });

      it('should render the provided content', () => {
        expect(wrapper.text().includes('block end content')).toBe(true);
      });
    });

    describe('When blockEndClass prop is provided', () => {
      beforeEach(() => {
        mockSlots = { blockEnd: 'content' };
        mockProps = { blockEndClass: 'custom-class' };

        updateWrapper();
      });

      it('should apply the class to the bottom wrapper', () => {
        expect(bottomWrapper.classes()).toContain('custom-class');
      });
    });

    describe('When selected content is provided', () => {
      beforeEach(() => {
        mockSlots = { selected: 'selected' };

        updateWrapper();
      });

      it('should render the provided content', () => {
        expect(wrapper.text().includes('selected')).toBe(true);
      });
    });

    describe('When startClass prop is provided', () => {
      beforeEach(() => {
        mockSlots = { start: 'start content' };
        mockProps = { startClass: 'my-start-class' };

        updateWrapper();
      });

      it('should apply the class to the start wrapper', () => {
        expect(leftWrapper.classes()).toContain('my-start-class');
      });
    });

    describe('When endClass prop is provided', () => {
      beforeEach(() => {
        mockSlots = { end: 'end content' };
        mockProps = { endClass: 'my-end-class' };

        updateWrapper();
      });

      it('should apply the class to the end wrapper', () => {
        expect(rightWrapper.classes()).toContain('my-end-class');
      });
    });
  });

  describe('Backward Compatibility Tests', () => {
    describe('When left slot is provided (deprecated)', () => {
      beforeEach(() => {
        mockSlots = { left: 'left content' };

        updateWrapper();
      });

      it('should render the slot wrapper', () => {
        expect(leftWrapper.exists()).toBe(true);
      });

      it('should render the provided content', () => {
        expect(wrapper.text().includes('left content')).toBe(true);
      });
    });

    describe('When right slot is provided (deprecated)', () => {
      beforeEach(() => {
        mockSlots = { right: 'right content' };

        updateWrapper();
      });

      it('should render the slot wrapper', () => {
        expect(rightWrapper.exists()).toBe(true);
      });

      it('should render the provided content', () => {
        expect(wrapper.text().includes('right content')).toBe(true);
      });
    });

    describe('When leftClass prop is provided (deprecated)', () => {
      beforeEach(() => {
        mockSlots = { start: 'start content' };
        mockProps = { leftClass: 'my-left-class' };

        updateWrapper();
      });

      it('should apply the class to the start wrapper', () => {
        expect(leftWrapper.classes()).toContain('my-left-class');
      });
    });

    describe('When rightClass prop is provided (deprecated)', () => {
      beforeEach(() => {
        mockSlots = { end: 'end content' };
        mockProps = { rightClass: 'my-right-class' };

        updateWrapper();
      });

      it('should apply the class to the end wrapper', () => {
        expect(rightWrapper.classes()).toContain('my-right-class');
      });
    });

    describe('When leftClass overrides startClass (deprecated takes precedence)', () => {
      beforeEach(() => {
        mockSlots = { start: 'start content' };
        mockProps = { startClass: 'new-class', leftClass: 'old-class' };

        updateWrapper();
      });

      it('should use leftClass value', () => {
        expect(leftWrapper.classes()).toContain('old-class');
        expect(leftWrapper.classes()).not.toContain('new-class');
      });
    });

    describe('When bottom slot is provided (deprecated)', () => {
      beforeEach(() => {
        mockSlots = { bottom: 'bottom content' };

        updateWrapper();
      });

      it('should render the slot wrapper', () => {
        expect(bottomWrapper.exists()).toBe(true);
      });

      it('should render the provided content', () => {
        expect(wrapper.text().includes('bottom content')).toBe(true);
      });
    });

    describe('When bottomClass prop is provided (deprecated)', () => {
      beforeEach(() => {
        mockSlots = { bottom: 'content' };
        mockProps = { bottomClass: 'old-class' };

        updateWrapper();
      });

      it('should apply the class to the bottom wrapper', () => {
        expect(bottomWrapper.classes()).toContain('old-class');
      });
    });

    describe('When both blockEnd and bottom slots are provided', () => {
      beforeEach(() => {
        mockSlots = { blockEnd: 'new content', bottom: 'old content' };

        updateWrapper();
      });

      it('should render blockEnd content over bottom content', () => {
        expect(wrapper.text().includes('new content')).toBe(true);
        expect(wrapper.text().includes('old content')).toBe(false);
      });
    });

    describe('When bottomClass overrides blockEndClass (deprecated takes precedence)', () => {
      beforeEach(() => {
        mockSlots = { blockEnd: 'content' };
        mockProps = { blockEndClass: 'new-class', bottomClass: 'old-class' };

        updateWrapper();
      });

      it('should use bottomClass value', () => {
        expect(bottomWrapper.classes()).toContain('old-class');
        expect(bottomWrapper.classes()).not.toContain('new-class');
      });
    });

    describe('When rightClass overrides endClass (deprecated takes precedence)', () => {
      beforeEach(() => {
        mockSlots = { end: 'end content' };
        mockProps = { endClass: 'new-class', rightClass: 'old-class' };

        updateWrapper();
      });

      it('should use rightClass value', () => {
        expect(rightWrapper.classes()).toContain('old-class');
        expect(rightWrapper.classes()).not.toContain('new-class');
      });
    });

    describe('When both start and left slots are provided', () => {
      it('should render the new start content and suppress the deprecated left', () => {
        mockSlots = {
          start: 'new start',
          left: 'old left',
        };

        updateWrapper();

        leftWrapper = wrapper.find('[data-qa="dt-item-layout-left-wrapper"]');

        expect(leftWrapper.exists()).toBe(true);
        expect(leftWrapper.text()).toContain('new start');
        expect(leftWrapper.text()).not.toContain('old left');
      });
    });
  });
});
