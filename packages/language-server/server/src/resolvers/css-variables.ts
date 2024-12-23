import type { CompletionItem, CompletionList, MarkupContent, NullableProviderResult } from "@volar/language-server/node";
import { CompletionItemKind } from "@volar/language-server/node";

export type DialtoneTokensDoc = {
    [theme: string]: {
        [variable: string]: {
            [platform: string]: {
                name: string;
                value: string;
                description?: string;
                keywords?: string[];
                isCompositionToken?: boolean;
            };
        };
    };
};

export type DialtoneCSSVariablesDoc = {
    name: string;
    value: string;
    description?: string;
    theme: string;
    keywords?: string[];
};

function getItemKind(itemName: string): CompletionItemKind {
    if (itemName.toLowerCase().includes('color')) {
        return CompletionItemKind.Color;
    } else {
        return CompletionItemKind.Text;
    }
}

function processDocumentation(docs: DialtoneTokensDoc) {
    const themeNames = Object.keys(docs).filter(themeName => ['dp-light', 'base-light', 'dp-dark', 'base-dark'].includes(themeName));
    const variableNames = new Set(themeNames.map(themeName => Object.keys(docs[themeName])).flat())
    const variablesDocumentation: CompletionItem[] = [];

    for (const variableName of variableNames) {
        const variable: CompletionItem = {
            label: `--dt-${variableName.split('/').join('-')}`,
            kind: getItemKind(variableName),
        };
        let documentation = '**Theme values**\n\n';

        themeNames.forEach(themeName => {
            const cssVariable = docs[themeName][variableName]?.['css/variables'];
            if (!cssVariable) return;

            variable.detail = cssVariable.description || variable.detail;

            // Small text to the right of the variable label
            if (!variable.labelDetails) {
                variable.labelDetails = { description: cssVariable.value };
            }

            documentation += `- **${themeName}**: ${cssVariable.value}\n`;

        });

        variable.documentation = {
            kind: 'markdown',
            value: documentation,
        } as MarkupContent;

        variablesDocumentation.push(variable)
    }

    return variablesDocumentation;
}

const tokensDocumentation: DialtoneTokensDoc = require('../../node_modules/@dialpad/dialtone-tokens/dist/doc.json');

// @TODO: Process the tokens on build, as it is a static file that will not change on runtime.
export const cssVariablesDocumentation: CompletionItem[] = processDocumentation(tokensDocumentation);

export function resolveCSSVariables(currentWord: string): NullableProviderResult<CompletionList> {
    console.log('Resolving CSS Variables', currentWord);
    // @TODO: Filter the tokens to send less info to the client at once.
    return { isIncomplete: false, items: cssVariablesDocumentation };
}
