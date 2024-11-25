import type { CodeMapping, LanguagePlugin, VirtualCode } from "@volar/language-core";
import type { IScriptSnapshot } from "typescript";
import type { URI } from "vscode-uri";

export const dialtoneLanguagePlugin: LanguagePlugin<URI> = {
  createVirtualCode(_scriptId, _languageId, snapshot): DialtoneVirtualCode {
    return new DialtoneVirtualCode(snapshot);
  },

  updateVirtualCode(_scriptId, virtualCode: DialtoneVirtualCode, snapshot): VirtualCode {
    virtualCode.update(snapshot);
    return virtualCode;
  },

  getLanguageId(_scriptId) {
    return 'dialtone';
  }
};

export class DialtoneVirtualCode implements VirtualCode {
  id = "root";
  languageId = "dialtone";
  mappings: CodeMapping[] = [];

  constructor(public snapshot: IScriptSnapshot) {
    this.onSnapshotUpdated();
  }

  update(newSnapshot: IScriptSnapshot) {
    this.snapshot = newSnapshot;
    this.onSnapshotUpdated();
  }

  onSnapshotUpdated() {
    this.mappings = [{
      sourceOffsets: [0],
      generatedOffsets: [0],
      lengths: [this.snapshot.getLength()],
      data: {
        completion: true,
        semantic: true,
      },
    }];
  }
}
