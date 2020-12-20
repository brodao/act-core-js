import * as fs from 'fs';
const stripJsonComments = require('strip-json-comments');

export function jsonFromFile(file: string): JSON {
	let content: any = {};

	if (!fs.existsSync(file)) {
		throw new Error('File not found.');
	}

	const json = fs.readFileSync(file).toString();

	if (json) {
		try {
			content = JSON.parse(stripJsonComments(json));
		} catch (e) {
			throw e;
		}
	}

	return content;
}

export function jsonToFile(content: JSON, file: string, overwrite: boolean) {
	if (fs.existsSync(file) && !overwrite) {
		throw new Error(`File [${file}] alredy exisist. `);
	}

	fs.writeFileSync(file, JSON.stringify(content));
}
