import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import { DivParagraph } from './div';

const createEditor = () => new Editor({
  extensions: [Document, Text, DivParagraph],
  content: '',
});

const getJSON = (editor, html) => {
  editor.commands.setContent(html, false);
  return editor.getJSON();
};

describe('DivParagraph extension', () => {
  let editor;

  beforeEach(() => {
    editor = createEditor();
  });

  afterEach(() => {
    editor.destroy();
  });

  describe('parseHTML getAttrs', () => {
    it('should parse a div with only inline children as a paragraph', () => {
      const json = getJSON(editor, '<div><span>hello</span> world</div>');
      const paragraphs = json.content.filter(n => n.type === 'paragraph');

      expect(paragraphs).toHaveLength(1);
      expect(paragraphs[0].content.some(n => n.text?.includes('hello'))).toBe(true);
    });

    it('should parse a div with only text as a paragraph', () => {
      const json = getJSON(editor, '<div>plain text</div>');
      const paragraphs = json.content.filter(n => n.type === 'paragraph');

      expect(paragraphs).toHaveLength(1);
      expect(paragraphs[0].content[0].text).toBe('plain text');
    });

    it('should reject a div that contains a block-level child (nested div)', () => {
      const json = getJSON(editor, '<div><div>nested</div></div>');
      // The outer div should NOT become a paragraph itself.
      // ProseMirror should lift the inner div into its own paragraph.
      const paragraphs = json.content.filter(n => n.type === 'paragraph');

      expect(paragraphs).toHaveLength(1);
      expect(paragraphs[0].content[0].text).toBe('nested');
    });

    it('should reject a div that contains a <p> child', () => {
      const json = getJSON(editor, '<div><p>inside p</p></div>');
      const paragraphs = json.content.filter(n => n.type === 'paragraph');

      expect(paragraphs).toHaveLength(1);
      expect(paragraphs[0].content[0].text).toBe('inside p');
    });

    it('should reject a div that contains a <ul> child', () => {
      const json = getJSON(editor, '<div><ul><li>item</li></ul></div>');
      const paragraphs = json.content.filter(n => n.type === 'paragraph');

      // The outer div should be skipped (not become a paragraph) because
      // it contains a block-level <ul>. The text content is still parsed.
      // There should be no extra empty paragraph from the outer div.
      expect(paragraphs.every(p => p.content?.length > 0)).toBe(true);
    });

    it('should reject a div that contains an <h1> child', () => {
      const json = getJSON(editor, '<div><h1>heading</h1></div>');

      // The heading text should still be parsed, but the outer div
      // should not produce an extra empty paragraph wrapper.
      const allText = json.content
        .flatMap(n => n.content || [])
        .map(n => n.text)
        .filter(Boolean);

      expect(allText).toContain('heading');
    });

    it('should not produce extra empty paragraphs for structural divs', () => {
      const json = getJSON(editor, '<div><div>a</div><div>b</div></div>');
      const paragraphs = json.content.filter(n => n.type === 'paragraph');

      // Should get two paragraphs (from the two inner divs), not three
      expect(paragraphs).toHaveLength(2);
      expect(paragraphs[0].content[0].text).toBe('a');
      expect(paragraphs[1].content[0].text).toBe('b');
    });

    it('should parse multiple sibling inline-only divs as separate paragraphs', () => {
      const json = getJSON(editor, '<div>first</div><div>second</div>');
      const paragraphs = json.content.filter(n => n.type === 'paragraph');

      expect(paragraphs).toHaveLength(2);
      expect(paragraphs[0].content[0].text).toBe('first');
      expect(paragraphs[1].content[0].text).toBe('second');
    });
  });
});
