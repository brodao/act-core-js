import * as tmp from 'tmp';
import { ACT } from '../../lib';

describe('Testa a manipulação JSON', () => {
	test('Arquivo inexistente', () => {
		expect(() => {
			ACT.json.fromFile('not_exist_file.json');
		}).toThrow();
	});

	test('Leitura de um objeto JSON simples', () => {
		const jsonContent: any = { message: 'This is a message' };
		const file: tmp.FileResult = tmp.fileSync();
		ACT.json.toFile(jsonContent, file.name, true);

		expect(JSON.stringify(ACT.json.fromFile(file.name))).toBe(
			JSON.stringify(jsonContent)
		);
	});

	const jsonFile = tmp.tmpNameSync();
	test('Gravação de um objeto JSON simples', () => {
		const jsonContent: any = { message: 'This is a message' };

		expect(() => {
			ACT.json.toFile(jsonContent, jsonFile);
		}).not.toThrow();
	});

	test('Sobrescrever arquivo existente', () => {
		const jsonContent: any = { message: 'This is a message' };

		expect(() => {
			ACT.json.toFile(jsonContent, jsonFile, true);
		}).not.toThrow();
	});

	test('Erro se arquivo existir', () => {
		const jsonContent: any = { message: 'This is a message' };

		expect(() => {
			ACT.json.toFile(jsonContent, jsonFile, false);
		}).toThrow();
	});
});
