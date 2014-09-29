class PycFile{
  //thanks to http://nedbatchelder.com/blog/200804/the_structure_of_pyc_files.html
  //Python pyc file fields
  private magicno: any; //type?
  private modtime: Date;
  private codeobj: CodeObject;

  constructor(magicno: any, modtime: Date, codeobj: CodeObject){
    this.magicno = magicno;
    this.modtime = modtime;
    this.codeobj = codeobj;
  }
  interpret(){
    this.codeobj.execute();
  }
}
class PycParser{
  private mp: MarshalParser;

  constructor(){
    this.mp = new MarshalParser();
  }
  parse(fileWrapper: FileWrapper): PycFile{
    var magicno: any = this.parseMagicNumber(fileWrapper);
    var modtime: Date = this.parseModTimeStamp(fileWrapper);
    var codeobj: CodeObject = this.mp.parse(fileWrapper);
  return new PycFile(magicno, modtime, codeobj);
  }
  private parseMagicNumber(fileWrapper: FileWrapper): any{
    return 0;
  }
  private parseModTimeStamp(fileWrapper: FileWrapper): Date{
    return new Date();
  }
}
class MarshalParser{
  //pseudo code
  //private funcMap = {'i':int32,...}
  parse(fileWrapper: FileWrapper): any{
    //pseudo code
    //return funcMap[read char](fileWrapper);
  }
  //pseudo code
  //int32(fileWrapper: FileWrapper): number{
  //}
  //codeobj(fileWrapper: FileWrapper): CodeObject{
  //  can be recursive
  //}
}
class CodeObject{
  //thanks to http://daeken.com/2010-02-20_Python_Marshal_Format.html
  //Python code object fields
  private argcount: number;
  private nlocals: number;
  private stacksize: number;
  private flags: number; //figure out bit operations or maybe switch to enums
  private code: StackOp[];
  private consts: Tuple<any>;
  private names: Tuple<string>; //pretty sure only strings here
  private varnames: Tuple<string>; //pretty sure only strings here
  private freevars: Tuple<any>;
  private cellvars: Tuple<any>;
  private filename: string;
  private name: string;
  private firstlineno: number;
  private lnotab: CodeOffsetToLineNoMap;

  //Implementation variables
  //Looking at CALL_FUNCTION of dis it seems as though
  //each code object should have its own stack machine
  //since it pops arguments and function and pushes 
  //return. That function itself must be executed on
  //stack machine.
  private stackMachine: StackMachine;
  
  //Look into factory pattern?
  constructor(/*dict containing all the fields*/){
    //fill in fields
    this.stackMachine = new StackMachine();
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

var pycParser = new PycParser();
var pyc = pycParser.parse(new FileWrapperNode('/path/to/pyc/file'));
pyc.interpret();
