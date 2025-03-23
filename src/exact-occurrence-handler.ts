import * as vscode from "vscode";

import {
	escapeRegexMeta,
	getExpandedRange
} from "./lib/utils";

import { VSCConfig } from "./lib/vsc-config";

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
	const searchText = getSearchTextFromEditor( editor ,1 );
	const regex = getRegexFromEditor( editor );

	const matches = regex.exec( searchText.text );
	if( matches !== null )
	{
		const startPos = editor.document.positionAt( searchText.offsetIndex + matches.index );
		const endPos = editor.document.positionAt( searchText.offsetIndex + matches.index + matches[0].length );

		return new vscode.Selection( startPos ,endPos );
	}
	else
	{
		console.debug( 'No matches found' );
	}

	return undefined;
}


function findPreviousOccurrence( editor: vscode.TextEditor ):vscode.Selection | undefined
{
	const searchText = getSearchTextFromEditor( editor ,-1 );
	const regex = getRegexFromEditor( editor ,'g' );

	let lastMatch:RegExpExecArray | undefined;
	let match:RegExpExecArray | null;
	while( ( match = regex.exec( searchText.text ) ) !== null )
	{
		lastMatch = match;
	}

	if( lastMatch !== undefined )
	{
		const startPos = editor.document.positionAt( searchText.offsetIndex + lastMatch.index );
		const endPos = editor.document.positionAt( searchText.offsetIndex + lastMatch.index + lastMatch[0].length );

		return new vscode.Selection( startPos ,endPos );
	}
	
	
}

function getSearchTextFromEditor( editor: vscode.TextEditor ,direction: 1 | -1 ):
{
	offsetIndex: number,
	text: string
}
{
	if( direction === 1 )
	{
		const lastSelection	= editor.selections[editor.selections.length - 1];
		const offsetIndex	= editor.document.offsetAt( lastSelection.end );
		return {
			text: editor.document.getText().slice( offsetIndex ),
			offsetIndex
		};
	}
	else
	{
		const firstSelection	= editor.selections[0];
		const offsetIndex		= 0;
		const endIndex			= editor.document.offsetAt( firstSelection.start );

		return {
			text: editor.document.getText().slice( offsetIndex ,endIndex ),
			offsetIndex
		};
	}
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
