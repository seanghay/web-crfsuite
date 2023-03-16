type ParamsObject = {
	[key: string]: string;
};

declare class Trainer {
	constructor();
	train(model: string): number;
	append(xseq: Array<string[]>, yseq: string[]): void;
	clear(): void;
	getParamsObject(): ParamsObject;
	setParamsObject(params: ParamsObject): void;
	get(key: string): string;
	set(key: string, value: string): void;
	help(key: string): string;
	delete(): void;
}

declare class Tagger {
	constructor();
	open(): void;
	close(): void;
	tag(xseq: Array<string[]>): string[];
	delete(): void;
	labels(): string[];
}

declare type FileSystem = {
	writeFile(file: string, buffer: any): void;
	readFile(file: string): any;
};

declare type WebCRFSuite = {
	Tagger: typeof Tagger;
	Trainer: typeof Trainer;
	FS: FileSystem;
};

declare const CRFSuite: WebCRFSuite;

export default CRFSuite;
