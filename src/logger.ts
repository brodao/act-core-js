import * as winston from 'winston';
import * as os from 'os';
import * as path from 'path';
import { IAppInfo, ILogger, ILoggerConfig, LogLevel } from './interfaces';

const outDir: string = path.join(os.homedir(), '.act-nodejs');

const fileTextFormat = winston.format.printf(
	({ level, message, label, timestamp }) => {
		return `${timestamp} [${label}] ${level}: ${message}`;
	}
);

const consoleFormat = winston.format.printf(({ message }) => {
	return message;
});

class Logger implements ILogger {
	private _config: ILoggerConfig = {
		appInfo: undefined,
		verbose: 'info',
		showBanner: true,
		logToFile: false,
		logFormat: 'text',
	};

	private _id: string;
	private _logger!: winston.Logger;
	private _textFile!: winston.transports.FileTransportInstance;
	private _jsonFile!: winston.transports.FileTransportInstance;
	private _firstLog: boolean = true;

	constructor(id: string, config: ILoggerConfig) {
		this._id = id.trim().toLowerCase();

		this.setConfig(config);
	}

	getConfig(): ILoggerConfig {
		return this._config;
	}

	setConfig(newConfig: ILoggerConfig) {
		this._config = { ...this._config, ...newConfig };
		const level: string = 'verbose'; //this._config.verbose ? "debug" : "info";

		const options: winston.LoggerOptions = {
			exitOnError: false,
			handleExceptions: true,
			level: level,
			levels: winston.config.cli.levels,
			format: winston.format.combine(
				winston.format.splat(),
				winston.format.colorize({ all: true }),
				winston.format.label({ label: this._config.appInfo?.getShortName() }),
				winston.format.timestamp(),
				consoleFormat
			),
			transports: [new winston.transports.Console()], //{ handleExceptions: true }
		};

		if (this._logger) {
			this._logger.configure(options);
		} else {
			this._logger = winston.createLogger(options);

			this._textFile = new winston.transports.File({
				level: level,
				filename: this._id + '.log',
				dirname: outDir,
				format: fileTextFormat,
			});

			this._jsonFile = new winston.transports.File({
				level: level,
				filename: this._id + '.log.json',
				dirname: outDir,
				format: winston.format.json(),
			});
		}

		if (this._config.logToFile) {
			this._logger.add(
				this._config.logFormat === 'text' ? this._textFile : this._jsonFile
			);
		} else {
			this._logger.remove(this._textFile);
			this._logger.remove(this._jsonFile);
		}
	}

	nested(level: LogLevel, message: string, ...args: any) {
		this.consoleLog(level, message);

		Object.keys(args).forEach((key) => {
			const item: any = args[key];

			if (Array.isArray(item)) {
				for (let index = 0; index < item.length; index++) {
					this.consoleLog('data', '> %s', item[index]);
				}
			} else if (typeof args[key] === 'object') {
				this.nested('data', key, args[key]);
			} else {
				this.consoleLog('data', '>  %s = %s', key, args[key]);
			}
		});
	}

	private consoleLog(level: LogLevel, message: string, ...data: any) {
		if (this._firstLog) {
			this._firstLog = false;
			this.showHeader();
		}

		this._logger.log(level, message, ...data);
	}

	help(...args: any) {
		this.consoleLog('help', args[0], args.slice(1));
	}

	data(...args: any) {
		this.consoleLog('data', args[0], args.slice(1));
	}

	debug(...args: any) {
		this.consoleLog('debug', args[0], args.slice(1));
	}

	input(...args: any) {
		this.consoleLog('input', args[0], args.slice(1));
	}

	error(...args: any[]) {
		this.consoleLog('error', args[0], args.slice(1));
	}

	warn(...args: any[]) {
		this.consoleLog('warn', args[0], args.slice(1));
	}

	info(...args: any[]) {
		this.consoleLog('info', args[0], args.slice(1));
	}

	prompt(question: string, anwser: any) {
		this.nested('prompt', question, anwser);
	}

	verbose(...args: any[]) {
		if (this._logger.isVerboseEnabled()) {
			const text: string = args[0] as string;
			this.nested('verbose', text, args.slice(1));
		}
	}

	profile(id: string) {
		this._logger.profile(id);
	}

	private appText(appInfo: IAppInfo): string[] {
		return [
			`${appInfo.displayName} [${appInfo.name}] ${appInfo.version}`,
			`${appInfo.description}`,
			'',
		];
	}

	// prettier-ignore
	private banner(appInfo: IAppInfo): string[] {
		const display: string = 
			"-".padStart((68 - appInfo.displayName.length) / 2, "-") +
			"< " + appInfo.displayName + " >" +
			"-".padEnd((68 - appInfo.displayName.length) / 2, "-");
		const description: string = 
			"-".padStart((68 - appInfo.description.length) / 2, "-") +
			"< " + appInfo.description + " >" +
			"-".padEnd((68 - appInfo.description.length) / 2, "-");

		return [
			// '/===========================v======================================================\\',
			// '|     /////// ////// ////// | AC TOOLS - Extensions for VS-Code and NodeJS         |',
			// '|    //   // //       //    | (C) 2020 Alan Candido (BRODAO) <brodao@gmail.com>    |',
			// '|   /////// //       //     | https://github.com/brodao/actools-extensions         |',
			// `|  //   // //       //      | ${appInfo.name.padEnd( 40, ' ' )} [${appInfo.version.padStart(9, ' ')}] |`,
			// `| //   // //////   //       | ${appInfo.description.padEnd(52, ' ')} |`,
			// '\\===========================^======================================================/',
			display,
			"    o O O    ___      ___      _____    ___      ___     _         ___  ",
			"   o   _    /   \\    / __|    |_   _|  / _ \\    / _ \\   | |       / __| ",
			"  _Y__[O]   | - |   | (__       | |   | (_) |  | (_) |  | |__     \\__ \\ ",
			" {======|  _|_|_|_  _\\___|_  ___|_|_  _\\___/_  _\\___/_  |____|_  _|___/_",
			"./o--000' \"`-0-0-' \"`-0-0-' \"`-0-0-' \"`-0-0-' \"`-0-0-' \"`-0-0-' \"`-0-0-'",
			description,
			`Extensions for VS-Code and NodeJS       ${appInfo.name.padStart(32, ' ' )}`,
			`(C) 2020-21 Alan Candido (bródão)       ${("Versão: ").concat(appInfo.version).padStart(32, ' ' )}`,
			`brodao@gmail.com ${appInfo.url.padStart(55, ' ' )}`,
			'',
		];
	}

	private showHeader() {
		if (this._config.appInfo) {
			if (!this._config.showBanner) {
				this.appText(this._config.appInfo).forEach((line: string) =>
					this.help(line)
				);
			} else {
				this.banner(this._config.appInfo).forEach((line: string) =>
					this.help(line)
				);
			}
		}
	}
}

const loggerMap: Map<string, ILogger> = new Map<string, ILogger>();
const actLogger: ILogger = createLogger('_act_', {
	appInfo: {
		name: 'AC Tools',
		displayName: 'AC Tools',
		version: '',
		description: 'AC Tools',
		url: '',
		getShortName: () => {
			return 'actools-js';
		},
	},
	verbose: 'verbose',
	showBanner: true,
});

export function getLogger(id: string): ILogger {
	return loggerMap.get(id) || actLogger;
}

export function createLogger(id: string, config: ILoggerConfig): ILogger {
	const newLogger: ILogger = new Logger(id, config);
	loggerMap.set(id, newLogger);

	return newLogger;
}
