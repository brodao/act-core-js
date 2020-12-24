import { ACT } from '../../lib/index';

const { wrap } = require('@brodao/act-jest-snapshot-console');

test('Informação simples', () => {
	expect(wrap(() => ACT.logger.info('Informação simples'))).toMatchSnapshot();
});

test('Informação com vários agumentos', () => {
	expect(
		wrap(() =>
			ACT.logger.info(
				'Informação com argumentos %s,%s,%s',
				'arg 1',
				'arg 2',
				'arg 3'
			)
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
	// expect(
	// 	wrap(() =>
	// 		ACT.logger.error('Erro com argumentos', 'arg 1', 'arg 2', 'arg 3')
	// 	)
	// ).toMatchSnapshot();
});

test('Verbose simples', () => {
	ACT.logger.setConfig({ verbose: true });

	//expect(wrap(() => ACT.logger.verbose('Verbose simples'))).toMatchSnapshot();
});

test('Verbose com vários agumentos', () => {
	ACT.logger.setConfig({ verbose: true });

	// expect(
	// 	wrap(() =>
	// 		// ACT.logger.verbose('Informação com argumentos', {
	// 		// 	'key 1': 'arg 1',
	// 		// 	'key 2': 'arg 2',
	// 		// 	'key 3': 3,
	// 		// })
	// 	)
	//	).toMatchSnapshot();
});

test('Verbose desligado', () => {
	ACT.logger.setConfig({ verbose: false });

	//expect(wrap(() => ACT.logger.verbose('Verbose desligado'))).toMatchSnapshot();
});

test('Log com argumentos {}', () => {
	expect(
		wrap(() =>
			ACT.logger.info('Log com argumentos %s, %s, %d', 'arg 1', 'arg 2', 3)
		)
	).toMatchSnapshot();
});
