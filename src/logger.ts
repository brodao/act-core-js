import * as winston from 'winston';
import * as os from 'os';
import * as path from 'path';
import { IAppInfo, ILogger, ILoggerConfig, LogLevel } from './interfaces';

const outDir: string = path.join(os.homedir(), ".act-nodejs"); //process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE || "./";

const fileTextFormat = winston.format.printf(
	({ level, message, label, timestamp }) => {
		return `${timestamp} [${label}] ${level}: ${message}`;
	}
);

const consoleFormat = winston.format.printf(({ level, message, label }) => {
	if (level === 'prompt') {
		return `${message}`;
	}
	return `[${level.substr(0, 1).toUpperCase()}:${label}] ${message}`;
});

class Logger implements ILogger {
	private _config: ILoggerConfig = {
		label: undefined,
		verbose: false,
		showBanner: true,
		writeTextFile: true,
		writeJsonFile: false,
	};

	private _logger: winston.Logger;

	shouldIgnore = winston.format((info) => {
		// if (info.level == "verbose" && !this._config.verbose) {
		// 	return false;
		// }

		return info;
	});

	private _textFile: winston.transports.FileTransportInstance;
	private _jsonFile: winston.transports.FileTransportInstance;

	constructor(id: string, config: ILoggerConfig) {
		id = id.trim();

		const options: winston.LoggerOptions = {
			exitOnError: false,
			//level: "verbose",
			levels: winston.config.npm.levels,
			format: winston.format.combine(
				this.shouldIgnore(),
				winston.format.label({ label: config.label ? config.label : id }),
				winston.format.timestamp(),
				consoleFormat
			),
			transports: [
				new winston.transports.Console()
			],
		};

		this._textFile = new winston.transports.File({
			filename: id + '.log',
			dirname: outDir,
			format: fileTextFormat
		});

		this._jsonFile = new winston.transports.File({
			filename: id + '.json',
			dirname: outDir,
			format: winston.format.json()
		});

		this._logger = winston.createLogger(options);

		this.reconfig(config);
	}

	public config(): ILoggerConfig {
		return this._config;
	}

	public reconfig(newConfig: ILoggerConfig) {
		this._config = { ...this._config, ...newConfig };

		if (this._config.writeTextFile) {
			this._logger.add(this._textFile);
		} else {
			this._logger.remove(this._textFile);
		}

		if (this._config.writeJsonFile) {
			this._logger.add(this._jsonFile);
		} else {
			this._logger.remove(this._jsonFile);
		}

		// const opt: winston.LoggerOptions = {
		// };
		// this._logger.configure(opt)
	}

	nested(level: LogLevel, message: string, args: any) {
		this.consoleLog(level, message);

		Object.keys(args).forEach((key) => {
			if (typeof args[key] === 'object') {
				this.nested("data", key, args[key]);
			} else {
				this.consoleLog('data', `>  ${key} ${args[key]}`);
			}
		});
	}

	private consoleLog(level: LogLevel, message: string, data: any[] = []) {
		let msg: string = message;

		data.forEach((element: any, index: number) => {
			msg = msg.replace(`{${index}}`, element);
		});

		this._logger.log(level, msg);
	}

	error(...args: any[]) {
		this.consoleLog('error', args[0], args.slice(1));
	}

	warn(...args: any[]) {
		this.consoleLog('warn', args[0], args.slice(1));
	}

	log(...args: any[]) {
		this.consoleLog('log', args[0], args.slice(1));
	}

	prompt(question: string, anwser: any) {
		this.nested('prompt', question, anwser);
	}

	verbose(...args: any[]) {
		console.log(`>>>>>>>>>>>>> ${this._logger.isVerboseEnabled()}`);

		if (this._logger.isVerboseEnabled()) {
			const text: string = args[0] as string;
			this.nested("verbose", text, args.slice(1));
		}
	}

	appText(appInfo: IAppInfo): string[] {
		return [
			`${'AC TOOLS'} - Extensions for VS-Code and NodeJS`,
			`${appInfo.name} [${appInfo.version}] ${appInfo.description}`,
		];
	}

	banner(appInfo: IAppInfo): string[] {
		return [
			'/===========================v======================================================\\',
			`|     /////// ////// ////// | AC TOOLS - Extensions for VS-Code and NodeJS         |`,
			`|    //   // //       //    | (C) 2020 Alan Candido (BRODAO) <brodao@gmail.com>    |`,
			`|   /////// //       //     |     https://github.com/brodao/actools-extensions     |`,
			`|  //   // //       //      | ${appInfo.name.padEnd(
				40,
				' '
			)} [${appInfo.version.padStart(9, ' ')}] |`,
			`| //   // //////   //       | ${appInfo.description.padEnd(52, ' ')} |`,
			'\\===========================^======================================================/',
			``,
		];
	}

	showHeader(appInfo: IAppInfo) {
		if (!this._config.showBanner) {
			this.appText(appInfo).forEach((line: string) =>
				this.log(line)
			);
		} else {
			this.banner(appInfo).forEach((line: string) =>
				this.log(line)
			);
		}
	}
}

const loggerMap: Map<string, ILogger> = new Map<string, ILogger>();
const actLogger: ILogger = createLogger('_act_', {
	label: '_act_',
	verbose: true,
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
