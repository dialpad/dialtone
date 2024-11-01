import type { LanguageServicePlugin, LanguageServicePluginInstance } from "@volar/language-server/node";
import { resolveVueComponents } from "../resolvers/vue-components";
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
        name: "dialtone-components",
        capabilities: {
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ['<', '\:', '"', '\''],
            },
            hoverProvider: true,
        },
        create(context): LanguageServicePluginInstance {
            console.log('Created Dialtone Components service');
            return {
                provideCompletionItems(document, position, completionContext) {
                    console.log('Providing Component Completion Items');

                    const content = getContent(document, context);
                    if (!content) return;

                    const currentLine: string = content.split('\n')[position.line];
                    const currentWord = getCurrentWord(currentLine, position);

                    // Remove all the trigger character from current word
                    const sanitizedWord = currentWord.replaceAll(/[<="'\:]/g, '');

                    // @TODO: Find multi-line components
                    if (!currentLine.includes('<dt-'))
                        return;

                    return resolveVueComponents(currentLine, currentWord, sanitizedWord, completionContext);
                },
                async provideHover(document, position) {
                    console.log('Providing Token Hover', document, position);

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
