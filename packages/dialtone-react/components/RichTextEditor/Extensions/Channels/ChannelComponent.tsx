import type { MouseEvent } from 'react';
import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react';
import { DtIconLock } from '../../../../icons';
import { DtLink } from '../../../Link';
import { DtStack } from '../../../Stack';
import type { ChannelData } from '../../editorEvents';

export function ChannelComponent ({ node, editor }: ReactNodeViewProps) {
  const text = node.attrs.locked ? node.attrs.name : '#' + node.attrs.name;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const channelData: ChannelData = {
      name: node.attrs.name,
      id: node.attrs.id,
      locked: node.attrs.locked,
      channelKey: node.attrs.channelKey,
    };
    editor.emit('channel-click', channelData);
  };

  return (
    <NodeViewWrapper className="d-d-inline-block">
      <DtLink
        tone="mention"
        onClick={handleClick}
      >
        <DtStack
          direction="row"
          gap="0"
        >
          {node.attrs.locked && (
            <DtIconLock size="200" />
          )}
          <span>{text}</span>
        </DtStack>
      </DtLink>
    </NodeViewWrapper>
  );
}

export default ChannelComponent;
