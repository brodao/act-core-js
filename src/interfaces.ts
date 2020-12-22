import * as Command from 'commander';

export interface IAppInfo {
	name: string;
	version: string;
	description: string;
	url: string;
	shortName?: string;
}

export interface ILoggerConfig {
	label?: string;
	verbose?: boolean;
	showBanner?: boolean;
	logToFile?: boolean;
	logFormat?: string;
}

export type LogLevel =
	| 'info'
	| 'warn'
	| 'error'
	| 'verbose'
	| 'data'
	| 'prompt';

export interface ILogger {
	log: (...args: any) => void;
	warn: (...args: any) => void;
	error: (...args: any) => void;
	verbose: (...args: any) => void;
	nested: (level: LogLevel, message: string, ...args: any) => void;
	prompt: (question: string, anwser: any) => void;
	showHeader: (appInfo: IAppInfo) => void;
	config: () => ILoggerConfig;
	reconfig: (newConfig: ILoggerConfig) => void;
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
