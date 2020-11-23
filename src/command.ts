import chalk from 'chalk';
import commander, { Command } from 'commander';
import act_logger from './logger';

export interface ICommandOptions {
	name: string;
	version?: string;
	commandText?: string;
	optionsText?: string;
}

export function newCommand(commandOptions: ICommandOptions): commander.Command {
	const command: commander.Command = new Command(commandOptions.name);

	if (commandOptions.version) {
		command.version(commandOptions.version);
	}

	if (commandOptions.commandText || commandOptions.optionsText) {
		let usageText: string = '';

		usageText += commandOptions.commandText
			? chalk.magenta(commandOptions.commandText) + ' '
			: '';
		usageText += commandOptions.optionsText ? commandOptions.optionsText : '';
		usageText += commandOptions.optionsText
			? chalk.yellowBright(commandOptions.optionsText) + ' '
			: '';

		command.usage(usageText);
	}

	return command;
}

export async function commandDidThrowAsync(error: any, exitCode?: number) {
	act_logger.newLine();
	act_logger.nested(chalk.red(`An unexpected error occurred:`));
	act_logger.nested(error);
	act_logger.newLine();

	if (exitCode) {
		process.exit(1);
	}
}
