import { ACT } from '../../lib/index';

const { wrap } = require('@brodao/act-jest-snapshot-console');

test('Mensagem aninhada', () => {
	expect(
		wrap(() => {
			const cmd = ACT.initialzeApp({
				appInfo: {
					name: 'app_commander_test',
					version: '99.99.99',
					description: 'App Commander test',
					url: 'http://no.url',
				},
				commandText: true,
				optionsText: true,
			});

			return cmd.appCommand().helpInformation();
		})
	).toMatchSnapshot();
});
