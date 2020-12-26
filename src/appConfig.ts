import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { IAppConfig } from './interfaces';

const homedir: string = path.join(os.homedir(), '.act-nodejs');
const file: string = path.join(homedir, '.env');

class AppConfig implements IAppConfig {
	private _options: dotenv.DotenvConfigOptions;
	private _dotenv: dotenv.DotenvParseOutput;

	constructor(options?: dotenv.DotenvConfigOptions) {
		this._options = options || { path: file };
		this._dotenv = this.reload();
	}

	reload(): dotenv.DotenvParseOutput {
		const config: dotenv.DotenvConfigOutput = dotenv.config({
			...this._options,
			debug: true,
		});

		if (config.error) {
			throw config.error;
		}

		return config.parsed || dotenv.parse('');
	}

	keys(): string[] {
		return Object.keys(this._dotenv);
	}

	get(key: string, defaultValue?: string): string {
		return this._dotenv[key] || defaultValue || '';
	}

	set(key: string, value: string) {
		this._dotenv[key] = value;
		this.save();
	}

	delete(key: string) {
		throw new Error(`delete: não implementado ${key}`);
		//this._dotenv.splice(key);
		//this.save();
	}

	private save(): void {
		let result: string = '';

		// Stringify
		for (const [key, value] of Object.entries(this._dotenv)) {
			if (key) {
				const line = `${key}=${String(value)}`;
				result += line + '\n';
			}
		}

		if (this._options.path) {
			fs.writeFileSync(this._options.path, result);
			this.reload();
		}
	}
}

export const appConfig = new AppConfig();
