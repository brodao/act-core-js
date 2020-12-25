import { AppCommander } from './appCommand';
import { IAppCommander, IAppOptions } from './interfaces';
import { jsonFromFile, jsonToFile } from './jsonFile';
import { getLogger } from './logger';

export namespace ACT {
	let appCommander: IAppCommander;

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
