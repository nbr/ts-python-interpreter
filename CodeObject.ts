/// <reference path="lib/node.d.ts" />
import gLong = require('./lib/gLong');

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
module PycParser{
  export function parse(fw: FileWrapper): PycFile{
    var magicno: any = this.parseMagicNumber(fw);
    var modtime: Date = this.parseModTimeStamp(fw);
    var codeobj: CodeObject = this.mp.parse(fw);
    return new PycFile(magicno, modtime, codeobj);
  }
  function parseMagicNumber(fw: FileWrapper): any{
    var magicno: number = fw.getInt32();
    return magicno;
  }
  function parseModTimeStamp(fw: FileWrapper): Date{
    //this probably isn't the correct parsing,
    //but as long as correct number of bytes consumed,
    //I don't care right now
    return new Date(fw.getInt32());
  }
}
module MarshalParser{
  export enum Constants {
    Null,
    None,
    False,
    True,
    Stopiter,
    Ellipsis
  }
  var typeParserMap = {
    'O': function typeNull(fw: FileWrapper){ return Constants.Null; },
    'N': function typeNone(fw: FileWrapper){ return Constants.None; },
    'F': function typeFalse(fw: FileWrapper){ return Constants.False; },
    'T': function typeTrue(fw: FileWrapper){ return Constants.True; },
    'S': function typeStopiter(fw: FileWrapper){ return Constants.Stopiter; },
    '.': function typeEllipsis(fw: FileWrapper){ return Constants.Ellipsis; },
    'i': typeInt,
    'I': typeInt64,
    'f': typeFloat,
    'g': typeBinaryFloat
  };
  export function parse(fw: FileWrapper): any{
    return typeParserMap[fw.getUInt8()](fw);
  }
  function typeInt(fw: FileWrapper): number{
    return fw.getInt32();
  }

  function typeInt64(fw: FileWrapper): gLong {
      var high: number = fw.getInt32();
      var low: number = fw.getInt32();
      return gLong.fromBits(low,high);
  }

  function typeFloat(fw: FileWrapper): number{
    var size: number = fw.getUInt8();
    if(size === 4){ return fw.getFloat(); }
    return fw.getDouble();
  }
  function typeBinaryFloat(fw: FileWrapper): number{
    return fw.getDouble();
  }
  //function codeobj(fw: FileWrapper): CodeObject{
  //  can be recursive
  //}
}
interface FileWrapper{
  getInt32: GetNumber;
  getUInt8: GetNumber;
  getFloat: GetNumber;
  getDouble: GetNumber;
  getUtf8: GetString;
}
interface GetNumber{
  (): number;
}
interface GetString{
  (): string;
}
import fs = require('fs');
class FileWrapperNode{
  private buffer: any; //type?
  private offset: number;
  private path: string;

  constructor(path: string){
    this.offset = 0;
    this.path = path;
  }
  connect(cb){
    //var fs = require('fs');
    fs.readFile(this.path, this.getAfterRead(cb));
  }
  getInt32(): number{
    return this.readNum(this.buffer.readInt32LE, 4);
  }
  getUInt8(): number{
    return this.readNum(this.buffer.readUInt8, 1);
  }
  getFloat(): number{
    return this.readNum(this.buffer.readFloatLE, 4);
  }
  getUtf8(): string{
    var c: string = this.buffer.toSting('utf8', this.offset, this.offset + 1);
    this.offset++;
    return c;
  }
  private readNum(readFunc: ReadFunc, offsetIncrease: number): number{
    var n = readFunc.call(this.buffer, this.offset, true);
    this.offset += offsetIncrease;
    return n;
  }
  private getAfterRead(cb){
    var fwn: FileWrapperNode = this;
    return function afterRead(err, buffer){
      if (err) { throw err;}
      fwn.buffer = buffer;
      cb();
    };
  }
}
interface ReadFunc{
  (offset: number, noAssert: boolean): number;
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
interface CodeOffsetToLineNoMap{
  [index: number]: number;
}
class StackMachine{
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

var fw = new FileWrapperNode('/path/to/pyc/file');
fw.connect(function afterConnect(fw: FileWrapper){
  var pyc: PycFile = PycParser.parse(fw);
  pyc.interpret();
});
