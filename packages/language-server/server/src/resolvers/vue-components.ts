import type { CompletionContext, CompletionItem, CompletionList, NullableProviderResult } from "@volar/language-server/node";
import { CompletionItemKind } from "@volar/language-server/node";
import { stringToHumanReadable, stringToKebabCase } from "../utils";

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
        label: componentName,
        kind: CompletionItemKind.Text,
        detail: humanReadableName,
        documentation: component.description,
        deprecated: component.deprecated
    } satisfies CompletionItem;
}) satisfies CompletionItem[];

export function resolveVueComponents(currentLine: string, currentWord: string, sanitizedWord: string, context: CompletionContext): NullableProviderResult<CompletionList> {
    console.log('Resolving Vue Components', currentLine, currentWord, sanitizedWord, context);

    // Get the clean tag-name
    const tagName = currentLine.replace(/\s+<([\w-]+).*/, '$1');

    const component = componentDocumentation.find(component =>
        stringToKebabCase(component.displayName) === tagName
    );

    if (currentWord.trim().startsWith('<') || context.triggerCharacter === '<') {
        return { isIncomplete: false, items: components }
    }

    if (!component)
        return;

    const propValues = component.props
        .find(prop => stringToKebabCase(prop.name) === stringToKebabCase(sanitizedWord))
        ?.values
        ?.map(val => ({
            label: val,
            kind: CompletionItemKind.Value,
        }) as CompletionItem);

    if (propValues?.length) {
        return { isIncomplete: false, items: propValues }
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
        .filter(item =>
            // @TODO: Filter properties that are already set
            item.label.startsWith(sanitizedWord)
        );

    return { isIncomplete: false, items: props };
}
