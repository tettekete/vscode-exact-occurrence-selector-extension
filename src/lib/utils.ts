import * as vscode from "vscode";

export function escapeRegexMeta(str: string): string
{
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getExpandedRange( range:vscode.Range , deltaChar: number = 1 )
{
	let expandedStart:vscode.Position;
	if( range.start.character - deltaChar < 0 )
	{
		expandedStart = new vscode.Position( range.start.line , 0 );
	}
	else
	{
		expandedStart = range.start.translate( undefined ,-deltaChar);
	}
	
	const expandedEnd	= range.end.translate( undefined ,deltaChar);
	return new vscode.Range( expandedStart , expandedEnd );
}
