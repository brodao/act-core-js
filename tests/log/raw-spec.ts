import { ACT } from '../../lib/index';

const { wrap } = require('@brodao/act-jest-snapshot-console');

describe('Console em texto puro', () => {
	test("Apresenta o 'splash'", () => {
		expect(
			wrap(() =>
				ACT.logger.showHeader({
					name: 'test_show_banner',
					version: '99.99.99',
					description: 'Show Banner',
					url: 'http:://no.url',
				})
			)
		).toMatchSnapshot();
	});

	test('Aviso simples', () => {
		expect(wrap(() => ACT.logger.warn('Aviso simples'))).toMatchSnapshot();
	});

	test('Aviso com vários agumentos', () => {
		expect(
			wrap(() =>
				ACT.logger.warn('Aviso com argumentos', 'arg 1', 'arg 2', 'arg 3')
			)
		).toMatchSnapshot();
	});

	test('Erro simples', () => {
		expect(wrap(() => ACT.logger.error('Erro simples'))).toMatchSnapshot();
	});

	test('Erro com vários agumentos', () => {
		expect(
			wrap(() =>
				ACT.logger.error('Erro com argumentos', 'arg 1', 'arg 2', 'arg 3')
			)
		).toMatchSnapshot();
	});
});
