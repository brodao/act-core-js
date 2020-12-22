import * as Command from "commander";
import { IAppCommander, IAppOptions, ILogger } from "./interfaces";
import { createLogger } from "./logger";

export class AppCommander implements IAppCommander {
	_command: Command.Command;
	_logger: ILogger;

	constructor(options: IAppOptions) {
		const label: string =
			options.appInfo.shortName?.trim() ||
			options.appInfo.name.split("/").reverse()[0];

		this._command = newAppCommand(options);
		this._logger = createLogger(options.appInfo.name, { label });

		this._command
			.on("option:verbose", () => {
				this._logger.reconfig({ verbose: this._command.verbose });
			})
			.on("option:no-banner", () => {
				this._logger.reconfig({ showBanner: this._command.showBanner });
			})
			.on("option:log-to-file", () => {
				this._logger.reconfig({ showBanner: this._command.showBanner });
			})
			.on("option:log-format", () => {
				this._logger.reconfig({ showBanner: this._command.showBanner });
			});
	}

	appCommand() {
		return this._command;
	}

	appLogger() {
		return this._logger;
	}
}

export function newAppCommand(options: IAppOptions): Command.Command {
	const program: Command.Command = new Command.Command(options.appInfo.name)
		.version(options.appInfo.version, "-v, --version")
		.usage(
			(options.commandText ? "<command>" : "") +
				(options.commandText && options.optionsText ? " " : "") +
				(options.optionsText ? "[options]" : "")
		);
	// .allowUnknownOption(true);
	program
		.option("--verbose", "detalha a execução", false) //
		.option("--no-banner", "omite a abertura", true)
		.option("--log-to-file", "gera arquivo com as ocorrências", false)
		.option("--log-format <json|text>", "formato do arquivo de logo", "text");

	return program;
}
