import * as _act_command from './command';
import * as _act_logger from './logger';

//export const act_jsonFile = _act_jsonFile;

export interface IACTModule {
	command: any;
	logger: any;
}

const ACT: IACTModule = {
	command: _act_command,
	logger: _act_logger,
};

export { ACT };
