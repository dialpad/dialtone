import type { CompletionItem, CompletionList, NullableProviderResult } from "@volar/language-server/node";
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

export const componentDocumentation: DialtoneComponentDoc[] = require('../../node_modules/@dialpad/dialtone-vue/dist/component-documentation.json');

export const components = componentDocumentation.map((component: DialtoneComponentDoc) => {
    const componentName = stringToKebabCase(component.displayName);
    const humanReadableName = stringToHumanReadable(component.displayName);
    return {
        label: componentName,
        kind: CompletionItemKind.Text,
        detail: humanReadableName,
        documentation: component.description,
        deprecated: component.deprecated,
    } satisfies CompletionItem;
}) satisfies CompletionItem[];

export function resolveComponentProps(tagName: string, existingProps: Set<String>): NullableProviderResult<CompletionList> {
    const component = componentDocumentation.find(component =>
        stringToKebabCase(component.displayName) === tagName
    );

    if (!component)
        return;

    const props = component.props
        .filter(prop => {
            const propKebabCase = stringToKebabCase(prop.name);
            return (!existingProps.has(prop.name) || !existingProps.has(propKebabCase))
        })
        .map(prop => ({
            label: stringToKebabCase(prop.name),
            kind: CompletionItemKind.Field,
            labelDetails: {
                detail: `: ${prop.type.name}`,
            },
            detail: `Default: ${prop.defaultValue?.value}`,
            documentation: prop.description,
        }) as CompletionItem);

    console.info('Resolving props');
    return { isIncomplete: true, items: props };
}

export function resolvePropValues(tagName: string, propName: string): NullableProviderResult<CompletionList> {
    const component = componentDocumentation.find(component =>
        stringToKebabCase(component.displayName) === tagName
    );

    if (!component)
        return;

    const prop = component.props.find(prop => stringToKebabCase(prop.name) === stringToKebabCase(propName));

    if (!prop) return;

    const propValues = prop.values?.map(val => ({
        label: val,
        kind: CompletionItemKind.Value,
    }) as CompletionItem);

    if (propValues?.length) {
        console.info('Resolving values');
        return { isIncomplete: false, items: propValues }
    }
}
