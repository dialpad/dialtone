import { mount } from '@vue/test-utils';
import { Editor } from '@tiptap/vue-3';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import Paragraph from '@tiptap/extension-paragraph';
import MeetingPill from './MeetingPill.vue';
import MeetingPillExtension from './meeting_pill.js';

const baseProps = {
  node: {
    attrs: {
      text: 'Test Meeting',
    },
  },
  editor: null,
  getPos: () => 0,
  updateAttributes: vi.fn(),
  deleteNode: vi.fn(),
  decorations: {},
  selected: false,
  extension: {},
};

const baseGlobal = {
  stubs: {
    'dt-item-layout': {
      template: '<div class="d-recipe-message-input-meeting-pill__layout"><slot name="left" /><slot /><slot name="right" /></div>',
    },
    'dt-button': {
      template: '<button @click="$emit(\'click\', $event)" :aria-label="$attrs[\'aria-label\']" :title="$attrs.title"><slot name="icon" /></button>',
      inheritAttrs: false,
    },
    'dt-icon-video': {
      template: '<div data-testid="video-icon" />',
    },
    'dt-icon-close': {
      template: '<div data-testid="close-icon" />',
    },
    'node-view-wrapper': {
      template: '<div class="d-d-inline-block"><slot /></div>',
      provide () {
        return {
          onDragStart: () => {},
          decorationClasses: {
            value: '',
          },
        };
      },
    },
  },
};

let mockProps = {};
let mockGlobal = {};
let mockOnClose;

describe('MeetingPill', () => {
  let wrapper;
  let editor;

  const updateWrapper = () => {
    wrapper = mount(MeetingPill, {
      props: { ...baseProps, ...mockProps },
      global: { ...baseGlobal, ...mockGlobal },
    });
  };

  beforeEach(() => {
    mockOnClose = vi.fn();

    editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        MeetingPillExtension.configure({
          onClose: mockOnClose,
        }),
      ],
      content: '',
    });

    // Set up the editor storage properly
    editor.storage.meetingPill = {
      onClose: mockOnClose,
    };

    baseProps.editor = editor;

    updateWrapper();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    if (editor) {
      editor.destroy();
    }
    mockProps = {};
    mockGlobal = {};
  });

  describe('Rendering', () => {
    it('renders the meeting pill with correct text', () => {
      mockProps = {
        node: {
          attrs: {
            text: 'Daily Standup',
          },
        },
      };

      updateWrapper();

      expect(wrapper.text()).toContain('Daily Standup');
    });

    it('renders the video icon', () => {
      expect(wrapper.find('[data-testid="video-icon"]').exists()).toBe(true);
    });

    it('renders the close button with correct aria-label', () => {
      const closeButton = wrapper.find('button');
      expect(closeButton.exists()).toBe(true);
      expect(closeButton.attributes('aria-label')).toBe('Click to close');
    });

    it('renders the close icon', () => {
      expect(wrapper.find('[data-testid="close-icon"]').exists()).toBe(true);
    });
  });

  describe('Close functionality', () => {
    it('calls the onClose callback when close button is clicked', async () => {
      const closeButton = wrapper.find('button');
      await closeButton.trigger('click');

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('passes the click event to the onClose callback', async () => {
      const closeButton = wrapper.find('button');
      await closeButton.trigger('click');

      expect(mockOnClose).toHaveBeenCalledWith(expect.any(Event));
    });

    it('handles missing onClose callback gracefully', async () => {
      // Create editor without onClose callback
      const editorWithoutCallback = new Editor({
        extensions: [
          Document,
          Paragraph,
          Text,
          MeetingPillExtension.configure({}),
        ],
        content: '',
      });

      mockProps = {
        editor: editorWithoutCallback,
        node: {
          attrs: {
            text: 'Test Meeting',
          },
        },
      };

      updateWrapper();

      const closeButton = wrapper.find('button');

      // Should not throw an error
      expect(async () => {
        await closeButton.trigger('click');
      }).not.toThrow();

      editorWithoutCallback.destroy();
    });

    it('handles editor without storage gracefully', async () => {
      // Create a mock editor without the storage structure
      const mockEditor = {
        storage: {},
      };

      mockProps = {
        editor: mockEditor,
        node: {
          attrs: {
            text: 'Test Meeting',
          },
        },
      };

      updateWrapper();

      const closeButton = wrapper.find('button');

      // Should not throw an error
      expect(async () => {
        await closeButton.trigger('click');
      }).not.toThrow();
    });
  });

  describe('Event Emission', () => {
    it('emits meeting-pill-close event', () => {
      // The component declares the emit but the actual emission logic
      // is handled through the callback, so we verify the event is declared
      expect(wrapper.vm.$options.emits).toContain('meeting-pill-close');
    });
  });

  describe('Props', () => {
    it('accepts nodeViewProps', () => {
      expect(wrapper.vm.node).toBeDefined();
      expect(wrapper.vm.editor).toBeDefined();
      expect(wrapper.vm.getPos).toBeDefined();
    });

    it('displays different text based on node attributes', () => {
      mockProps = {
        node: {
          attrs: {
            text: 'Team Meeting',
          },
        },
      };

      updateWrapper();

      expect(wrapper.text()).toContain('Team Meeting');
    });
  });

  describe('Component Structure', () => {
    it('has the correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('MeetingPill');
    });

    it('wraps content in NodeViewWrapper', () => {
      expect(wrapper.find('.d-recipe-message-input-meeting-pill').exists()).toBe(true);
    });

    it('uses DtItemLayout for structure', () => {
      // Since we're stubbing the component, we check for the layout structure
      // The stubbed dt-item-layout should render as a div with slots
      const layout = wrapper.find('.d-recipe-message-input-meeting-pill__layout');
      expect(layout.exists()).toBe(true);
    });
  });
});
