import log from '../src/logger';

test("Apresentação do 'Splash'", () => {
	expect(
		log.showBanner({
			name: 'test_show_banner',
			version: '99.99.99',
			description: 'Show Banner',
		})
	).toMatchSnapshot();
});
