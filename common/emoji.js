import emojiToolkit from 'emoji-toolkit';

export function setEmojiAssetUrl (url, fileExtension = '.svg') {
  if (!url.endsWith('/')) {
    url = url + '/';
  }
  emojiToolkit.imagePathPNG = url;
  emojiToolkit.fileExtension = fileExtension;
}
