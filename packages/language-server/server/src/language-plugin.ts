import type { CodeMapping, LanguagePlugin, VirtualCode } from "@volar/language-core";
import type { IScriptSnapshot } from "typescript";
import type { URI } from "vscode-uri";

export const dialtoneLanguagePlugin: LanguagePlugin<URI> = {
  createVirtualCode(_scriptId, _languageId, snapshot): DialtoneVirtualCode {
    return new DialtoneVirtualCode(snapshot);
  },

  updateVirtualCode(_fileId, languageCode: DialtoneVirtualCode, snapshot): VirtualCode {
    languageCode.update(snapshot);
    return languageCode;
  },

  getLanguageId(_scriptId) {
    return 'dialtone';
  },
};

function _findEmbeddedLanguages(content: string): { id: string, languageId: string, content: string, mappings: CodeMapping[] }[] {
  let template;
  let style;

  const mappings = [];

  const templateTagMatch = /<template>/.exec(content);
  const styleTagMatch = /<style[^>]*>/.exec(content);

  if (templateTagMatch) {
    const templateTagStart = templateTagMatch.index + templateTagMatch[0].length;
    const templateTagEnd = content.indexOf('</template>', templateTagStart);

    template = content.substring(templateTagStart, templateTagEnd)

    mappings.push({
      id: 'template',
      languageId: 'html',
      content: template,
      mappings: [{
        sourceOffsets: [templateTagStart],
        lengths: [template.length],
        generatedOffsets: [0],
        data: {
          completion: true,
          semantic: true,
        }
      }]
    })
  }

  if (styleTagMatch) {
    const styleTagStart = styleTagMatch.index + styleTagMatch[0].length;
    const styleTagEnd = content.indexOf('</style>', styleTagStart);

    style = content.substring(styleTagStart, styleTagEnd);

    mappings.push(
      {
        id: 'style',
        languageId: 'css',
        content: style,
        mappings: [{
          sourceOffsets: [styleTagStart],
          lengths: [style.length],
          generatedOffsets: [0],
          data: {
            completion: true,
            semantic: true,
          }
        }]
      }
    )
  }

  return mappings;
}

export class DialtoneVirtualCode implements VirtualCode {
  id = "main";
  languageId = "dialtone";
  mappings: CodeMapping[] = [];
  embeddedCodes: VirtualCode[] = [];

  constructor(public snapshot: IScriptSnapshot) {
    this.onSnapshotUpdated();
  }

  public update(newSnapshot: IScriptSnapshot) {
    this.snapshot = newSnapshot;
    this.onSnapshotUpdated();
  }

  onSnapshotUpdated() {
    const snapshotContent = this.snapshot.getText(0, this.snapshot.getLength());

    // Find embedded languages
    const embeddedLanguages = _findEmbeddedLanguages(snapshotContent);

    // Create virtual code objects for embedded languages
    this.embeddedCodes = embeddedLanguages.map(embeddedLanguage => {
      return {
        id: embeddedLanguage.id,
        languageId: embeddedLanguage.languageId,
        mappings: embeddedLanguage.mappings,
        snapshot: {
          getText: (start, end) => embeddedLanguage.content.substring(start, end),
          getLength: () => embeddedLanguage.content.length,
          getChangeRange: () => undefined,
        }
      }
    });

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
