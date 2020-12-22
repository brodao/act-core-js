import { ACT } from '../../lib';
import { IAppInfo } from '../../lib/interfaces';

const { wrap } = require('@brodao/act-jest-snapshot-console');

const appInfo: IAppInfo = {
	shortName: 'test',
	name: 'test_show_banner',
	version: '99.99.99',
	description: 'Show Banner or single line',
	url: 'http://no.url',
};

describe("Testa a apresentação ou não do 'splash' completo", () => {
	test("Apresenta o 'splash'", () => {
		ACT.logger.reconfig({ showBanner: true });

		expect(wrap(() => ACT.logger.showHeader(appInfo))).toMatchSnapshot();
	});

	test("Apresenta um 'splash' simples de identificação", () => {
		ACT.logger.reconfig({ showBanner: false });

		expect(wrap(() => ACT.logger.showHeader(appInfo))).toMatchSnapshot();
	});
});
