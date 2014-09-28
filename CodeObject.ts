class CodeObject{
	//thanks to http://daeken.com/2010-02-20_Python_Marshal_Format.html
	//Python code object variables
	private argcount: number;
	private nlocals: number;
	private stacksize: number;
	private flags: number; //figure out bit operations or maybe switch to enums
	private code: StackOp[];
	private consts: Constants[];
	private names: any[]; //type? what does this contain?
	private varnames: string[];
	private freevars: any[]; //type?
	private cellvars: any[]; //type?
	private filename: string;
	private name: string;
	private firstlineno: number;
	private lnotab: CodeOffsetToLineNoMap;

	//Implementation variables
	private fileWrapper: FileWrapper;

	constructor(fileWrapper: FileWrapper){
		this.fileWrapper = fileWrapper;
		this.parse();
	}
	parse(){
	}
}
class StackOp{
	private opcode: OpCode;
	private argument: any; //type?
}
enum OpCode{
};
enum Constants{
};
interface CodeOffsetToLineNoMap{
	[index: number]: number;
}
interface FileWrapper{
	getInt32: GetNumber;
	getUInt8: GetNumber;
}
interface GetNumber{
	(): number;
}
class FileWrapperNode{
	private buffer: any; //type?
	private offset: number;

	constructor(path: string){
		var fs = require('fs');
		this.buffer = fs.readFileSync(path);
		this.offset = 0;
	}
	getInt32(){
		return this.readNum(this.buffer.readInt32LE,4);
	}
	getUInt8(){
		return this.readNum(this.buffer.readUInt8,1);
	}
	private readNum(readFunc: ReadFunc, offsetIncrease: number){
		var n = readFunc.call(this.buffer,this.offset,true);
		this.offset += offsetIncrease;
		return n;
	}
}
interface ReadFunc{
	(offset: number, noAssert: boolean): number;
}

var co = new CodeObject(new FileWrapperNode('/path/to/pyc/file'));
