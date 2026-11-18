import { render, type RenderResult } from '@testing-library/react';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import Paragraph from '@tiptap/extension-paragraph';
import type { ReactNodeViewProps } from '@tiptap/react';
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import SlashCommandComponent, { type SlashCommandsStorage } from './SlashCommandComponent';
import { SlashCommandPlugin } from './SlashCommand';

// The node view props SlashCommandComponent reads: the node's command and the editor.
const nodeViewProps = (editor: Editor): ReactNodeViewProps => ({
  node: {
    attrs: {
      command: 'test-command',
    },
  },
  editor,
  getPos: () => 0,
  updateAttributes: vi.fn(),
  deleteNode: vi.fn(),
}) as unknown as ReactNodeViewProps;

let mockProps: Partial<ReactNodeViewProps> = {};
let mockOnSelectedCommand: Mock<(command: string) => void>;

describe('SlashCommandComponent', () => {
  let wrapper: RenderResult;
  let editor: Editor;

  const updateWrapper = () => {
    wrapper = render(<SlashCommandComponent {...nodeViewProps(editor)} {...mockProps} />);
  };

  beforeEach(() => {
    mockOnSelectedCommand = vi.fn<(command: string) => void>();

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
    (editor.storage as unknown as Record<string, SlashCommandsStorage>)['slash-commands'] = {
      onSelectedCommand: mockOnSelectedCommand,
    };

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
      expect(wrapper.container.firstElementChild).not.toBeNull();
      expect(wrapper.container.textContent).toBe('/test-command');
    });

    // Vue's node view emits `selected-command` itself, which nothing listens to and React has no equivalent of: the
    // command it reports is what the editor's storage callback receives.
    it('should emit selected-command event when created', () => {
      expect(mockOnSelectedCommand).toHaveBeenCalledTimes(1);
      expect(mockOnSelectedCommand.mock.calls[0][0]).toBe('test-command');
    });

    it('should call onSelectedCommand callback when available in editor storage', () => {
      expect(mockOnSelectedCommand).toHaveBeenCalledWith('test-command');
    });

    it('should handle missing onSelectedCommand callback gracefully', () => {
      wrapper.unmount();
      mockOnSelectedCommand.mockClear();

      // Remove the callback from editor storage
      (editor.storage as unknown as Record<string, Partial<SlashCommandsStorage>>)['slash-commands'] = {};

      // Update wrapper with modified editor
      // Should not throw an error and should still render the command (there is no node view event to check)
      expect(() => updateWrapper()).not.toThrow();
      expect(wrapper.container.textContent).toBe('/test-command');
      expect(mockOnSelectedCommand).not.toHaveBeenCalled();
    });
  });
});
