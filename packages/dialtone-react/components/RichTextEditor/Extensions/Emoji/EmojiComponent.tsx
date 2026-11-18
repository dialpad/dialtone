import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react';
import { DtEmoji } from '../../../Emoji';

export function EmojiComponent ({ node }: ReactNodeViewProps) {
  const code = node.attrs.code as string | null;
  return (
    <NodeViewWrapper className="d-d-inline-block d-va-bottom d-lh0">
      {typeof code === 'string' && code
        ? (
            <DtEmoji
              size="500"
              code={code}
            />
          )
        : null}
    </NodeViewWrapper>
  );
}

export default EmojiComponent;
