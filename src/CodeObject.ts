import StackMachine = require('./StackMachine');
import Tuple = require('./Tuple');
import FileWrapper = require('./FileWrapper');

class CodeObject{
  //thanks to http://daeken.com/2010-02-20_Python_Marshal_Format.html
  //Python code object fields
  private argcount: number;
  private nlocals: number;
  private stacksize: number;
  private flags: number; //figure out bit operations or maybe switch to enums
  private code: FileWrapper;
  private consts: Tuple<any>;
  private names: Tuple<any>; //pretty sure only strings here
  private varnames: Tuple<any>; //pretty sure only strings here
  private freevars: Tuple<any>;
  private cellvars: Tuple<any>;
  private filename: FileWrapper;
  private name: FileWrapper;
  private firstlineno: number;
  private lnotab: FileWrapper;

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
      code: FileWrapper,
      consts: Tuple<any>,
      names: Tuple<any>,
      varnames: Tuple<any>,
      freevars: Tuple<any>,
      cellvars: Tuple<any>,
      filename: FileWrapper,
      name: FileWrapper,
      firstlineno: number,
      lnotab: FileWrapper){
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
