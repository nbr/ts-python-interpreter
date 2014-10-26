import enums = require('./enums');
import Exceptions = require('./Exceptions');

class PyObject{
  private type: enums.PyType;
  //private value: any;
  /*
  constructor(type: enums.PyType, value: any){
    this.type = type;
    this.value = value;
  }
  */
  constructor(type: enums.PyType){
    this.type = type;
  }
  getType(): enums.PyType{
    return this.type;
  }
  __str__(): string{
    throw new Exceptions.Exception("__str__ not implemented");
  }
  __add__(other: PyObject): PyObject{
    throw new Exceptions.Exception("__add__ not implemented");
  }
  /*
  getValue(): any{
    return this.value;
  }
  */
}

export = PyObject;
