import StackOp = require('./StackOp');
import StackMachine = require('./StackMachine');
import Tuple = require('./Tuple');

class CodeObject{
  //thanks to http://daeken.com/2010-02-20_Python_Marshal_Format.html
  //Python code object fields
  private argcount: number;
  private nlocals: number;
  private stacksize: number;
  private flags: number; //figure out bit operations or maybe switch to enums
  //private code: StackOp[];
  private code: string;
  private consts: Tuple<any>;
  private names: Tuple<string>; //pretty sure only strings here
  private varnames: Tuple<string>; //pretty sure only strings here
  private freevars: Tuple<any>;
  private cellvars: Tuple<any>;
  private filename: string;
  private name: string;
  private firstlineno: number;
  //private lnotab: CodeOffsetToLineNoMap;
  private lnotab: string;

  //Implementation variables
  //Looking at CALL_FUNCTION of dis it seems as though
  //each code object should have its own stack machine
  //since it pops arguments and function and pushes
  //return. That function itself must be executed on
  //stack machine.
  private stackMachine: StackMachine;

  //Look into factory pattern?
  constructor(argcount: number,
      nlocals: number,
      stacksize: number,
      flags: number,
      code: string,
      consts: Tuple<string>,
      names: Tuple<string>,
      varnames: Tuple<string>,
      freevars: Tuple<any>,
      cellvars: Tuple<any>,
      filename: string,
      name: string,
      firstlineno: number,
      lnotab: string){
    this.argcount = argcount;
    this.nlocals = nlocals;
    this.stacksize = stacksize;
    this.flags = flags;
    this.code = code;
    this.consts = consts;
    this.names = names;
    this.varnames = varnames;
    this.freevars = freevars;
    this.cellvars = cellvars;
    this.filename = filename;
    this.name = name;
    this.firstlineno = firstlineno;
    this.lnotab = lnotab;
    this.stackMachine = new StackMachine();
  }
  execute(){
  }
}
interface CodeOffsetToLineNoMap{
  [index: number]: number;
}

export = CodeObject;
