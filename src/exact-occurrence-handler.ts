import * as vscode from "vscode";

import {
	escapeRegexMeta,
	getExpandedRange
} from "./lib/utils";

import { VSCConfig } from "./lib/vsc-config";

type SearchTextRecord =
{
	offsetIndex: number,
	text: string
};

export function addNextOccurrence()
{
	const editor = vscode.window.activeTextEditor;
	if(!editor){ return; }
	if( editor.selection.isEmpty ){ return; }


	const selectionOrUndefined = findNextOccurrence( editor );
	if( selectionOrUndefined === undefined )
	{
		return;
	}

	const selection = selectionOrUndefined;
	
	editor.selections = [ ...editor.selections ,selection ];
	editor.revealRange( selection );
}


export function addPreviousOccurrence()
{
	const editor = vscode.window.activeTextEditor;
	if( ! editor ){ return; }
	if( editor.selection.isEmpty ){ return; }

	const selectionOrUndefined = findPreviousOccurrence( editor );
	if( selectionOrUndefined === undefined )
	{
		return;
	}

	const selection = selectionOrUndefined;
	
	editor.selections = [ selection ,...editor.selections ];
	editor.revealRange( selection );
}


export function selectAllOccurrences()
{
	const editor = vscode.window.activeTextEditor;
	if( ! editor ){ return; }
	if( editor.selection.isEmpty ){ return; }

	const searchText = editor.document.getText();
	const regex = getRegexFromEditor( editor ,'g');

	const matches = searchText.matchAll( regex );
	if( matches === null ){ return; }

	for( const match of matches )
	{
		const startPos = editor.document.positionAt( match.index );
		const endPos = editor.document.positionAt( match.index + match[0].length );
		const selection = new vscode.Selection( startPos ,endPos );
		if( selection.isEqual( editor.selection ) )
		{
			continue;
		}

		editor.selections = [ ...editor.selections ,selection ];
	}
}


function findNextOccurrence( editor: vscode.TextEditor ):vscode.Selection | undefined
{	
	const searchTextRecords = getSearchTextsFromEditor( editor ,1 );
	const regex = getRegexFromEditor( editor );

	for(const searchTextRecord of searchTextRecords )
	{
		const matches = regex.exec( searchTextRecord.text );
		if( matches !== null )
		{
			const startPos = editor.document.positionAt( searchTextRecord.offsetIndex + matches.index );
			const endPos = editor.document.positionAt( searchTextRecord.offsetIndex + matches.index + matches[0].length );

			const newSelection = new vscode.Selection( startPos ,endPos );
			if( editor.selections.some( ( s:vscode.Selection ) => s.isEqual( newSelection ) ) )
			{
				continue;
			}

			return newSelection;
		}
	}

	return undefined;
}


function findPreviousOccurrence( editor: vscode.TextEditor ):vscode.Selection | undefined
{
	const searchTextRecords = getSearchTextsFromEditor( editor ,-1 );
	const regex = getRegexFromEditor( editor ,'g' );

	for( const searchTextRecord of searchTextRecords )
	{
		const searchText = searchTextRecord.text;
		let lastMatch:RegExpExecArray | undefined;
		let match:RegExpExecArray | null;
		while( ( match = regex.exec( searchText ) ) !== null )
		{
			lastMatch = match;
		}

		if( lastMatch !== undefined )
		{
			const startPos = editor.document.positionAt( searchTextRecord.offsetIndex + lastMatch.index );
			const endPos = editor.document.positionAt( searchTextRecord.offsetIndex + lastMatch.index + lastMatch[0].length );

			const newSelection = new vscode.Selection( startPos ,endPos );
			if( editor.selections.some( ( s:vscode.Selection ) => s.isEqual( newSelection ) ) )
			{
				continue;
			}

			return newSelection;
		}
	}

	return undefined;
}


function getSearchTextsFromEditor( editor: vscode.TextEditor ,direction: 1 | -1 ):SearchTextRecord[]
{
	const result:SearchTextRecord[] = [];
	
	const settings =[
		{
			// after last selection
			selection: editor.selections[editor.selections.length - 1],
			sliceStart: editor.document.offsetAt( editor.selections[editor.selections.length - 1].end ),
			sliceEnd: undefined
		},
		{
			// before first selection
			selection: editor.selections[0],
			sliceStart: 0,
			sliceEnd: editor.document.offsetAt( editor.selections[0].start )
		}
	];
	
	let sortedSettings = settings;
	if( direction === -1 )
	{
		sortedSettings = sortedSettings.reverse();
	}

	for( const setting of sortedSettings )
	{
		const offsetIndex	= setting.sliceStart;
		result.push(
			{
				text: editor.document.getText().slice( setting.sliceStart, setting.sliceEnd ),
				offsetIndex: setting.sliceStart
			}
		);
	}

	return result;
}


function getRegexFromEditor( editor: vscode.TextEditor ,options:string = ''):RegExp
{
	const selectionRange = new vscode.Range( editor.selection.start ,editor.selection.end );
	const word = editor.document.getText( selectionRange );
	const escapedWord = escapeRegexMeta( word );

	let regexSource:string = escapedWord;

	const boundaryHandling = VSCConfig.boundaryHandling();
	if( boundaryHandling === 'auto' )
	{
		const expandedWordRange = getExpandedRange( selectionRange );
		const expandedWord = editor.document.getText( expandedWordRange );

		if( word.length === expandedWord.length )
		{
			regexSource = `(?<=^|\\W)${escapedWord}(?=$|\\W)`;
		}
		else
		{
			let wordBoundaryCheckRegex = /^\W.+\W$/;
			if( word.length + 2 !== expandedWord.length )
			{
				if( selectionRange.start.character === 0 )
				{
					wordBoundaryCheckRegex = /\W$/;
				}
				else
				{
					wordBoundaryCheckRegex = /^\W/;
				}
			}

			if( wordBoundaryCheckRegex.test( expandedWord ) )
			{
				regexSource = `(?<=^|\\W)${escapedWord}(?=$|\\W)`;
			}
		}
	}
	else if( boundaryHandling === 'always' )
	{
		regexSource = `(?<=^|\\W)${escapedWord}(?=$|\\W)`;
	}
	else if( boundaryHandling === 'never' )
	{
		regexSource = escapedWord;
	}

	let option = options;
	if( ! VSCConfig.caseSensitive() )
	{
		option += 'i';
	}

	return RegExp( regexSource ,option );
}
