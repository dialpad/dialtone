import type { LanguageServicePlugin, LanguageServicePluginInstance } from "@volar/language-service";
import { componentDocumentation, components, resolveComponentProps, resolvePropValues } from "../resolvers/vue-components";
import { getContent, getCurrentWord, stringToKebabCase, wordUnderCursor } from "../utils";

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
                triggerCharacters: ['\:', '"', '\''],
            },
            hoverProvider: true,
        },
        create(context): LanguageServicePluginInstance {
            console.log('Created Dialtone Components service');

            return {
                provideCompletionItems(document, position) {
                    const content = getContent(document, context);
                    if (!content) return;

                    const currentLine: string = content.split('\n')[position.line];

                    // @TODO: Find multi-line components
                    if (!currentLine.includes('<dt-'))
                        return;

                    const currentWord = getCurrentWord(currentLine, position.character)
                    const tagName = currentLine.replace(/\s+<([\w-]+).*/, '$1');
                    const quotesRegex = /["'][\w-]*["']/g;
                    let quotesMatch = null;

                    console.info(`Component completion context (current-word: ${currentWord}, tag-name: ${tagName})`);

                    // Check if cursor is within quotes
                    while ((quotesMatch = quotesRegex.exec(currentLine)) !== null) {
                        // If not, continue;
                        if (position.character <= quotesMatch.index || position.character >= quotesMatch.index + quotesMatch[0].length)
                            continue;

                        const propName = currentLine.replace(/.*[^\w-](.*?)="[\w-]*".*/, "$1")
                        console.log('prop name: ', propName);

                        return resolvePropValues(tagName, propName)
                    }

                    if (/^\<?dt\-/.test(currentWord)) {
                        console.info('Resolving components');
                        return { isIncomplete: false, items: components }
                    } else {
                        return resolveComponentProps(tagName, currentWord)
                    }
                },
                provideHover(document, position) {
                    const content = getContent(document, context);
                    if (!content) return;

                    const currentLine: string = content.split('\n')[position.line];
                    const tagName = currentLine.replace(/\s+<([\w-]+).*/, '$1');
                    const currentWord = wordUnderCursor(content, position)

                    if (!currentWord) return;

                    const component = componentDocumentation.find(component => stringToKebabCase(component.displayName) === tagName)

                    if (!component) return;

                    console.info(`Component hover context (current-word: ${currentWord.text}, tag-name: ${tagName})`);

                    if (tagName === currentWord.text) {

                        if (!component.description) return;

                        return {
                            contents: {
                                kind: 'markdown',
                                value: component.description
                            },
                            range: currentWord.range
                        };
                    }

                    const prop = component.props.find(prop => stringToKebabCase(prop.name) === stringToKebabCase(currentWord.text));

                    if (!prop || !prop.description) return;

                    let description = prop.description;
                    if (prop.values) {
                        description += `\n\n**Values**: [${prop.values.join(', ')}]\n`
                    }
                    if (prop.defaultValue?.value) {
                        description += `\n\n**Default**: ${prop.defaultValue.value}\n`
                    }

                    return {
                        contents: {
                            kind: 'markdown',
                            value: description
                        },
                        range: currentWord.range
                    };
                },
            };
        },
    }
}
