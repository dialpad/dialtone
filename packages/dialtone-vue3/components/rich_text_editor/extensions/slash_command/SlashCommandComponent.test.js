import { mount } from '@vue/test-utils';
import { Editor } from '@tiptap/vue-3';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import Paragraph from '@tiptap/extension-paragraph';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SlashCommandComponent from './SlashCommandComponent.vue';
import { SlashCommandPlugin } from './slash_command.js';

const baseProps = {
  node: {
    attrs: {
      command: 'test-command',
    },
  },
  editor: null,
  getPos: () => 0,
  updateAttributes: vi.fn(),
  deleteNode: vi.fn(),
};

let mockProps = {};
let mockOnSelectedCommand;

describe('SlashCommandComponent', () => {
  let wrapper;
  let editor;

  const updateWrapper = () => {
    wrapper = mount(SlashCommandComponent, {
      props: { ...baseProps, ...mockProps },
    });
  };

  beforeEach(() => {
    mockOnSelectedCommand = vi.fn();

    // Create a minimal TipTap editor instance for testing
    editor = new Editor({
      extensions: [
        Document,
        Text,
        Paragraph,
        SlashCommandPlugin.configure({
          onSelectedCommand: mockOnSelectedCommand,
          suggestion: {
            items: () => [
              { command: 'test', description: 'Test command' },
              { command: 'example', description: 'Example command' },
            ],
          },
        }),
      ],
      content: '',
    });

    // Set up the editor storage
    editor.storage['slash-commands'] = {
      onSelectedCommand: mockOnSelectedCommand,
    };

    baseProps.editor = editor;

    updateWrapper();
  });

  afterEach(() => {
    wrapper?.unmount();
    editor?.destroy();
    vi.clearAllMocks();
    mockProps = {};
  });

  describe('Component Creation', () => {
    it('should render the component with correct text', () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.text()).toBe('/test-command');
    });

    it('should emit selected-command event when created', () => {
      const emittedEvents = wrapper.emitted('selected-command');
      expect(emittedEvents[0][0]).toBe('test-command');
    });

    it('should call onSelectedCommand callback when available in editor storage', () => {
      expect(mockOnSelectedCommand).toHaveBeenCalledWith('test-command');
    });

    it('should handle missing onSelectedCommand callback gracefully', () => {
      // Remove the callback from editor storage
      editor.storage['slash-commands'] = {};

      // Update wrapper with modified editor
      updateWrapper();

      // Should not throw an error and should still emit the component event
      const emittedEvents = wrapper.emitted('selected-command');
      expect(emittedEvents[0][0]).toBe('test-command');
    });
  });
});
