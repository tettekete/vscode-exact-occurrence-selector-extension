import * as vscode from 'vscode';

import {
	addNextOccurrence,
	addPreviousOccurrence,
	selectAllOccurrences
} from './exact-occurrence-handler';

export function activate(context: vscode.ExtensionContext) {

	const RunAddNextOccurrence = vscode.commands.registerCommand(
		'exact-occurrence-selector.addNextOccurrence', 
		addNextOccurrence
	);

	const RunAddPreviousOccurrence = vscode.commands.registerCommand(
		'exact-occurrence-selector.addPreviousOccurrence', 
		addPreviousOccurrence
	);

	const RunSelectAllOccurrences = vscode.commands.registerCommand(
		'exact-occurrence-selector.selectAllOccurrences', 
		selectAllOccurrences
	);

	context.subscriptions.push(
		RunAddNextOccurrence,
		RunAddPreviousOccurrence,
		RunSelectAllOccurrences
	);
}

export function deactivate() {}
