import { act, render, type RenderResult } from '@testing-library/react';
import type { Editor, NodeConfig } from '@tiptap/core';
import { findAllVariables, type EditorNode } from '../../../../tests/helpers/node_traversal';
import { DtRichTextEditor, type DtRichTextEditorHandle, type DtRichTextEditorProps } from '../../RichTextEditor';

// Wrappers
let result: RenderResult;
let handle: DtRichTextEditorHandle;

// Test Environment
let props: Partial<DtRichTextEditorProps>;

// Constants
const baseProps: Partial<DtRichTextEditorProps> = {
  value: 'init',
  inputAriaLabel: 'aria-label text',
  link: true,
  inputClass: 'qa-editor',
  showLinkBubbleMenu: false,
  allowVariable: true,
  variableItems: [
    { id: 'user_name', placeholder: 'User Name' },
    { id: 'company_name', placeholder: 'Company Name' },
    { id: 'ticket_id', placeholder: 'Ticket ID' },
    { id: 'date', placeholder: 'Date' },
  ],
};

const getClientRectsMock = vi.fn(() => [{}] as unknown as DOMRectList);
const getBoundingClientRect = vi.fn(() => ({}) as unknown as DOMRect);
const scrollByMock = vi.fn();

// Helpers
const element = () => (
  <DtRichTextEditor
    ref={(instance) => {
      if (instance) handle = instance;
    }}
    inputAriaLabel="aria-label text"
    {...props}
  />
);

const getEditor = (): Editor => handle.editor!;

const _getVariableNodesFromJSON = (): EditorNode[] => {
  const json = getEditor().getJSON();
  return findAllVariables(json.content as EditorNode[] | undefined);
};

const _insertVariable = (id: string | null, altText = '') => {
  // The command takes `id?: string | null` here as in Vue, where null is a valid id.
  return getEditor().commands.insertVariable({ id, altText });
};

const _getEditorHTML = () => {
  return getEditor().getHTML();
};

const _mountWrapper = () => {
  result = render(element());
};

const flush = async () => {
  await act(async () => {});
};

const setProps = async (newProps: Partial<DtRichTextEditorProps>) => {
  props = { ...props, ...newProps };
  await act(async () => {
    result.rerender(element());
  });
};

describe('DtRichTextEditor Variable Extension tests', () => {
  // Test Setup
  beforeAll(() => {
    Range.prototype.getClientRects = getClientRectsMock;
    Range.prototype.getBoundingClientRect = getBoundingClientRect;
    globalThis.scrollBy = scrollByMock;
  });

  beforeEach(async () => {
    props = { ...baseProps };
    _mountWrapper();
    await flush();
  });

  // Test Teardown
  afterEach(() => {
    result.unmount();
  });

  describe('Functionality Tests', () => {
    describe('Variable Insertion', () => {
      it('should insert a variable with valid id', async () => {
        await act(async () => {
          _insertVariable('user_name');
        });

        const variables = _getVariableNodesFromJSON();
        expect(variables.length).toBe(1);
        expect(variables[0].attrs?.id).toBe('user_name');
      });

      it('should insert a variable with id and altText', async () => {
        await act(async () => {
          _insertVariable('company_name', 'Acme Corp');
        });

        const variables = _getVariableNodesFromJSON();
        expect(variables.length).toBe(1);
        expect(variables[0].attrs?.id).toBe('company_name');
        expect(variables[0].attrs?.altText).toBe('Acme Corp');
      });

      it('should insert multiple variables', async () => {
        await act(async () => {
          _insertVariable('user_name', 'John Doe');
          _insertVariable('company_name', 'Acme Corp');
          _insertVariable('ticket_id', '#12345');
        });

        const variables = _getVariableNodesFromJSON();
        expect(variables.length).toBe(3);
        expect(variables[0].attrs?.id).toBe('user_name');
        expect(variables[1].attrs?.id).toBe('company_name');
        expect(variables[2].attrs?.id).toBe('ticket_id');
      });

      it('should insert variable with null id when id not provided', async () => {
        await act(async () => {
          _insertVariable(null, 'Fallback text');
        });

        const variables = _getVariableNodesFromJSON();
        expect(variables.length).toBe(1);
        expect(variables[0].attrs?.id).toBe(null);
        expect(variables[0].attrs?.altText).toBe('Fallback text');
      });
    });

    describe('Variable Attributes', () => {
      it('should have default altText as empty string', async () => {
        await act(async () => {
          _insertVariable('date');
        });

        const variables = _getVariableNodesFromJSON();
        expect(variables[0].attrs?.altText).toBe('');
      });

      it('should preserve altText when set', async () => {
        const altText = 'Today is Monday';
        await act(async () => {
          _insertVariable('date', altText);
        });

        const variables = _getVariableNodesFromJSON();
        expect(variables[0].attrs?.altText).toBe(altText);
      });

      it('should update variable attributes', async () => {
        await act(async () => {
          _insertVariable('user_name', 'Initial Name');
        });

        // Get the variable node position
        const doc = getEditor().state.doc;
        let variablePos = -1;
        doc.descendants((node, pos) => {
          if (node.type.name === 'variable') {
            variablePos = pos;
            return false; // Stop searching
          }
        });

        // Select the variable node and update its attributes
        if (variablePos !== -1) {
          await act(async () => {
            getEditor()
              .chain()
              .focus()
              .setNodeSelection(variablePos)
              .updateAttributes('variable', {
                altText: 'Updated Name',
              })
              .run();
          });
        }

        const variables = _getVariableNodesFromJSON();
        expect(variables[0].attrs?.altText).toBe('Updated Name');
      });
    });

    describe('HTML Rendering', () => {
      it('should render variable as HTML with data attributes', async () => {
        await act(async () => {
          _insertVariable('user_name', 'John Smith');
        });

        const html = _getEditorHTML();
        expect(html).toContain('data-variable-id="user_name"');
        expect(html).toContain('data-alt-text="John Smith"');
      });

      it('should not render data attributes for null values', async () => {
        await act(async () => {
          _insertVariable(null, '');
        });

        const html = _getEditorHTML();
        // The variable tag should exist but without data attributes for null/empty values
        expect(html).toContain('<variable');
        expect(html).not.toContain('data-variable-id=""');
      });

      it('should render multiple variables correctly', async () => {
        await act(async () => {
          _insertVariable('user_name', 'Alice');
          getEditor().commands.insertContent(' works at ');
          _insertVariable('company_name', 'Tech Inc');
        });

        const html = _getEditorHTML();
        expect(html).toContain('data-variable-id="user_name"');
        expect(html).toContain('data-alt-text="Alice"');
        expect(html).toContain('data-variable-id="company_name"');
        expect(html).toContain('data-alt-text="Tech Inc"');
      });
    });

    describe('Variable Configuration', () => {
      it('should not allow variables when allowVariable is false', async () => {
        result.unmount();

        props = {
          ...baseProps,
          allowVariable: false,
        };
        _mountWrapper();
        await flush();

        // Check that the insertVariable command doesn't exist
        const insertVariable: unknown = getEditor().commands.insertVariable;
        expect(insertVariable).toBeUndefined();
      });

      it('should access variableItems from extension options', async () => {
        await act(async () => {
          _insertVariable('user_name');
        });

        const variableExtension = getEditor().extensionManager.extensions.find(
          ext => ext.name === 'variable',
        );

        expect(variableExtension).toBeDefined();
        expect(variableExtension?.options.variableItems).toEqual(baseProps.variableItems);
      });

      it('should handle empty variableItems array', async () => {
        result.unmount();

        props = {
          ...baseProps,
          variableItems: [],
        };
        _mountWrapper();
        await flush();

        // Should still be able to insert variables even with empty items
        await act(async () => {
          _insertVariable('custom_id', 'Custom Text');
        });

        const variables = _getVariableNodesFromJSON();
        expect(variables.length).toBe(1);
        expect(variables[0].attrs?.id).toBe('custom_id');
      });
    });

    describe('parseHTML and renderHTML', () => {
      it('should parse variable from HTML', async () => {
        const htmlContent = '<p><variable data-variable-id="user_name" data-alt-text="Jane Doe"></variable> is here</p>';
        await setProps({ value: htmlContent });

        const variables = _getVariableNodesFromJSON();
        expect(variables.length).toBe(1);
        expect(variables[0].attrs?.id).toBe('user_name');
        expect(variables[0].attrs?.altText).toBe('Jane Doe');
      });

      it('should parse multiple variables from HTML', async () => {
        const htmlContent = `
          <p>
            <variable data-variable-id="user_name" data-alt-text="Bob"></variable>
            opened ticket
            <variable data-variable-id="ticket_id" data-alt-text="#999"></variable>
            on
            <variable data-variable-id="date" data-alt-text="2024-01-01"></variable>
          </p>
        `;
        await setProps({ value: htmlContent });

        const variables = _getVariableNodesFromJSON();
        expect(variables.length).toBe(3);
        expect(variables[0].attrs?.id).toBe('user_name');
        expect(variables[1].attrs?.id).toBe('ticket_id');
        expect(variables[2].attrs?.id).toBe('date');
      });
    });

    describe('renderText', () => {
      it('should render altText as plain text', async () => {
        await act(async () => {
          _insertVariable('user_name', 'John Doe');
        });

        const text = getEditor().getText();
        expect(text).toContain('John Doe');
      });

      it('should render empty string when altText is not provided', async () => {
        await act(async () => {
          _insertVariable('user_name');
        });

        const text = getEditor().getText();
        // The text should be 'init' (initial value) since variable has no altText
        expect(text).toBe('init');
      });

      it('should render multiple variables with their altText', async () => {
        await act(async () => {
          // Clear initial content
          getEditor().commands.clearContent();

          _insertVariable('user_name', 'Alice');
          getEditor().commands.insertContent(' from ');
          _insertVariable('company_name', 'TechCorp');
        });

        const text = getEditor().getText();
        expect(text).toBe('Alice from TechCorp');
      });
    });

    describe('Variable as Inline Node', () => {
      it('should be inline and atomic', async () => {
        const variableExtension = getEditor().extensionManager.extensions.find(
          ext => ext.name === 'variable',
        );

        const nodeSpec = variableExtension?.config as NodeConfig | undefined;
        expect(nodeSpec?.inline).toBe(true);
        expect(nodeSpec?.atom).toBe(true);
        expect(nodeSpec?.selectable).toBe(true);
        expect(nodeSpec?.group).toBe('inline');
      });

      it('should insert variable inline with text', async () => {
        await act(async () => {
          getEditor().commands.clearContent();
          getEditor().commands.insertContent('Hello ');
          _insertVariable('user_name', 'World');
          getEditor().commands.insertContent('!');
        });

        const text = getEditor().getText();
        expect(text).toBe('Hello World!');

        const variables = _getVariableNodesFromJSON();
        expect(variables.length).toBe(1);
      });
    });
  });
});
