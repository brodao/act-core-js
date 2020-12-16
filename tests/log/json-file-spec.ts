import * as tmp from 'tmp';
import ACT from '../../lib/index';

describe('Testa a leitura de arquivos JSON', () => {
	test('Arquivo inexistente', () => {
		expect(() => {
			ACT.jsonFile.from('not_exist_file.json');
		}).toThrow();
	});

	test('Leitura de um objeto JSON simples', () => {
		const jsonContent: any = { message: 'This is a message' };
		const file: tmp.FileResult = tmp.fileSync();
		ACT.jsonFile.to(jsonContent, file.name, true);

		expect(JSON.stringify(ACT.jsonFile.from(file.name))).toBe(
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
			ACT.jsonFile.to(jsonContent, jsonFile);
		}).not.toThrow();
	});

	test('Sobrescrever arquivo existente', () => {
		const jsonContent: any = { message: 'This is a message' };

		expect(() => {
			ACT.jsonFile.to(jsonContent, jsonFile, true);
		}).not.toThrow();
	});

	test('Erro se arquivo existir', () => {
		const jsonContent: any = { message: 'This is a message' };

		expect(() => {
			ACT.jsonFile.to(jsonContent, jsonFile, false);
		}).toThrow();
	});
});
