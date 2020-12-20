import * as Command from 'commander';

export interface IAppInfo {
	name: string;
	version: string;
	description: string;
	url: string;
}

export interface ILoggerConfig {
	verbose: boolean;
	showBanner: boolean;
}

export interface ILogger {
	log: (...args: any) => void;
	warn: (...args: any) => void;
	error: (...args: any) => void;
	verbose: (...args: any) => void;
	nested: (message: string, ...args: any) => void;
	showHeader: (appInfo: IAppInfo) => void;
	_config: ILoggerConfig;
}

export interface IAppCommander {
	appCommand: () => Command.Command;
	appLogger: () => ILogger;
}

export interface IAppOptions {
	appInfo: IAppInfo;
	commandText?: boolean;
	optionsText?: boolean;
}

export interface IJsonFile {
	from: (file: string) => JSON;
	to: (content: JSON, file: string, overwrite?: boolean) => void;
}
