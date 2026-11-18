import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react';
import { DtEmoji } from '../../../Emoji';

export function EmojiComponent ({ node }: ReactNodeViewProps) {
  return (
    <NodeViewWrapper className="d-d-inline-block d-va-bottom d-lh0">
      <DtEmoji
        size="500"
        code={node.attrs.code}
      />
    </NodeViewWrapper>
  );
}

export default EmojiComponent;
