import enums = require('./enums');
import Exceptions = require('./Exceptions');

class PyObject{
  private type: enums.PyType;
  constructor(type: enums.PyType){
    this.type = type;
  }
  getType(): enums.PyType{
    return this.type;
  }
  __str__(): string{
    throw new Exceptions.Exception("__str__ not implemented");
  }
  __add__(right: PyObject): PyObject{
    throw new Exceptions.Exception("__add__ not implemented");
  }
  __radd__(left: PyObject): PyObject{
    throw new Exceptions.Exception("__radd__ not implemented");
  }

  getValue(): any{
    //TODO: fix with Exception
    throw "getValue not implemented";
  }
  __cmp__(cmpidx: number, comparee: PyObject): boolean{
    //TODO: fix with Exception
    throw "cmp not implemented";
  }

  getArray(): any{
    throw new Exceptions.Exception("getArray not implemented");
  }

}

export = PyObject;
