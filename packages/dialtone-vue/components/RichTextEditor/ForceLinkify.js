import { isAllowedUri } from '@tiptap/extension-link';
import { tokenize } from 'linkifyjs';

/**
 * Mirrors Tiptap's own autolink validation (helpers/autolink.ts): a "word" only
 * counts as a link if it tokenizes to a single link token, or a link token
 * wrapped in matching brackets/parens. Rejects malformed-looking matches, e.g.
 * linkifyjs's find() alone would match only "www.google.com" out of the word
 * "www.google.comx", which isn't actually a valid link.
 */
export function isValidLinkStructure (tokens) {
  if (tokens.length === 1) {
    return tokens[0].isLink;
  }

  if (tokens.length === 3 && tokens[1].isLink) {
    return ['()', '[]'].includes(tokens[0].value + tokens[2].value);
  }

  return false;
}

/**
 * Whether every character in [from, to) already carries a link mark, of any
 * href. Used to tell "already fully linked, nothing to do" apart from "no
 * mark, or only part of this match is marked" (e.g. someone extends an
 * already-linked "example.co" into "example.com" by typing directly after
 * it, with the link mark, being non-inclusive, only covering the original
 * "example.co") -- the latter should be (re)marked across the full range so
 * the extended text gets linked and the href gets updated. Deliberately
 * ignores href value: an already fully-linked range is left untouched even
 * if its explicit href (e.g. https://) differs from what re-tokenizing its
 * bare text would produce by default, since that doesn't mean it's wrong.
 */
export function rangeFullyLinked (doc, from, to, markType) {
  let fullyLinked = true;

  doc.nodesBetween(from, to, node => {
    if (!node.isText) {
      return;
    }

    if (!markType.isInSet(node.marks)) {
      fullyLinked = false;
    }
  });

  return fullyLinked;
}

/**
 * Validate and, if warranted, mark a single whitespace-delimited word as a
 * link. Returns whether a mark was added or corrected.
 */
function linkifyWord (word, from, positions, { doc, tr, markType, codeMarkType, linkOptions }) {
  const { protocols, defaultProtocol, isAllowedUri: isLinkAllowed, shouldAutoLink } = linkOptions;
  const tokens = tokenize(word).map(token => token.toObject(defaultProtocol));

  if (!isValidLinkStructure(tokens)) {
    return false;
  }

  const linkToken = tokens.find(token => token.isLink);

  if (
    !isLinkAllowed(linkToken.value, {
      defaultValidate: href => !!isAllowedUri(href, protocols),
      protocols,
      defaultProtocol,
    }) ||
    !shouldAutoLink(linkToken.value)
  ) {
    return false;
  }

  const rangeFrom = positions[from + linkToken.start];
  const rangeTo = positions[from + linkToken.end - 1] + 1;

  if (codeMarkType && doc.rangeHasMark(rangeFrom, rangeTo, codeMarkType)) {
    return false;
  }

  if (rangeFullyLinked(doc, rangeFrom, rangeTo, markType)) {
    return false;
  }

  tr.removeMark(rangeFrom, rangeTo, markType);
  tr.addMark(rangeFrom, rangeTo, markType.create({ href: linkToken.href }));

  return true;
}

/**
 * TipTap's built-in link autolink plugin only commits a link mark once a
 * trailing boundary character (space, newline, etc.) is typed after the URL
 * (ueberdosis/tiptap#3225), so a URL sitting at the very end of the input never
 * gets linkified on its own (ueberdosis/tiptap#783). There's no built-in
 * "flush" command for this, so reuse linkifyjs -- the same link-detection
 * engine autolink and the paste rule already use internally -- to mark any
 * URL/email matches autolink hasn't caught yet, honoring whatever
 * protocols/defaultProtocol/isAllowedUri/shouldAutoLink the link extension was
 * configured with. Dialtone has no generic "send" event to hook, so this is
 * not called automatically -- consumers should call it themselves (e.g. right
 * before reading the editor's content to send it) to catch a trailing URL
 * with nothing typed after it.
 */
export function forceLinkifyPendingText (editor) {
  const markType = editor.state.schema.marks.link;
  const codeMarkType = editor.state.schema.marks.code;
  const linkExtension = editor.extensionManager.extensions.find(
    extension => extension.name === 'link',
  );

  if (!markType || !linkExtension) {
    return;
  }

  const linkOptions = linkExtension.options;
  const { doc } = editor.state;
  const tr = editor.state.tr;
  const context = { doc, tr, markType, codeMarkType, linkOptions };
  let modified = false;

  doc.descendants((node, pos) => {
    if (!node.isTextblock) {
      return;
    }

    // Walk contiguous runs of actual text, breaking the run at every non-text
    // inline node (emoji/mention/variable/channel/hard-break). Those nodes
    // contribute no characters to a run, but still occupy a real document
    // position -- `forEach`'s offset already accounts for that -- and treating
    // them as a hard boundary (rather than silently skipping over them) stops
    // text on either side from being fused into one bogus word, e.g. "hi" and
    // "www.google.com" separated only by a hard break must not become
    // "hiwww.google.com".
    let runText = '';
    let runPositions = [];

    const flushRun = () => {
      runText.split(/(\s+)/).reduce((index, part) => {
        if (part && !/\s/.test(part) && linkifyWord(part, index, runPositions, context)) {
          modified = true;
        }

        return index + part.length;
      }, 0);

      runText = '';
      runPositions = [];
    };

    node.forEach((child, offset) => {
      if (!child.isText) {
        flushRun();
        return;
      }

      for (let i = 0; i < child.text.length; i++) {
        runPositions.push(pos + offset + i + 1);
      }

      runText += child.text;
    });

    flushRun();
  });

  if (modified) {
    editor.view.dispatch(tr);
  }
}
