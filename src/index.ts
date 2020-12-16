import { actCommander } from './command';
import { actLogger, getLogger } from './logger';
import { actJson } from './jsonFile';
import {
	ICommander,
	IJsonFile,
	ILogger,
	ILoggerConfig,
} from './model/model_interfaces';

export interface IACTModule {
	commander: ICommander;
	logger: ILogger;
	getLogger: (id: string, config?: ILoggerConfig) => ILogger;
	jsonFile: IJsonFile;
}

const ACT: IACTModule = {
	commander: actCommander,
	logger: actLogger,
	getLogger: (id: string, config?: ILoggerConfig): ILogger => {
		return getLogger(id.toLowerCase(), config);
	},
	jsonFile: actJson,
};

export default ACT;
