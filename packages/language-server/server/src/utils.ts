import type { LanguageServiceContext, Position, Range } from "@volar/language-server";
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
    const lineUntilCursor = line.slice(0, offset);
    return lineUntilCursor.replace(/.*[^\w-](.*?)/, "$1");
}

export function wordUnderCursor(content: string, position: Position) {
    const currentLine: string = content.split('\n')[position.line];

    if (!currentLine.includes('<dt-'))
        return;

    const start = currentLine.lastIndexOf(' ', position.character) + 1;
    const end = currentLine.indexOf(' ', position.character);

    const currentWord = (end === -1 ? currentLine.slice(start) : currentLine.slice(start, end));
    const wordMatch = currentWord.match(/[\w-]+/);

    if (!wordMatch) return;

    return {
        text: wordMatch[0],
        range: {
            start: { line: position.line, character: start + (wordMatch.index || 0) },
            end: { line: position.line, character: start + ((wordMatch.index || 0) + wordMatch[0].length) }
        } as Range
    };
}

export function getEmbeddedLanguage(document: TextDocument, context: LanguageServiceContext): string | undefined {
    const decoded = context.decodeEmbeddedDocumentUri(URI.parse(document.uri));
    if (!decoded) return;

    return decoded[1];
}

export function getContent(document: TextDocument, context: LanguageServiceContext): string | undefined {
    const decoded = context.decodeEmbeddedDocumentUri(URI.parse(document.uri));
    if (!decoded) return;

    const virtualCode = context.language.scripts.get(decoded[0])?.generated?.embeddedCodes.get(decoded[1]);
    if (!virtualCode) return;

    return virtualCode.snapshot.getText(0, virtualCode.snapshot.getLength());
}
