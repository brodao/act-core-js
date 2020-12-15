import ACT from '../../lib/index';

const { wrap } = require('@brodao/act-jest-snapshot-console');

describe("Testa a apresentação ou não do 'splash' completo", () => {
	test("Apresenta o 'splash'", () => {
		ACT.logger.config.showSplash = true;

		expect(
			wrap(() =>
				ACT.logger.showBanner({
					name: 'test_show_banner',
					version: '99.99.99',
					description: 'Show Banner',
				})
			)
		).toMatchSnapshot();
	});

	test("Apresenta um 'splash' simples de identificação", () => {
		ACT.logger.config.showSplash = false;

		expect(
			wrap(() =>
				ACT.logger.showBanner({
					name: 'test_show_banner',
					version: '99.99.99',
					description: 'Show Banner',
				})
			)
		).toMatchSnapshot();
	});
});
