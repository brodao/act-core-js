// @flow

const chalk = require("chalk");
const program = require("commander");

type Color = (...text: string[]) => string;

let _bundleProgressBar: any;
let _oraSpinner: any;

let _printNewLineBeforeNextLog = false;

function _maybePrintNewLine() {
	if (_printNewLineBeforeNextLog) {
		_printNewLineBeforeNextLog = false;
		console.log("");
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
	console.log(...args);
}

function respectProgressBars(commitLogs: () => void) {
	if (_bundleProgressBar) {
		_bundleProgressBar.terminate();
		_bundleProgressBar.lastDraw = "";
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

function withPrefixAndTextColor(args: any[], chalkColor: Color = chalk.gray) {
	if (program.nonInteractive) {
		return [getPrefix(chalkColor), ...args.map((arg) => chalkColor(arg))];
	} else {
		return args.map((arg) => chalkColor(arg));
	}
}

function withPrefix(args: any[], chalkColor = chalk.gray) {
	if (program.nonInteractive) {
		return [getPrefix(chalkColor), ...args];
	} else {
		return args;
	}
}

function actLogger(...args: any[]) {
	if (actLogger.config.raw) {
		return;
	}

	respectProgressBars(() => {
		consoleLog(...withPrefix(args));
	});
}

actLogger.nested = (message: any) => {
	respectProgressBars(() => {
		consoleLog(message);
	});
};

actLogger.newLine = function newLine() {
	respectProgressBars(() => {
		consoleLog("");
	});
};

actLogger.printNewLineBeforeNextLog = function printNewLineBeforeNextLog() {
	_printNewLineBeforeNextLog = true;
};

actLogger.error = function error(...args: any[]) {
	if (actLogger.config.raw) {
		return;
	}

	respectProgressBars(() => {
		consoleError(...withPrefixAndTextColor(args, chalk.red));
	});
};

actLogger.warn = function warn(...args: any[]) {
	if (actLogger.config.raw) {
		return;
	}

	respectProgressBars(() => {
		consoleWarn(...withPrefixAndTextColor(args, chalk.yellow));
	});
};

actLogger.gray = (...args: any[]) => {
	if (actLogger.config.raw) {
		return;
	}

	respectProgressBars(() => {
		consoleLog(...withPrefixAndTextColor(args));
	});
};

actLogger.raw = (...args: any[]) => {
	if (!actLogger.config.raw) {
		return;
	}

	respectProgressBars(() => {
		consoleLog(...args);
	});
};

actLogger.verbose = (text: string | string[], args?: any) => {
	if (!actLogger.config.verboseEnable) {
		return;
	}

	if (args) {
		actLogger.warn(text);
		Object.keys(args).forEach((key) => {
			actLogger.nested(`  ${key} ${chalk.bold(args[key])}`);
		});
	} else {
		actLogger.gray(text);
	}
};

actLogger.chalk = chalk;

actLogger.config = {
	raw: false,
	verboseEnable: false,
	showSplash: true,
};

export interface IAppInfo {
	name: string;
	version: string;
	description: string;
}

actLogger.showBanner = (appInfo: IAppInfo) => {
	if (!actLogger.config.showSplash) {
		return;
	}

	actLogger.newLine();

	actLogger.gray(
		"/====================v======================================================\\"
	);
	actLogger.gray(
		"|     /////// ////// | AC FERRAMENTAS - Extensões para VS-Code e Node.JS    |"
	);
	actLogger.gray(
		"|    //   // //      | (C) 2020 Alan Candido (BRODAO) <brodao@gmail.com>    |"
	);
	actLogger.gray(
		"|   /////// //       |                                                      |"
	);
	actLogger.gray(
		"|  //   // //        | Ferramentas de apoio a desenvolvedores TOTVS         |"
	);
	actLogger.gray(
		"| //   // //////     | https://github.com/brodao/workspace/projects/AFPV    |"
	);
	actLogger.gray(
		"\\====================^======================================================/"
	);
	actLogger.gray(
		`${appInfo.name} [${appInfo.version}] ${appInfo.description}`
	);

	actLogger.newLine();
};

export default actLogger;
