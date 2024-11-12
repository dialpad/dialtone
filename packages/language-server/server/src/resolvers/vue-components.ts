import type { CompletionContext, CompletionItem, CompletionList, NullableProviderResult } from "@volar/language-server/node";
import { Command, CompletionItemKind } from "@volar/language-server/node";
import { getCurrentWord, stringToHumanReadable, stringToKebabCase } from "../utils";

export type DialtoneComponentDoc = {
    displayName: string;
    description: string;
    tags: {
        see: {
            description: string;
        }[]
    }
    deprecated: boolean;
    props: {
        name: string;
        description?: string;
        tags?: object;
        values?: string[];
        type: { name: string; };
        defaultValue?: {
            func: boolean;
            value: string;
        },
        required?: boolean;
    }[]
};

const componentDocumentation: DialtoneComponentDoc[] = require('../../node_modules/@dialpad/dialtone-vue/dist/component-documentation.json');

export const components = componentDocumentation.map((component: DialtoneComponentDoc) => {
    const componentName = stringToKebabCase(component.displayName);
    const humanReadableName = stringToHumanReadable(component.displayName);
    return {
        label: `${componentName} `,
        kind: CompletionItemKind.Text,
        detail: humanReadableName,
        documentation: component.description,
        deprecated: component.deprecated,
    } satisfies CompletionItem;
}) satisfies CompletionItem[];

export function resolveVueComponents(currentLine: string, currentWord: string): NullableProviderResult<CompletionList> {
    // Get the clean tag-name
    const tagName = currentLine.replace(/\s+<([\w-]+).*/, '$1');

    const component = componentDocumentation.find(component =>
        stringToKebabCase(component.displayName) === tagName
    );

    if (!component)
        return;

    if (currentLine.endsWith('"')) {
        const propValues = component.props
            .find(prop => stringToKebabCase(prop.name) === stringToKebabCase(currentWord))
            ?.values
            ?.map(val => ({
                label: val,
                kind: CompletionItemKind.Value,
            }) as CompletionItem);

        if (propValues?.length) {
            console.log('Resolving values', currentWord);
            return { isIncomplete: false, items: propValues }
        }
    }

    const props = component.props
        .map(prop => ({
            label: stringToKebabCase(prop.name),
            kind: CompletionItemKind.Field,
            labelDetails: {
                detail: `: ${prop.type.name}`,
            },
            detail: `Default: ${prop.defaultValue?.value}`,
            documentation: prop.description
        }) as CompletionItem)
        .filter(item => {
            console.log(item.label, currentWord);

            return item.label.startsWith(currentWord)
        });

    console.log('Resolving properties', currentWord);
    return { isIncomplete: false, items: props };
}

export function resolveComponentProps(currentLine: string, currentWord: string): NullableProviderResult<CompletionList> {
    // Get the clean tag-name
    const tagName = currentLine.replace(/\s+<([\w-]+).*/, '$1');

    const component = componentDocumentation.find(component =>
        stringToKebabCase(component.displayName) === tagName
    );

    if (!component)
        return;

    const props = component.props
        .map(prop => ({
            label: stringToKebabCase(prop.name),
            kind: CompletionItemKind.Field,
            labelDetails: {
                detail: `: ${prop.type.name}`,
            },
            detail: `Default: ${prop.defaultValue?.value}`,
            documentation: prop.description,
        }) as CompletionItem);

    console.log('Resolving properties', currentWord);
    return { isIncomplete: false, items: props };
}

export function resolvePropValues(currentLine: string, currentWord: string): NullableProviderResult<CompletionList> {
    console.log('Resolving values', currentWord);

    // Get the clean tag-name
    const tagName = currentLine.replace(/\s+<([\w-]+).*/, '$1');

    const component = componentDocumentation.find(component =>
        stringToKebabCase(component.displayName) === tagName
    );

    if (!component)
        return;

    const prop = component.props.find(prop => stringToKebabCase(prop.name) === stringToKebabCase(currentWord));

    if (!prop) return;

    const propValues = prop.values?.map(val => ({
        label: val,
        kind: CompletionItemKind.Value,
    }) as CompletionItem);

    if (propValues?.length) {
        console.log('Resolving values', currentWord);
        return { isIncomplete: false, items: propValues }
    }
}
