import PyEval = require('./PyEval');
import Tuple = require('./Tuple');
import FileWrapper = require('./FileWrapper');
import PyObject = require('./PyObject');

class CodeObject{
  //thanks to http://daeken.com/2010-02-20_Python_Marshal_Format.html
  //Python code object fields
  private argcount: number;
  private nlocals: number;
  private stacksize: number;
  private flags: number; //figure out bit operations or maybe switch to enums
  private code: PyObject;
  private consts: PyObject;
  private names: PyObject; //pretty sure only strings here
  private varnames: PyObject; //pretty sure only strings here
  private freevars: PyObject;
  private cellvars: PyObject;
  private filename: PyObject;
  private name: PyObject;
  private firstlineno: number;
  private lnotab: PyObject;

  //Implementation variables
  //Looking at CALL_FUNCTION of dis it seems as though
  //each code object should have its own stack machine
  //since it pops arguments and function and pushes
  //return. That function itself must be executed on
  //stack machine.

  //Look into factory pattern?
  constructor(argcount: number,
      nlocals: number,
      stacksize: number,
      flags: number,
      code: PyObject,
      consts: PyObject,
      names: PyObject,
      varnames: PyObject,
      freevars: PyObject,
      cellvars: PyObject,
      filename: PyObject,
      name: PyObject,
      firstlineno: number,
      lnotab: PyObject){
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
  }

  getCode(): PyObject{
    return this.code;
  }
  getConst(index: number): PyObject{
    return this.consts.getValue().getItem(index);
  }
}
interface CodeOffsetToLineNoMap{
  [index: number]: number;
}

export = CodeObject;
