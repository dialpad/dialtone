import { useEffect, useRef } from 'react';
import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react';

export interface SlashCommandsStorage {
  onSelectedCommand: ((command: string) => void) | null;
}

export function SlashCommandComponent ({ node, editor }: ReactNodeViewProps) {
  const text = '/' + node.attrs.command;

  // Vue reports the command from created(): once per node view, whatever StrictMode or re-renders do.
  const reported = useRef(false);
  useEffect(() => {
    if (reported.current) return;
    reported.current = true;

    const command = node.attrs.command;

    // Vue also emits `selected-command` from the node view itself, which nothing listens to. The editor's
    // callback is what reaches DtRichTextEditor.
    const storage = editor?.storage as unknown as Record<string, SlashCommandsStorage | undefined> | undefined;
    const onSelectedCommand = storage?.['slash-commands']?.onSelectedCommand;
    if (onSelectedCommand && typeof onSelectedCommand === 'function') {
      onSelectedCommand(command);
    }
    // No dependencies on purpose: once per instance, as Vue's created(), so later attribute changes don't report.
  }, []);

  return (
    <NodeViewWrapper className="d-d-inline-block">
      {text}
    </NodeViewWrapper>
  );
}

export default SlashCommandComponent;
