import * as tmp from 'tmp';
import { jsonFromFile, jsonToFile } from '../../src/jsonFile';

describe('Testa a leitura de arquivos JSON', () => {
	test('Arquivo inexistente', () => {
		expect(() => {
			jsonFromFile('not_exist_file.json');
		}).toThrow();
	});

	test('Leitura de um objeto JSON simples', () => {
		const jsonContent: any = { message: 'This is a message' };
		const file: tmp.FileResult = tmp.fileSync();
		jsonToFile(jsonContent, file.name, true);

		expect(JSON.stringify(jsonFromFile(file.name))).toBe(
			JSON.stringify(jsonContent)
		);
	});
});

let jsonFile: string;

describe('Testa a gravação de arquivos JSON', () => {
	beforeAll(() => {
		jsonFile = tmp.tmpNameSync();
	});

	test('Gravação de um objeto JSON simples', () => {
		const jsonContent: any = { message: 'This is a message' };

		expect(() => {
			jsonToFile(jsonContent, jsonFile);
		}).not.toThrow();
	});

	test('Sobrescrever arquivo existente', () => {
		const jsonContent: any = { message: 'This is a message' };

		expect(() => {
			jsonToFile(jsonContent, jsonFile, true);
		}).not.toThrow();
	});

	test('Erro se arquivo existir', () => {
		const jsonContent: any = { message: 'This is a message' };

		expect(() => {
			jsonToFile(jsonContent, jsonFile, false);
		}).toThrow();
	});
});
