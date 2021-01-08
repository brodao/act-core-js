import { IAppCommander, IAppConfig, IAppOptions, ILogger } from './interfaces';
import * as winston from 'winston';
import { createLogger } from './logger';
import { appConfig } from './appConfig';
import { AppCommand } from './appCommand';
import * as Command from 'commander';

export class AppCommander implements IAppCommander {
	_command: AppCommand;
	_logger: ILogger;
	_config: IAppConfig;

	constructor(options: IAppOptions) {
		this._config = appConfig;

		this._logger = createLogger(options.appInfo.name, {
			appInfo: options.appInfo,
		});

		this._command = newAppCommand(
			{
				...options,
				appInfo: options.appInfo,
			},
			this._logger
		);

		this._command
			.on('option:verbose', () => {
				this._logger.setConfig({ verbose: this._command.verbose });
			})
			.on('option:no-banner', () => {
				this._logger.setConfig({ showBanner: this._command.showBanner });
			})
			.on('option:log-to-file', () => {
				this._logger.setConfig({ showBanner: this._command.showBanner });
			})
			.on('option:log-format', () => {
				this._logger.setConfig({ showBanner: this._command.showBanner });
			})
			.on('command:*', (operands) => {
				this._logger.error('Comando desconhecido %s', operands[0]);
				const availableCommands: string[] = this._command.commands.map((cmd) =>
					cmd.name()
				);
				this._logger.nested('help', 'Comandos', ...availableCommands);
				process.exitCode = 1;
			});

		this._command
			.command('config [key] [value]')
			.description('Mantem ou lista as configurações.', {
				key: 'identificador da chave',
				value: 'novo valor. Se não informado, assumirá vazio',
			})
			.option(
				'-l, --list',
				'lista valores atuais (padrão). Ignora [key] e [value]'
			)
			.option('-u, --update', 'se não existir cria, senão atualiza a chave')
			.option('-r, --remove', 'remove a chave')
			.action((key: string, value: string, cmd: Command.Command) => {
				if (cmd.list) {
					runConfig(this._logger, this._config);
				} else {
					runConfig(this._logger, this._config, key, value, cmd.remove);
				}
			});
	}

	collect(value: string, previous: string[]) {
		return previous.concat([value]);
	}

	commaSeparatedList(value: string, separator: string = ','): string[] {
		return value.split(separator);
	}

	appConfig() {
		return this._config;
	}

	appCommand() {
		return this._command;
	}

	appLogger() {
		return this._logger;
	}
}

function newAppCommand(options: IAppOptions, logger: ILogger): AppCommand {
	const levels: string[] = [];
	Object.keys(winston.config.cli.levels).forEach((value: string) => {
		levels.push(value);
	});
	const program: AppCommand = new AppCommand(
		options.appInfo.getShortName(),
		logger
	)
		.version(options.appInfo.version, '-v, --version')
		.helpOption('-h, --help', 'apresenta ajuda sobre o comando')
		.option(
			'--verbose [level]',
			'detalhamento da execução\nLevel: ' + levels.join(' | '),
			'info'
		) //
		.option('--no-banner', 'omite a abertura', true)
		.option('--log-to-file', 'gera arquivo com as ocorrências', false)
		.option(
			'--log-format <json|text>',
			'formato do arquivo de ocorrências',
			'text'
		);

	return program;
}

function runConfig(
	logger: ILogger,
	_appConfig: IAppConfig,
	key?: string,
	value?: string,
	remove?: boolean
): void {
	for (const [_key, _value] of Object.entries(_appConfig)) {
		if (key) {
			if (remove) {
				logger.data('X %s = %s', _key, _value);
				appConfig.delete(_key);
			} else {
				logger.data('U %s->%s', _key, _value, value);
				appConfig.set(_key, _value);
			}
		}
	}
}
