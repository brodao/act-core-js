import * as winston from 'winston';
import * as os from 'os';
import { IAppInfo, ILogger, ILoggerConfig } from './interfaces';

const outDir: string = os.homedir(); //process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE || "./";
const defaultFormat = winston.format.printf(
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
	_config: ILoggerConfig = {
		verbose: false,
		showBanner: true,
	};

	_id: string;
	_logger: winston.Logger;

	constructor(id: string, config?: ILoggerConfig) {
		if (config) {
			this._config = config;
		}

		const options: winston.LoggerOptions = {
			levels: winston.config.cli.levels,
			//level: 'info',
			format: winston.format.combine(
				winston.format.label({ label: id }),
				winston.format.timestamp(),
				defaultFormat
			),
			transports: [
				this._config.verbose
					? new winston.transports.Console({
							level: 'verbose',
							format: consoleFormat,
					  })
					: new winston.transports.Console({
							level: 'prompt',
							format: consoleFormat,
					  }),
				new winston.transports.File({
					filename: 'combined.log',
					dirname: outDir,
				}),
			],
		};

		this._id = id;
		//this._logger = actLogger?(actLogger as Logger)._logger.child({ requestId: id }):winston.createLogger(options);
		this._logger = winston.createLogger(options);
	}

	nested(message: string, args: any) {
		this.consoleLog('error', message);

		Object.keys(args).forEach((key) => {
			if (typeof args[key] === 'object') {
				this.nested(key, args[key]);
			} else {
				this.consoleLog('data', `>  ${key} ${args[key]}`);
			}
		});
	}

	private consoleLog(level: string, message: string, data: any[] = []) {
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
		this.consoleLog('info', args[0], args.slice(1));
	}

	verbose(...args: any[]) {
		if (this._logger.isVerboseEnabled()) {
			const text = args[0];

			if (args.length > 1) {
				this.nested(text, args.slice(1));
			} else {
				this._logger.verbose(text);
			}
		}
	}

	appText(appInfo: IAppInfo): string[] {
		return [
			`${'AC TOOLS'} - Extensions for VS-Code and NodeJS`,
			'See https://github.com/brodao/actools-extensions',
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
				this.consoleLog('prompt', line)
			);
		} else {
			this.banner(appInfo).forEach((line: string) =>
				this.consoleLog('prompt', line)
			);
		}
	}
}

const loggerMap: Map<string, ILogger> = new Map<string, ILogger>();

export function getLogger(id: string, config?: ILoggerConfig): ILogger {
	return loggerMap.get(id) || createLogger(id, config);
}

function createLogger(id: string, config?: ILoggerConfig): ILogger {
	const newLogger: ILogger = new Logger(id, config);
	loggerMap.set(id, newLogger);

	return newLogger;
}
