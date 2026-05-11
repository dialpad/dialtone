const STUB_CSS = ':root {}';

export const dpStub = {
  brand: { name: 'dp', css: STUB_CSS },
};

export const melonStub = {
  brand: { name: 'melon', css: STUB_CSS },
  material: { name: 'iron' },
};

export const botanyStub = {
  brand: { name: 'botany', css: STUB_CSS },
  material: { name: 'sandstone' },
};

export const unknownMaterialBrandStub = {
  brand: { name: 'fake', css: STUB_CSS },
  material: { name: 'unobtainium' },
};

export const highContrastStub = {
  contrast: { name: 'high', css: STUB_CSS },
};
