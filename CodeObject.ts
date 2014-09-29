class PycFile{
  //thanks to http://nedbatchelder.com/blog/200804/the_structure_of_pyc_files.html
  //Python pyc file fields
  private magicno: any; //type?
  private modtime: Date;
  private codeobj: CodeObject;

  //Implementation variables
  private fileWrapper: FileWrapper;

  constructor(fileWrapper: FileWrapper){
    this.fileWrapper = fileWrapper;
    this.parseMagicNumber();
    this.parseModTimeStamp();
    this.codeobj = new CodeObject(this.fileWrapper);
  }
  private parseMagicNumber(){
  }
  private parseModTimeStamp(){
  }
  interpret(){
    this.codeobj.execute();
  }
}
class CodeObject{
  //thanks to http://daeken.com/2010-02-20_Python_Marshal_Format.html
  //Python code object fields
  private argcount: number;
  private nlocals: number;
  private stacksize: number;
  private flags: number; //figure out bit operations or maybe switch to enums
  private code: StackOp[];
  //blog refers to each of the following as being tuples which he
  //defines as a collection of marshalled objects
  private consts: Tuple<CodeObject>; //why are these marshalled objects rather than connstants listed in his blog?
  private names: Tuple<CodeObject>; //why aren't these strings as in python?
  private varnames: Tuple<CodeObject>; //why aren't these strings as in python?
  private freevars: Tuple<CodeObject>;
  private cellvars: Tuple<CodeObject>;
  private filename: string;
  private name: string;
  private firstlineno: number;
  private lnotab: CodeOffsetToLineNoMap;

  //Implementation variables
  private fileWrapper: FileWrapper;
  //Looking at CALL_FUNCTION of dis it seems as though
  //each code object should have its own stack machine
  //since it pops arguments and function and pushes 
  //return. That function itself must be executed on
  //stack machine.
  private stackMachine: StackMachine;
  
  constructor(fileWrapper: FileWrapper){
    this.fileWrapper = fileWrapper;
    this.parse();
  }
  private parse(){
  }
  execute(){
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
class StackMachine{
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
  getInt32(): number{
    return this.readNum(this.buffer.readInt32LE,4);
  }
  getUInt8(): number{
    return this.readNum(this.buffer.readUInt8,1);
  }
  private readNum(readFunc: ReadFunc, offsetIncrease: number): number{
    var n = readFunc.call(this.buffer,this.offset,true);
    this.offset += offsetIncrease;
    return n;
  }
}
interface ReadFunc{
  (offset: number, noAssert: boolean): number;
}
class Tuple<T>{
  private array: T[]; 
  constructor(array: T[]){
    this.array = array.slice(0);
  }
  getItem(index: number): T{
    return this.array[index];
  }
  getLength(): number{
    return this.array.length;
  }
}

var pyc = new PycFile(new FileWrapperNode('/path/to/pyc/file'));
pyc.interpret();
