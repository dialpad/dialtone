import type { LanguageServicePlugin, LanguageServicePluginInstance, MarkupContent } from "@volar/language-server/node";
import { resolveCSSVariables, cssVariablesDocumentation } from "../resolvers/css-variables";
import { getContent, getCurrentWord, getEmbeddedLanguage } from "../utils";

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
                triggerCharacters: ['(', '-'],
            },
            hoverProvider: true,
        },
        create(context): LanguageServicePluginInstance {
            console.log('Created Dialtone Tokens service');
            return {
                provideCompletionItems(document, position) {
                    const language = getEmbeddedLanguage(document, context);
                    if (language !== 'style') return;

                    const content = getContent(document, context);
                    if (!content) return;

                    const currentLine: string = content.split('\n')[position.line];

                    if (!currentLine.includes('var(--dt-'))
                        return;

                    const currentWord = getCurrentWord(currentLine, position.character);

                    console.info(`Token completion context (current-word: ${currentWord})`);

                    return resolveCSSVariables(currentWord);

                },
                async provideHover(document, position) {
                    const language = getEmbeddedLanguage(document, context);
                    if (language !== 'style') return;

                    const content = getContent(document, context);
                    if (!content) return;

                    const currentLine: string = content.split('\n')[position.line];

                    if (!currentLine.includes('var(--dt-')) return;

                    const variableMatch = /(--dt-[\w-]+)/gi.exec(currentLine);

                    if (!variableMatch) return;

                    const matchStart = variableMatch.index;
                    const matchEnd = matchStart + variableMatch[0].length;
                    const isHoveringVariable = (position.character >= matchStart && position.character <= matchEnd);

                    if (!isHoveringVariable) return;

                    const variableName = variableMatch[0];

                    console.info(`Token hover context (current-word: ${variableName}, start: ${matchStart}, end: ${matchEnd})`);

                    const cssVariable = cssVariablesDocumentation.find(item => item.label === variableName);
                    if (!cssVariable) return;

                    return {
                        contents: cssVariable.documentation as MarkupContent,
                        range: {
                            start: {
                                line: position.line,
                                character: matchStart,
                            },
                            end: {
                                line: position.line,
                                character: matchEnd,
                            }
                        }
                    };
                },
            };
        },
    }
}
