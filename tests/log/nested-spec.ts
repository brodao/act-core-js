import { ACT } from '../../lib';

const { wrap } = require('@brodao/act-jest-snapshot-console');

test('Mensagem aninhada', () => {
	expect(
		wrap(() => {
			ACT.logger.nested('Mensagem aninhada', ['linha 1', 'linha 2', 10]);
		})
	).toMatchSnapshot();
});
