export interface IAppInfo {
	name: string;
	version: string;
	description: string;
}

export interface ILoggerConfig {
	raw: boolean;
	verboseEnable: boolean;
	showSplash: boolean;
}

export interface ICommandOptions {
	name: string;
	version?: string;
	commandText?: string;
	optionsText?: string;
}
