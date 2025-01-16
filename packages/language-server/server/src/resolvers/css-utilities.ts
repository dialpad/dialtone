import { CompletionItem, CompletionList, NullableProviderResult } from "@volar/language-service";
import { CompletionItemKind } from "@volar/language-server/node";

const DialtoneDocs = require('../../node_modules/@dialpad/dialtone-css/lib/dist/dialtone-docs.json');

export type UtilityClassValue = {
    prop: string;
    value: string;
    description?: string;
}

export type UtilityClassDoc = {
    [className: string]: {
        [values: string]: UtilityClassValue[];
    };
};

function processDocumentation(docs: UtilityClassDoc) {
    const variablesDocumentation: CompletionItem[] = [];

    Object.keys(docs).forEach(className => {
        const values = docs[className].values;
        const item: CompletionItem = {
            label: className,
            kind: CompletionItemKind.Text,
            detail: values.map(value => (`${value.prop}: ${value.value}`)).join('\n'),
            // documentation: {
            //     kind: 'markdown',
            //     value: values.map(value => (`${value.prop}: ${value.value}`)).join('\n'),
            // } as MarkupContent
        };

        if (values[0].description) {
            item.labelDetails = {
                description: values.map(value => (`${value.prop}: ${value.description}`)).join(' ')
            }
        }

        variablesDocumentation.push(item);
    });

    return variablesDocumentation;
}

export const utilityClassDocumentation: CompletionItem[] = processDocumentation(DialtoneDocs);

export function resolveUtilityClass(currentWord: string, existingClasses: Set<string>): NullableProviderResult<CompletionList> {
    const classesDocumentation = utilityClassDocumentation.filter(className => !existingClasses.has(className.label))

    console.log('Resolving Utility Classes', currentWord);
    return { isIncomplete: false, items: classesDocumentation }
}
