// import { readFileSync } from "fs";
// import path from "path";
// import { stringToHumanReadable, stringToKebabCase } from "./utils";
import { CompletionContext, CompletionList, NullableProviderResult } from "@volar/language-server/node";

// export type DialtoneComponentDoc = {
//     displayName: string;
//     description: string;
//     tags: {
//         see: {
//             description: string;
//         }[]
//     }
//     deprecated: boolean;
//     props: {
//         name: string;
//         description?: string;
//         tags?: object;
//         values?: string[];
//         type: { name: string; };
//         defaultValue?: {
//             func: boolean;
//             value: string;
//         },
//         required?: boolean;
//     }[]
// };

// const componentDocumentationFile: string = readFileSync(path.resolve(__dirname + '/../node_modules/@dialpad/dialtone-vue/dist/component-documentation.json'), 'utf-8').toString();
// export const componentDocumentation: DialtoneComponentDoc[] = JSON.parse(componentDocumentationFile);

// export const components = componentDocumentation.map((component: DialtoneComponentDoc) => {
//     const componentName = stringToKebabCase(component.displayName);
//     const humanReadableName = stringToHumanReadable(component.displayName);
//     return {
//         label: componentName,
//         kind: CompletionItemKind.Text,
//         detail: humanReadableName,
//         documentation: component.description,
//         deprecated: component.deprecated,
//     } satisfies CompletionItem;
// }) satisfies CompletionItem[];

export function resolveCSSVariables(currentLine: string, currentWord: string, sanitizedWord: string, context: CompletionContext): NullableProviderResult<CompletionList> {
    console.log('Resolving CSS Variables', currentLine, currentWord, sanitizedWord, context);

    return { isIncomplete: false, items: [] };
}
