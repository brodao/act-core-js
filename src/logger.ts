import winston from 'winston';
import { IAppInfo, ILoggerConfig } from './model/model_interfaces';

const __logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { service: 'user-service' },
	transports: [
		//
		// - Write all logs with level `error` and below to `error.log`
		// - Write all logs with level `info` and below to `combined.log`
		//
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
		new winston.transports.File({ filename: 'combined.log' }),
	],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
	__logger.add(
		new winston.transports.Console({
			format: winston.format.simple(),
		})
	);
}

class Logger {
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

	nested(message: any) {
		console.error('> ' + message);
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

let _loggerMap: Map<string, Logger> = new Map<string, Logger>();
_loggerMap.set('', new Logger());

export function logger(id: string = ''): Logger | undefined {
	return _loggerMap.get(id);
}

export function createLogger(id: string): Logger | undefined {
	_loggerMap.set(id, new Logger());
	return logger(id);
}
