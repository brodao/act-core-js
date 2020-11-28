import commander from 'commander';
import { ICommandOptions } from './model/model_interfaces';

export function newCommand(commandOptions: ICommandOptions): commander.Command {
	const command: commander.Command = new commander.Command(commandOptions.name);

	if (commandOptions.version) {
		command.version(commandOptions.version);
	}

	if (commandOptions.commandText || commandOptions.optionsText) {
		let usageText: string = '';

		usageText += commandOptions.commandText;
		usageText += commandOptions.optionsText ? commandOptions.optionsText : '';
		usageText += commandOptions.optionsText;

		command.usage(usageText);
	}

	return command;
}

// export async function commandDidThrowAsync(error: any, exitCode?: number) {
// 	act_logger.newLine();
// 	act_logger.nested(chalk.red(`An unexpected error occurred:`));
// 	act_logger.nested(error);
// 	act_logger.newLine();

// 	if (exitCode) {
// 		process.exit(1);
// 	}
// }
