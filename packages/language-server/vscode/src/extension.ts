// Comment to bump version
import * as serverProtocol from '@volar/language-server/protocol';
import { createLabsInfo, RevealOutputChannelOn } from '@volar/vscode';
import type { ExtensionContext, OutputChannel } from 'vscode';
import type { BaseLanguageClient, LanguageClientOptions, ServerOptions } from '@volar/vscode/node';
import { LanguageClient, TransportKind } from '@volar/vscode/node';
import { Uri, commands, window } from 'vscode';

let client: BaseLanguageClient;
let outputChannel: OutputChannel;

const CLIENT_ID = 'dialtone'
const CLIENT_NAME = 'Dialtone'

export async function activate(context: ExtensionContext) {
	outputChannel = window.createOutputChannel(CLIENT_NAME);
	context.subscriptions.push(
		commands.registerCommand('dialtone.showOutput', () => {
			outputChannel.show(true);
		}),
	)

	const serverModule = Uri.joinPath(context.extensionUri, 'dist', 'server.js');
	const runOptions = { execArgv: <string[]>[] };
	const debugOptions = { execArgv: ['--nolazy', '--inspect=' + 6009] };
	const serverOptions: ServerOptions = {
		run: {
			module: serverModule.fsPath,
			transport: TransportKind.ipc,
			options: runOptions
		},
		debug: {
			module: serverModule.fsPath,
			transport: TransportKind.ipc,
			options: debugOptions
		},
	};
	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', pattern: '**/*.{vue,css,less}' }],
		outputChannel,
		revealOutputChannelOn: RevealOutputChannelOn.Error
	};
	client = new LanguageClient(
		CLIENT_ID,
		CLIENT_NAME,
		serverOptions,
		clientOptions,
	);
	await client.start();

	// support for https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volarjs-labs
	// ref: https://twitter.com/johnsoncodehk/status/1656126976774791168
	const labsInfo = createLabsInfo(serverProtocol);
	labsInfo.addLanguageClient(client);
	return labsInfo.extensionExports;
}

export function deactivate(): Thenable<any> | undefined {
	return client?.stop();
}
