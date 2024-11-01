import type { LanguageServicePlugin, LanguageServicePluginInstance } from "@volar/language-server/node";
import { resolveCSSVariables } from "../resolvers/css-variables";
import { getContent, getCurrentWord } from "../utils";

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
        name: "dialtone-tokens",
        capabilities: {
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ['(', '-'],
            },
            hoverProvider: true,
        },
        create(context): LanguageServicePluginInstance {
            console.log('Created Dialtone Tokens service');
            return {
                provideCompletionItems(document, position) {
                    console.log('Providing Tokens Completion Items');

                    const content = getContent(document, context);
                    if (!content) return;

                    const currentLine: string = content.split('\n')[position.line];
                    const currentWord = getCurrentWord(currentLine, position);

                    // @TODO: Find multi-line components
                    if (currentWord.startsWith('var(--dt-'))
                        return resolveCSSVariables(currentWord);
                    else
                        return { isIncomplete: true, items: [] };

                },
                async provideHover(document, position) {
                    console.log('Providing Component Hover', document, position);

                    const content = getContent(document, context);
                    if (!content) return;

                    const currentLine: string = content.split('\n')[position.line];
                    const currentWord = getCurrentWord(currentLine, position);

                    console.log('hovering: ', currentWord);


                    return { contents: { kind: "plaintext", value: 'Hover content' } };
                },
            };
        },
    }
}
