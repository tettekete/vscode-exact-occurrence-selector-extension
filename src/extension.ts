import * as vscode from 'vscode';

import {
	addNextOccurrence,
	addPreviousOccurrence,
	selectAllOccurrences
} from './exact-occurrence-handler';
import { VSCConfig } from './lib/vsc-config';
import { disposeWhenSelectionUnmatched } from './lib/show-num-of-occurrences';

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

	const RunChangeBoundaryHandlingConfig = vscode.commands.registerCommand(
		'exact-occurrence-selector.changeBoundaryHandlingConfig',
		changeBoundaryHandlingConfig
	);

	const RunChangeCaseSensitiveConfig = vscode.commands.registerCommand(
		'exact-occurrence-selector.changeCaseSensitiveConfig',
		changeCaseSensitiveConfig
	);

	const onDidChangeTextEditorSelection = vscode.window.onDidChangeTextEditorSelection(
		( event: vscode.TextEditorSelectionChangeEvent ) =>
		{
			disposeWhenSelectionUnmatched( event.textEditor );
		}
	);

	context.subscriptions.push(
		RunAddNextOccurrence,
		RunAddPreviousOccurrence,
		RunSelectAllOccurrences,
		RunChangeBoundaryHandlingConfig,
		RunChangeCaseSensitiveConfig
	);
}

export function deactivate() {}


async function changeBoundaryHandlingConfig()
{
	const currentSetting = await VSCConfig.boundaryHandling();
	const quickPickItems: vscode.QuickPickItem[] = [];
	const validValues = ['auto', 'always', 'never'];
	for( const value of validValues )
	{
		const item: vscode.QuickPickItem = {label: value };
		if( value === currentSetting )
		{
			item['picked'] = true;
			item['iconPath'] = new vscode.ThemeIcon( 'pass-filled' );
		}
		else
		{
			item['iconPath'] = new vscode.ThemeIcon( 'circle-large-outline' );
		}

		quickPickItems.push( item );
	}

	const newBoundaryHandling = await vscode.window.showQuickPick( quickPickItems, { placeHolder: 'Select boundary handling' } );
	if( newBoundaryHandling === undefined )
	{
		return;
	}
	else
	{
		await VSCConfig.setBoundaryHandling( newBoundaryHandling.label as 'auto' | 'always' | 'never' );
		vscode.window.setStatusBarMessage( `Boundary handling config changed to "${newBoundaryHandling.label}"`,8000 );
	}
}


async function changeCaseSensitiveConfig()
{
	const currentSetting = await VSCConfig.caseSensitive();
	const quickPickItems: vscode.QuickPickItem[] = [];
	const validValues = [true, false];
	for( const value of validValues )
	{
		const item: vscode.QuickPickItem = {label: value.toString() };
		if( value === true )
		{
			item['description'] = 'Case Sensitive';
		}
		else
		{
			item['description'] = 'Case Insensitive';
		}

		if( value === currentSetting )
		{
			item['picked'] = true;
			item['iconPath'] = new vscode.ThemeIcon( 'pass-filled' );
		}
		else
		{
			item['iconPath'] = new vscode.ThemeIcon( 'circle-large-outline' );
		}

		quickPickItems.push( item );
	}

	const newCaseSensitive = await vscode.window.showQuickPick( quickPickItems, { placeHolder: 'Select case sensitivity' } );
	if( newCaseSensitive === undefined )
	{
		return;
	}
	else
	{
		await VSCConfig.setCaseSensitive( newCaseSensitive.label === 'true' );
		vscode.window.setStatusBarMessage( `Case sensitivity config changed to "${newCaseSensitive.label}"`,8000 );
	}
}
