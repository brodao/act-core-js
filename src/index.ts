import { actCommander } from './command';
import { actLogger, getLogger } from './logger';
import { actJson } from './jsonFile';
import { ICommander, IJsonFile, ILogger } from './model/model_interfaces';

export interface IACTModule {
	commander: ICommander;
	logger: ILogger;
	getLogger: (id: string) => ILogger;
	jsonFile: IJsonFile;
}

const ACT: IACTModule = {
	commander: actCommander,
	logger: actLogger,
	getLogger: (id: string): ILogger => {
		return getLogger(id.toLowerCase());
	},
	jsonFile: actJson,
};

export default ACT;
