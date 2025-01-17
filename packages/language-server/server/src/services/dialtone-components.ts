import type { LanguageServicePlugin, LanguageServicePluginInstance } from "@volar/language-service";
import { componentDocumentation, components, resolveComponentProps, resolvePropValues } from "../resolvers/vue-components";
import { getContent, getCurrentWord, getEmbeddedLanguage, stringToKebabCase, wordUnderCursor } from "../utils";

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
                    const language = getEmbeddedLanguage(document, context);
                    if (language !== 'template') return;

                    const content = getContent(document, context);
                    if (!content) return;

                    const currentLine: string = content.split('\n')[position.line];

                    // @TODO: Find multi-line components
                    if (!currentLine.includes('<dt-'))
                        return;

                    const currentWord = getCurrentWord(currentLine, position.character)
                    const tagName = currentLine.replace(/\s+<([\w-]+).*/, '$1');
                    const propRegex = /:?([\w-]+)="([^"]*)"|'([^']*)'/g;
                    const existingProps = new Set<string>();
                    let propMatch;

                    console.info(`Component completion context (current-word: ${currentWord}, tag-name: ${tagName})`);

                    do {
                        propMatch = propRegex.exec(currentLine);
                        if (!propMatch) break;

                        const propStartIndex = propMatch.index;
                        const propEndIndex = propMatch.index + propMatch[0].length;
                        const propName = propMatch[1];

                        if (!existingProps.has(propName)) existingProps.add(propName);

                        const isCursorWithinProp = position.character > propStartIndex && position.character < propEndIndex;

                        if (isCursorWithinProp) return resolvePropValues(tagName, propName);
                    } while (propMatch !== null);

                    if (/^\<?dt\-/.test(currentWord)) {
                        console.info('Resolving components');
                        return { isIncomplete: false, items: components }
                    } else {
                        return resolveComponentProps(tagName, existingProps);
                    }
                },
                provideHover(document, position) {
                    const language = getEmbeddedLanguage(document, context);
                    if (language !== 'template') return;

                    const content = getContent(document, context);
                    if (!content) return;

                    const currentLine: string = content.split('\n')[position.line];
                    const tagName = currentLine.replace(/\s+<([\w-]+).*/, '$1');
                    const currentWord = wordUnderCursor(content, position)

                    if (!currentWord) return;

                    const component = componentDocumentation.find(component => stringToKebabCase(component.displayName) === tagName)

                    if (!component) return;

                    if (tagName === currentWord.text) {

                        console.info(`Component hover context (current-word: ${currentWord.text}, tag-name: ${tagName})`);
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

                    console.info(`Prop hover context (prop-name: ${prop.name})`);

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
