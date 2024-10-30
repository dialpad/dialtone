import { Diagnostic, LanguageServicePlugin, LanguageServicePluginInstance } from "@volar/language-server/node";
import { resolveVueComponents } from "./VueComponentResolver";
import { resolveCSSVariables } from "./CSSVariableResolver";
import { getContent, getCurrentWord } from "./utils";

export type DialtoneTokenDoc = {
    [theme: string]: {
        [variable: string]: {
            name: string;
            value: string;
            description?: string;
            keywords?: string[];
        }
    }
};

export function create(): LanguageServicePlugin {
    return {
        name: "dialtone",
        capabilities: {
            completionProvider: {
                triggerCharacters: ['(', '<', '"', '\''],
            },
            hoverProvider: true,
            diagnosticProvider: {
                interFileDependencies: false,
                workspaceDiagnostics: false,
            },
        },
        create(context): LanguageServicePluginInstance {
            console.log('Created Dialtone service');
            return {
                provideCompletionItems(document, position, completionContext) {
                    const content = getContent(document, context);
                    if (!content) return;

                    const currentLine: string = content.split('\n')[position.line];
                    const currentWord = getCurrentWord(currentLine, position);

                    // Remove all the trigger character from current word
                    const sanitizedWord = currentWord.replaceAll(/[\(<="']/g, '');
                    // console.log('content: ', content);
                    // console.log('current line: ', currentLine);
                    // console.log('current word: ', currentWord);
                    // console.log('sanitized word: ', sanitizedWord);


                    if (completionContext.triggerCharacter === '(' && sanitizedWord === 'var')
                        return resolveCSSVariables(currentLine, currentWord, sanitizedWord, completionContext);
                    else if (completionContext.triggerCharacter === '<' || currentLine.includes('<'))
                        // @TODO: Find multi-line components
                        return resolveVueComponents(currentLine, currentWord, sanitizedWord, completionContext);
                    else
                        return {
                            isIncomplete: true,
                            items: [],
                        };

                },
                async provideHover(document, position) {
                    console.log('Hover!', document, position);

                    const content = getContent(document, context);
                    if (!content) return;

                    const currentLine: string = content.split('\n')[position.line];
                    const currentWord = getCurrentWord(currentLine, position);

                    console.log('hovering: ', currentWord);


                    return { contents: { kind: "plaintext", value: 'Hover content' } };
                },
                provideDiagnostics(document) {
                    console.log('providing diagnostics');

                    const content = getContent(document, context);
                    if (!content) return;
                    const errors: Diagnostic[] = [
                        {
                            severity: 2,
                            range: {
                                start: document.positionAt(0),
                                end: document.positionAt(10),
                            },
                            source: "dialtone language server",
                            message: "Only one style tag is allowed.",
                        }
                    ];
                    return errors;
                },
            };
        },
    }
}