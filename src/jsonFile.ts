import * as fs from 'fs';
import { IJsonFile } from './model/model_interfaces';
const stripJsonComments = require('strip-json-comments');

function fromFile(file: string): JSON {
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

function toFile(content: JSON, file: string, overwrite: boolean) {
	if (fs.existsSync(file) && !overwrite) {
		throw new Error('File alredy exisist.');
	}

	fs.writeFileSync(file, JSON.stringify(content));
}

export const actJson: IJsonFile = {
	from: (file: string): JSON => {
		return fromFile(file);
	},
	to: (content: JSON, file: string, overwrite: boolean = false) =>  {
		toFile(content, file, overwrite) ;
	}

};
