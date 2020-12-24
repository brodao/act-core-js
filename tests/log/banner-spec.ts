import { ACT } from '../../lib';

const { wrap } = require('@brodao/act-jest-snapshot-console');

describe("Testa a apresentação ou não do 'splash' completo", () => {
	test("Apresenta o 'splash'", () => {
		ACT.logger.setConfig({ showBanner: true });

		expect(wrap(() => ACT.logger.info('splash completo'))).toMatchSnapshot();
	});

	test("Apresenta um 'splash' simples de identificação", () => {
		ACT.logger.setConfig({ showBanner: false });

		expect(wrap(() => ACT.logger.info('<splash simples'))).toMatchSnapshot();
	});
});
