import { IAppInfo, ILogger, ILoggerConfig } from './model/model_interfaces';
import * as winston from 'winston';
import * as os from 'os';

const outDir: string = os.homedir(); //process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE || "./";
const defaultFormat = winston.format.printf(
	({ level, message, label, timestamp }) => {
		return `${timestamp} [${label}] ${level}: ${message}`;
	}
);

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
					? new winston.transports.Console({ level: 'verbose' })
					: new winston.transports.Console(),
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
		this.consoleLog('data', message);

		Object.keys(args).forEach((key) => {
			this.consoleLog('data', `>  ${key} ${args[key]}`);
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
			`|   /////// //       //     | * ${appInfo.name.padEnd(38, ' ')} [${appInfo.version.padStart(9,' ')}] |`,
			`|  //   // //       //      | ${appInfo.description.padEnd(52, "*")} |`,
			`| //   // //////   //       | https://github.com/brodao/actools-extensions         |`,
			'\\===========================^======================================================/',
			``,
		];
	}

	showBanner(appInfo: IAppInfo) {
		if (!this._config.showBanner) {
			this.appText(appInfo).forEach((line: string) => this.log(line));
		} else {
			this.banner(appInfo).forEach((line: string) => this.log(line));
		}
	}

	// logNewSection(title: string) {
	// 	return title;
	// }
}

const loggerMap: Map<string, ILogger> = new Map<string, ILogger>();

export const actLogger: ILogger = getLogger('_act_');

export function getLogger(id: string, config?: ILoggerConfig): ILogger {
	return loggerMap.get(id) || createLogger(id, config);
}

function createLogger(id: string, config?: ILoggerConfig): ILogger {
	const newLogger: ILogger = new Logger(id, config);
	loggerMap.set(id, newLogger);

	return newLogger;
}
