import log from '../src/logger';

test('Informação simples', () => {
	expect(log.gray('Informação simples')).toMatchSnapshot();
});

test('Informação com vários agumentos', () => {
	expect(
		log.gray('Informação com argumentos', 'arg 1', 'arg 2', 'arg 3')
	).toMatchSnapshot();
});

test('Aviso simples', () => {
	expect(log.warn('Aviso simples')).toMatchSnapshot();
});

test('Aviso com vários agumentos', () => {
	expect(
		log.warn('Aviso com argumentos', 'arg 1', 'arg 2', 'arg 3')
	).toMatchSnapshot();
});

test('Erro simples', () => {
	expect(log.error('Erro simples')).toMatchSnapshot();
});

test('Erro com vários agumentos', () => {
	expect(
		log.error('Erro com argumentos', 'arg 1', 'arg 2', 'arg 3')
	).toMatchSnapshot();
});

test('Verbose simples', () => {
	log.verboseOn();

	expect(log.verbose('Verbose simples')).toMatchSnapshot();
});

test('Verbose com vários agumentos', () => {
	log.verboseOff();

	expect(
		log.verbose('Informação com argumentos', {
			'key 1': 'arg 1',
			'key 2': 'arg 2',
			'key 3': 3,
		})
	).toMatchSnapshot();
});

test('Verbose desligado', () => {
	log.verboseOff();
	expect(log.verbose('Verbose desligado')).toMatchSnapshot();
});

test('Log com argumentos {}', () => {
	log.verboseOff();
	expect(
		log.gray('Log com argumentos {0}, {1}, {2}', 'arg 1', 'arg 2', 3)
	).toMatchSnapshot();
});
