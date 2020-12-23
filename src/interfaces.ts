import * as Command from "commander";

export interface IAppInfo {
	name: string;
	version: string;
	description: string;
	url: string;
	getShortName: () => string;
}

export interface ILoggerConfig {
	appInfo?: IAppInfo;
	verbose?: boolean;
	showBanner?: boolean;
	logToFile?: boolean;
	logFormat?: string;
}

export type LogLevel =
	| "error"
	| "warn"
	| "help"
	| "data"
	| "info"
	| "debug"
	| "prompt"
	| "verbose"
	| "input";

export interface ILogger {
	error: (...args: any) => void;
	warn: (...args: any) => void;
	help: (...args: any) => void;
	data: (...args: any) => void;
	info: (...args: any) => void;
	debug: (...args: any) => void;
	prompt: (question: string, anwser: any) => void;
	verbose: (...args: any) => void;
	input: (...args: any) => void;
	nested: (level: LogLevel, message: string, ...args: any) => void;
	showHeader: () => void;
	profile: (id: string) => void;
	getConfig: () => ILoggerConfig;
	setConfig: (newConfig: ILoggerConfig) => void;
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
