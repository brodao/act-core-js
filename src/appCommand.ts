import * as Command from 'commander';
import { IAppOptions } from './interfaces';

export function newAppCommand(options: IAppOptions): Command.Command {
	const program: Command.Command = new Command.Command(options.appInfo.name)
		.version(options.appInfo.version)
		.usage(
			(options.commandText ? '<command>' : '') +
				(options.commandText && options.optionsText ? ' ' : '') +
				(options.optionsText ? '[options]' : '')
		);
	//.allowUnknownOption(true);
	program
		.option('-v, --verbose', 'detalha a execução', false) //
		.option('--no-banner', 'omite a abertura', true);

	return program;
}
