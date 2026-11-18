// The custom events DtRichTextEditor's extensions emit on the tiptap editor, typed on tiptap's EditorEvents so that
// editor.emit() and editor.on() check their payloads.

export interface MentionData {
  name: string;
  id: string;
  avatarSrc: string;
  contactKey: string;
}

export interface MentionPointerData extends MentionData {
  /** The native event, e.g. for positioning a hovercard. */
  event: Event;
}

export interface ChannelData {
  name: string;
  id: string;
  locked: boolean;
  channelKey: string;
}

export interface PhoneClickData {
  phoneNumber: string;
}

export interface LinkClickData {
  href: string;
  text: string | null;
  event: MouseEvent;
}

declare module '@tiptap/core' {
  interface EditorEvents {
    'mention-click': MentionData;
    'mention-hover': MentionPointerData;
    'mention-leave': MentionPointerData;
    'channel-click': ChannelData;
    'phone-click': PhoneClickData;
    'link-click': LinkClickData;
  }
}
