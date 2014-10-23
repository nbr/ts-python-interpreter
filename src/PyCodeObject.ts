import PyTuple = require('./PyTuple');
import FileWrapper = require('./FileWrapper');
import PyObject = require('./PyObject');
import PyString = require('./PyString');
import enums = require('./enums');

class PyCodeObject extends PyObject{
  //thanks to http://daeken.com/2010-02-20_Python_Marshal_Format.html
  //Python code object fields
  private argcount: number;
  private nlocals: number;
  private stacksize: number;
  private flags: number; //figure out bit operations or maybe switch to enums
  private code: PyString;
  private consts: PyTuple<PyObject>;
  private names: PyTuple<PyObject>; //pretty sure only strings here
  private varnames: PyTuple<PyObject>; //pretty sure only strings here
  private freevars: PyTuple<PyObject>;
  private cellvars: PyTuple<PyObject>;
  private filename: PyString;
  private name: PyString;
  private firstlineno: number;
  private lnotab: PyString;

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
      code: PyString,
      consts: PyTuple<PyObject>,
      names: PyTuple<PyObject>,
      varnames: PyTuple<PyObject>,
      freevars: PyTuple<PyObject>,
      cellvars: PyTuple<PyObject>,
      filename: PyString,
      name: PyString,
      firstlineno: number,
      lnotab: PyString){
    super(enums.PyType.TYPE_CODE);
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
  setName(name: PyString): void{
    this.name = name;
  }
  getName(): PyString{
    return this.name;
  }
  setFilename(filename: PyString): void{
    this.filename = filename;
  }
  getFilename(): PyString{
    return this.filename;
  }
  getCode(): PyString{
    return this.code;
  }
  getConst(index: number): PyObject{
    return this.consts.getItem(index);
  }
  getConstsSize(): number{
    return this.consts.getLength();
  }
}
interface CodeOffsetToLineNoMap{
  [index: number]: number;
}

export = PyCodeObject;
