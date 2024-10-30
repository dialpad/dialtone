import { LanguageServiceContext } from "@volar/language-server";
import { Position, TextDocument } from "vscode-html-languageservice";
import { URI } from "vscode-uri";
import { DialtoneVirtualCode } from "./languagePlugin";

export function stringToKebabCase(string: string): string {
    return string.split(/(?=[A-Z]|[0-9]{3,}?)/).join("-").toLowerCase();
}

export function stringToHumanReadable(string: string): string {
    return string.split(/(?=[A-Z]|[0-9]{3,}?)/).join(' ')
}

export function getCurrentWord(line: string, position: Position): string {
    return line.slice(line.lastIndexOf(' ', position.character), position.character).trim();
}

export function getContent(document: TextDocument, context: LanguageServiceContext): string | undefined {
    const decoded = context.decodeEmbeddedDocumentUri(URI.parse(document.uri));
    if (!decoded) return;

    const virtualCode = context.language.scripts.get(decoded[0])?.generated?.embeddedCodes.get(decoded[1]);
    if (!(virtualCode instanceof DialtoneVirtualCode)) return;

    return virtualCode.snapshot.getText(0, virtualCode.snapshot.getLength());
}