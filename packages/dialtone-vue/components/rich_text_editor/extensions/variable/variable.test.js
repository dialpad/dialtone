import { mount } from '@vue/test-utils';
import { DtRichTextEditor } from '@/components/rich_text_editor';
import { EditorContent } from '@tiptap/vue-3';
import { findAllVariables } from '../../../../common/test_utils/node_traversal';

// Wrappers
let wrapper;
let editorEl;

// Test Environment
let propsData;

// Constants
const baseProps = {
  modelValue: 'init',
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

const getClientRectsMock = vi.fn(() => [{}]);
const getBoundingClientRect = vi.fn(() => ({}));
const scrollByMock = vi.fn();

// Helpers
const _setChildWrappers = () => {
  editorEl = document.getElementsByClassName('qa-editor')[0];
};

const _getVariableNodesFromJSON = () => {
  const json = wrapper.vm.editor.getJSON();
  return findAllVariables(json.content);
};

const _insertVariable = (id, altText = '') => {
  return wrapper.vm.editor.commands.insertVariable({ id, altText });
};

const _getEditorHTML = () => {
  return wrapper.vm.editor.getHTML();
};

const _mountWrapper = () => {
  editorEl?.remove();
  wrapper = mount(DtRichTextEditor, {
    propsData,
    components: { EditorContent },
    attachTo: document.body,
  });
};

describe('DtRichTextEditor Variable Extension tests', () => {
  // Test Setup
  beforeAll(() => {
    global.Range.prototype.getClientRects = getClientRectsMock;
    global.Range.prototype.getBoundingClientRect = getBoundingClientRect;
    global.scrollBy = scrollByMock;
  });

  beforeEach(async () => {
    propsData = baseProps;
    _mountWrapper();
    await wrapper.vm.$nextTick();
    _setChildWrappers();
  });

  // Test Teardown
  afterEach(() => {
    propsData = baseProps;
    wrapper.unmount();
  });

  describe('Functionality Tests', () => {
    describe('Variable Insertion', () => {
      it('should insert a variable with valid id', async () => {
        _insertVariable('user_name');
        await wrapper.vm.$nextTick();

        const variables = _getVariableNodesFromJSON();
        expect(variables.length).toBe(1);
        expect(variables[0].attrs.id).toBe('user_name');
      });

      it('should insert a variable with id and altText', async () => {
        _insertVariable('company_name', 'Acme Corp');
        await wrapper.vm.$nextTick();

        const variables = _getVariableNodesFromJSON();
        expect(variables.length).toBe(1);
        expect(variables[0].attrs.id).toBe('company_name');
        expect(variables[0].attrs.altText).toBe('Acme Corp');
      });

      it('should insert multiple variables', async () => {
        _insertVariable('user_name', 'John Doe');
        _insertVariable('company_name', 'Acme Corp');
        _insertVariable('ticket_id', '#12345');
        await wrapper.vm.$nextTick();

        const variables = _getVariableNodesFromJSON();
        expect(variables.length).toBe(3);
        expect(variables[0].attrs.id).toBe('user_name');
        expect(variables[1].attrs.id).toBe('company_name');
        expect(variables[2].attrs.id).toBe('ticket_id');
      });

      it('should insert variable with null id when id not provided', async () => {
        _insertVariable(null, 'Fallback text');
        await wrapper.vm.$nextTick();

        const variables = _getVariableNodesFromJSON();
        expect(variables.length).toBe(1);
        expect(variables[0].attrs.id).toBe(null);
        expect(variables[0].attrs.altText).toBe('Fallback text');
      });
    });

    describe('Variable Attributes', () => {
      it('should have default altText as empty string', async () => {
        _insertVariable('date');
        await wrapper.vm.$nextTick();

        const variables = _getVariableNodesFromJSON();
        expect(variables[0].attrs.altText).toBe('');
      });

      it('should preserve altText when set', async () => {
        const altText = 'Today is Monday';
        _insertVariable('date', altText);
        await wrapper.vm.$nextTick();

        const variables = _getVariableNodesFromJSON();
        expect(variables[0].attrs.altText).toBe(altText);
      });

      it('should update variable attributes', async () => {
        _insertVariable('user_name', 'Initial Name');
        await wrapper.vm.$nextTick();

        // Get the variable node position
        const doc = wrapper.vm.editor.state.doc;
        let variablePos = -1;
        doc.descendants((node, pos) => {
          if (node.type.name === 'variable') {
            variablePos = pos;
            return false; // Stop searching
          }
        });

        // Select the variable node and update its attributes
        if (variablePos !== -1) {
          wrapper.vm.editor
            .chain()
            .focus()
            .setNodeSelection(variablePos)
            .updateAttributes('variable', {
              altText: 'Updated Name',
            })
            .run();
          await wrapper.vm.$nextTick();
        }

        const variables = _getVariableNodesFromJSON();
        expect(variables[0].attrs.altText).toBe('Updated Name');
      });
    });

    describe('HTML Rendering', () => {
      it('should render variable as HTML with data attributes', async () => {
        _insertVariable('user_name', 'John Smith');
        await wrapper.vm.$nextTick();

        const html = _getEditorHTML();
        expect(html).toContain('data-variable-id="user_name"');
        expect(html).toContain('data-alt-text="John Smith"');
      });

      it('should not render data attributes for null values', async () => {
        _insertVariable(null, '');
        await wrapper.vm.$nextTick();

        const html = _getEditorHTML();
        // The variable tag should exist but without data attributes for null/empty values
        expect(html).toContain('<variable');
        expect(html).not.toContain('data-variable-id=""');
      });

      it('should render multiple variables correctly', async () => {
        _insertVariable('user_name', 'Alice');
        wrapper.vm.editor.commands.insertContent(' works at ');
        _insertVariable('company_name', 'Tech Inc');
        await wrapper.vm.$nextTick();

        const html = _getEditorHTML();
        expect(html).toContain('data-variable-id="user_name"');
        expect(html).toContain('data-alt-text="Alice"');
        expect(html).toContain('data-variable-id="company_name"');
        expect(html).toContain('data-alt-text="Tech Inc"');
      });
    });

    describe('Variable Configuration', () => {
      it('should not allow variables when allowVariable is false', async () => {
        await wrapper.unmount();

        propsData = {
          ...baseProps,
          allowVariable: false,
        };
        _mountWrapper();
        await wrapper.vm.$nextTick();

        // Check that the insertVariable command doesn't exist
        const result = wrapper.vm.editor.commands.insertVariable;
        expect(result).toBeUndefined();
      });

      it('should access variableItems from extension options', async () => {
        _insertVariable('user_name');
        await wrapper.vm.$nextTick();

        const variableExtension = wrapper.vm.editor.extensionManager.extensions.find(
          ext => ext.name === 'variable',
        );

        expect(variableExtension).toBeDefined();
        expect(variableExtension.options.variableItems).toEqual(baseProps.variableItems);
      });

      it('should handle empty variableItems array', async () => {
        await wrapper.unmount();

        propsData = {
          ...baseProps,
          variableItems: [],
        };
        _mountWrapper();
        await wrapper.vm.$nextTick();

        // Should still be able to insert variables even with empty items
        _insertVariable('custom_id', 'Custom Text');
        await wrapper.vm.$nextTick();

        const variables = _getVariableNodesFromJSON();
        expect(variables.length).toBe(1);
        expect(variables[0].attrs.id).toBe('custom_id');
      });
    });

    describe('parseHTML and renderHTML', () => {
      it('should parse variable from HTML', async () => {
        const htmlContent = '<p><variable data-variable-id="user_name" data-alt-text="Jane Doe"></variable> is here</p>';
        await wrapper.setProps({ modelValue: htmlContent });
        await wrapper.vm.$nextTick();

        const variables = _getVariableNodesFromJSON();
        expect(variables.length).toBe(1);
        expect(variables[0].attrs.id).toBe('user_name');
        expect(variables[0].attrs.altText).toBe('Jane Doe');
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
        await wrapper.setProps({ modelValue: htmlContent });
        await wrapper.vm.$nextTick();

        const variables = _getVariableNodesFromJSON();
        expect(variables.length).toBe(3);
        expect(variables[0].attrs.id).toBe('user_name');
        expect(variables[1].attrs.id).toBe('ticket_id');
        expect(variables[2].attrs.id).toBe('date');
      });
    });

    describe('renderText', () => {
      it('should render altText as plain text', async () => {
        _insertVariable('user_name', 'John Doe');
        await wrapper.vm.$nextTick();

        const text = wrapper.vm.editor.getText();
        expect(text).toContain('John Doe');
      });

      it('should render empty string when altText is not provided', async () => {
        _insertVariable('user_name');
        await wrapper.vm.$nextTick();

        const text = wrapper.vm.editor.getText();
        // The text should be 'init' (initial value) since variable has no altText
        expect(text).toBe('init');
      });

      it('should render multiple variables with their altText', async () => {
        // Clear initial content
        wrapper.vm.editor.commands.clearContent();

        _insertVariable('user_name', 'Alice');
        wrapper.vm.editor.commands.insertContent(' from ');
        _insertVariable('company_name', 'TechCorp');
        await wrapper.vm.$nextTick();

        const text = wrapper.vm.editor.getText();
        expect(text).toBe('Alice from TechCorp');
      });
    });

    describe('Variable as Inline Node', () => {
      it('should be inline and atomic', async () => {
        const variableExtension = wrapper.vm.editor.extensionManager.extensions.find(
          ext => ext.name === 'variable',
        );

        const nodeSpec = variableExtension.config;
        expect(nodeSpec.inline).toBe(true);
        expect(nodeSpec.atom).toBe(true);
        expect(nodeSpec.selectable).toBe(true);
        expect(nodeSpec.group).toBe('inline');
      });

      it('should insert variable inline with text', async () => {
        wrapper.vm.editor.commands.clearContent();
        wrapper.vm.editor.commands.insertContent('Hello ');
        _insertVariable('user_name', 'World');
        wrapper.vm.editor.commands.insertContent('!');
        await wrapper.vm.$nextTick();

        const text = wrapper.vm.editor.getText();
        expect(text).toBe('Hello World!');

        const variables = _getVariableNodesFromJSON();
        expect(variables.length).toBe(1);
      });
    });
  });
});
