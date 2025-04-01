import * as vscode from 'vscode';
import { VSCConfig } from './vsc-config';

let occurrencesDisposer	:vscode.Disposable | undefined	= undefined;
let lastEditor			:vscode.TextEditor | undefined	= undefined;
let lastSelections		:vscode.Selection[] | undefined	= undefined;

export function showNumOfOccurrences( editor:vscode.TextEditor )
{
	if( ! VSCConfig.showNumOfOccurrences() )
	{
		return;
	}

	if( occurrencesDisposer !== undefined )
	{
		disposeStatusBarMessage();
	}
	
	const numOfOccurrences = editor.selections.length;
	if( numOfOccurrences > 0 )
	{
		occurrencesDisposer = vscode.window.setStatusBarMessage( `${numOfOccurrences} occurrences are selected` );
		lastEditor = editor;
		lastSelections = [... editor.selections];
	}
}

// 本機能拡張によって add Occurrence されたセレクションと一致する場合を除いて、
// セレクションが変更されたときに、ステータスバーのメッセージを削除する。
export function disposeWhenSelectionUnmatched( editor:vscode.TextEditor | undefined )
{
	if( occurrencesDisposer === undefined 
		|| lastEditor === undefined
		|| lastSelections === undefined )
	{
		return;
	}

	if( editor === undefined || lastEditor !== editor )
	{
		disposeStatusBarMessage();
		return;
	}

	if( isSameSelections( [...editor.selections], lastSelections ) )
	{
		return;
	}

	disposeStatusBarMessage();
}

function disposeStatusBarMessage()
{
	if( occurrencesDisposer !== undefined )
	{
		occurrencesDisposer.dispose();
	}

	occurrencesDisposer = undefined;
	lastEditor = undefined;
	lastSelections = undefined;
}

function isSameSelections( selections1:vscode.Selection[], selections2:vscode.Selection[] )
{
	if( selections1.length !== selections2.length )
	{
		return false;
	}

	return selections1.every( ( selection, index ) =>
		{
			return selection.isEqual( selections2[index] );
		}
	);
}
