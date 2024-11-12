import type { LanguageServicePlugin, LanguageServicePluginInstance } from "@volar/language-service";
import { components, resolveComponentProps, resolvePropValues, resolveVueComponents } from "../resolvers/vue-components";
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
                triggerCharacters: ['<', '\:', '"', '\''],
            },
            hoverProvider: true,
        },
        create(context): LanguageServicePluginInstance {
            console.log('Created Dialtone Components service');

            return {
                provideCompletionItems(document, position, completionContext) {

                    const content = getContent(document, context);
                    if (!content) return;

                    const currentLine: string = content.split('\n')[position.line];

                    // @TODO: Find multi-line components
                    if (!currentLine.includes('<dt-'))
                        return;

                    // console.log('Providing Component Completion Items');
                    const currentWord = getCurrentWord(currentLine, position.character);

                    if (currentWord.startsWith('dt-')) {
                        console.log('Resolving components', currentWord);
                        return { isIncomplete: false, items: components }
                    } else if (/["']/.test(currentLine[position.character - 1])) {
                        return resolvePropValues(currentLine, currentWord)
                    } else {
                        return resolveComponentProps(currentLine, currentWord)
                    }
                },
                provideHover(document, position) {
                    const content = getContent(document, context);
                    if (!content) return;

                    const currentLine: string = content.split('\n')[position.line];

                    if (!currentLine.includes('<dt-'))
                        return;

                    console.log('Providing Token Hover');
                    const currentWord = getCurrentWord(currentLine, position.character);

                    console.log('hovering: ', currentWord);


                    return { contents: ['Hover Component content'] };
                },
            };
        },
    }
}
