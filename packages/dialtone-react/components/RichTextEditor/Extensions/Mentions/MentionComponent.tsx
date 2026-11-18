import type { FocusEvent, MouseEvent } from 'react';
import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react';
import { DtLink } from '../../../Link';
import type { MentionData } from '../../editorEvents';

export function MentionComponent ({ node, editor }: ReactNodeViewProps) {
  const text = '@' + node.attrs.name;

  const getMentionData = (): MentionData => ({
    name: node.attrs.name,
    id: node.attrs.id,
    avatarSrc: node.attrs.avatarSrc,
    contactKey: node.attrs.contactKey,
  });

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    editor.emit('mention-click', getMentionData());
  };

  const handleMouseEnter = (event: MouseEvent<HTMLAnchorElement> | FocusEvent<HTMLAnchorElement>) => {
    editor.emit('mention-hover', { ...getMentionData(), event: event.nativeEvent });
  };

  const handleMouseLeave = (event: MouseEvent<HTMLAnchorElement> | FocusEvent<HTMLAnchorElement>) => {
    editor.emit('mention-leave', { ...getMentionData(), event: event.nativeEvent });
  };

  return (
    <NodeViewWrapper className="d-d-inline-block">
      <DtLink
        tone="mention"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {text}
      </DtLink>
    </NodeViewWrapper>
  );
}

export default MentionComponent;
