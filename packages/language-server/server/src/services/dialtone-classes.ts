import type { LanguageServicePlugin, LanguageServicePluginInstance, MarkupContent } from "@volar/language-server/node";
import { getContent, getCurrentWord, getEmbeddedLanguage } from "../utils";
import { resolveUtilityClass, utilityClassDocumentation } from "../resolvers/css-utilities";

const classAttributeRegex = /:?(class=)("([^"]*)"|'([^']*)')/

export function create(): LanguageServicePlugin {
    return {
        name: "dialtone-classes",
        capabilities: {
            completionProvider: {
                triggerCharacters: ['d', '-', ':'],
            },
            hoverProvider: true,
        },
        create(context): LanguageServicePluginInstance {
            console.log('Created Dialtone Utility Classes service');
            return {
                provideCompletionItems(document, position) {
                    console.log('resolving classes');

                    const language = getEmbeddedLanguage(document, context);
                    if (language !== 'template') return;

                    const content = getContent(document, context);
                    if (!content) return;

                    const currentLine: string = content.split('\n')[position.line];
                    const classAttributeMatch = classAttributeRegex.exec(currentLine);
                    if (!classAttributeMatch) return;

                    const classStartIndex = classAttributeMatch.index + classAttributeMatch[1].length;
                    const classEndIndex = classAttributeMatch.index + classAttributeMatch[0].length;

                    const isCursorWithinClassAttribute = position.character > classStartIndex && position.character < classEndIndex;

                    if (!(isCursorWithinClassAttribute)) return;

                    const classes = new Set(classAttributeMatch[2].split(' '));

                    const currentWord = getCurrentWord(currentLine, position.character);

                    console.info(`Utility Class completion context (current-word: ${currentWord})`);

                    return resolveUtilityClass(currentWord, classes);

                },
                async provideHover(document, position) {
                    const language = getEmbeddedLanguage(document, context);
                    if (language !== 'template') return;

                    const content = getContent(document, context);
                    if (!content) return;

                    const currentLine: string = content.split('\n')[position.line];
                    const classAttributeMatch = classAttributeRegex.exec(currentLine);
                    if (!classAttributeMatch) return;

                    const classesStartIndex = classAttributeMatch.index + classAttributeMatch[1].length;
                    const classesEndIndex = classAttributeMatch.index + classAttributeMatch[0].length;

                    const isCursorWithinClassAttribute = position.character > classesStartIndex && position.character < classesEndIndex;
                    if (!(isCursorWithinClassAttribute)) return;

                    const classes = classAttributeMatch[2].split(' ');
                    let currentIndex = classesStartIndex + 1;

                    const hoveredClass = classes.find(className => {
                        const classStartIndex = currentIndex;
                        const classEndIndex = currentIndex + className.length;

                        const isCursorWithinClassName = position.character > classStartIndex && position.character < classEndIndex;

                        if (!isCursorWithinClassName) {
                            currentIndex = classEndIndex + 1; // Add the space character index after every class
                            return false;
                        }

                        return true;
                    })

                    if (!hoveredClass) return;

                    const cssVariable = utilityClassDocumentation.find(item => item.label === hoveredClass);

                    console.info(`Utility class hover context (current-word: ${hoveredClass}, start: ${currentIndex}, end: ${currentIndex + hoveredClass.length}`);
                    console.info(cssVariable);

                    if (!cssVariable) return;

                    return {
                        contents: {
                            kind: 'plaintext',
                            value: cssVariable.labelDetails?.description || cssVariable.detail
                        } as MarkupContent,
                        range: {
                            start: {
                                line: position.line,
                                character: currentIndex,
                            },
                            end: {
                                line: position.line,
                                character: currentIndex + hoveredClass.length,
                            }
                        }
                    };
                },
            };
        },
    }
}
