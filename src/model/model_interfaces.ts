import * as Command from "commander";

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

export interface ILogger {
	log: (...args: any) => void;
	warn: (...args: any) => void;
	error: (...args: any) => void;
	verbose: (text: string | string[], args?: any) => void;
	nested: (message: string) => void;
	newLine: () => void;
	showBanner: (appInfo: IAppInfo) => void;
	config: ILoggerConfig;
}

export interface ICommander {
	newCommand: (commandOptions: ICommandOptions) => Command.Command,
	commandDidThrowAsync: (error: any, exitCode?: number) => void
}

export interface ICommandOptions {
	name: string;
	version: string;
	default?: boolean;
	commandText?: boolean;
	optionsText?: boolean;
}

export interface IJsonFile {
	from: (file: string) => JSON,
	to: (content: JSON, file: string, overwrite?: boolean) => void
}
