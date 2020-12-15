import ACT from '../../lib/index';

const { wrap } = require('@brodao/act-jest-snapshot-console');

test('Mensagem aninhada', () => {
	expect(
		wrap(() => {
			const cmd = ACT.commander.newCommand({
				name: 'app_commander_test',
				commandText: true,
				optionsText: true,
				version: '99.99.99',
			});

			return cmd.helpInformation();
		})
	).toMatchSnapshot();
});
