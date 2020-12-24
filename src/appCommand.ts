import * as Command from "commander";
import * as path from "path";
import * as os from "os";
import * as dotenv from "dotenv";
import { ParseOptions } from "commander";
import { IAppCommander, IAppOptions, ILogger } from "./interfaces";
import { createLogger } from "./logger";

const homedir: string = path.join(os.homedir(), ".act-nodejs");

class AppCommand extends Command.Command {
	private _logger?: ILogger;

	constructor(name: string, logger?: ILogger) {
		super(name);
		this._logger = logger;
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

	parse(argv?: string[], options?: ParseOptions): this {
		const result: this = super.parse(finishFilling(argv), options);

		this._logger?.verbose("Argumentos", result.args);
		this._logger?.verbose("Opções", result.opts());

		return result;
	}
}

function finishFilling(argv?: string[]): string[] {
	const newArgv: string[] = [];

	if (argv) {
		newArgv.push(...argv);
	}

	const env: dotenv.DotenvConfigOutput = dotenv.config({
		path: path.join(homedir, ".env"),
	});
	if (env.error) {
		throw env.error;
	}

	// console.log(JSON.stringify(argv));
	// console.log("");
	// console.log(JSON.stringify(env));
	// console.log("");
	// console.log(JSON.stringify(newArgv));

	return newArgv;
}

export class AppCommander implements IAppCommander {
	_command: AppCommand;
	_logger: ILogger;

	constructor(options: IAppOptions) {
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
			.on("option:verbose", () => {
				this._logger.setConfig({ verbose: this._command.verbose });
			})
			.on("option:no-banner", () => {
				this._logger.setConfig({ showBanner: this._command.showBanner });
			})
			.on("option:log-to-file", () => {
				this._logger.setConfig({ showBanner: this._command.showBanner });
			})
			.on("option:log-format", () => {
				this._logger.setConfig({ showBanner: this._command.showBanner });
			})
			.on("command:*", (operands) => {
				this._logger.error("Comando desconhecido %s", operands[0]);
				const availableCommands: string[] = this._command.commands.map((cmd) =>
					cmd.name()
				);
				this._logger.nested("help", "Comandos", ...availableCommands);
				process.exitCode = 1;
			});
	}

	appCommand() {
		return this._command;
	}

	appLogger() {
		return this._logger;
	}
}

function newAppCommand(options: IAppOptions, logger: ILogger): Command.Command {
	const program: Command.Command = new AppCommand(
		options.appInfo.getShortName(),
		logger
	)
		.version(options.appInfo.version, "-v, --version")
		.usage(
			(options.commandText ? "<command>" : "") +
				(options.commandText && options.optionsText ? " " : "") +
				(options.optionsText ? "[options]" : "")
		)
		.option("--verbose", "detalha a execução", false) //
		.option("--no-banner", "omite a abertura", true)
		.option("--log-to-file", "gera arquivo com as ocorrências", false)
		.option("--log-format <json|text>", "formato do arquivo de logo", "text");

	return program;
}
