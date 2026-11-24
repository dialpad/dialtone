// A file from staticDirs (dialtone-vue's common/assets: avatars, test images), as a URL. A root-absolute path
// ("/avatar2.png") only works when the Storybook is served from the root of its host. The published previews sit
// under a path (deploy-previews/react/<ref>/react/), so this resolves the name against the preview iframe's own
// address, which is the Storybook's root in both cases.
export const asset = (name: string) => new URL(name, document.baseURI).href;
