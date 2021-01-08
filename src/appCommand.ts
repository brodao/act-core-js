import * as Command from 'commander';
import * as path from 'path';
import * as os from 'os';
import { IAppConfig, ILogger } from './interfaces';
import { appConfig } from './appConfig';

const homedir: string = path.join(os.homedir(), '.act-nodejs');

export class AppCommand extends Command.Command {
	private _logger?: ILogger;
	private _environment: IAppConfig;

	constructor(name: string, logger?: ILogger /*, environment?: IAppConfig*/) {
		super(name);
		this._logger = logger;
		this._environment = appConfig;
	}

	outputHelp(cb?: (str: string) => string): void {
		if (this._logger) {
			this._logger.help(this.helpInformation());
			this.emit(this._helpLongFlag);
		} else {
			super.outputHelp(cb);
		}
	}

	createCommand(name: string): AppCommand {
		return new AppCommand(name, this._logger);
	}

	parse(argv?: string[], options?: Command.ParseOptions): this {
		const file: string = path.join(homedir, '.env');
		this._logger?.info('Loadind environment from %s', file);

		const result: this = super.parse(this.finishFilling(argv), options);

		this._logger?.verbose('Arguments', result.args);
		this._logger?.verbose('Options', result.opts());

		return result;
	}

	finishFilling(argv?: string[]): string[] {
		const newArgv: string[] = argv ? [...argv] : [];
		const env: IAppConfig = this._environment;

		env.keys().forEach((key) => {
			const value: any = env.get(key);

			if (key.startsWith('act')) {
				value.split(' ').forEach((part: string) => {
					if (!newArgv.includes(part)) {
						newArgv.push(part);
					}
				});
			}
		});

		return newArgv;
	}
}
