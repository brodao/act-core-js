import { IAppInfo, ILogger, ILoggerConfig } from './model/model_interfaces';
import * as winston from 'winston';
import * as os from 'os';

const outDir: string = os.homedir(); //process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE || "./";
const defaultFormat = winston.format.printf(
	({ level, message, label, timestamp }) => {
		return `${timestamp} [${label}] ${level}: ${message}`;
	}
);
const options: winston.LoggerOptions = {
	level: 'info',
	format: winston.format.combine(
		winston.format.label({ label: 'right meow!' }),
		winston.format.timestamp(),
		defaultFormat
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: `${outDir} combined.log` }),
	],
};

const defaultLogger: winston.Logger = winston.createLogger(options); //

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
	defaultLogger.add(
		new winston.transports.Console({
			format: winston.format.simple(),
		})
	);
}

class Logger implements ILogger {
	config: ILoggerConfig = {
		raw: false,
		verboseEnable: false,
		showSplash: true,
	};

	consoleLog(...args: any[]) {
		console.log(...args);
	}

	consoleWarn(...args: any[]) {
		console.log(...args);
	}

	consoleError(...args: any[]) {
		console.error(...args);
	}

	nested(message: string) {
		console.error('> ' + message);
	}

	newLine() {
		console.log('');
	}

	error(...args: any[]) {
		this.consoleError(args);
	}

	warn(...args: any[]) {
		this.consoleWarn(args);
	}

	log(...args: any[]) {
		this.consoleLog(args);
	}

	verbose(text: string | string[], args?: any) {
		// if (!act_logger.config.verboseEnable) {
		// 	return;
		// }

		if (args) {
			this.warn(text);
			Object.keys(args).forEach((key) => {
				this.nested(`  ${key} ${args[key]}`);
			});
		} else {
			this.log(text);
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
			'/====================v======================================================\\',
			`|     /////// ////// | AC TOOLS - Extensions for VS-Code and NodeJS         |`,
			`|    //   // //      | (C) 2020 Alan Candido (BRODAO) <brodao@gmail.com>    |`,
			`|   /////// //       |                                                      |`,
			`|  //   // //        |                                                      |`,
			`| //   // //////     | https://github.com/brodao/actools-extensions         |`,
			'\\====================^======================================================/',
			`${appInfo.name} [${appInfo.version}] ${appInfo.description}`,
		];
	}

	showBanner(appInfo: IAppInfo) {
		if (!this.config.showSplash) {
			this.appText(appInfo).forEach((line: string) => this.log(line));
		} else {
			this.banner(appInfo).forEach((line: string) => this.log(line));
		}
	}

	logNewSection(title: string) {
		return title;
	}
}

const loggerMap: Map<string, ILogger> = new Map<string, ILogger>();

export const actLogger: ILogger = getLogger('_act_');

export function getLogger(id: string): ILogger {
	return loggerMap.get(id) || createLogger(id);
}

function createLogger(id: string): ILogger {
	const newLogger:ILogger = new Logger();
	loggerMap.set(id, newLogger);

	return newLogger;
}
