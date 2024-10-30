import type { CodeMapping, LanguagePlugin, VirtualCode } from "@volar/language-core";
import type * as ts from "typescript";
import { URI } from "vscode-uri";

const VALID_LANGUAGES = ['vue'];

export const dialtoneLanguagePlugin = {
  getLanguageId(uri) {
    console.log('Getting language ID: ', uri);
    return 'dialtone';
  },

  createVirtualCode(_uri, languageId, snapshot) {
    if (VALID_LANGUAGES.includes(languageId)) {
      return new DialtoneVirtualCode(snapshot);
    }
  },

  updateVirtualCode(_fileId, code: DialtoneVirtualCode, snapshot) {
    code.update(snapshot);
    return code;
  },
} satisfies LanguagePlugin<URI>;

export class DialtoneVirtualCode implements VirtualCode {
  id = "root";
  languageId = "dialtone";
  mappings: CodeMapping[] = [];

  constructor(public snapshot: ts.IScriptSnapshot) {
    this.onSnapshotUpdated();
  }

  update(newSnapshot: ts.IScriptSnapshot) {
    this.snapshot = newSnapshot;
    this.onSnapshotUpdated();
  }

  onSnapshotUpdated() {
    this.mappings = [{
      sourceOffsets: [0],
      generatedOffsets: [0],
      lengths: [this.snapshot.getLength()],
      data: { completion: true },
    }];
  }
}
