import * as Command from 'commander';
import { newAppCommand } from './appCommand';
import { IAppCommander, IAppOptions, ILogger } from './interfaces';
import { jsonFromFile, jsonToFile } from './jsonFile';
import { createLogger, getLogger } from './logger';

class AppCommander implements IAppCommander {
	_command: Command.Command;
	_logger: ILogger;

	constructor(options: IAppOptions) {
		let label: string = options.appInfo.shortName?.trim()
			|| options.appInfo.name.split('/').reverse()[0];

		this._command = newAppCommand(options);
		this._logger = createLogger(options.appInfo.name, { label: label });
	}

	appCommand() {
		return this._command;
	}

	appLogger() {
		return this._logger;
	}
}

export namespace ACT {
	var appCommander: IAppCommander;
	export const logger = getLogger('_act_');

	export function initialzeApp(options: IAppOptions) {
		if (!appCommander) {
			appCommander = new AppCommander(options);
		} else {
			throw new Error('ACT.initialzeApp already executed');
		}

		return appCommander;
	}

	export namespace json {
		export function fromFile(name: string): JSON {
			return jsonFromFile(name);
		}

		export function toFile(
			content: JSON,
			file: string,
			overwrite: boolean = false
		): void {
			return jsonToFile(content, file, overwrite);
		}
	}
}
