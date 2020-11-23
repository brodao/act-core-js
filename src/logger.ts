import * as chalk from 'chalk';
import * as program from 'commander';
import ora from 'ora';
// @ts-ignore
const chalkRaw = new chalk.Instance({ raw: ['bold', {}], level: 0 });

type Color = (...text: string[]) => string;

let _bundleProgressBar: any;
let _oraSpinner: any;

let _printNewLineBeforeNextLog = false;

function _maybePrintNewLine() {
	if (_printNewLineBeforeNextLog) {
		_printNewLineBeforeNextLog = false;
		console.log('');
	}
}

function consoleLog(...args: any[]) {
	_maybePrintNewLine();
	console.log(...args);
}

function consoleWarn(...args: any[]) {
	_maybePrintNewLine();
	console.log(...args);
}

function consoleError(...args: any[]) {
	_maybePrintNewLine();
	console.error(...args);
}

function respectProgressBars(commitLogs: () => void) {
	if (_bundleProgressBar) {
		_bundleProgressBar.terminate();
		_bundleProgressBar.lastDraw = '';
	}
	if (_oraSpinner) {
		_oraSpinner.stop();
	}
	commitLogs();

	if (_bundleProgressBar) {
		_bundleProgressBar.render();
	}
	if (_oraSpinner) {
		_oraSpinner.start();
	}
}

function getPrefix(chalkColor: Color) {
	return chalkColor(`[${new Date().toTimeString().slice(0, 8)}]`);
}

function withPrefixAndTextColor(
	args: any[],
	chalkColor: Color = act_logger.chalk.gray
) {
	if (program.nonInteractive) {
		return [getPrefix(chalkColor), ...args.map((arg) => chalkColor(arg))];
	} else {
		return args.map((arg) => chalkColor(arg));
	}
}

function withPrefix(args: any[], chalkColor = act_logger.chalk.gray) {
	if (program.nonInteractive) {
		return [getPrefix(chalkColor), ...args];
	} else {
		return args;
	}
}

function adjustRaw() {
	// @ts-expect-error
	act_logger.chalk = act_logger.config.raw ? chalkRaw : chalk;
}

function act_logger(...args: any[]) {
	adjustRaw();

	respectProgressBars(() => {
		consoleLog(...withPrefix(args));
	});
}

act_logger.nested = (message: any) => {
	respectProgressBars(() => {
		consoleLog(message);
	});
};

act_logger.newLine = function newLine() {
	respectProgressBars(() => {
		consoleLog('');
	});
};

act_logger.printNewLineBeforeNextLog = function printNewLineBeforeNextLog() {
	_printNewLineBeforeNextLog = true;
};

act_logger.error = function error(...args: any[]) {
	adjustRaw();

	respectProgressBars(() => {
		consoleError(...withPrefixAndTextColor(args, act_logger.chalk.red));
	});
};

act_logger.warn = function warn(...args: any[]) {
	adjustRaw();

	respectProgressBars(() => {
		consoleWarn(...withPrefixAndTextColor(args, act_logger.chalk.yellow));
	});
};

act_logger.gray = (...args: any[]) => {
	adjustRaw();

	respectProgressBars(() => {
		consoleLog(...withPrefixAndTextColor(args));
	});
};

act_logger.verbose = (text: string | string[], args?: any) => {
	if (!act_logger.config.verboseEnable) {
		return;
	}

	if (args) {
		act_logger.warn(text);
		Object.keys(args).forEach((key) => {
			act_logger.nested(`  ${key} ${act_logger.chalk.bold(args[key])}`);
		});
	} else {
		act_logger.gray(text);
	}
};

act_logger.chalk = chalk;

act_logger.config = {
	raw: false,
	verboseEnable: false,
	showSplash: true,
};

export interface IAppInfo {
	name: string;
	version: string;
	description: string;
}

const appText = (
	name: string,
	version: string,
	description: string
): string[] => {
	return [
		`${act_logger.chalk.bold('AC TOOLS')} - Extensions for VS-Code and NodeJS`,
		'See https://github.com/brodao/workspace/projects/AFPV',
		`${name} [${version}] ${description}`,
	];
};

const banner = (
	name: string,
	version: string,
	description: string
): string[] => {
	const b = act_logger.chalk.bold;
	return [
		'/====================v======================================================\\',
		`| ${b('    /////// //////')} | ${b(
			'AC TOOLS'
		)} - Extensions for VS-Code and NodeJS   |`,
		`| ${b(
			'   //   // //     '
		)} | (C) 2020 Alan Candido (BRODAO) <brodao@gmail.com>    |`,
		`| ${b(
			'  /////// //      '
		)} |                                                      |`,
		`| ${b(
			' //   // //       '
		)} | Support tools for TOTVS developers         |`,
		`| ${b(
			'//   // //////    '
		)} | https://github.com/brodao/workspace/projects/AFPV    |`,
		'\\====================^======================================================/',
		`${name} [${version}] ${description}`,
	];
};

act_logger.showBanner = (appInfo: IAppInfo) => {
	adjustRaw();

	if (!act_logger.config.showSplash) {
		appText(
			appInfo.name,
			appInfo.version,
			appInfo.description
		).forEach((line: string) => act_logger.gray(line));
	} else {
		banner(
			appInfo.name,
			appInfo.version,
			appInfo.description
		).forEach((line: string) => act_logger.gray(line));
	}
};

act_logger.logNewSection = (title: string) => {
	let spinner = ora(chalk.bold(title));
	spinner.start();
	return spinner;
};

export default act_logger;
