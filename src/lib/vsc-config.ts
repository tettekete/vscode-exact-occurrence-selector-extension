
import * as vscode from 'vscode';

export class VSCConfig
{
	static #config = vscode.workspace.getConfiguration();

	// - - - - - - - - - - - - - - - - - - - -
	// caseSensitive<boolean>
	// - - - - - - - - - - - - - - - - - - - -
	static caseSensitive( fallback?: boolean ): boolean
	{
		const config = VSCConfig._booleanConfig(
			'exactOccurrenceSelector.caseSensitive'
		);

		if( config === undefined )
		{
			return !! fallback;
		}

		return config;
	}

	static async toggleCaseSensitive(): Promise<boolean>
	{
		return await VSCConfig._toggleConfig( 'exactOccurrenceSelector.caseSensitive' );
	}

	static async setCaseSensitive( value: boolean ): Promise<boolean>
	{
		await vscode.workspace.getConfiguration().update(
			'exactOccurrenceSelector.caseSensitive',
			value,
			vscode.ConfigurationTarget.Global
		);

		return value;
	}

	// - - - - - - - - - - - - - - - - - - - -
	// boundaryHandling<string>
	// - - - - - - - - - - - - - - - - - - - -
	static boundaryHandling( fallback: string = 'auto'): string
	{
		const config = VSCConfig._stringConfig(
			'exactOccurrenceSelector.boundaryHandling'
		);

		if( config === undefined )
		{
			return fallback;
		}

		return config;
	}

	static async setBoundaryHandling( value: 'auto' | 'always' | 'never' ): Promise<string>
	{
		await vscode.workspace.getConfiguration().update(
			'exactOccurrenceSelector.boundaryHandling',
			value,
			vscode.ConfigurationTarget.Global
		);

		return value;
	}


	static _stringConfig( configName: string , fallback?: string ):string | undefined
	{
		const value = vscode.workspace
			.getConfiguration()
			.get<string>( configName );
		
		if( value === undefined && typeof fallback === 'string' )
		{
			return fallback;
		}

		return value;
	}

	static _numberConfig( configName: string , fallback?:number ):number | undefined
	{
		const value = vscode.workspace
			.getConfiguration()
			.get<number>( configName );
		
		if( value === undefined && typeof fallback === 'number' )
		{
			return fallback;
		}
		return value;
	}

	static _booleanConfig( configName: string , fallback?:boolean ):boolean | undefined
	{
		const value = vscode.workspace
			.getConfiguration()
			.get<boolean>( configName );
		
		if( value  === undefined && typeof fallback === 'boolean' )
		{
			return fallback;
		}
		return value;
	}

	static async _toggleConfig( configName: string ): Promise<boolean>
	{
		const value = !! vscode.workspace
			.getConfiguration()
			.get<boolean>( configName );
		
		await vscode.workspace.getConfiguration().update(
			configName,
			! value,
			vscode.ConfigurationTarget.Global
		);

		return !! vscode.workspace
			.getConfiguration()
			.get<boolean>( configName );
	}
}