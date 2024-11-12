import type { LanguageServiceContext } from "@volar/language-server";
import type { TextDocument } from "vscode-html-languageservice";
import { URI } from "vscode-uri";
import { DialtoneVirtualCode } from "./language-plugin";

export function stringToKebabCase(string: string): string {
    return string.split(/(?=[A-Z]|[0-9]{3,}?)/).join("-").toLowerCase();
}

export function stringToHumanReadable(string: string): string {
    return string.split(/(?=[A-Z]|[0-9]{3,}?)/).join(' ')
}

export function getCurrentWord(line: string, offset: number): string {
    let wordStart = line.lastIndexOf(' ', offset);
    if (wordStart === -1) wordStart = 0;

    let wordEnd = line.indexOf(' ', offset);
    if (wordEnd === -1) wordEnd = line.length;

    const word = line.slice(wordStart, wordEnd);

    // Removes all the non-word characters and the beginning and end of the current word.
    return word.replace(/^[^\w-]*([\w-]+)[^\w-]*$/gi, '$1').trim();
}

export function getContent(document: TextDocument, context: LanguageServiceContext): string | undefined {
    const decoded = context.decodeEmbeddedDocumentUri(URI.parse(document.uri));
    if (!decoded) return;

    const virtualCode = context.language.scripts.get(decoded[0])?.generated?.embeddedCodes.get(decoded[1]);
    if (!(virtualCode instanceof DialtoneVirtualCode)) return;

    return virtualCode.snapshot.getText(0, virtualCode.snapshot.getLength());
}
