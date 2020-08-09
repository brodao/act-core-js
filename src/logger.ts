// @flow

const chalk = require('chalk');
const program = require('commander');

type Color = (...text: string[]) => string;

let _bundleProgressBar: any;
let _oraSpinner: any;

let _printNewLineBeforeNextLog = false;

function _maybePrintNewLine() {
	if (_printNewLineBeforeNextLog) {
		_printNewLineBeforeNextLog = false;
		console.log();
	}
}

function consoleLog(...args: any[]) {
	_maybePrintNewLine();
	console.log(...args);
}

function consoleWarn(...args: any[]) {
	_maybePrintNewLine();
	console.warn(...args);
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

function log(...args: any[]) {
	if (log.config.raw) {
		return;
	}

	respectProgressBars(() => {
		consoleLog(...withPrefix(args));
	});
}

log.nested = (message: any) => {
	respectProgressBars(() => {
		consoleLog(message);
	});
};

log.newLine = function newLine() {
	respectProgressBars(() => {
		consoleLog();
	});
};

log.printNewLineBeforeNextLog = function printNewLineBeforeNextLog() {
	_printNewLineBeforeNextLog = true;
};

log.error = function error(...args: any[]) {
	if (log.config.raw) {
		return;
	}

	respectProgressBars(() => {
		consoleError(...withPrefixAndTextColor(args, chalk.red));
	});
};

log.warn = function warn(...args: any[]) {
	if (log.config.raw) {
		return;
	}

	respectProgressBars(() => {
		consoleWarn(...withPrefixAndTextColor(args, chalk.yellow));
	});
};

log.gray = (...args: any[]) => {
	if (log.config.raw) {
		return;
	}

	respectProgressBars(() => {
		consoleLog(...withPrefixAndTextColor(args));
	});
};

log.raw = (...args: any[]) => {
	if (!log.config.raw) {
		return;
	}

	respectProgressBars(() => {
		consoleLog(...args);
	});
};

log.verboseOn = () => {
	log.config.verboseEnable = true;
};

log.verboseOff = () => {
	log.config.verboseEnable = false;
};

log.verbose = (text: string | string[], args?: any) => {
	if (!log.config.verboseEnable) {
		return;
	}

	if (args) {
		log.warn(text);
		Object.keys(args).forEach((key) => {
			log.nested(`  ${key} ${chalk.bold(args[key])}`);
		});
	} else {
		log.gray(text);
	}
};

log.chalk = chalk;

log.config = {
	raw: false,
	verboseEnable: false,
};

export interface IAppInfo {
	name: string;
	version: string;
	description: string;
}

log.showBanner = (appInfo: IAppInfo) => {
	log.newLine();

	log.gray(
		'/====================v======================================================\\'
	);
	log.gray(
		'|     /////// ////// | AC FERRAMENTAS - Extensões para VS-Code e Node.JS    |'
	);
	log.gray(
		'|    //   // //      | (C) 2020 Alan Candido (BRODAO) <brodao@gmail.com>    |'
	);
	log.gray(
		'|   /////// //       |                                                      |'
	);
	log.gray(
		'|  //   // //        | Ferramentas de apoio a desenvolvedores TOTVS         |'
	);
	log.gray(
		'| //   // //////     | https://github.com/brodao/workspace/projects/AFPV    |'
	);
	log.gray(
		'\\====================^======================================================/'
	);
	log.gray(`${appInfo.name} [${appInfo.version}] ${appInfo.description}`);

	log.newLine();
};

export default log;
