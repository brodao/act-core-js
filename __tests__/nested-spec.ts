import log from '../src/logger';

test('Mensagem aninhada', () => {
	expect(log.gray('Mensagem aninhada')).toMatchSnapshot();
});
